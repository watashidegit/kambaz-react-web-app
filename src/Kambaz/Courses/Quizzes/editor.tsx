import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Form, Button, Row, Col, Tab, Modal, Nav, InputGroup } from "react-bootstrap";
import { useState, useEffect } from "react";
import { addQuiz, updateQuiz, setCurrentQuiz } from "./reducer";
import * as quizClient from "./client";
import * as courseClient from "../client";
import { FaBan, FaEllipsisV } from "react-icons/fa";
import PublishedCheckMark from "./publishedCheckMark";
import { parseISO, format } from 'date-fns';
import QuestionForm from "./QuestionForm";
import QuestionPreview from "./QuestionPreview";

export default function QuizEditor() {
    const { cid, qid } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [showSaveSuccess, setShowSaveSuccess] = useState(false);
    const [showQuestionForm, setShowQuestionForm] = useState<boolean>(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState("details");
    const isCreating = location.pathname.endsWith("/new"); // creating a quiz
    const toLocalDateTimeString = (isoString: string | undefined) => {
        if (!isoString) return "";
        const date = parseISO(isoString);
        if (isNaN(date.getTime())) return "";
        return format(date, "yyyy-MM-dd'T'HH:mm");
    };
    // extract quiz of the course from redux
    const quizzes = useSelector((state: any) => state.quizReducer.quizzes);

    // check if the quiz exist, go to add/edit mode
    const quiz = quizzes.find((quiz: any) => quiz._id === qid);

    // initial state of the form (form to create new quiz)
    const [quizData, setQuizData] = useState({
        title: "",
        course: cid || "",
        questions: [],
        description: "",
        quizType: "Graded Quiz",
        assignmentGroup: "QUIZZES",
        shuffleAnswer: true,
        timeLimit: 20,
        points: 0,
        multipleAttempts: false,
        attempts: 1,
        dueDate: "",
        assignTo: "Everyone",
        availableFrom: "",
        availableUntil: "",
        published: false,
        oneQuestionAtATime: true,
        webcamRequired: false,
        lockQuestionsAfterAnswering: false,
        showCorrectAnswers: false,
    });

    const [questions, setQuestions] = useState<any[]>(quizData.questions || []);

    useEffect(() => {
          if (qid) {
            fetchQuiz(qid);
          };
      }, [qid]);

    useEffect(() => {
        if (quiz) {
            setQuizData({
                title: quiz.title || "",
                course: quiz.course || "",
                questions: quiz.questions || [],
                description: quiz.description ?? `This is the description for ${quiz.title}`,
                quizType: quiz.type || "Graded Quiz",
                assignmentGroup: quiz.assignmentGroup || "QUIZZES",
                shuffleAnswer: quiz.shuffleAnswer || false,
                timeLimit: quiz.timeLimit || 20,
                points: quiz.points || 0,
                multipleAttempts: quiz.multipleAttempts || false,
                attempts: quiz.attempts || 1,
                dueDate: quiz.dueDate || "",
                assignTo: quiz.assignTo || "Everyone",
                availableFrom: quiz.availableFrom || "",
                availableUntil: quiz.availableUntil || "",
                published: quiz.published || false,
                oneQuestionAtATime: quiz.oneQuestionAtATime || true,
                webcamRequired: quiz.webcamRequired || false,
                lockQuestionsAfterAnswering: quiz.lockQuestionsAfterAnswering || false,
                showCorrectAnswers: quiz.showCorrectAnswers || false,
            });
            setQuestions(quiz.questions || []); 
        }
    }, [quiz]);

    const fetchQuiz = async (qid: string) => {
        const quiz = await quizClient.findQuizById(qid);
        dispatch(setCurrentQuiz(quiz));
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setQuizData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
            if (isCreating) {
                const newQuiz = await courseClient.createQuizForCourse(cid!, quizData);
                dispatch(addQuiz(newQuiz));
            } else {
                const quizToUpdate = {
                    ...quizData,
                    _id: qid,
                };
                await quizClient.updateQuiz(quizToUpdate);
                const updatedQuiz = await quizClient.findQuizById(qid!);
                dispatch(updateQuiz(updatedQuiz));
            }
    
            setShowSaveSuccess(true);
        } catch (err) {
            console.error("Save failed:", err);
        }
    };
      
    const handlePublishQuiz = () => {
        setShowPublishModal(true);
    };

    const confirmPublish = async (qid: string) => {
        try {
            const finalQuiz = {
                ...quizData,
                published: true,
            };
    
            if (isCreating) {
                const finalQuizwId = await courseClient.createQuizForCourse(cid!, finalQuiz);
                console.log("Created:", finalQuizwId);
                dispatch(addQuiz(finalQuizwId));
            } else {
                const quizToUpdate = {
                    ...finalQuiz,
                    _id: qid,
                }
                await quizClient.updateQuiz(quizToUpdate);
                const updatedQuiz = await quizClient.findQuizById(qid!);
                console.log("Updated:", updatedQuiz);
                dispatch(updateQuiz(updatedQuiz));
            }
            setShowPublishModal(false);
            navigate(`/Kambaz/Courses/${cid}/Quizzes`);
        } catch (err) {
            console.error("Publish failed:", err);
        }
    }; 

    const cancelPublish = () => {
        setShowPublishModal(false);
    };

    const handleSaveQuestion = async(question: any) => {
        const updated = [...questions];
        if (editingIndex !== null) {
            updated[editingIndex] = question;
        } else {
            updated.push(question);
        }
        setQuestions(updated);
        setEditingIndex(null);
        setShowQuestionForm(false);

        try {
            const updatedQuiz = {
                ...quizData,
                questions: updated,
                _id: qid,
            };
            await quizClient.updateQuiz(updatedQuiz);
            dispatch(updateQuiz(updatedQuiz));
        } catch (err) {
            console.error("Failed to update quiz with new question:", err);
        }
    };

    const handleDeleteQuestion = async (index: number) => {
        const updatedQuestions = questions.filter((_, i) => i !== index);
        setQuestions(updatedQuestions);
        if (!qid) {
            console.error("Missing quiz ID; cannot update.");
            return;
        }
        try {
            const updatedQuiz = {
                ...quizData,
                questions: updatedQuestions,
                _id: qid,
            };
            await quizClient.updateQuiz(updatedQuiz);
            dispatch(updateQuiz(updatedQuiz));
        } catch (err) {
            console.error("Failed to update quiz after deleting question:", err);
        }
    
    };

    return (
        <div className="m-4">
            <div className="d-flex justify-content-end mb-3">
                <label className="fs-6 px-3 py-2 mb-1">
                    Total Points: 
                </label>
                {quizData.published ? (
                    <span className="small d-flex align-items-center text-success me-3 mb-1">
                        <PublishedCheckMark />
                        <span className="ms-2">Published</span>
                    </span>
                ) : (
                    <span className="small d-flex align-items-center text-secondary me-3 mb-1">
                        <FaBan />
                        <span className="ms-2">Not Published</span>
                    </span>
                )}
                <button className="border rounded bg-light text-dark mf-3" style={{
                    width: "36px",
                    height: "36px",
                    cursor: "pointer",
                }}>
                    <FaEllipsisV />
                </button>
            </div>
            <hr/>

            <Tab.Container id="quiz-editor-tabs" activeKey={activeTab} onSelect={(tabKey) => setActiveTab(tabKey as string)}>
                <Nav variant="tabs" className="mb-3">
                    <Nav.Item>
                        <Nav.Link eventKey="details">Details</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="questions">Questions</Nav.Link>
                    </Nav.Item>
                </Nav>

                <Tab.Content>
                    <Tab.Pane eventKey="details">
                        <Form onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                <Col>
                                    <Form.Control
                                        name="title"
                                        value={quizData.title}
                                        onChange={handleChange}
                                        placeholder="Unnamed Quiz"
                                        required
                                    />
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col>
                                    <Form.Label>Quiz Instructions:</Form.Label>
                                    <Form.Control
                                        name="description"
                                        as="textarea"
                                        rows={3}
                                        value={quizData.description}
                                        onChange={handleChange}
                                    />
                                </Col>
                            </Row>
                            <Row className="mb-3 align-items-center">
                                <Col md={4} className="text-end mt-2" >
                                    <Form.Label>Quiz Type</Form.Label></Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Select
                                            name="quizType"
                                            value={quizData.quizType}
                                            onChange={handleChange}
                                        >
                                            <option>Graded Quiz</option>
                                            <option>Practice Quiz</option>
                                            <option>Graded Survey</option>
                                            <option>Ungraded Survey</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={4} className="text-end mt-2" >
                                    <Form.Label>Assignment Group</Form.Label></Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Select
                                            name="assignmentGroup"
                                            value={quizData.assignmentGroup}
                                            onChange={handleChange}
                                        >
                                            <option>Quizzes</option>
                                            <option>Exams</option>
                                            <option>Assignments</option>
                                            <option>Project</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="mb-3 align-items-center justify-content-center ">
                                <Col md={6} className="mb-3">
                                    <Form.Label className="fw-bold mb-3">Options</Form.Label>
                                    <Form.Check
                                        type="checkbox"
                                        label="Shuffle Answers"
                                        name="shuffleAnswer"
                                        className="mb-3"
                                        checked={quizData.shuffleAnswer}
                                        onChange={handleChange}
                                    />
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column sm={4}>
                                            Time Limit
                                        </Form.Label>
                                        <Col sm={4}>
                                            <InputGroup>
                                                <Form.Control
                                                    name="timeLimit"
                                                    type="number"
                                                    value={quizData.timeLimit}
                                                    onChange={handleChange}
                                                    min={0}
                                                />
                                                <InputGroup.Text>min</InputGroup.Text>
                                            </InputGroup>
                                        </Col>
                                    </Form.Group>
                                    <Form.Check
                                        type="checkbox"
                                        label="Allow Multiple Attempts"
                                        name="multipleAttempts"
                                        checked={quizData.multipleAttempts}
                                        onChange={handleChange}
                                        className="mt-3 mb-3"
                                    />
                                    {quizData.multipleAttempts && (
                                        <Form.Group className="mt-3 mb-3">
                                            <Form.Label>Attempts</Form.Label>
                                            <Form.Control
                                                name="attempts"
                                                type="number"
                                                value={quizData.attempts}
                                                onChange={handleChange}
                                                min={1}
                                            />
                                        </Form.Group>
                                    )}
                                    <Form.Check
                                        type="checkbox"
                                        label="Show Correct Answers"
                                        name="showCorrectAnswers"
                                        checked={quizData.showCorrectAnswers}
                                        onChange={handleChange}
                                        className="mt-2"
                                    />
                                    <Form.Text className="text-muted mb-3">
                                        If checked, students will see correct answers after submitting the quiz.
                                    </Form.Text>

                                    <Form.Check
                                        type="checkbox"
                                        label="One Question at a Time"
                                        name="oneQuestionAtATime"
                                        checked={quizData.oneQuestionAtATime}
                                        onChange={handleChange}
                                        className="mt-3"
                                    />
                                    <Form.Text className="text-muted mb-3">
                                        If checked, students will see only one question at a time.
                                    </Form.Text>

                                    {quizData.oneQuestionAtATime && (
                                        <Form.Check
                                            type="checkbox"
                                            label="Lock Questions After Answering"
                                            name="lockQuestionsAfterAnswering"
                                            checked={quizData.lockQuestionsAfterAnswering}
                                            onChange={handleChange}
                                            className="mt-3"
                                        />
                                    )}
                                    {quizData.oneQuestionAtATime && quizData.lockQuestionsAfterAnswering && (
                                        <Form.Text className="text-muted mb-3 ms-4">
                                            If checked, students cannot return to questions once answered.
                                        </Form.Text>
                                    )}

                                    <Form.Check
                                        type="checkbox"
                                        label="Webcam Required"
                                        name="webcamRequired"
                                        checked={quizData.webcamRequired}
                                        onChange={handleChange}
                                        className="mt-3"
                                    />
                                </Col>
                            </Row>
                            <div className="border rounded p-3">
                                <Row className="mb-3 justify-content-center">
                                    <Col md={8}>
                                        <Form.Label>Due Date</Form.Label>
                                        <Form.Control
                                            name="dueDate"
                                            type="datetime-local"
                                            value={toLocalDateTimeString(quizData.dueDate)}
                                            onChange={handleChange}
                                        />
                                    </Col>
                                </Row>
                                <Row className="mb-3 justify-content-center">
                                    <Col md={4}>
                                        <Form.Label>Available From</Form.Label>
                                        <Form.Control
                                            name="availableFrom"
                                            type="datetime-local"
                                            value={toLocalDateTimeString(quizData.availableFrom)}
                                            onChange={handleChange}
                                        />
                                    </Col>                              
                                    <Col md={4}>
                                        <Form.Label>Until</Form.Label>
                                        <Form.Control
                                            name="availableUntil"
                                            type="datetime-local"
                                            value={toLocalDateTimeString(quizData.availableUntil)}
                                            onChange={handleChange}
                                        />
                                    </Col>
                                </Row>
                            </div>
                            <div className="text-center mt-3">
                                <Button variant="secondary" onClick={() => navigate(-1)} className="me-2">
                                    Cancel
                                </Button>
                                <Button variant="primary" type="submit" className="me-2">
                                    Save
                                </Button>
                                <Button variant="danger" onClick={handlePublishQuiz}>
                                    Save & Publish
                                </Button>
                            </div>
                        </Form>
                    </Tab.Pane>

                    {/* Question tab */}
                    <Tab.Pane eventKey="questions">
                        <Button variant="secondary" onClick={() => {
                            setEditingIndex(null);
                            setShowQuestionForm(true);
                            }} className="my-2">
                            + New Question
                        </Button>

                        {showQuestionForm && editingIndex === null && (
                            <QuestionForm
                                question={editingIndex !== null ? quiz.questions[editingIndex] : undefined}
                                onSave={handleSaveQuestion}
                                onCancel={() => setShowQuestionForm(false)}
                            />
                        )}

                        {questions.map((question, index) => (
                            <div key={index} className="border p-3 my-2">
                                {editingIndex === index ? (
                                <QuestionForm
                                    question={question}
                                    onSave={(updatedQ: any) => handleSaveQuestion(updatedQ)}
                                    onCancel={() => setShowQuestionForm(false)}
                                />
                                ) : (
                                <QuestionPreview question={question}/>
                                )}
                                <div className="mt-2 d-flex gap-2">
                                <Button variant="warning" onClick={() => {
                                    setEditingIndex(index);
                                    setShowQuestionForm(true);
                                }}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDeleteQuestion(index)}>Delete</Button>
                                </div>
                            </div>
                        ))}
                            

                        <br/>
                        <div className="text-center mt-3">
                            <Button variant="secondary" onClick={() => navigate(-1)} className="me-2">
                                Back
                            </Button>
                            <Button variant="primary" onClick={handleSubmit} className="me-2">
                                Save
                            </Button>
                            <Button variant="danger" onClick={handlePublishQuiz}>
                                Save & Publish
                            </Button>
                        </div>
                        
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>

            <Modal show={showSaveSuccess} onHide={() => setShowSaveSuccess(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Save Successful</Modal.Title>
                </Modal.Header>
                <Modal.Body>Your changes have been successfully saved.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}>
                        Done
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showPublishModal} onHide={cancelPublish}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Publish</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to publish the quiz?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cancelPublish}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => confirmPublish(qid!)}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}