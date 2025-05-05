// /src/store/reduxStore.js
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import dashboardReducer from "./dashboardSlice"; // Import your auth slice
import uiReducer from "./uiSlice"; // Import your UI slice
export const store = configureStore({
  reducer: {
    auth: authSlice, // Add your auth slice reducer here
    dashboard: dashboardReducer,
    ui: uiReducer, // Add your UI slice reducer here
  },
});
