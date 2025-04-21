import axios from "axios";
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;
const axiosWithCredentials = axios.create({ withCredentials: true });


// delete quiz, respond with status
export const deleteQuiz = async (quizId: string) => {
    const response = await axiosWithCredentials.delete(`${QUIZZES_API}/${quizId}`);
    return response.data;
};

// retrieve quiz by id
export const findQuizById = async (quizId: string) => {
    const response = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}`);
    return response.data;
};

// update quiz
export const updateQuiz = async (quiz: any) => {
    const { data } = await axiosWithCredentials.put(`${QUIZZES_API}/${quiz._id}`, quiz);
    return data;
}


export const fetchQuizSubmission = async (quizId: string, studentId: string) => {
    const { data } = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}/submissions/${studentId}`);
    return data;
};

export const fetchPreviewAttempt = async (quizId: string, userId: string) => {
    try {
        const { data } = await axiosWithCredentials.get(
            `${QUIZZES_API}/${quizId}/preview/${userId}`
        );
        return data;
    } catch (error) {
        const err = error as { response?: { data: any }, message?: string };
        console.error("Error fetching preview attempt:", err.response ? err.response.data : err.message);
        throw error;
    }
};

export const savePreviewAttempt = async (quizId: string, attempt: any) => {
    const { data } = await axiosWithCredentials.post(
        `${QUIZZES_API}/${quizId}/preview`,
        attempt
    );
    return data;
};

export const fetchStudentQuizAttempts = async (quizId: string, studentId: string) => {
    const { data } = await axiosWithCredentials.get(
        `${QUIZZES_API}/${quizId}/attempts/${studentId}`
    );
    return data;
};

export const submitQuizAttempt = async (quizId: string, submission: any) => {
    const { data } = await axiosWithCredentials.post(
        `${QUIZZES_API}/${quizId}/attempts`,
        submission
    );
    return data;
};


export const fetchLatestQuizAttempt = async (quizId: string, studentId: string) => {
    try {
        const { data } = await axiosWithCredentials.get(
            `${QUIZZES_API}/${quizId}/attempts/${studentId}/latest`
        );
        return data;
    } catch (error) {
        const err = error as { response?: { data: any }, message?: string };
        console.error("Error fetching latest attempt:", err.response ? err.response.data : err.message);
        throw error;
    }
};