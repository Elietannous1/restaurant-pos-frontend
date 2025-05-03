// /src/store/reduxStore.js
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    // your slice reducers will go here, e.g.
    // user: userReducer,
    // products: productsReducer,
  },
});
