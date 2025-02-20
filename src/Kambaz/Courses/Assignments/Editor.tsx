import { Form, Card, Row, Col, InputGroup } from "react-bootstrap";
import { FaCalendarAlt } from "react-icons/fa";
import { useParams, Link  } from "react-router-dom";
import * as db from "../../Database";

export default function AssignmentEditor() {
    const { cid, aid } = useParams();
    const assignment = db.assignments.find((a:any) => a._id === aid);
    
    if (!assignment) {
        return <h3 className="text-center text-danger">Assignment not found.</h3>
    }

    return (
        <div style={{ width:"700px", margin: "0 auto" }} id="wd-assignments-editor">
            <div className="container mt-4">
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Assignment Name</Form.Label>
                        <Form.Control type="text" defaultValue={assignment.title} />
                    </Form.Group>

                    {/* Assignment Description */}
                    <Card id="wd-description" className="mb-4">
                        <Card.Body>
                            <p>
                                The assignment is <span className="text-danger">available online</span>
                            </p>
                            <p>
                                Submit a link to the landing page of your Web application running on 
                                Netlify.
                            </p>
                            <p>The landing page should include the following:</p>
                            <ul>
                                <li>Your full name and section</li>
                                <li>Links to each of the lab assignments</li>
                                <li>Link to the Kambaz application
                                </li>
                                <li>Links to all relevant source code repositories</li>
                            </ul>
                            <p>
                                The Kambaz application should include a link to navigate back to the landing page.
                            </p>
                        </Card.Body>
                    </Card>

                    <Form.Group className="d-flex mb-3 align-items-center">
                        <Form.Label className="me-2 mb-0">Points</Form.Label>
                        <Form.Control type="number" placeholder="100" />
                    </Form.Group>

                    <Form.Group className="d-flex mb-3 align-items-center">
                        <Form.Label className="me-2 mb-0" style={{ whiteSpace: "nowrap" }} >Assignment Group</Form.Label>
                        <Form.Select>
                            <option value="ASSIGNMENTS">ASSIGNMENTS</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="d-flex mb-3 align-items-center">
                        <Form.Label className="me-2 mb-0" style={{ whiteSpace: "nowrap" }} >Display Grade as</Form.Label>
                        <Form.Select>
                            <option value="Percentage">Percentage</option>
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
                                                type="datetime-local"
                                                defaultValue={"2024-05-13T23:59"}
                                                aria-label="Due Date"
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
                        <Link to={`/Kambaz/Courses/${cid}/Assignments`} className="btn btn-secondary me-2">
                        Cancel</Link>
                        <Link to={`/Kambaz/Courses/${cid}/Assignments`} className="btn btn-danger">
                        Save</Link>
                    </div>
                </Form>
            </div>  
        </div>
    );
}
