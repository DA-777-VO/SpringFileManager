import { configureStore } from "@reduxjs/toolkit";
import filesReducer from "./features/filesSlice";

export default configureStore({
  reducer: {
    files: filesReducer,
  },
}); 