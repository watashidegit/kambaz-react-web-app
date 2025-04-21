import { Button, Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import * as QuizClient from "./client";
import { FaPencilAlt } from "react-icons/fa";

export default function QuizDetails() {

    const { cid, qid } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const isFaculty = currentUser?.role === "FACULTY";
    const isStudent = currentUser?.role === "STUDENT";
    const [quiz, setQuiz] = useState<any>(null);
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



    const fetchQuiz = async (qid: string) => {
        try {
            const quiz = await QuizClient.findQuizById(qid);
            setQuiz(quiz);
          } catch (e) {
            console.error("Failed to load quiz", e);
          }
    }

    useEffect(() => {
        if (qid) {
            fetchQuiz(qid);
        }
    }, [qid]);

    if (!quiz) {
        return (
          <Container className="mt-4">
            <div className="text-muted">Loading quiz details...</div>
          </Container>
        );
    }

    return (
        <Container className="mt-4">
            <div className="d-flex mb-4 gap-2 justify-content-center">
                <Button variant="secondary" className="me-2" onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}>
                    Back
                </Button>

                {isFaculty && (
                <>
                    <Button variant="light" className="me-2" onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/preview`)}>
                        Preview
                    </Button>
                    <Button variant="light" onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/editor`)}>
                        <FaPencilAlt className="mb-1 me-1" style={{ transform: "rotate(270deg)" }}/>Edit 
                    </Button>
                </>
                )}
                
                {isStudent && (
                <Button variant="danger" onClick={() => navigate(`/quiz/${qid}/start`)}>
                    Start Quiz
                </Button>
                )}  
            </div>

            <br />
            <h4 className="fw-bold mb-3">{quiz.title}</h4>
            <hr />

            {isFaculty && (
                <div className="mt-4">
                    <Row className="mb-2">
                        <Col sm={4} className="fw-bold text-end">Quiz Type</Col>
                        <Col sm={8}>{quiz.type ?? "Graded Quiz"}</Col>
                    </Row>
                    
                    <Row className="mb-2">
                        <Col sm={4} className="fw-bold text-end">Points</Col>
                        <Col sm={8}>{quiz.points}</Col>
                    </Row>

                    <Row className="mb-2">
                        <Col sm={4} className="fw-bold text-end">Assignment Group</Col>
                        <Col sm={8}>{quiz.assignmentGroup ?? "QUIZZES"}</Col>
                    </Row> 

                    <Row className="mb-2">
                        <Col sm={4} className="fw-bold text-end">Shuffle Answers</Col>
                        <Col sm={8}>{quiz.shuffleAnswers ? "Yes" : "No"}</Col>
                    </Row>

                    <Row className="mb-2">
                        <Col sm={4} className="fw-bold text-end">Time Limit</Col>
                        <Col sm={8}>{quiz.timeLimit ?? "20"} Minutes</Col>
                    </Row>

                    <Row className="mb-2">
                        <Col sm={4} className="fw-bold text-end">Multiple Attempts</Col>
                        <Col sm={8}>{quiz.multipleAttempts ? "Yes" : "No"}</Col>
                    </Row>  

                    <Row className="mb-2">
                        <Col sm={4} className="fw-bold text-end">View Responses</Col>
                        <Col sm={8}>{quiz.viewResponses ?? "Always"}</Col>
                    </Row>

                    
                    {quiz.multipleAttempts && (
                        <Row className="mb-2">
                            <Col sm={4} className="fw-bold text-end">How Many Attempts</Col>
                            <Col sm={8}>{quiz.attemptLimit}</Col>
                        </Row>
                    )}
                    

                    <Row className="mb-2">
                        <Col sm={4} className="fw-bold text-end">Show Correct Answers</Col>
                        <Col sm={8}>{quiz.showCorrectAnswers ?? "No"}</Col>
                    </Row>

                    <Row className="mb-2">
                        <Col sm={4} className="fw-bold text-end">Access Code</Col>
                        <Col sm={8}>{quiz.accessCode || "None"}</Col>
                    </Row>

                    <Row className="mb-2">
                        <Col sm={4} className="fw-bold text-end">One Question at a Time</Col>
                        <Col sm={8}>{quiz.oneQuestionAtATime ? "Yes" : "No"}</Col>
                    </Row>

                    <Row className="mb-2">
                        <Col sm={4} className="fw-bold text-end">Webcam Required</Col>
                        <Col sm={8}>{quiz.webcamRequired ? "Yes" : "No"}</Col>
                    </Row>

                    <Row className="mb-2">
                        <Col sm={4} className="fw-bold text-end">Lock Questions After Answering</Col>
                        <Col sm={8}>{quiz.lockQuestions ? "Yes" : "No"}</Col>
                    </Row>

                    <br />
                    
                    <div className="border-bottom py-3 justify-content-left text-left">
                        <Row className="fw-bold ">
                            <Col xs={3}>Due</Col>
                            <Col xs={3}>For</Col>
                            <Col xs={3}>Available from</Col>
                            <Col xs={3}>Until</Col>
                        </Row>
                    </div>
                    <div className="border-bottom py-3 justify-content-left text-left">
                        <Row>
                            <Col xs={3}>{formatDateTime(quiz.dueDate)}</Col>
                            <Col xs={3}>Everyone</Col>
                            <Col xs={3}>{formatDateTime(quiz.availableFrom)}</Col>
                            <Col xs={3}>{formatDateTime(quiz.availableUntil)}</Col>
                        </Row>
                    </div>
                </div>
            )}          
        </Container>
    );}