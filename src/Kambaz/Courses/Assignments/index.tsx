import AssignmentsControls from "./AssignmentsControls";
import { IoEllipsisVertical } from "react-icons/io5";
import "../../styles.css";
import { ListGroup } from "react-bootstrap";
import { BsGripVertical, BsChevronDown } from "react-icons/bs";
import { FaEdit, FaPlus } from "react-icons/fa";
import ControlButtons from "./ControlButton";
import { useParams, Link } from "react-router-dom";
import * as db from "../../Database";

export default function Assignments() {
    const { cid } = useParams();
    const assignments = db.assignments;
    return (
      <div style={{ width: "800px ", margin: "0 auto" }}>
      <AssignmentsControls />
      <br /><br />
      
      {/*Assignments Section */}
      <ListGroup className="rounded-0" id="wd-assignment">
        <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-light d-flex">
            <div className="d-flex flex-grow-1">
              <BsGripVertical className="me-2 fs-3" /> 
              <BsChevronDown className="me-2 fs-5" />
              <span className="fw-bold">ASSIGNMENTS</span>
            </div>
            <div className="d-flex align-items-center">
              <span className="badge bg-light border rounded-pill text-muted me-3 px-3">
                40% of Total
              </span>
              <FaPlus />
              <IoEllipsisVertical className="fs-4" />
            </div>
          </div>

          {/* Dynamic Assignment List */}
          <ListGroup className="wd-lessons rounded-1">
            {assignments
              .filter((assignment: any) => assignment.course === cid)
              .map((assignment: any) => (
              <ListGroup.Item key={assignment._id} className="wd-lesson p-3">
                <div className="d-flex align-items-center justify-content-between">
                  <BsGripVertical className="fs-3 me-3" />
                  <FaEdit className="fs-3 me-3 text-success" />
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-2">
                      <div className="fw-bold fs-5">
                        <Link to={`/Kambaz/Courses/${cid}/Assignments/${assignment._id}`} className="text-decoration-none">
                          {assignment.title}
                        </Link>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="text-danger me-2 small">Multiple Modules</span>
                      <span className="text-muted small">
                        | <span className="fw-bold">Not available until</span> May 6 at 12:00am |
                      </span>
                    </div>
                    <div className="text-muted small mt-1">
                      <span className="fw-bold">Due</span> May 13 at 11:59pm | 100 pts
                    </div>
                  </div>
                  <div>
                    <ControlButtons />
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
}
