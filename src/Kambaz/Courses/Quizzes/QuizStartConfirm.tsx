import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as quizClient from "./client";
import { Card, Button, Alert, Container, Badge, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { QuizType } from "./types";

export default function QuizStartConfirm() {
    const { qid, cid } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<QuizType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useSelector((state: any) => state.accountReducer);


    useEffect(() => {
        const loadQuiz = async () => {
            if (!qid) {
                setError("Quiz ID is missing");
                setLoading(false);
                return;
            }

            try {
                if (currentUser?.role !== "STUDENT") {
                    setError("Only students can take quizzes");
                    setLoading(false);
                    return;
                }

                const data = await quizClient.findQuizById(qid);
                setQuiz(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to load quiz:", error);
                setError("Failed to load quiz");
                setLoading(false);
            }
        };
        loadQuiz();
    }, [qid, currentUser]);

    if (loading) return <div className="text-center p-5">Loading...</div>;
    if (error) return <Alert variant="danger" className="m-5">{error}</Alert>;
    if (!quiz) return <div className="text-center p-5">Quiz not found</div>;

    const startQuiz = () => {
        if (cid && qid) {
            navigate(`/Kambaz/Courses/${cid}/quizzes/${qid}/take`);
        }
    };

    const cancelQuiz = () => {
        if (cid) {
            navigate(`/Kambaz/Courses/${cid}/quizzes`);
        }
    };

    return (
        <Container className="py-5">
            <Card className="shadow">
                <Card.Header as="h3" className="d-flex justify-content-between align-items-center fw-bold">
                    {quiz.title}
                    <Badge bg="secondary">{quiz.points} pts</Badge>
                </Card.Header>
                <Card.Body>
                    <Card.Subtitle className="mb-4 text-muted">
                        {quiz.questions?.length || 0} Questions ·{" "}
                        {quiz.timeLimit ? `${quiz.timeLimit} minute time limit` : "No time limit"}
                        {quiz.multipleAttempts && ` · ${quiz.attempts || 1} attempt(s) allowed`}
                    </Card.Subtitle>

                    {quiz.description && (
                        <div className="mb-3">
                            <h5>
                                <strong>Instructions:</strong>
                            </h5>
                            <p className="text-muted">{quiz.description}</p>
                        </div>
                    )}

                    <Alert variant="warning">
                        <strong>Reminder:</strong> Once you start, the timer will begin immediately and cannot be paused or reset.
                    </Alert>

                    <Row>
                        <Col className="text-start">
                            <Button variant="secondary" onClick={cancelQuiz}>
                                Back
                            </Button>
                        </Col>
                        <Col className="text-end">
                            <Button variant="success" onClick={startQuiz}>
                                Start Quiz
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
}