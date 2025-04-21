import { useState } from "react";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";

const defaultQuestion = {
  title: "",
  type: "Multiple Choice",
  questionText: "",
  options: ["", ""],
  correctAnswer: 0,
  correctAnswers: [""],
  points: 1,
};

export default function QuestionForm({ question = defaultQuestion, onSave, onCancel }: any) {
  const [formData, setFormData] = useState(question);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, index?: number) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name === "options" && index !== undefined) {
      // mc: options
      const updatedOptions = [...formData.options];
      updatedOptions[index] = value;
      setFormData({ ...formData, options: updatedOptions });
    } else if (name === "correctAnswers" && index !== undefined) {
      // fitb
      const updated = [...formData.correctAnswers];
      updated[index] = value;
      setFormData({ ...formData, correctAnswers: updated });
    } else if (name === "correctAnswer" && typeof index === "number") {
      // mc: selecting correct option by index
      setFormData({ ...formData, correctAnswer: index });
    } else {
      // t/f and non-boolean
      setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    }
  };

  const handleAddOption = () => {
    setFormData({ ...formData, options: [...formData.options, ""] });
  };

  const handleRemoveOption = (index: number) => {
    const updated = formData.options.filter((_: string, i: number) => i !== index);
    setFormData({ ...formData, options: updated });
  };

  const handleAddAnswer = () => {
    setFormData({ ...formData, correctAnswers: [...formData.correctAnswers, ""] });
  };

  const handleRemoveAnswer = (index: number) => {
    const updated = formData.correctAnswers.filter((_: string, i: number) => i !== index);
    setFormData({ ...formData, correctAnswers: updated });
  };

  return (
    <div className="border p-3">
      <Row className="mb-3">
        <Col md={4}>
          <Form.Select name="type" value={formData.type} onChange={handleChange}>
            <option>Multiple Choice</option>
            <option>True/False</option>
            <option>Fill in the Blank</option>
          </Form.Select>
        </Col>
        <Col md={5}>
          <Form.Control
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter question title"
          />
        </Col>
        <Col md={3} className="d-flex align-items-center">
          <span className="me-2">pts:</span>
          <Form.Control
              type="number"
              value={formData.points}
              onChange={handleChange}
              placeholder="Points"
              min={0}
          />
        </Col>
      </Row>

      <Form.Group className="mb-3 mt-3">
        <Form.Label className="fs-5"><b>Question:</b></Form.Label>
        <Form.Control
          name="questionText"
          as="textarea"
          rows={3}
          value={formData.questionText}
          onChange={handleChange}
          placeholder="Write the question here..."
        />
      </Form.Group>

      {/* Rendering multiple choice */}
      {formData.type === "Multiple Choice" && (
        <>
          <Form.Label className="fw-bold fs-5">Answers:</Form.Label>
          {formData.options.map((option: string, index: number) => (
            <InputGroup className="mb-2" key={index}>
              <InputGroup.Radio
                checked={formData.correctAnswer === index}
                onChange={() => setFormData({ ...formData, correctAnswer: index })}
                name="correctAnswer"
              />
              <Form.Control
                value={option}
                onChange={(e) => handleChange(e, index)}
                name="options"
                placeholder={`Option ${index + 1}`}
              />
              <Button variant="outline-danger" onClick={() => handleRemoveOption(index)}>
                ✕
              </Button>
            </InputGroup>
          ))}

          <Button variant="link" onClick={handleAddOption}>
            + Add Option
          </Button>
        </>
      )}

      {/* Rendering true false qa editor */}
      {formData.type === "True/False" && (
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold fs-5">Correct Answer: </Form.Label>
          <div className="d-flex gap-4">
            <Form.Check
              type="radio"
              id="true-option"
              label="True"
              name="correctAnswer"
              value="true"
              checked={formData.correctAnswer === "true"}
              onChange={handleChange}
            />
            <Form.Check
              type="radio"
              id="false-option"
              label="False"
              name="correctAnswer"
              value="false"
              checked={formData.correctAnswer === "false"}
              onChange={handleChange}
            />
          </div>
        </Form.Group>
      )}

      {/* Rendering fill in the blank qa editor */}
      {formData.type === "Fill in the Blank" && (
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold fs-5">Answers: </Form.Label>
          <Form.Text className="text-muted d-block mb-2">
            Add all acceptable correct answers (case-insensitive match)
          </Form.Text>
          {formData.correctAnswers.map((ans: string, index: number) => (
            <InputGroup className="mb-2" key={index}>
              <Form.Control
                name="correctAnswers"
                value={ans}
                onChange={(e) => handleChange(e, index)}
                placeholder={`Answer ${index + 1}`}
              />
              <Button variant="outline-danger" onClick={() => handleRemoveAnswer(index)}>
                ✕
              </Button>
            </InputGroup>
          ))}
        <Button variant="link" onClick={handleAddAnswer}>+ Add Answer</Button>
      </Form.Group>
      )}

      {/* cancel/save button for question */}
      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={() => onSave(formData)}>Save Question</Button>
      </div>
    </div>
  );
}