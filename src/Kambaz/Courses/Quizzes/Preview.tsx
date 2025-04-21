import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Card, Alert, Container, Badge } from "react-bootstrap";
import * as quizClient from "./client";
import { QuizType, QuizAttempt } from "./types";
import { useSelector } from "react-redux";

export default function Preview() {
    const { cid, qid } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<QuizType | null>(null);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [previousAttempt, setPreviousAttempt] = useState<QuizAttempt | null>(null);
    const { currentUser } = useSelector((state: any) => state.accountReducer);

    const totalPoints = useMemo(() => {
        if (!quiz || !quiz.questions) return 0;
        return quiz.questions.reduce((sum, q) => sum + q.points, 0);
    }, [quiz]);

    useEffect(() => {
        const loadQuizAndPreviousAttempt = async () => {
            if (qid && currentUser?._id) {
                try {
                    const quizData = await quizClient.findQuizById(qid);
                    setQuiz(quizData);

                    try {
                        const previewData = await quizClient.fetchPreviewAttempt(qid, currentUser._id);
                        if (previewData) {
                            setPreviousAttempt(previewData);
                            setAnswers(previewData.answers || {});
                        }
                    } catch (error) {
                        console.log("No previous preview attempt found", error);
                    }

                    setLoading(false);
                } catch (error) {
                    console.error("Error loading quiz:", error);
                    setLoading(false);
                }
            }
        };

        loadQuizAndPreviousAttempt();
    }, [qid, currentUser]);

    if (loading) {
        return <div className="text-center p-5">Loading quiz preview...</div>;
    }

    if (!quiz) {
        return <div className="text-center p-5">Quiz not found</div>;
    }

    const handleAnswerChange = (questionId: string, value: any) => {
        setAnswers({
            ...answers,
            [questionId]: value
        });
    };

    const calculateScore = () => {
        if (!quiz) return 0;

        let totalScore = 0;

        quiz.questions.forEach(question => {
            const userAnswer = answers[question._id ?? ""];

            if (!userAnswer) return;


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
                    if (question.correctAnswers) {
                        const isCorrect = question.correctAnswers.some(ans => {
                            if (question.caseSensitive) {
                                return userAnswer === ans;
                            } else {
                                return userAnswer.toLowerCase() === ans.toLowerCase();
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

    const handleSubmit = async () => {
        if (!quiz || !currentUser?._id) return;

        const calculatedScore = calculateScore();
        setScore(calculatedScore);


        const previewAttempt: QuizAttempt = {
            quizId: qid!,
            userId: currentUser._id,
            answers,
            score: calculatedScore,
            submittedAt: new Date().toISOString(),
            isPreview: true
        };


        await quizClient.savePreviewAttempt(qid!, previewAttempt);

        setSubmitted(true);
    };

    const handleEdit = () => {
        navigate(`/Kambaz/Courses/${cid}/quizzes/${qid}/edit`);
    };

    const handleRetake = () => {
        setAnswers({});
        setSubmitted(false);
        setScore(0);
    };

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold">{quiz.title}</h2>
                <div>
                    <Button
                        variant="primary"
                        onClick={handleEdit}
                        className="me-2"
                    >
                        Edit Quiz
                    </Button>
                </div>
            </div>

            {previousAttempt && !submitted && (
                <Alert variant="info">
                    <strong>Previous attempt found!</strong> You last previewed this quiz on{' '}
                    {new Date(previousAttempt.submittedAt).toLocaleString()}.
                    Your score was {previousAttempt.score} out of {totalPoints}.
                </Alert>
            )}

            {submitted ? (
                <div>
                    <Alert variant="success" className="mb-4">
                        <h4>Preview Results</h4>
                        <p>Your score: <strong>{score}</strong> out of <strong>{totalPoints}</strong> points.</p>
                    </Alert>

                    <h4 className="mb-4">Question Review</h4>
                    {quiz.questions.map((question, idx) => {
                        const userAnswer = answers[question._id ?? ""];
                        let isCorrect = false;

                        switch (question.type) {
                            case "Multiple Choice":
                                isCorrect = parseInt(userAnswer) === question.correctAnswer;
                                break;
                            case "True/False":
                                isCorrect = userAnswer === question.correctAnswer;
                                break;
                            case "Fill in the Blank":
                                if (question.options) {
                                    isCorrect = question.options.some(option => {
                                        if (question.caseSensitive) {
                                            return userAnswer === option;
                                        } else {
                                            return userAnswer?.toLowerCase() === option.toLowerCase();
                                        }
                                    });
                                }
                                break;
                            default:
                                isCorrect = userAnswer === question.correctAnswer;
                                break;
                        }

                        return (
                            <Card key={question._id} className="mb-4">
                                <Card.Header className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="mb-0 text-start fs-4">Question {idx + 1}</h5>
                                        {question.title && <p className="mb-0 text-muted">{question.title}</p>}
                                    </div>
                                    
                                    <div className="d-flex align-items-center">
                                        <Badge bg={isCorrect ? "success" : "danger"} className="me-2">
                                            {isCorrect ? "Correct" : "Incorrect"}
                                        </Badge>
                                        <span className="fw-bold fs-5">{question.points} pts</span>
                                    </div>
                                </Card.Header>
                                <Card.Body className="py-4 px-4">
                                    <div className="fs-5 mb-3">
                                        <strong>Q:</strong> {question.questionText}
                                    </div>

                                    <div className="border-top pt-3 mt-3">
                                        <p className="fs-5 mb-2"><strong>Your Answer:</strong> {renderUserAnswer(question, userAnswer)}</p>
                                        <p className="fs-5 mb-0"><strong>Correct Answer:</strong> {renderCorrectAnswer(question)}</p>
                                    </div>
                                </Card.Body>
                            </Card>
                        );
                    })}

                    <div className="d-flex justify-content-between mt-4">
                        <Button variant="secondary" onClick={() => navigate(`/Kambaz/Courses/${cid}/quizzes/${qid}`)} size="lg">
                            Back to Quiz
                        </Button>
                        <Button variant="primary" onClick={handleRetake} size="lg">
                            Retake Preview
                        </Button>
                    </div>
                </div>
            ) : (
                <div>
                    <Alert variant="primary">
                        This is a preview of the public version of the quiz.
                    </Alert>

                    {quiz.timeLimit && (
                        <p className="mb-4">
                            <i className="bi bi-clock me-2"></i>
                            Time Limit: {quiz.timeLimit} minutes
                        </p>
                    )}

                    {quiz.description && (
                        <Card className="mb-4">
                            <Card.Body>
                                <h5 className="fw-bold">Quiz Instructions</h5>
                                <p>{quiz.description}</p>
                            </Card.Body>
                        </Card>
                    )}

                    {quiz.questions.map((question, idx) => (
                        <Card className="mb-4" key={question._id}>
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 text-start fs-4">Question {idx + 1}</h5>
                                <span className="fw-bold fs-5">{question.points} pts</span>
                            </Card.Header>
                            <Card.Body className="py-4">

                                {question.title && (
                                    <h4 className="fw-bold mb-3">{question.title}</h4>
                                )}

                                <div className="mb-4 fs-5">
                                    {question.questionText}
                                </div>

                                <hr className="my-4" />

                                <div className="mt-4">
                                    <div className="mt-4">
                                        {renderQuestionInput(question, answers[question._id ?? ""], (value) => handleAnswerChange(question._id ?? "defaultId", value))}
                                    </div>

                                </div>
                            </Card.Body>
                        </Card>
                    ))}

                    <div className="d-flex justify-content-between mt-4">
                        <Button
                            variant="secondary"
                            onClick={() => navigate(`/Kambaz/Courses/${cid}/quizzes/${qid}`)}
                            size="lg"
                        >
                            Back to Quiz
                        </Button>
                        <Button
                            variant="success"

                            onClick={handleSubmit}
                            size="lg"
                        >
                            Submit Quiz
                        </Button>
                    </div>
                </div>
            )}
        </Container>
    );
}

function renderQuestionInput(question: any, value: any, onChange: (value: any) => void) {
    switch (question.type) {
        case "Multiple Choice":
            return (
                <div className="ps-2">
                    {question.options?.map((option: string, idx: number) => (
                        <Form.Check
                            key={question._id || idx}
                            type="radio"
                            id={`question-${question._id}-option-${idx}`}
                            name={`question-${question._id}`}
                            label={option}
                            checked={value === idx.toString()}
                            onChange={() => onChange(idx.toString())}
                            className="mb-3 fs-5"
                        />
                    ))}
                </div>
            );

        case "True/False":
            return (
                <div className="ps-2">
                    <Form.Check
                        type="radio"
                        id={`question-${question._id}-true`}
                        name={`question-${question._id}`}
                        label="True"
                        checked={value === "True"}
                        onChange={() => onChange("True")}
                        className="mb-3 fs-5"
                    />
                    <Form.Check
                        type="radio"
                        id={`question-${question._id}-false`}
                        name={`question-${question._id}`}
                        label="False"
                        checked={value === "False"}
                        onChange={() => onChange("False")}
                        className="mb-3 fs-5"
                    />
                </div>
            );

        case "Fill in the Blank":
            return (
                <Form.Control
                    type="text"
                    placeholder="Type your answer here"
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    className="fs-5"
                />
            );

        case "Short Answer":
            return (
                <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Type your answer here"
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    className="fs-5"
                />
            );

        default:
            return <p>Unsupported question type</p>;
    }
}

function renderUserAnswer(question: any, answer: any) {
    if (!answer) return "No answer provided";

    switch (question.type) {
        case "Multiple Choice": {
            const optionIndex = parseInt(answer);
            return question.options && question.options[optionIndex]
                ? question.options[optionIndex]
                : "Invalid option";
        }
        case "True/False":            
        case "Fill in the Blank":
            return answer;
        case "Short Answer":
            return answer;
        default:
            return answer.toString();
    }
}

function renderCorrectAnswer(question: any) {
    switch (question.type) {
        case "Multiple Choice":
            return question.options && question.correctAnswer !== undefined
                ? question.options[question.correctAnswer]
                : "Not specified";

        case "True/False":
            return question.correctAnswer === "true" ? "True" : "False";

        case "Fill in the Blank":
            return question.correctAnswers
                ? question.correctAnswers.join(" or ")
                : "Not specified";

        case "Short Answer":
            return question.correctAnswer || "Not specified";

        default:
            return "Not specified";
    }
}