//import Pazza from "./Pazza";
import CourseNavigation from "./Navigation";
import { Route, Routes, useParams, useLocation } from "react-router";
import Modules from "./Modules";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import People from "./People/Table";
import { FaAlignJustify } from "react-icons/fa";
import { useState } from "react";
import * as db from "../Database";

export default function Courses( { courses }: { courses: any[]}) {
    
    const { cid } = useParams();
    const course = courses.find((course) => course._id === cid);
    const { pathname } = useLocation();
    const [modules, setModules] = useState<any[]>(db.modules);
    return (
      <div id="wd-courses">        
        <h2 className="text-danger">
          <FaAlignJustify className="me-4 fs-4 mb-1" />
          {course && course.name} &gt; {pathname.split("/")[4]}
          </h2><hr />
        <div className="d-flex">
          <div className="d-none d-md-block">
            <CourseNavigation />
          </div>
          <div className="flex-fill">
          <Routes>
              <Route path="Home" element={
                  <Home
                      modules={modules}
                      setModules={setModules}
                  />
              } />
              <Route path="Modules" element={
                  <Modules
                      modules={modules}
                      setModules={setModules}
                  />
              } />
              <Route path="Assignments" element={<Assignments />} />
              <Route path="Assignments/:aid" element={<AssignmentEditor />} />
              <Route path="People" element={<People />} />
            </Routes>
          </div>
        </div>
      </div>
  );
}
  