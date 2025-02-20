import { Link, useLocation, useParams } from "react-router-dom";
import "../styles.css";
export default function CourseNavigation() {
  const { pathname } = useLocation() 
  const { cid } = useParams();
  const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];
  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => {
        const linkPath = `/Kambaz/Courses/${cid}/${link}`;
        return (
          <Link
            key={link}
            to={linkPath}
            id={`wd-course-${link.toLowerCase()}-link`}
            className={`list-group-item border-0 ${
              pathname.includes(link) ? "active bg-primary text-white" : "text-danger"
            }`}
          >
            {link}
          </Link> 
        );
      })}
    </div>
  );
}
