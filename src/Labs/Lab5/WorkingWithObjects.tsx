import { useState } from "react";
import { Form, FormControl } from "react-bootstrap";
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
export default function WorkingWithObjects() {
    const [assignment, setAssignment] = useState({
        id: 1, title: "NodeJS Assignment",
        description: "Create a NodeJS server with ExpressJS",
        due: "2021-10-10", completed: false, score: 0,
    });
    const ASSIGNMENT_API_URL = `${REMOTE_SERVER}/lab5/assignment`
    return (
        <div id="wd-working-with-objects">
            <h3>Working With Objects</h3>
            <h4>Modifying Properties</h4>
            <div className="d-flex align-items-center">
                <FormControl 
                    className="me-2" 
                    style={{ width: "200pt" }}
                    id="wd-assignment-title"
                    defaultValue={assignment.title} 
                    onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}/>
                <a id="wd-update-assignment-title"
                    className="btn btn-primary"
                    href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}>
                    Update Title
                </a>
            </div><br/>
            <div className="d-flex align-items-center">
                <FormControl 
                    className="me-2" 
                    style={{ width: "200pt" }}
                    id="wd-assignment-score"
                    defaultValue={assignment.score} 
                    onChange={(e) => setAssignment({ ...assignment, score: parseInt(e.target.value) })}/>
                <a id="wd-update-assignment-score"
                    className="btn btn-primary"
                    href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}>
                    Update Score
                </a>
            </div><br/>
            <div className="d-flex align-items-center">
                <Form.Check
                    type="checkbox"
                    className="me-2" 
                    style={{ width: "25px", height: "25px" }}
                    id="wd-assignment-status"
                    checked={assignment.completed} 
                    onChange={(e) => setAssignment({ ...assignment, completed: e.target.checked })}/>
                <label htmlFor="wd-assignment-status" className="me-3">
                    Completed
                </label>
                <a id="wd-update-assignment-status"
                    className="btn btn-primary"
                    href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}>
                    Update Complete Status
                </a>
            </div>
            <hr/>
            <h4>Retrieving Objects</h4>
            <a id="wd-retrieve-assignments" className="btn btn-primary me-2"
                href={`${REMOTE_SERVER}/lab5/assignment`}>
                Get Assignment
            </a>
            <a id="wd-retrieve-module" className="btn btn-primary"
                href={`${REMOTE_SERVER}/lab5/module`}>
                Get Module
            </a> <hr/>

            <h4>Retrieving Properties</h4>
            <a id="wd-retrieve-assignment-title" className="btn btn-primary me-2"
                href={`${REMOTE_SERVER}/lab5/assignment/title`}>
                Get Assignment Title
            </a>
            <a id="wd-retrieve-module-name" className="btn btn-primary me-2"
                href={`${REMOTE_SERVER}/lab5/module/name`}>
                Get Module Name
            </a>
            
            <hr/>
            
        </div>
);}
