import { Button, Dropdown, Form, InputGroup, ListGroup, Modal } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PublishedCheckMark from "./publishedCheckMark";
import UnpublishedCheckMark from "./unpublishedCheckMark";
import { IoMdArrowDropdown } from "react-icons/io";
import { RxRocket } from "react-icons/rx";
import { FaEllipsisV } from "react-icons/fa";
import * as courseClient from "../client";
import * as quizClient from "./client";
import { setQuizzes } from "./reducer";
import { useEffect, useState } from "react";
import { QuizType, QuizAttempt } from "./types";



export default function Quizzes() {
    const { cid } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const isFaculty = currentUser?.role === "FACULTY";
    const isStudent = currentUser?.role == "STUDENT";
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
    const [filteredQuizzes, setFilteredQuizzes] = useState<any[]>([]);
    const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
    const [showMaxAttemptModal, setShowMaxAttemptModal] = useState(false);
    const [viewingQuizId, setViewingQuizId] = useState<string | null>(null);

    const formatDateTime = (isoDate: string | undefined) => {
        if (!isoDate) return "—";
    
        const date = new Date(isoDate);
        if (isNaN(date.getTime())) return "Invalid date";
      
        const datePart = date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        });
      
        const timePart = date.toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).toLowerCase();
      
        return `${datePart} at ${timePart}`;
      };
    
    const quizzes = useSelector((state: any) => state.quizReducer.quizzes);
    
    const filterQuizzesByPartialTitle = async(partialTitle: string) => {
        if (partialTitle.trim()) {
            const result = await courseClient.findQuizzesByPartialTitle(cid as string, partialTitle)
            setFilteredQuizzes(result);
        } else {
            setFilteredQuizzes(quizzes)}
    }

    const getStudentScore = (quizId: string) => {
        if (!currentUser?._id) return "Not Attempted";
      
        const quizAttempts = attempts.filter(attempt => attempt.quizId === quizId);
        if (quizAttempts.length === 0) return "Not Attempted";
      
        const latestAttempt = quizAttempts.reduce((latest, attempt) =>
          new Date(attempt.submittedAt) > new Date(latest.submittedAt) ? attempt : latest
        );
      
        const quiz = quizzes.find((q: QuizType) => q._id === quizId);
        if (!quiz) return "N/A";
      
        const totalPoints = quiz.questions.reduce((sum: number, q: any) => sum + q.points, 0);
        if (totalPoints === 0) return "N/A";
      
        const percentage = (latestAttempt.score / totalPoints) * 100;
        return `${percentage.toFixed(0)}%`;
      };

    // search filter to map quizzes
    const displayedQuizzes = filteredQuizzes.length>0 ? filteredQuizzes : quizzes;
    
    // student can only see published quizzes
    const visibleQuizzes = isStudent
        ? displayedQuizzes.filter((quiz: any) => quiz.published) : displayedQuizzes;

    const fetchQuizzes = async() => {
        const quizzes = await courseClient.findQuizzesForCourse(cid as string);
        console.log(quizzes);
        dispatch(setQuizzes(quizzes));
    }

    useEffect(() => {
        const loadAttempts = async () => {
            if (currentUser?._id && currentUser.role === "STUDENT" && quizzes.length > 0) {
                try {
                    const allAttempts = await Promise.all(
                        quizzes.map((quiz:QuizType) => {
                            if (!quiz._id) return Promise.resolve([]);
                            return quizClient.fetchStudentQuizAttempts(quiz._id, currentUser._id).catch(() => []);
                        })
                    );
                    setAttempts(allAttempts.flat());
                } catch (error) {
                    console.error("Failed to load attempts", error);
                }
            }
        };

        loadAttempts();
        fetchQuizzes();
    }, [quizzes, currentUser]);

    const handleDeleteClick = (quiz: any) => {
        setSelectedQuiz(quiz);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedQuiz && selectedQuiz._id) {
            try {
                await quizClient.deleteQuiz(selectedQuiz._id);
                const data = await courseClient.findQuizzesForCourse(cid!);
                dispatch(setQuizzes(data));
            } catch (error) {
                console.error("Failed to delete quiz:", error);
            }
        }
        setShowDeleteModal(false);
        setSelectedQuiz(null);
    };

    const handleTogglePublish = async (qid: string) => {
        try {
          const quiz = displayedQuizzes.find((q: any) => q._id === qid);
          if (!quiz) return;
      
          const updated = {
            ...quiz,
            published: !quiz.published,
          };
          await quizClient.updateQuiz(updated);
          const updatedQuizzes = await courseClient.findQuizzesForCourse(cid!);
          dispatch(setQuizzes(updatedQuizzes));
        } catch (err) {
          console.error("Failed to toggle publish:", err);
        }
      };
    
    return (
        <div>
            {/* header */}
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <InputGroup style={{ width: "300px" }}>
                    <InputGroup.Text className="bg-white border-end-0">
                        <BsSearch className="text-secondary" />
                    </InputGroup.Text>
                    <Form.Control onChange={(e)=>filterQuizzesByPartialTitle(e.target.value) }
                    placeholder="Search for Quiz" className="border-start-0 wd-filter-by-title" />
                </InputGroup>

                {/* Faculty Only Adding Quiz */}
                {isFaculty && (
                    <div>
                        <Button
                            className="btn-danger"
                            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/new`)}
                        >
                            <FaPlus className="me-2 mb-1" />
                            Quiz
                        </Button>
                        <button className="btn btn-light p-1 border border-2 ms-1">
                            <IoEllipsisVertical className="fs-4" />
                        </button>
                    </div>
                )}
            </div>

            <ListGroup className="rounded-0 border" >
                <ListGroup.Item className="d-flex justify-content-between align-items-center p-3 bg-light border-bottom">
                    <div className="d-flex align-items-center">
                        <IoMdArrowDropdown className="me-2 fs-3" />
                        <span className="fs-5 fw-bold">Assignment Quizzes</span>
                    </div>
                </ListGroup.Item>

                <ListGroup className="rounded-0">
                        {visibleQuizzes.map((quiz:any) => (
                            <ListGroup.Item key={quiz._id} className="wd-lesson p-3 ps-3 border-bottom">
                                <div className="d-flex align-items-start w-100">
                                    <RxRocket className="me-3 mt-3 fs-5"/>
                                    <div className="flex-grow-1 text-start">
                                        <div
                                            className="fw-bold fs-5 cursor-pointer"
                                            onClick={() => {
                                                if (isStudent) {
                                                  const quizAttempts = attempts.filter((a) => a.quizId === quiz._id);
                                                  const remainingAttempts = quiz.attempts - quizAttempts.length;
                                              
                                                  if (remainingAttempts <= 0) {
                                                    setViewingQuizId(quiz._id);
                                                    setShowMaxAttemptModal(true);
                                                    return;
                                                  }
                                              
                                                  navigate(`/Kambaz/Courses/${cid}/quizzes/${quiz._id}/start`);
                                                } else {
                                                  navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}`);
                                                }
                                              }}
                                              
                                        >
                                            {quiz.title}
                                        </div>
        
                                        <div className="text-secondary small">
                                            {(() => {
                                                const now = new Date();
                                                const from = new Date(quiz.availableFrom);
                                                const until = new Date(quiz.availableUntil);
                                                if (now < from) return `Not available until ${formatDateTime(quiz.availableFrom)}`;
                                                if (now > until) return `Closed`;
                                                return `Available`;
                                            })()}
                                            {" | "}
                                            <strong>Due</strong> {formatDateTime(quiz.dueDate)}
                                            {" | "}
                                            {quiz.points} pts
                                            {" | "}
                                            {quiz.questionsCount} Questions
                                            {isStudent && (
                                                <> | Score: {getStudentScore(quiz._id)}</>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="ms-2 mt-3 fs-5 me-3">
                                            {quiz.published ? <PublishedCheckMark /> : <UnpublishedCheckMark /> }
                                    </div>
                                    {/* clickable quiz context menu for faculty*/}
                                    {isFaculty && (
                                        <Dropdown align="end" className="ms-2 mt-3">
                                            <Dropdown.Toggle
                                                as="div"
                                                className="cursor-pointer dropdown-toggle-no-caret"
                                                bsPrefix=""
                                            >
                                                <FaEllipsisV className="fs-5 mt-1"/>
                                            </Dropdown.Toggle>
                                            
                                            <Dropdown.Menu>
                                                <Dropdown.Item className="small" onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/editor`)}>
                                                    Edit
                                                </Dropdown.Item>
                                                <Dropdown.Item className="small" onClick={() => handleDeleteClick(quiz)}>
                                                    Delete
                                                </Dropdown.Item>
                                                <Dropdown.Item className="small" onClick={() => handleTogglePublish(quiz._id)}>
                                                    {quiz.published ? "Unpublish" : "Publish"}
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    )}
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </ListGroup>

                {showMaxAttemptModal && (
                    <Modal
                        show={showMaxAttemptModal}
                        onHide={() => setShowMaxAttemptModal(false)}
                        centered
                    >
                        <Modal.Header closeButton>
                        <Modal.Title>Maximum Attempts Reached</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <p>You have used all available attempts for this quiz.</p>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowMaxAttemptModal(false)}>
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                            navigate(`/Kambaz/Courses/${cid}/quizzes/${viewingQuizId}/result`);
                            setShowMaxAttemptModal(false);
                            }}
                        >
                            View Results
                        </Button>
                        </Modal.Footer>
                    </Modal>
                    )}


                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete this quiz?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleConfirmDelete}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
                
        </div>
    );
}