import { Card, Button } from "react-bootstrap";

interface Question {
  _id?: string;
  type: string;
  title?: string;
  questionText: string;
  points: number;
  options?: string[];
  correctAnswer?: number | string; // multiple choice: index, true/false: "true"/"false"
  correctAnswers?: string[];       // for fill in the blank
  caseSensitive?: boolean;
}

interface Props {
  question: Question;
  onEdit?: () => void;
}

export default function QuestionPreview({ question, onEdit }: Props) {
  const renderCorrectAnswer = () => {
    switch (question.type) {
      case "Multiple Choice":
        if (
          typeof question.correctAnswer === "number" &&
          question.options &&
          question.options[question.correctAnswer] !== undefined
        ) {
          return question.options[question.correctAnswer];
        }
        return "Not specified";

      case "True/False":
        return question.correctAnswer === "true" ? "True" : "False";

      case "Fill in the Blank":
        return question.correctAnswers?.join(" / ") || "Not specified";

      default:
        return "Not specified";
    }
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <strong>{question.title}</strong>{" "}
            <span className="text-muted">({question.points} pt{question.points > 1 ? "s" : ""})</span>
          </div>
          {onEdit && (
            <Button variant="outline-secondary" size="sm" onClick={onEdit}>
              Edit
            </Button>
          )}
        </Card.Title>

        <Card.Text className="mb-3">
          <strong>Q:</strong> {question.questionText}
        </Card.Text>

        {question.type === "Multiple Choice" && question.options && (
          <div className="ms-2">
            {question.options?.map((option, idx) => (
              <div key={idx}>
                <div className="d-flex align-items-center mb-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`question-${question._id}`}
                      id={`option-${question._id}-${idx}`}
                      disabled
                      checked={idx === question.correctAnswer}
                    />
                    <label
                      className="form-check-label ms-2"
                      htmlFor={`option-${question._id}-${idx}`}
                    >
                      {option}
                    </label>
                  </div>
                </div>

                {/* Add a line between choices */}
                {idx < (question.options?.length ?? 0) -1 && (
                  <hr className="mx-4 my-2" />
                )}
              </div>
            ))}
          </div>
        )}
        å
        {question.type !== "Multiple Choice" && (
          <p>
            <strong>Correct Answer:</strong> {renderCorrectAnswer()}
          </p>
        )}
      </Card.Body>
    </Card>
  );
}
