import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./Account/reducer";
import modulesReducer from "./Courses/Modules/reducer";
import assignmentReducer from "./Courses/Assignments/reducer";
const store = configureStore({
  reducer: {
    modulesReducer,
    accountReducer,
    assignmentReducer,
  },
});
export default store;
