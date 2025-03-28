import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import { addAssignment, updateAssignment } from "./reducer";
import * as courseClient from "../client"; 
import * as assignmentClient from "./client";

export default function AssignmentEditor() {
    const { cid, aid } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // extract assignments of the course from redux
    const assignments = useSelector((state: any) => state.assignmentReducer.assignments);

    // check if the assignment exist, go to add/edit mode
    const assignment = assignments.find((assignment: any) => assignment._id === aid);

    const { currentUser } = useSelector((state: any) => state.accountReducer);

    // create assignment for the course
    const createAssignmentForCourse = async () => {
        if (!cid) return;
        const newAssignment = { title: formData.title, course: cid}
        const assignment = await courseClient.createAssignmentForCourse(cid, newAssignment);
        dispatch(addAssignment(assignment));
    }

    // save update
    const saveAssignmentUpdate = async (assignment: any) => {
        await assignmentClient.updateAssignment(assignment);
        dispatch(updateAssignment(assignment));
    }

    // initial state of the form (form to create new assignment)
    const [formData, setFormData] = useState({
        _id: "",
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
        if (assignment) {
            setFormData({
                _id: assignment._id || "",
                title: assignment.title || "",
                description: assignment.description ?? `This is the description for ${assignment.title}`,
                points: assignment.points || 100,
                assignmentGroup: assignment.assignmentGroup || "ASSIGNMENTS",
                displayGrade: assignment.displayGrade || "Percentage",
                submissionType: assignment.submissionType || "Online",
                assignTo: assignment.assignTo || "Everyone",
                dueDate: assignment.dueDate || "",
                availableFromDate: assignment.availableFromDate || "",
                availableUntilDate: assignment.availableUntilDate || "",
            });
        }
    }, [assignment]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const updatedAssignment = {
            _id: assignment?._id,
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

        if (assignment) {
            saveAssignmentUpdate(updatedAssignment);
        } else {
            createAssignmentForCourse();
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