import { Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
export default function Dashboard() {
    return (
        <div id="wd-dashbaord">
            <h1 id="wd-dashbaord-title">Dashboard</h1> <hr/>
            <h2 id="wd-dashbaord-published">Published Courses (12)</h2> <hr/>
            <div id="wd-dashboard-courses">
                <Row xs={1} md={5} className="g-4">
                    <Col className="wd-dashboard-course" style={{ width: "300px"}}>
                        <Card>
                            <Link to="/Kambaz/Courses/1234/Home"
                                className="wd-dashboard-course-link text-decoration-none text-dark">
                            <Card.Img variant="top" src="/images/reactjs.jpg" width="100%" height={160}/>
                            <Card.Body>
                                <Card.Title className="wd-dashboard-course-title">CS1234 React JS</Card.Title>
                                <Card.Text className="wd-dashboard-course-description">Full Stack software developer</Card.Text>
                                <Button variant="primary">Go</Button>
                            </Card.Body>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px"}}>
                        <Card>
                            <Link to="/Kambaz/Courses/1234/Home"
                                className="wd-dashboard-course-link text-decoration-none text-dark">
                            <Card.Img variant="top" src="/images/flexbox.jpg" width="100%" height={160}/>
                            <Card.Body>
                                <Card.Title className="wd-dashboard-course-title">CS2234 Responsive Web Design</Card.Title>
                                <Card.Text className="wd-dashboard-course-description">Full Stack software developer</Card.Text>
                                <Button variant="primary">Go</Button>
                            </Card.Body>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px"}}>
                        <Card>
                            <Link to="/Kambaz/Courses/1234/Home"
                                className="wd-dashboard-course-link text-decoration-none text-dark">
                            <Card.Img variant="top" src="/images/javascript.jpg" width="100%" height={160}/>
                            <Card.Body>
                                <Card.Title className="wd-dashboard-course-title">CS3234  JavaScript Essentials</Card.Title>
                                <Card.Text className="wd-dashboard-course-description">Full Stack software developer</Card.Text>
                                <Button variant="primary">Go</Button>
                            </Card.Body>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px"}}>
                        <Card>
                            <Link to="/Kambaz/Courses/1234/Home"
                                className="wd-dashboard-course-link text-decoration-none text-dark">
                            <Card.Img variant="top" src="/images/accessibility.jpg" width="100%" height={160}/>
                            <Card.Body>
                                <Card.Title className="wd-dashboard-course-title">CS4234 Web Accessibility Fundamentals</Card.Title>
                                <Card.Text className="wd-dashboard-course-description">Full Stack software developer</Card.Text>
                                <Button variant="primary">Go</Button>
                            </Card.Body>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px"}}>
                        <Card>
                            <Link to="/Kambaz/Courses/1234/Home"
                                className="wd-dashboard-course-link text-decoration-none text-dark">
                            <Card.Img variant="top" src="/images/git.jpg" width="100%" height={160}/>
                            <Card.Body>
                                <Card.Title className="wd-dashboard-course-title">CS5234 Version Control with Git and GitHub</Card.Title>
                                <Card.Text className="wd-dashboard-course-description">Full Stack software developer</Card.Text>
                                <Button variant="primary">Go</Button>
                            </Card.Body>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px"}}>
                        <Card>
                            <Link to="/Kambaz/Courses/1234/Home"
                                className="wd-dashboard-course-link text-decoration-none text-dark">
                            <Card.Img variant="top" src="/images/optimization.jpg" width="100%" height={160}/>
                            <Card.Body>
                                <Card.Title className="wd-dashboard-course-title">CS6234 Introduction to Web Performance Optimization</Card.Title>
                                <Card.Text className="wd-dashboard-course-description">Full Stack software developer</Card.Text>
                                <Button variant="primary">Go</Button>
                            </Card.Body>
                            </Link>
                        </Card>
                    </Col>
                    <Col className="wd-dashboard-course" style={{ width: "300px"}}>
                        <Card>
                            <Link to="/Kambaz/Courses/1234/Home"
                                className="wd-dashboard-course-link text-decoration-none text-dark">
                            <Card.Img variant="top" src="/images/css.jpg" width="100%" height={160}/>
                            <Card.Body>
                                <Card.Title className="wd-dashboard-course-title">CS7234 Advanced CSS Techniques</Card.Title>
                                <Card.Text className="wd-dashboard-course-description">Full Stack software developer</Card.Text>
                                <Button variant="primary">Go</Button>
                            </Card.Body>
                            </Link>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}