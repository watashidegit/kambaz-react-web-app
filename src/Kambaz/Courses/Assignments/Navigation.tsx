import { Routes, Route, Navigate } from "react-router-dom";
import Assignments from "./index";
import AssignmentEditor from "./Editor"; 
import ProtectedFacultyRoute from "../../Account/ProtectedFacultyRoute";
export default function AssignmentNavigation() {
    return (
        <div className="p-3">
            <Routes>
                <Route path="/" element={<Navigate to="/Assignments" />} />
                <Route path="/Assignments" element={<Assignments />} />

                <Route path="/Assignments/Editor" element={
                    <ProtectedFacultyRoute>
                        <AssignmentEditor />
                    </ProtectedFacultyRoute>
                } />
            </Routes>
        </div>
    );
}