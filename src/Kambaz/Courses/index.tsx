
import CourseNavigation from "./Navigation";
import { Navigate, Route, Routes } from "react-router";
import Modules from "./Modules";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import People from "./People/Table";
import { FaAlignJustify } from "react-icons/fa";
export default function Courses() {
    return (
      <div id="wd-courses">        
        <h2 className="text-danger">
          <FaAlignJustify className="me-4 fs-4 mb-1" />
          Course 1234</h2><hr />
        <div className="d-flex">
          <div className="d-none d-md-block">
            <CourseNavigation />
          </div>
          <div className="flex-fill">
            <Routes>
              <Route path="/" element={<Navigate to="Home" />} />
              <Route path="Home" element={<Home />} />
                    <Route path="Modules" element={<Modules />} />
                        <Route path="Piazza" element={<h2>Piazza</h2>} />
                        <Route path="Zoom" element={<h2>Zoom</h2>} />
                        <Route path="Assignments" element={<Assignments />} />
                        <Route path="Assignments/:aid" element={<AssignmentEditor />} />
                        <Route path="Quizzes" element={<h2>Quizzes</h2>} />
                        <Route path="Grades" element={<h2>Grades</h2>} />
                        <Route path="People" element={<People />} />
                    </Routes>
          </div>
        </div>
      </div>
  );
}
  