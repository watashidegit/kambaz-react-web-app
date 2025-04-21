import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;

export const fetchAllCourses = async () => {
    const { data } = await axiosWithCredentials.get(COURSES_API);
    return data;
};

export const createCourse = async (course: any) => {
    const { data } = await axiosWithCredentials.post(COURSES_API, course);
    return data;
   };

// returns the status of delete
export const deleteCourse = async (id: string) => {
    const { data } = await axiosWithCredentials.delete(`${COURSES_API}/${id}`);
    return data;
};

export const updateCourse = async (course: any) => {
    const { data } = await axiosWithCredentials.put(`${COURSES_API}/${course._id}`, course);
    return data;
};
  
// retreive a course's modules
export const findModulesForCourse = async (courseId: string) => {
    const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/modules`);
    return response.data;
}  

// create new module associate with course id
export const createModuleForCourse = async (courseId: string, module: any) => {
    const response = await axiosWithCredentials.post(
      `${COURSES_API}/${courseId}/modules`, module
    );
    return response.data;
};  

// retreive a course's assignments
export const findAssignmentsForCourse = async (courseId: string) => {
    const response = await axios.get(`${COURSES_API}/${courseId}/assignments`);
    return response.data;
};

// create an assignment for a given course
export const createAssignmentForCourse = async (courseId: string, assignment: any) => {
    const response = await axiosWithCredentials.post(
        `${COURSES_API}/${courseId}/assignments`, assignment
    );
    return response.data;
};

// retrieve users for a given course
export const findUsersForCourse = async (courseId: string) => {
    const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/users`);
    return response.data;
};

// retrieve quizzes for a given course
export const findQuizzesForCourse = async (courseId: string) => {
    const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/quizzes`);
    return response.data;
}

// retrieve quizzes for a given course by partial title
export const findQuizzesByPartialTitle = async (courseId: string, partialTitle: string) => {
    const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/quizzes`, {
        params: { title: partialTitle }
    });
    return response.data;
};
   
// create a quiz for a given course
export const createQuizForCourse = async (courseId: string, quiz: any) => {
    const response = await axiosWithCredentials.post(
        `${COURSES_API}/${courseId}/quizzes`, quiz
    );
    console.log(courseId, quiz);
    return response.data;
};

