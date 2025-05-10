import { Routes, Route, Navigate } from "react-router-dom";
import Assignments from "./index";
import AssignmentEditor from "./Editor";
import ProtectedFacultyRoute from "../../Account/ProtectedFacultyRoute";

export default function AssignmentsRouter() {
    return (
        <div className="p-3">
            <Routes>
                <Route path="/" element={<Navigate to="assignments" />} />
                <Route path="/assignments" element={<Assignments />} />

                <Route path="/assignments/editor" element={
                    <ProtectedFacultyRoute>
                        <AssignmentEditor />
                    </ProtectedFacultyRoute>
                } />
            </Routes>
        </div>
    );
}