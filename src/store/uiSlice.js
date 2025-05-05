// src/store/uiSlice.js
import {
  createSlice,
  isPending,
  isFulfilled,
  isRejected,
} from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: { loadingCount: 0 },
  reducers: {},
  extraReducers: (builder) => {
    // Any action ending in /pending will bump the counter
    builder.addMatcher(isPending, (state) => {
      state.loadingCount += 1;
    });
    // Any action ending in /fulfilled or /rejected will decrement it
    builder.addMatcher(isFulfilled, (state) => {
      state.loadingCount = Math.max(state.loadingCount - 1, 0);
    });
    builder.addMatcher(isRejected, (state) => {
      state.loadingCount = Math.max(state.loadingCount - 1, 0);
    });
  },
});

export default uiSlice.reducer;
