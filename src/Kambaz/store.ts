import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./Account/reducer";
import modulesReducer from "./Courses/Modules/reducer";
import assignmentReducer from "./Courses/Assignments/reducer";
import enrollmentsReducer from "./Account/Enrollments/reducer";
const store = configureStore({
  reducer: {
    modulesReducer,
    accountReducer,
    assignmentReducer,
    enrollmentsReducer,
  },
});
export default store;
