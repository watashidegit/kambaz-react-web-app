import { Form, Card, Row, Col, InputGroup, Button } from "react-bootstrap";
import { FaCalendarAlt } from "react-icons/fa";
import { useParams, Link, Navigate, useNavigate  } from "react-router-dom";
import * as db from "../../Database";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addAssignment, updateAssignment } from "./reducer";

interface Assignemnt {
    _id: string;
    title: string;
    description?: string;
    points: number;
    assignmentGroup: string;
    displayGrade: string;
    submissionType: string;
    assignTo: string;
    dueDate?: string;
    availableFromDate?: string;
    availableUntilDate?: string;
    course: string;
};

export default function AssignmentEditor() {
    const { cid, aid } = useParams();
    const assignment = db.assignments.find((a:any) => a._id === aid);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const assignments: Assignemnt[] = useSelector((state: { assignmentsReducer: 
        { assignments: Assignemnt[] } }) =>
        state.assignmentsReducer.assignments);
    const publishedAssignment = assignments.find(a => a._id === aid);
    const currentUser = useSelector((state: any) => state.accountReducer);
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
        if (publishedAssignment) {
            setFormData({
                title: publishedAssignment.title || "",
                description: publishedAssignment.description ?? `This is the description for ${publishedAssignment.title}`,
                points: publishedAssignment.points || 100,
                assignmentGroup: publishedAssignment.assignmentGroup || "ASSIGNMENTS",
                displayGrade: publishedAssignment.displayGrade || "Percentage",
                submissionType: publishedAssignment.submissionType || "Online",
                assignTo: publishedAssignment.assignTo || "Everyone",
                dueDate: publishedAssignment.dueDate || "",
                availableFromDate: publishedAssignment.availableFromDate || "",
                availableUntilDate: publishedAssignment.availableUntilDate || "",
            });
        }
    }, [publishedAssignment]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === "points" ? Number(value) : value }));
    };

    const handleSave = () => {
        const updatedAssignment = {
            _id: publishedAssignment ? publishedAssignment._id : Math.random().toString(36).substr(2, 9),
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

        if (publishedAssignment) {
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
        <div style={{ width:"700px", margin: "0 auto" }} id="wd-assignments-editor">
            <div className="container mt-4">
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Assignment Name</Form.Label>
                        <Form.Control type="text" 
                                      name="title"
                                      value={formData.title}
                                      onChange={handleChange}
                                      className="w-100" />
                    </Form.Group>

                    {/* Assignment Description */}
                    <Form.Group className="mb-3">
                        <Card id="wd-description" className="mb-4">
                            <Card.Body>
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

                    <Form.Group className="d-flex mb-3 align-items-center">
                        <Form.Label className="me-2 mb-0">Points</Form.Label>
                        <Form.Control 
                            type="number"
                            name="points"
                            value={formData.points}
                            onChange={handleChange}
                            className="w-50 ms-auto"
                        />
                    </Form.Group>

                    <Form.Group className="d-flex mb-3 align-items-center">
                        <Form.Label className="me-2 mb-0" style={{ whiteSpace: "nowrap" }} >Assignment Group</Form.Label>
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
                    </Form.Group>

                    <Form.Group className="d-flex mb-3 align-items-center">
                        <Form.Label className="me-2 mb-0" style={{ whiteSpace: "nowrap" }} >Display Grade as</Form.Label>
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
                    </Form.Group>

                    <Form.Label className= "d-flex mb-3 align-items-center"> Submission Type
                    <Card className="flex-grow-1 ms-3">
                        <Card.Body>
                            <Form.Group className="me-2 mb-3">
                                <Form.Select>
                                    <option value="Online">Online</option>
                                </Form.Select>
                            </Form.Group>

                            <p className="fw-bold text-muted">Online Entry Options</p>
                            <Form.Check type="checkbox" label="Text Entry" />
                            <Form.Check type="checkbox" label="Website URL" defaultChecked />
                            <Form.Check type="checkbox" label="Media Recordings" />
                            <Form.Check type="checkbox" label="Student Annotation" />
                            <Form.Check type="checkbox" label="File Uploads" />
                        </Card.Body>
                    </Card>
                    </Form.Label>

                    {/* Availability and Due Date */}
                    <Card className="mb-4">
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold text-muted">Assign to</Form.Label>
                                <Form.Control type="text" placeholder="Everyone" />
                            </Form.Group>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold text-muted">Due</Form.Label>
                                        <InputGroup>
                                        <Form.Control
                                            type="date"
                                            name="dueDate"
                                            value={formData.dueDate}
                                            onChange={handleChange}
                                            className="w-50 ms-auto"
                                        />
                                            <InputGroup.Text>
                                                <FaCalendarAlt />
                                            </InputGroup.Text>
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold text-muted">Available from</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                type="datetime-local"
                                                defaultValue="2024-05-06T00:00"
                                                aria-label="Available from"
                                            />
                                            <InputGroup.Text>
                                                <FaCalendarAlt />
                                            </InputGroup.Text>
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                            
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold text-muted">Until</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                type="datetime-local"
                                                defaultValue="2024-05-13T23:59"
                                                aria-label="Due Date"
                                            />
                                            <InputGroup.Text>
                                                <FaCalendarAlt />
                                            </InputGroup.Text>
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Save & Cancel Buttons */}
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
            </div>  
        </div>
    );
}
