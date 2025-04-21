import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as quizClient from "./client";
import { QuizType, QuizAttempt } from "./types";
import { useSelector } from "react-redux";
import { Form, Button, Card, Alert, Container, Badge, ProgressBar} from "react-bootstrap";

export default function QuizTakePage() {
    const { qid, cid } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<QuizType | null>(null);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [previousAttempts, setPreviousAttempts] = useState<QuizAttempt[]>([]);
    const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());

    const { currentUser } = useSelector(
        (state: { accountReducer: { currentUser: { _id: string } | null } }) =>
            state.accountReducer
    );

    const handleSubmit = useCallback(async () => {
        if (!qid || !quiz || !currentUser?._id || remainingAttempts === 0 || submitting) return;

        setSubmitting(true);

        try {
            console.log("Answers before submitting:", answers);
            const calculatedScore = calculateScore();
            const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
            const percentageScore = (calculatedScore / totalPoints) * 100;

            const submission = {
                quizId: qid,
                userId: currentUser._id,
                answers,
                score: calculatedScore,
                percentageScore,
                submittedAt: new Date().toISOString()
            } as QuizAttempt;
            console.log("Submission data:", submission);

            await quizClient.submitQuizAttempt(qid, submission);
            navigate(`/Kambaz/Courses/${cid}/quizzes/${qid}/result`);
        } catch (error) {
            console.error("Error submitting quiz:", error);
            setError("Failed to submit quiz. Please try again.");
            setSubmitting(false);
        }
    }, [qid, quiz, currentUser, remainingAttempts, submitting, answers, navigate, cid]);

    const calculateScore = () => {
        if (!quiz) return 0;

        let totalScore = 0;

        quiz.questions.forEach(question => {
            const userAnswer = answers[question._id || ""];
            if (userAnswer === undefined || userAnswer === "") return;

            switch (question.type) {
                case "Multiple Choice":
                    if (parseInt(userAnswer) === question.correctAnswer) {
                        totalScore += question.points;
                    }
                    break;
                case "True/False":
                    if (userAnswer === question.correctAnswer) {
                        totalScore += question.points;
                    }
                    break;
                case "Fill in the Blank":
                    if (question.options) {
                        const isCorrect = question.options.some(option => {
                            if (question.caseSensitive === true) {
                                return userAnswer === option;
                            } else {
                                return userAnswer.toLowerCase() === option.toLowerCase();
                            }
                        });

                        if (isCorrect) {
                            totalScore += question.points;
                        }
                    }
                    break;
                default:
                    if (userAnswer === question.correctAnswer) {
                        totalScore += question.points;
                    }
                    break;
            }
        });

        return totalScore;
    };

    useEffect(() => {
        const loadQuiz = async () => {
            if (qid) {
                try {
                    const fetched = await quizClient.findQuizById(qid);
                    setQuiz(fetched);
                    setLoading(false);
                } catch (error) {
                    console.error("Failed to load quiz:", error);
                    setError("Failed to load quiz. Please try again later.");
                    setLoading(false);
                }
            }
        };
        loadQuiz();
    }, [qid]);

    useEffect(() => {
        const loadPreviousAttempts = async () => {
            if (qid && currentUser?._id) {
                try {
                    const attempts = await quizClient.fetchStudentQuizAttempts(qid, currentUser._id);
                    setPreviousAttempts(attempts);

                    if (quiz) {
                        const maxAttempts = quiz.multipleAttempts === true ? (quiz.attempts || 1) : 1;
                        setRemainingAttempts(Math.max(0, maxAttempts - attempts.length));
                    }
                } catch (error) {
                    console.error("Failed to load previous attempts:", error);
                    if (quiz) {
                        setRemainingAttempts(quiz.multipleAttempts === true ? (quiz.attempts || 1) : 1);
                    }
                }
            }
        };

        if (quiz) {
            loadPreviousAttempts();
        }
    }, [quiz, qid, currentUser]);

    useEffect(() => {
        if (quiz?.timeLimit && remainingAttempts && remainingAttempts > 0) {
            setTimeLeft(quiz.timeLimit * 60);

            const timer = setInterval(() => {
                setTimeLeft((prevTime) => {
                    const currentTime = prevTime === null ? 0 : prevTime;
                    if (currentTime <= 1) {
                        clearInterval(timer);
                        handleSubmit();
                        return 0;
                    }
                    return currentTime - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [quiz, remainingAttempts, handleSubmit]);

    // eslint-disable-next-line
    const handleChange = (questionId: string, value: any) => {
        console.log("Updating answer for question:", questionId, "Value:", value);
        setAnswers((prev) => ({ ...prev, [questionId]: value }));

        setAnsweredQuestions(prev => {
            const newSet = new Set(prev);
            newSet.add(questionId);
            return newSet;
        });
    };

    const formatTimeLeft = () => {
        if (timeLeft === null) return "";
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const renderQuestionText = (questionText: string) => {
        if (!questionText) return "";
        if (questionText.includes("[blank]")) {
            return questionText.replace(/\[blank\]/g, "____________");
        }
        return questionText;
    };

    const singleQuestionMode = quiz?.oneQuestionAtATime === true;

    const goToNextQuestion = () => {
        if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const goToPreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            const prevQuestion = quiz?.questions[currentQuestionIndex - 1];
            const prevQuestionId = prevQuestion?._id || "";

            if (quiz?.lockQuestionsAfterAnswering === true &&
                prevQuestionId &&
                answeredQuestions.has(prevQuestionId)) {
                return;
            }

            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const goToQuestion = (index: number) => {
        if (quiz && index >= 0 && index < quiz.questions.length) {
            if (quiz.lockQuestionsAfterAnswering === true) {
                const currentQuestion = quiz.questions[currentQuestionIndex];
                const currentQId = currentQuestion._id || "";
                if (currentQId && answeredQuestions.has(currentQId)) {
                    return;
                }

                const targetQuestion = quiz.questions[index];
                const targetQId = targetQuestion._id || "";
                if (targetQId && answeredQuestions.has(targetQId)) {
                    return;
                }
            }

            setCurrentQuestionIndex(index);
        }
    };

    const renderQuestion = (question: any, idx: number) => {
        const questionId = question._id || "";

        return (
            <Card key={questionId} className="mb-4 border-dark">
                <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Question {idx + 1}</h5>
                    <div className="fw-bold">{question.points} pts</div>
                </Card.Header>
                <Card.Body>
                    {question.title && (
                        <h4 className="fw-bold mb-3">{question.title}</h4>
                    )}

                    <div className="mb-3 fs-5">
                        {renderQuestionText(question.questionText)}
                    </div>

                    <hr className="my-3" />

                    <div className="mt-4">
                        {question.type === "Multiple Choice" && question.options && (
                            <div className="ms-2">
                                {question.options.map((option: string, cidx: number) => (
                                    <div key={cidx}>
                                        <div className="d-flex align-items-center mb-2">
                                            <Form.Check
                                                type="radio"
                                                id={`question-${questionId}-option-${cidx}`}
                                                name={`question-${questionId}`}
                                                label={option}
                                                checked={answers[questionId] === cidx.toString()}
                                                onChange={() => handleChange(questionId, cidx.toString())}
                                                className="fs-5"
                                            />
                                        </div>
                                        {cidx < question.options.length - 1 && (
                                            <hr className="mx-4 my-2" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {question.type === "True/False" && (
                            <div className="ms-2">
                                {["True", "False"].map((option, optIdx) => (
                                    <div key={option}>
                                        <div className="d-flex align-items-center mb-2">
                                            <Form.Check
                                                type="radio"
                                                id={`question-${questionId}-${option.toLowerCase()}`}
                                                name={`question-${questionId}`}
                                                label={option}
                                                checked={answers[questionId] === option}
                                                onChange={() => handleChange(questionId, option)}
                                                className="fs-5"
                                            />
                                        </div>
                                        {optIdx === 0 && (
                                            <hr className="mx-4 my-2" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {question.type === "Fill in the Blank" && (
                            <div className="ms-2">
                                <Form.Control
                                    type="text"
                                    placeholder="Type your answer here"
                                    value={answers[questionId] || ""}
                                    onChange={(e) => handleChange(questionId, e.target.value)}
                                    className="fs-5"
                                />
                            </div>
                        )}

                        {question.type === "Short Answer" && (
                            <div className="ms-2">
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Type your answer here"
                                    value={answers[questionId] || ""}
                                    onChange={(e) => handleChange(questionId, e.target.value)}
                                    className="fs-5"
                                />
                            </div>
                        )}
                    </div>
                </Card.Body>
            </Card>
        );
    };

    const isQuestionLocked = (questionId: string) => {
        return quiz?.lockQuestionsAfterAnswering === true && answeredQuestions.has(questionId);
    };

    if (loading) {
        return <div className="text-center p-5">Loading quiz...</div>;
    }

    if (error) {
        return <Alert variant="danger" className="m-5">{error}</Alert>;
    }

    if (!quiz) return <div className="text-center p-5">Quiz not found</div>;

    if (remainingAttempts === 0) {
        return (
            <Container className="py-4">
                <Card>
                    <Card.Body>
                        <Alert variant="info">
                            <h4>Maximum attempts reached</h4>
                            <p>You have used all available attempts for this quiz.</p>
                            <Button
                                variant="primary"
                                onClick={() => navigate(`/Kambaz/Courses/${cid}/quizzes/${qid}/result`)}
                            >
                                View Results
                            </Button>
                        </Alert>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <Card className="mb-4">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                        <h2 className="fw-bold">{quiz.title}</h2>
                        {timeLeft !== null && (
                            <div>
                                <div className="text-danger fw-bold">
                                    Time Remaining: {formatTimeLeft()}
                                </div>
                                <ProgressBar
                                    now={(timeLeft / (quiz.timeLimit || 1) * 60) * 100}
                                    variant="danger"
                                    className="mt-2"
                                    style={{ width: '200px' }}
                                />
                            </div>
                        )}
                    </div>

                    {previousAttempts.length > 0 && (
                        <Alert variant="info" className="mt-3 mb-3">
                            <h5>Previous Attempts</h5>
                            <p>You have completed {previousAttempts.length} attempt(s). Your last score was {previousAttempts[0].score} points.</p>
                            <Badge bg="info">
                                Attempt {(quiz.attempts || 1) - (remainingAttempts || 0) + 1} of {quiz.attempts || 1}
                            </Badge>
                        </Alert>
                    )}
                </Card.Body>
            </Card>

            {quiz.questions.length > 1 && (
                <div className="mb-4">
                    <Card>
                        <Card.Body className="p-2">
                            <div className="d-flex flex-wrap justify-content-center">
                                {quiz.questions.map((q, idx) => {
                                    const qId = q._id || "";
                                    const isAnswered = qId && answers[qId] !== undefined;
                                    const isLocked = qId && isQuestionLocked(qId);
                                    const isCurrent = currentQuestionIndex === idx;

                                    let variant = "outline-secondary";
                                    if (isCurrent) variant = "primary";
                                    else if (isAnswered) variant = "success";
                                    if (isLocked && !isCurrent) variant = "light";

                                    return (
                                        <Button
                                            key={idx}
                                            variant={variant}
                                            className="m-1"
                                            onClick={() => goToQuestion(idx)}
                                            disabled={Boolean(isLocked && !isCurrent)}
                                        >
                                            {idx + 1}
                                        </Button>
                                    );
                                })}
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            )}

            {singleQuestionMode ? (
                <div>
                    {quiz.questions.length > 0 && renderQuestion(quiz.questions[currentQuestionIndex], currentQuestionIndex)}

                    <div className="d-flex justify-content-between mt-4">
                        <Button
                            variant="outline-primary"
                            onClick={goToPreviousQuestion}
                            disabled={Boolean(
                                currentQuestionIndex === 0 ||
                                (quiz.lockQuestionsAfterAnswering === true &&
                                    currentQuestionIndex > 0 &&
                                    quiz.questions[currentQuestionIndex-1]._id &&
                                    answeredQuestions.has(quiz.questions[currentQuestionIndex-1]._id || ""))
                            )}
                        >
                            Previous
                        </Button>

                        {currentQuestionIndex < quiz.questions.length - 1 ? (
                            <Button
                                variant="primary"
                                onClick={goToNextQuestion}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                variant="success"
                                onClick={handleSubmit}
                                disabled={submitting}
                            >
                                {submitting ? "Submitting..." : "Submit Quiz"}
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                <div>
                    {quiz.questions.map((q, idx) => renderQuestion(q, idx))}

                    <div className="text-center mt-4">
                        <Button
                            variant="secondary"
                            className="me-3"
                            onClick={() => navigate(`/Kambaz/Courses/${cid}/quizzes`)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="success"
                            size="lg"
                            onClick={handleSubmit}
                            className="px-5"
                            disabled={submitting}
                        >
                            {submitting ? "Submitting..." : "Submit Quiz"}
                        </Button>
                    </div>
                </div>
            )}
        </Container>
    );
}