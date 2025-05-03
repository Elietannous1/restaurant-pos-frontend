// /src/store/reduxStore.js
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice"; // Import your auth slice
export const store = configureStore({
  reducer: {
    auth: authSlice, // Add your auth slice reducer here
  },
});
