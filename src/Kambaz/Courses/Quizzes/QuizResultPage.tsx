import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as quizClient from "./client";
import { QuizType, QuizAttempt } from "./types";
import { useSelector } from "react-redux";
import { Button, Card, Alert, Container, Badge, Table, ProgressBar } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function QuizResultPage() {
    const { qid, cid } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<QuizType | null>(null);
    const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
    const [latestAttempt, setLatestAttempt] = useState<QuizAttempt | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);

    const { currentUser } = useSelector(
        (state: { accountReducer: { currentUser: { _id: string } | null } }) =>
            state.accountReducer
    );

    useEffect(() => {
        const loadQuizAndAttempts = async () => {
            if (!qid || !currentUser?._id) {
                setError("Quiz ID or user information missing");
                setLoading(false);
                return;
            }

            try {
                const quizData = await quizClient.findQuizById(qid);
                setQuiz(quizData);

                try {
                    const attemptsData = await quizClient.fetchStudentQuizAttempts(qid, currentUser._id);
                    setAttempts(attemptsData);

                    if (attemptsData.length > 0) {
                        const sortedAttempts = [...attemptsData].sort((a, b) =>
                            new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
                        );
                        setLatestAttempt(sortedAttempts[0]);
                    }

                    const maxAttempts = quizData.multipleAttempts ? (quizData.attempts || 1) : 1;
                    const attemptsUsed = attemptsData.length;
                    setRemainingAttempts(Math.max(0, maxAttempts - attemptsUsed));
                } catch (error) {
                    console.log("No attempts found", error);
                    const maxAttempts = quizData.multipleAttempts ? (quizData.attempts || 1) : 1;
                    setRemainingAttempts(maxAttempts);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error loading quiz:", error);
                setError("Failed to load quiz results. Please try again later.");
                setLoading(false);
            }
        };

        loadQuizAndAttempts();
    }, [qid, currentUser]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const isAnswerCorrect = (question: any, userAnswer: any) => {
        if (userAnswer === undefined || userAnswer === '') return false;

        switch (question.type) {
            case "Multiple Choice":
                return parseInt(userAnswer) === question.correctAnswer;
            case "True/False":
                return userAnswer === question.answer;
            case "Fill in the Blank":
                if (question.choices) {
                    return question.choices.some((choice: string) => {
                        if (question.caseSensitive) {
                            return userAnswer === choice;
                        } else {
                            return userAnswer.toLowerCase() === choice.toLowerCase();
                        }
                    });
                }
                return false;
            default:
                return userAnswer?.toLowerCase().trim() === question.answer?.toLowerCase().trim();
        }
    };

    const renderUserAnswer = (question: any, userAnswer: any) => {
        if (userAnswer === undefined || userAnswer === '') return "No answer provided";

        switch (question.type) {
            case "Multiple Choice": {
                const choiceIndex = parseInt(userAnswer);
                return question.choices && question.choices[choiceIndex]
                    ? question.choices[choiceIndex]
                    : "Invalid choice";
            }
            case "True/False":
            case "Fill in the Blank":
                return userAnswer;
            default:
                return userAnswer.toString();
        }
    };

    const renderCorrectAnswer = (question: any) => {
        if (!question) return "Not specified (no question data)";

        let correctIndex;
        let choices;

        switch (question.type) {
            case "Multiple Choice":
                console.debug("Multiple Choice Debug:", {
                    choices: question.choices,
                    correctAnswer: question.correctAnswer,
                    typeOfCorrectAnswer: typeof question.correctAnswer
                });

                choices = question.choices;
                correctIndex = Number(question.correctAnswer);

                if (!Array.isArray(choices)) {
                    return "Not specified (invalid choices format)";
                }
                if (choices.length === 0) {
                    return "Not specified (no choices available)";
                }

                if (isNaN(correctIndex)) {
                    return "Not specified (invalid correct answer index)";
                }
                if (correctIndex < 0 || correctIndex >= choices.length) {
                    return `Not specified (index ${correctIndex} out of range)`;
                }

                return choices[correctIndex];

            case "True/False":
                return (question.answer === "True" || question.answer === "False")
                    ? question.answer
                    : "Not specified (invalid True/False answer)";

            case "Fill in the Blank":
                return (Array.isArray(question.choices) && question.choices.length > 0)
                    ? question.choices.join(" or ")
                    : "Not specified (no possible answers)";

            case "Short Answer":
                return question.answer || "Not specified";

            default:
                return "Not specified (unknown question type)";
        }
    };

    const shouldShowCorrectAnswers = () => {
        if (!quiz) return false;

        if (quiz.showCorrectAnswers) return true;

        if (remainingAttempts === 0) return true;

        return false;
    };

    const handleRetakeQuiz = () => {
        navigate(`/Kambaz/Courses/${cid}/quizzes/${qid}/take`);
    };

    if (loading) {
        return <div className="text-center p-5">Loading quiz results...</div>;
    }

    if (error) {
        return <Alert variant="danger" className="m-5">{error}</Alert>;
    }

    if (!quiz || !latestAttempt) {
        return <Alert variant="warning" className="m-5">No quiz results found</Alert>;
    }

    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const scorePercentage = (latestAttempt.score / totalPoints) * 100;

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>{quiz.title} - Results</h2>
                <div>
                    <Badge bg={scorePercentage >= 70 ? "success" : "danger"} className="fs-5 px-3 py-2">
                        Score: {latestAttempt.score} / {totalPoints} ({scorePercentage.toFixed(1)}%)
                    </Badge>
                </div>
            </div>

            <Card className="mb-4">
                <Card.Body>
                    <h4>Your Latest Attempt</h4>
                    <p><strong>Submitted:</strong> {formatDate(latestAttempt.submittedAt)}</p>
                    <p><strong>Score:</strong> {latestAttempt.score} out of {totalPoints} points</p>
                    <ProgressBar
                        now={scorePercentage}
                        variant={scorePercentage >= 70 ? "success" : "danger"}
                        label={`${scorePercentage.toFixed(1)}%`}
                        className="mb-3"
                    />

                    {attempts.length > 1 && (
                        <div className="mt-3">
                            <h5>All Attempts</h5>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Date</th>
                                    <th>Score</th>
                                    <th>Percentage</th>
                                </tr>
                                </thead>
                                <tbody>
                                {attempts.map((attempt, index) => {
                                    const attemptPercentage = (attempt.score / totalPoints) * 100;
                                    return (
                                        <tr key={index}>
                                            <td>{attempts.length - index}</td>
                                            <td>{formatDate(attempt.submittedAt)}</td>
                                            <td>{attempt.score} / {totalPoints}</td>
                                            <td>{attemptPercentage.toFixed(1)}%</td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </Table>
                        </div>
                    )}

                    {remainingAttempts! > 0 && (
                        <div className="mt-3">
                            <Alert variant="info">
                                You have {remainingAttempts} attempt(s) remaining.
                            </Alert>
                            <Button variant="primary" onClick={handleRetakeQuiz}>
                                Take Quiz Again
                            </Button>
                        </div>
                    )}
                </Card.Body>
            </Card>

            <h4 className="mb-4">Question Review</h4>
            {quiz.questions.map((question, idx) => {
                const userAnswer = latestAttempt.answers[question._id ?? ""];
                const correct = isAnswerCorrect(question, userAnswer);

                return (
                    <Card key={question._id} className={`mb-4 ${correct ? 'border-success' : 'border-danger'}`}>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 text-start fs-4">Question {idx + 1}</h5>
                            <div className="d-flex align-items-center">
                                {correct ? (
                                    <FaCheckCircle className="text-success me-2 fs-5" />
                                ) : (
                                    <FaTimesCircle className="text-danger me-2 fs-5" />
                                )}
                                <span className="fw-bold fs-5">{question.points} pts</span>
                            </div>
                        </Card.Header>
                        <Card.Body className="py-4">
                            {question.title && (
                                <h4 className="fw-bold mb-3">{question.title}</h4>
                            )}

                            <div className="mb-4 fs-5">
                                {question.questionText.replace(/\[blank\]/g, "____________")}
                            </div>

                            <hr className="my-4" />

                            <div className="mt-4">
                                <p className="fs-5">
                                    <strong>Your Answer:</strong> {renderUserAnswer(question, userAnswer)}
                                </p>

                                {shouldShowCorrectAnswers() && (
                                    <p className="fs-5">
                                        <strong>Correct Answer:</strong> {renderCorrectAnswer(question)}
                                    </p>
                                )}

                                <div className={`mt-3 p-2 ${correct ? 'bg-success-subtle' : 'bg-danger-subtle'} rounded`}>
                                    <p className="mb-0 fs-5 fw-bold">
                                        {correct ? 'Correct!' : 'Incorrect'}
                                    </p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                );
            })}

            <div className="d-flex justify-content-between mt-4">
                <Button
                    variant="secondary"
                    onClick={() => navigate(`/Kambaz/Courses/${cid}/quizzes`)}
                    size="lg"
                >
                    Back to Quizzes
                </Button>

                {remainingAttempts! > 0 && (
                    <Button
                        variant="primary"
                        onClick={handleRetakeQuiz}
                        size="lg"
                    >
                        Take Quiz Again
                    </Button>
                )}
            </div>
        </Container>
    );
}