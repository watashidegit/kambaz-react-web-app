import { FormControl } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as courseClient from "./Courses/client";

interface Course {
  _id: string;
  name: string;
  description: string;
}

export default function Dashboard(
  { courses, course, setCourse, addNewCourse, deleteCourse, updateCourse, showAllCourses, setShowAllCourses, updateEnrollment }: 
  {
    courses: Course[]; 
    course: Course; 
    setCourse: (course: Course) => void;
    addNewCourse: () => void; 
    deleteCourse: (courseId: string) => void;
    updateCourse: () => void; 
    showAllCourses: boolean; 
    setShowAllCourses: (showAllCourses: boolean) => void;
    updateEnrollment: (courseId: string, enrolled: boolean) => void;
  }) {
  
  // Extract current user from Redux store
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const [courseList, setCourseList] = useState<any[]>([]);

  // const [refreshTrigger, setRefreshTrigger] = useState(0);

  // fetch an offered course list
  const fetchCourseList = async () => {
    try {
        const courses = await courseClient.fetchAllCourses(); // call the function
        setCourseList(courses); // store in state
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
  }

  useEffect(() => {
    fetchCourseList();
  }, []);

  // Local state for controlling course visibility
  //const [showAllCourses, setShowAllCourses] = useState(false);

  // Determine the user's role
  //const isStudent = currentUser?.role === "STUDENT";
  const isFaculty = currentUser?.role === "FACULTY";

  return (
    <div className="p-4" id="wd-dashboard">
      <h1 id="wd-dashboard-title">
        Dashboard
        <button onClick={() => setShowAllCourses(!showAllCourses)} className="float-end btn btn-primary" >
          {showAllCourses ? "My Courses" : "All Courses"}
        </button>
      </h1>
      <hr />

      {isFaculty && (
        <div>
          <h5>
            New Course
            <button className="btn btn-primary float-end" onClick={addNewCourse}>Add</button>
            <button className="btn btn-warning float-end me-2" onClick={updateCourse}>Update</button>
          </h5>
          <br />
          <FormControl
            value={course.name}
            className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <FormControl
            as="textarea"
            value={course.description}
            rows={3}
            onChange={(e) => setCourse({ ...course, description: e.target.value })}
          />
        </div>
      )}

      <hr />
      <h2 id="wd-dashboard-published">
        {showAllCourses ? "All Courses" : "My Courses"} ({showAllCourses ? courseList.length : courses.length})
      </h2>
      <hr />

      {(showAllCourses ? courseList : courses).length === 0 ? (
        <h3 className="text-danger">No Courses Available</h3>
      ) : (
        <div className="row row-cols-1 row-cols-md-5 g-4">
          {(showAllCourses ? courseList : courses).map((course) => (
            <div key={course._id} className="col" style={{ width: "350px" }}>
              <div className="card">
                <Link to={`/Kambaz/Courses/${course._id}/Home`} className="text-decoration-none text-dark">
                    <img src="/images/reactjs.jpg" className="card-img-top" width="100%" height={160} />
                </Link>

                <div className="card-body">
                    <h5 className="card-title text-nowrap overflow-hidden">
                      <Link to={`/Kambaz/Courses/${course._id}/Home`} className="text-decoration-none text-dark">
                          {course.name}
                      </Link>
                    </h5>

                    <p className="card-text overflow-hidden" style={{ height: "100px" }}>
                    {course.description}
                    </p>

                    {/* Go button only on My Courses page */}
                    {!showAllCourses && (
                      <Link to={`/Kambaz/Courses/${course._id}/Home`}>
                        <button className="btn btn-primary">Go</button>
                      </Link>
                    )}

                    {/* enroll button */}
                    {showAllCourses && (
                        <button onClick={(event) => {
                                  event.preventDefault();
                                  updateEnrollment(course._id, !course.enrolled);
                                }}
                                className={`btn ${ course.enrolled ? "btn-danger" : "btn-success" } float-end`} >
                          {course.enrolled ? "Unenroll" : "Enroll"}
                        </button>
                    )}

                    {/* Faculty controls on my courses only*/}
                    {!showAllCourses && isFaculty && (
                      <div className="float-end">
                        <button
                        onClick={(event) => {
                            event.preventDefault();
                            setCourse(course);
                        }}
                        className="btn btn-warning me-2"
                        >
                        Edit
                        </button>
                        <button
                        onClick={(event) => {
                            event.preventDefault();
                            deleteCourse(course._id);
                        }}
                        className="btn btn-danger"
                        >
                        Delete
                        </button>
                      </div>
                    )}

                  </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
