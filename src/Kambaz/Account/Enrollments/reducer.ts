import { createSlice } from "@reduxjs/toolkit";
import * as db from "../../Database";

const initialState = {
    enrollments: db.enrollments
};

const enrollmentsSlice = createSlice({
    name: "enrollments",
    initialState,
    reducers: {
        enrollCourse: (state, action) => {
            const { courseId, userId } = action.payload;
            const newEnrollment = {
                _id: new Date().getTime().toString(),
                user: userId,
                course: courseId
            };
            state.enrollments.push(newEnrollment);
            console.log("Enrolled:", newEnrollment, state.enrollments);
        },
        unenrollCourse: (state, action) => {
            const { courseId, userId } = action.payload;
            state.enrollments = state.enrollments.filter(
                (enrollment) => !(enrollment.course === courseId && enrollment.user === userId)
            );
            console.log("Unenrolled from course:", courseId, state.enrollments);
        }
    }
});

export const { enrollCourse, unenrollCourse } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;