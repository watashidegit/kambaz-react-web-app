import { createSlice } from "@reduxjs/toolkit";
import * as db from "../../Database";

const initialState = {
    assignments: db.assignments,
};

const assignmentsSlice = createSlice({
    name: "assignments",
    initialState,
    reducers: {
        addAssignment: (state, action) => {
            const newAssignment = {
                ...action.payload,
                _id: action.payload._id || Math.random().toString(36).substr(2, 9),
            };
            state.assignments.push(newAssignment);
        },
        deleteAssignment: (state, action) => {
            state.assignments = state.assignments.filter(a => a._id !== action.payload);
        },
        updateAssignment: (state, action) => {
            const index = state.assignments.findIndex(a => a._id === action.payload._id);
            if (index !== -1) {
                Object.assign(state.assignments[index], action.payload);
            }
        }
    }
});

export const { addAssignment, deleteAssignment, updateAssignment } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;