import { Row, Col, Card, Button, FormControl } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import * as db from "./Database";

interface Course {
  _id: string;
  name: string;
  description: string;
}

export default function Dashboard(
  { courses, course, setCourse, addNewCourse, deleteCourse, updateCourse }: 
  {
    courses: Course[]; course: Course; setCourse: (course: Course) => void;
    addNewCourse: () => void; deleteCourse: (courseId: string) => void;
    updateCourse: () => void; })
   {
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const { enrollments } = db;
    const enrolledCourses = currentUser && enrollments
    ? courses.filter((course) =>
        enrollments.some(
          (enrollment) =>
            enrollment.user === currentUser._id &&
            enrollment.course === course._id
        )
      )
    : [];

    return (
        <div id="wd-dashboard">
          <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
          
          {/* Editing controls for faculty only */}
          {currentUser.role === "FACULTY" && (
            <>
              <h5>New Course
                <button className="btn btn-primary float-end"
                  id="wd-add-new-course-click"
                  onClick={addNewCourse} > Add </button>
                <button className="btn btn-warning float-end me-2"
                  onClick={updateCourse} id="wd-update-course-click">
                  Update </button>
              </h5><hr />
            </>
          )}
          <FormControl value={course.name} className="mb-2" 
                onChange={(e) => setCourse({ ...course, name: e.target.value })}/>
          <FormControl 
                as="textarea"
                rows={3} 
                value={course.description} 
                onChange={(e) => setCourse({ ...course, description: e.target.value })}/>
          <h2 id="wd-dashboard-published">Published Courses ({enrolledCourses.length})</h2> <hr />
          <div id="wd-dashboard-courses">
            <Row xs={1} md={5} className="g-4">
              {enrolledCourses.map((course) => (
                <Col key={course._id} className="col" style={{ width: "300px" }}>
                  <Card>
                    <Link to={`/Kambaz/Courses/${course._id}/Home`}
                          className="wd-dashboard-course-link text-decoration-none text-dark" >
                      <Card.Img src="/images/reactjs.jpg" variant="top" width="100%" height={160} />
                      <Card.Body className="card-body">
                        <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                          {course.name} </Card.Title>
                        <Card.Text className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                          {course.description} </Card.Text>
                        <Button variant="primary"> Go </Button>
                        {/* Show Edit/Delete Only for Faculty */}
                        {currentUser.role === "FACULTY" && (
                          <>
                            <button onClick={(event) => {
                                event.preventDefault();
                                if (course._id) deleteCourse(course._id);
                              }} className="btn btn-danger float-end">
                              Delete
                            </button>
                            <button onClick={() => setCourse(course)}
                                className="btn btn-warning me-2 float-end">
                                Edit
                            </button>
                          </>
                        )}
                      </Card.Body>
                    </Link>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>);}