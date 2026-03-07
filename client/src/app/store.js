import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import progressReducer from "../features/progressSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    progress: progressReducer,
  },
});