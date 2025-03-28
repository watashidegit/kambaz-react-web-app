import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
const initialState = {
    assignments: [],
};

const assignmentsSlice = createSlice({
    name: "assignments",
    initialState,
    reducers: {
        setAssignments: (state, action) => {
            state.assignments = action.payload;
        },
        addAssignment: (state, {payload: assignment}) => {
            const newAssignment: any = {
                _id: uuidv4(),
                title: assignment.title,
                course: assignment.course
            };
            state.assignments = [...state.assignments, newAssignment] as any;
        },
        deleteAssignment: (state, {payload: assignmentId}) => {
            state.assignments = state.assignments.filter((a: any) => a._id !== assignmentId);
        },
        updateAssignment: (state, {payload: assignment}) => {
            const index = state.assignments.findIndex((a: any) => a._id === assignment._id);
            if (index !== -1) {
                Object.assign(state.assignments[index], assignment);
            }
        }
    }
});

export const { addAssignment, deleteAssignment, updateAssignment, setAssignments } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;