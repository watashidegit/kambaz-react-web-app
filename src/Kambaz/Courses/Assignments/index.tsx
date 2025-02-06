import AssignmentsControls from "./AssignmentsControls";
import { IoEllipsisVertical } from "react-icons/io5";
import "../../styles.css";
import { ListGroup } from "react-bootstrap";
import { BsGripVertical, BsChevronDown } from "react-icons/bs";
import { FaEdit, FaPlus } from "react-icons/fa";
import ControlButtons from "./ControlButton";
export default function Assignments() {
    return (
      <div style={{ width: "800px ", margin: "0 auto" }}>
      <AssignmentsControls /><br /><br />
      <ListGroup className="rounded-0" id="wd-modules">
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
          <ListGroup className="wd-lessons rounded-1">
            <ListGroup.Item className="wd-lesson p-3">
              <div className= "d-flex align-items-center justify-content-between">
                <BsGripVertical className="fs-3 me-3" />
                <FaEdit className="fs-3 me-3 text-success" />
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center mb-2">
                    <div className="fw-bold fs-5">
                      <a href="#/Kambaz/Courses/1234/Assignments/123">A1</a>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="text-danger me-2 small">Multiple Modules</span>
                    <span className="text-muted small">
    |                 <span className="fw-bold">Not available until</span> May 6 at 12:00am |
                    </span>
                  </div>
                  <div className="text-muted small mt-1">
                    <span className="fw-bold">Due</span> May 13 at 11:59pm | 100 pts
                  </div>
                </div>
                <div>
                  <ControlButtons/>
                </div>
              </div>
            </ListGroup.Item>

            <ListGroup.Item className="wd-lesson p-3">
              <div className= "d-flex align-items-center justify-content-between">
                <BsGripVertical className="fs-3 me-3" />
                <FaEdit className="fs-3 me-3 text-success" />
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center mb-2">
                    <div className="fw-bold fs-5">
                      <a href="#/Kambaz/Courses/1234/Assignments/123">A2</a>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="text-danger me-2 small">Multiple Modules</span>
                    <span className="text-muted small">
    |                 <span className="fw-bold">Not available until</span> May 13 at 12:00am |
                    </span>
                  </div>
                  <div className="text-muted small mt-1">
                    <span className="fw-bold">Due</span> May 20 at 11:59pm | 100 pts
                  </div>
                </div>
                <div>
                  <ControlButtons/>
                </div>
              </div>  
            </ListGroup.Item>

            <ListGroup.Item className="wd-lesson p-3">
              <div className= "d-flex align-items-center justify-content-between">
                <BsGripVertical className="fs-3 me-3" />
                <FaEdit className="fs-3 me-3 text-success" />
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center mb-2">
                    <div className="fw-bold fs-5">
                      <a href="#/Kambaz/Courses/1234/Assignments/123">A3</a>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="text-danger me-2 small">Multiple Modules</span>
                    <span className="text-muted small">
    |                 <span className="fw-bold">Not available until</span> May 20 at 12:00am |
                    </span>
                  </div>
                  <div className="text-muted small mt-1">
                    <span className="fw-bold">Due</span> May 27 at 11:59pm | 100 pts
                  </div>
                </div>
                <div>
                  <ControlButtons/>
                </div>
              </div>  
            </ListGroup.Item>
          </ListGroup>
        </ListGroup.Item>
      </ListGroup>
      
    </div>
  );}
  