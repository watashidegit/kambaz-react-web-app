import { Link } from "react-router-dom";
export default function Dashboard() {
    return (
        <div id="wd-dashbaord">
            <h1 id="wd-dashbaord-title">Dashboard</h1> <hr/>
            <h2 id="wd-dashbaord-published">Published Courses (12)</h2> <hr/>
            <div id="wd-dashboard-courses">
                <div className="wd-dashboard-course">
                    <Link to="/Kambaz/Courses/1234/Home"
                          className="wd-dashboard-course-link" >
                        <img src="/images/reactjs.jpg" width={200} height={100} />
                        <div>
                            <h5> CS1234 React JS </h5>
                            <p className="wd-dashboard-course-title">
                                Full Stack software developer 
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>
                <div className="wd-dashboard-course">
                    <Link to="/Kambaz/Courses/1234/Home"
                          className="wd-dashboard-course-link" >
                        <img src="/images/flexbox.jpg" width={200} height={100} />
                        <div>
                            <h5> CS2234 Responsive Web Design with Flexbox and Grid </h5>
                            <p className="wd-dashboard-course-title">
                                Full Stack software developer 
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>
                <div className="wd-dashboard-course">
                    <Link to="/Kambaz/Courses/1234/Home"
                          className="wd-dashboard-course-link" >
                        <img src="/images/javascript.jpg" width={200} height={100} />
                        <div>
                            <h5> CS3234  JavaScript Essentials </h5>
                            <p className="wd-dashboard-course-title">
                                Full Stack software developer 
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>
                <div className="wd-dashboard-course">
                    <Link to="/Kambaz/Courses/1234/Home"
                          className="wd-dashboard-course-link" >
                        <img src="/images/accessibility.jpg" width={200} height={100} />
                        <div>
                            <h5> CS4234 Web Accessibility Fundamentals </h5>
                            <p className="wd-dashboard-course-title">
                                Full Stack software developer 
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>
                <div className="wd-dashboard-course">
                    <Link to="/Kambaz/Courses/1234/Home"
                          className="wd-dashboard-course-link" >
                        <img src="/images/git.jpg" width={200} height={100} />
                        <div>
                            <h5> CS5234 Version Control with Git and GitHub </h5>
                            <p className="wd-dashboard-course-title">
                                Full Stack software developer 
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>
                <div className="wd-dashboard-course">
                    <Link to="/Kambaz/Courses/1234/Home"
                          className="wd-dashboard-course-link" >
                        <img src="/images/optimization.jpg" width={200} height={100} />
                        <div>
                            <h5> CS6234 Introduction to Web Performance Optimization </h5>
                            <p className="wd-dashboard-course-title">
                                Full Stack software developer 
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>
                <div className="wd-dashboard-course">
                    <Link to="/Kambaz/Courses/1234/Home"
                          className="wd-dashboard-course-link" >
                        <img src="/images/css.jpg" width={200} height={100} />
                        <div>
                            <h5> CS7234 Advanced CSS Techniques </h5>
                            <p className="wd-dashboard-course-title">
                                Full Stack software developer 
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}