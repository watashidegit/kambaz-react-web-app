import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    enrollments: [] as any[]
};

const enrollmentsSlice = createSlice({
    name: "enrollments",
    initialState,
    reducers: {
        setEnrollments: (state, action ) => {
            state.enrollments = action.payload
        },
        enrollCourseR: (state, action) => {
            const { courseId, userId } = action.payload;
            const newEnrollment: any={
                _id: new Date().getTime().toString(),
                user: userId,
                course: courseId
            };
            state.enrollments.push(newEnrollment);
            console.log("Enrolled:", newEnrollment, state.enrollments);
        },
        unenrollCourseR: (state, action) => {
            const { courseId, userId } = action.payload;
            state.enrollments = state.enrollments.filter(
                (enrollment: any) => !(enrollment.course === courseId && enrollment.user === userId)
            );
            console.log("Unenrolled from course:", courseId, state.enrollments);
        }
    }
});

export const { enrollCourseR, unenrollCourseR, setEnrollments } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;