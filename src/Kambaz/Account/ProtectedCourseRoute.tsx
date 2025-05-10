import { useSelector } from "react-redux";
import { Navigate, Outlet, useParams } from "react-router-dom";

type EnrollmentType = {
    course: string;
    user: string;
};

export default function ProtectedCourseRoute() {
    
    const { currentUser } = useSelector((state: any) => state.accountReducer);


    const enrollments: EnrollmentType[] = useSelector(
        (state: any) => state.enrollmentsReducer.enrollments
    );

    const { cid } = useParams();

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    if (currentUser.role === "STUDENT") {
        const isEnrolled = enrollments.some(
            (enrollment: EnrollmentType) =>
                enrollment.course === cid && enrollment.user === currentUser._id
        );

        if (!isEnrolled) {
            return <Navigate to="/Kambaz/Dashboard" />;
        }
    }

    return <Outlet />;
}