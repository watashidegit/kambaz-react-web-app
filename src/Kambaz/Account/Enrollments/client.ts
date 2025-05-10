import axios from "axios";
export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
export const ENROLLMENTS_API = `${REMOTE_SERVER}/api/enrollments`;

// get all enrollment 
export const fetchEnrollment = async () => {
    const enrollments = await axios.get(`${ENROLLMENTS_API}`);
    return enrollments.data;
}