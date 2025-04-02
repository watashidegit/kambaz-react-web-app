import axios from "axios";
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;

export const fetchUsersInCourse = async (courseId: string) => {
    const { data } = await axios.get(`${REMOTE_SERVER}/api/courses/${courseId}/people`);
    return data;
}