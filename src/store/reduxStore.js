// /src/store/reduxStore.js
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import dashboardReducer from "./dashboardSlice"; // Import your auth slice
import uiReducer from "./uiSlice"; // Import your UI slice
import categoryReducer from "./categorySlice"; // Import your category slice
import orderReducer from "./orderSlice"; // Import your order slice
import productReducer from "./productSlice"; // Import your product slice
export const store = configureStore({
  reducer: {
    auth: authSlice, // Add your auth slice reducer here
    dashboard: dashboardReducer,
    ui: uiReducer, // Add your UI slice reducer here
    categories: categoryReducer, // Add your category slice reducer here
    orders: orderReducer, // Add your order slice reducer here
    products: productReducer, // Add your product slice reducer here
  },
});
