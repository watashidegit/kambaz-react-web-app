import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
export const USERS_API = `${REMOTE_SERVER}/api/users`;

export const signin = async (credentials: any) => {
  const response = await axiosWithCredentials.post( `${USERS_API}/signin`, credentials );
  return response.data;
};

export const signup = async (user: any) => {
    const response = await axiosWithCredentials.post(`${USERS_API}/signup`, user);
    return response.data;
  };
  
export const updateUser = async (user: any) => {
    const response = await axiosWithCredentials.put(`${USERS_API}/${user._id}`, user);
    return response.data;
};
  
export const profile = async () => {
    const response = await axiosWithCredentials.post(`${USERS_API}/profile`);
    return response.data;
};
  
export const signout = async () => {
    const response = await axiosWithCredentials.post(`${USERS_API}/signout`);
    return response.data;
  };
  
// find course for signed in users
export const findMyCourses = async () => {
    const { data } = await axiosWithCredentials.get(`${USERS_API}/current/courses`);
    return data;
};

// posts a new course to the server
export const createCourse = async (course: any) => {
    const { data } = await axiosWithCredentials.post(`${USERS_API}/current/courses`, course);
    return data;
};
  
// enroll a new course (user end)
export const enrollCourse = async (courseId: string) => {
  const url = `${USERS_API}/current/enrollments`;

  console.log("📡 POST Request to:", url);
  console.log("📦 Request body:", { courseId });

  const response = await axiosWithCredentials.post(url, { courseId });
  return response;
};

// unenroll a course (user end)
export const unenrollCourse = async (courseId: string) => {
  const url = `${USERS_API}/current/enrollments`;
  const data = { courseId };

  console.log("📡 Delete Request to:", url);
  console.log("📦 Request body:", data);

  const response = await axiosWithCredentials.delete(url, {data});
  return response;
}
  