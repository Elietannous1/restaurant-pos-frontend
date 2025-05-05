// /src/store/reduxStore.js
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import dashboardReducer from "./dashboardSlice"; // Import your auth slice
export const store = configureStore({
  reducer: {
    auth: authSlice, // Add your auth slice reducer here
    dashboard: dashboardReducer,
  },
});
