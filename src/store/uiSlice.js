import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "./authSlice";
import { loadDashboard } from "./dashboardSlice";

const uiSlice = createSlice({
  name: "ui",
  initialState: { loadingCount: 0 },
  reducers: {},
  extraReducers: (builder) => {
    const pendingActions = [
      loginUser.pending,
      registerUser.pending,
      loadDashboard.pending,
      // add other thunks here…
    ];
    const fulfilledOrRejected = [
      loginUser.fulfilled,
      loginUser.rejected,
      registerUser.fulfilled,
      registerUser.rejected,
      loadDashboard.fulfilled,
      loadDashboard.rejected,
      // …and so on
    ];

    builder
      .addMatcher(isAnyOf(...pendingActions), (state) => {
        state.loadingCount += 1;
      })
      .addMatcher(isAnyOf(...fulfilledOrRejected), (state) => {
        state.loadingCount = Math.max(state.loadingCount - 1, 0);
      });
  },
});

export default uiSlice.reducer;
