import { FormControl } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
// import { enrollCourse, unenrollCourse } from "./Account/Enrollments/reducer";

interface Course {
  _id: string;
  name: string;
  description: string;
}

// courses is filtered with findMyCourses
export default function Dashboard(
  { courses, course, setCourse, addNewCourse, deleteCourse, updateCourse }: 
  {
    courses: Course[]; 
    course: Course; 
    setCourse: (course: Course) => void;
    addNewCourse: () => void; 
    deleteCourse: (courseId: string) => void;
    updateCourse: () => void; 
  }
) {
  // Extract current user from Redux store
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  // const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);
  const dispatch = useDispatch();

  // Local state for controlling course visibility
  const [showAllCourses, setShowAllCourses] = useState(false);

  // Determine the user's role
  const isStudent = currentUser?.role === "STUDENT";
  const isFaculty = currentUser?.role === "FACULTY";

  /*
  // Enroll in a course
  const handleEnrollCourse = (courseId: string) => {
    if (!currentUser) return;
    dispatch(enrollCourse({
      courseId: courseId,
      userId: currentUser._id
    }));
  };

  // Unenroll from a course
  const handleUnenrollCourse = (courseId: string) => {
    if (!currentUser) return;
    dispatch(unenrollCourse({
      courseId: courseId,
      userId: currentUser._id
    }));
  };
  */
  return (
    <div className="p-4" id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />

      {isStudent && (
        <button
          className="btn btn-primary float-end"
          onClick={() => setShowAllCourses(!showAllCourses)}
        >
          {showAllCourses ? "Show My Courses" : "Enrollments"}
        </button>
      )}

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
      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2>
      <hr />

      {courses.length === 0 ? (
        <h3 className="text-danger">No Courses Available</h3>
      ) : (
        <div className="row row-cols-1 row-cols-md-5 g-4">
          {courses.map((course) => (
            <div key={course._id} className="col" style={{ width: "350px" }}>
              <div className="card">
                <Link to={`/Kambaz/Courses/${course._id}/Home`} className="text-decoration-none text-dark">
                  <img src="/images/reactjs.jpg" className="card-img-top" width="100%" height={160} />
                  <div className="card-body">
                    <h5 className="card-title text-nowrap overflow-hidden">{course.name}</h5>
                    <p className="card-text overflow-hidden" style={{ height: "100px" }}>
                      {course.description}
                    </p>
                    <button className="btn btn-primary">Go</button>
                    
                    {isFaculty && (
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
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
