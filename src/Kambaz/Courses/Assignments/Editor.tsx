import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import { addAssignment, updateAssignment } from "./reducer";
import { AssignmentType } from "./types";

export default function AssignmentEditor() {
    const { cid, aid } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const assignments: AssignmentType[] = useSelector(
        (state: { assignmentReducer: { assignments: AssignmentType[] } }) =>
            state.assignmentReducer.assignments
    );

    const existingAssignment = assignments.find(a => a._id === aid);

    const { currentUser } = useSelector((state: any) => state.accountReducer);



    const [formData, setFormData] = useState({
        title: "",
        description: "",
        points: 100,
        assignmentGroup: "ASSIGNMENTS",
        displayGrade: "Percentage",
        submissionType: "Online",
        assignTo: "Everyone",
        dueDate: "",
        availableFromDate: "",
        availableUntilDate: "",
    });

    useEffect(() => {
        if (existingAssignment) {
            setFormData({
                title: existingAssignment.title || "",
                description: existingAssignment.description ?? `This is the description for ${existingAssignment.title}`,
                points: existingAssignment.points || 100,
                assignmentGroup: existingAssignment.assignmentGroup || "ASSIGNMENTS",
                displayGrade: existingAssignment.displayGrade || "Percentage",
                submissionType: existingAssignment.submissionType || "Online",
                assignTo: existingAssignment.assignTo || "Everyone",
                dueDate: existingAssignment.dueDate || "",
                availableFromDate: existingAssignment.availableFromDate || "",
                availableUntilDate: existingAssignment.availableUntilDate || "",
            });
        }
    }, [existingAssignment]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const updatedAssignment = {
            _id: existingAssignment ? existingAssignment._id : Math.random().toString(36).substr(2, 9),
            title: formData.title,
            course: cid,
            description: formData.description,
            points: formData.points,
            dueDate: formData.dueDate,
            availableFromDate: formData.availableFromDate,
            availableUntilDate: formData.availableUntilDate,
            assignmentGroup: formData.assignmentGroup,
            displayGrade: formData.displayGrade,
            submissionType: formData.submissionType,
            assignTo: formData.assignTo,
        };

        if (existingAssignment) {
            dispatch(updateAssignment(updatedAssignment));
        } else {
            dispatch(addAssignment(updatedAssignment));
        }
        navigate(`/Kambaz/Courses/${cid}/Assignments`);
    };

    if (!currentUser || currentUser.role !== "FACULTY") {
        return <Navigate to={`/Kambaz/Courses/${cid}/Assignments`} />;
    }

    return (
        <Container className="mt-4">
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label className="d-block text-left">Assignment Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-100"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Card>
                        <Card.Body className="p-0">
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="h-100 w-100 border-0"
                                style={{ minHeight: "200px" }}
                            />
                        </Card.Body>
                    </Card>
                </Form.Group>

                <Row className="mb-3">
                    <Col sm={3} className="text-end">
                        <Form.Label>Points</Form.Label>
                    </Col>
                    <Col sm={9}>
                        <Form.Control
                            type="number"
                            name="points"
                            value={formData.points}
                            onChange={handleChange}
                            className="w-50 ms-auto"
                        />
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col sm={3} className="text-end">
                        <Form.Label>Assignment Group</Form.Label>
                    </Col>
                    <Col sm={9}>
                        <Form.Select
                            className="w-50 ms-auto"
                            name="assignmentGroup"
                            value={formData.assignmentGroup}
                            onChange={handleChange}
                        >
                            <option>ASSIGNMENTS</option>
                            <option>QUIZZES</option>
                            <option>PROJECTS</option>
                        </Form.Select>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col sm={3} className="text-end">
                        <Form.Label>Display Grade as</Form.Label>
                    </Col>
                    <Col sm={9}>
                        <Form.Select
                            className="w-50 ms-auto"
                            name="displayGrade"
                            value={formData.displayGrade}
                            onChange={handleChange}
                        >
                            <option>Percentage</option>
                            <option>Complete/Incomplete</option>
                            <option>Points</option>
                        </Form.Select>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col sm={3} className="text-end">
                        <Form.Label>Due Date</Form.Label>
                    </Col>
                    <Col sm={9}>
                        <Form.Control
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            className="w-50 ms-auto"
                        />
                    </Col>
                </Row>

                <div className="d-flex justify-content-end">
                    <Button
                        variant="secondary"
                        className="me-2"
                        onClick={() => navigate(`/Kambaz/Courses/${cid}/Assignments`)}
                    >
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleSave}>
                        Save
                    </Button>
                </div>
            </Form>
        </Container>
    );
}