import { useNavigate, useParams } from "react-router-dom";
import { ListGroup, Button, Form, InputGroup, Modal } from "react-bootstrap";
import { BsSearch, BsThreeDotsVertical, BsGripVertical } from "react-icons/bs";
import { FaPlus, FaTrash } from "react-icons/fa6";
import GreenCheckmark from "../Modules/GreenCheckmark";
import AssignmentIcon from "./AssignmentIcon";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deleteAssignment, setAssignments } from "./reducer";
import { useEffect, useState } from "react";
import * as courseClient from "../client";
import * as assignmentClient from "./client";

export default function Assignments() {
    const { cid } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    

    // delete assignment with aid
    const removeAssignment = async (assignmentId: string) => {
        await assignmentClient.deleteAssignment(assignmentId);
        dispatch(deleteAssignment(assignmentId));
    }

    // fetch assignments of the course and dispatch to redux
    const fetchAssignments = async () => {
        const assignments = await courseClient.findAssignmentsForCourse(cid as string);
        dispatch(setAssignments(assignments));
    }
    
    // load assignments
    useEffect(() => {
        fetchAssignments();
    }, []);

    // extract assignments from redux
    const assignments = useSelector((state: any) => state.assignmentReducer.assignments);

    // extract from redux to determine user roles
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const isFaculty = currentUser?.role === "FACULTY";

    // select assignment for removal
    const [selectedAssignment, setSelectedAssignment] = useState< any | null>(null);

    // state variable to pop delete modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDeleteClick = (assignment: any) => {
        setSelectedAssignment(assignment);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (selectedAssignment) {
            removeAssignment(selectedAssignment._id)
        }
        setShowDeleteModal(false);
        setSelectedAssignment(null);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedAssignment(null);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Not set";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div>
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <InputGroup style={{ width: "300px" }}>
                    <InputGroup.Text className="bg-white border-end-0">
                        <BsSearch className="text-secondary" />
                    </InputGroup.Text>
                    <Form.Control placeholder="Search for Assignments" className="border-start-0" />
                </InputGroup>

                {/* Faculty Only Adding section */}
                {isFaculty && (
                    <div>
                        <Button variant="secondary" className="me-2">
                            <FaPlus className="me-2 mb-1" />
                            Group
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => navigate(`/Kambaz/Courses/${cid}/Assignments/editor`)}
                        >
                            <FaPlus className="me-2 mb-1" />
                            Assignment
                        </Button>
                    </div>
                )}
            </div>

            <ListGroup className="rounded-0 border">
                <ListGroup.Item className="d-flex justify-content-between align-items-center p-3 bg-light border-bottom">
                    <div className="d-flex align-items-center">
                        <BsGripVertical className="me-2 fs-3" />
                        <span className="fs-5 fw-bold">ASSIGNMENTS</span>
                    </div>
                    <div className="d-flex align-items-center">
                        <span className="text-secondary me-3">40% of Total</span>
                        {isFaculty && <FaPlus className="me-3" />}
                        <BsThreeDotsVertical />
                    </div>
                </ListGroup.Item>

                <ListGroup className="rounded-0">
                    {assignments.map((assignment: any) => (
                        <ListGroup.Item key={assignment._id} className="wd-lesson p-3 ps-3 border-bottom">
                            <div className="d-flex align-items-start w-100">
                                <BsGripVertical className="me-2 fs-3" />
                                <AssignmentIcon className="me-3" />
                                <div className="flex-grow-1 text-start">
                                    <Link
                                        to={`/Kambaz/Courses/${cid}/Assignments/${assignment._id}`}
                                        className="fs-5 fw-bold text-decoration-none text-dark"
                                    >
                                        {assignment.title}
                                    </Link>
                                    <div className="text-secondary small">
                                        <span className="text-danger fw-bold">Multiple Modules</span> |
                                        <span className="fw-bold"> Not available until</span>{" "}
                                        {formatDate(assignment.availableFromDate)} at 12:00am
                                        <br />
                                        <span className="fw-bold">Due</span> {formatDate(assignment.dueDate)} at
                                        11:59pm | {assignment.points || 100} pts
                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <GreenCheckmark />
                                    {/* Faculty handle delete */}
                                    {isFaculty && (
                                        <>
                                            <Button
                                                variant="link"
                                                className="text-danger"
                                                onClick={() => handleDeleteClick(assignment)}
                                            >
                                                <FaTrash />
                                            </Button>
                                            <BsThreeDotsVertical className="fs-4 ms-2" />
                                        </>
                                    )}
                                </div>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </ListGroup>

            <Modal show={showDeleteModal} onHide={handleCancelDelete} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this assignment?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancelDelete}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}