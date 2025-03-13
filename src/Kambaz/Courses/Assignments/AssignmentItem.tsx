import { AssignmentType } from "./types";
import { ListGroup, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BsGripVertical, BsThreeDotsVertical } from "react-icons/bs";
import { FaTrash } from "react-icons/fa6";
import GreenCheckmark from "../Modules/GreenCheckmark";
import AssignmentIcon from "./AssignmentIcon";

/** ✅ Move formatDate outside the component (prevents unnecessary re-creation on re-renders) */
const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
};

export default function AssignmentItem({ assignment, cid, handleDeleteClick, currentUser }: {
    assignment: AssignmentType;
    cid: string | undefined;
    handleDeleteClick: (assignment: AssignmentType) => void;
    currentUser: { role: string } | null;
}) {
    return (
        <ListGroup.Item className="wd-lesson p-3 ps-3 border-bottom">
            <div className="d-flex align-items-start w-100">
                {/* ✅ Draggable Handle */}
                <BsGripVertical className="me-2 fs-3" />

                {/* ✅ Assignment Icon */}
                <AssignmentIcon className="me-3" />

                {/* ✅ Assignment Title */}
                <div className="flex-grow-1 text-start">
                    <Link
                        to={`/kambaz/courses/${cid}/assignments/${assignment._id}`}
                        className="fs-5 fw-bold text-decoration-none text-dark"
                    >
                        {assignment.title}
                    </Link>

                    {/* ✅ Assignment Details */}
                    <div className="text-secondary small">
                        <span className="text-danger fw-bold">Multiple Modules</span> |
                        <span className="fw-bold"> Not available until</span>{" "}
                        {formatDate(assignment.availableFromDate)} at 12:00am
                        <br />
                        <span className="fw-bold">Due</span> {formatDate(assignment.dueDate)} at
                        11:59pm | {assignment.points || 100} pts
                    </div>
                </div>

                {/* ✅ Faculty Controls */}
                <div className="d-flex align-items-center">
                    <GreenCheckmark />
                    
                    {currentUser?.role === "FACULTY" && (
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
    );
}