import CourseNavigation from "./Navigation";
import { Route, Routes, useParams, useLocation } from "react-router";
import Modules from "./Modules";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import { FaAlignJustify } from "react-icons/fa";
import PeopleTable from "./People/Table";
import * as CourseClient from "../Courses/client"
import { useEffect, useState } from "react";
import Quizzes from "./Quizzes";
import QuizEditor from "./Quizzes/editor";
import QuizDetails from "./Quizzes/details";
import QuizTakePage from "./Quizzes/QuizTakePage";
import QuizPreView from "./Quizzes/QuizPreview";
import QuizStartConfirm from "./Quizzes/QuizStartConfirm";

export default function Courses( { courses }: { courses: any[]}) {
    
    const { cid } = useParams();
    const course = courses.find((course) => course._id === cid);
    const { pathname } = useLocation();
    const [courseUsers, setCourseUsers] = useState<any[]>([]);


    const fetchUsersInCourse = async (cid: string) => {
      const users = await CourseClient.findUsersForCourse(cid);
      setCourseUsers(users);
    }

    useEffect(() => {
      if (cid) fetchUsersInCourse(cid);
    }, [cid]);
   
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
              <Route path="Home" element={<Home />} />
              <Route path="Modules" element={<Modules />} />
              <Route path="Assignments" element={<Assignments />} />
              <Route path="Assignments/:aid" element={<AssignmentEditor />} />
              <Route path="Quizzes" element={<Quizzes />} />
              <Route path="Quizzes/new" element={<QuizEditor />} />
              <Route path="Quizzes/:qid/editor" element={<QuizEditor />} />
              <Route path="Quizzes/:qid" element={<QuizDetails />} />
              <Route path="/quizzes/:qid/preview" element={<QuizPreView/>}/>
              <Route path="quizzes/:qid/take" element={<QuizTakePage/>}/>
              <Route path="quizzes/:qid/start" element={<QuizStartConfirm/>}/>
              <Route path="People" element={<PeopleTable users={courseUsers}/>} />
            </Routes>
          </div>
        </div>
      </div>
  );
}
  