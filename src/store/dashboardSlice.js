// src/store/dashboardSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getBarChartData,
  getLineChartData,
  getTodaysSales,
  getTotalSalesLast30Days,
} from "../services/DashboardApiRequest";

// Thunk to load everything at once
export const loadDashboard = createAsyncThunk(
  "dashboard/loadDashboard",
  async ({ startDate, endDate, productNames }, { rejectWithValue }) => {
    try {
      const [barData, lineData, todaySales, last30Days] = await Promise.all([
        getBarChartData(startDate, endDate, productNames),
        getLineChartData(startDate, endDate),
        getTodaysSales(),
        getTotalSalesLast30Days(),
      ]);
      return { barData, lineData, todaySales, last30Days };
    } catch (err) {
      return rejectWithValue(err.response || err.toString());
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    barData: [],
    lineData: [],
    todaySales: 0,
    last30Days: 0,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadDashboard.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadDashboard.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.barData = payload.barData;
        state.lineData = payload.lineData;
        state.todaySales = payload.todaySales;
        state.last30Days = payload.last30Days;
      })
      .addCase(loadDashboard.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload;
      });
  },
});

export default dashboardSlice.reducer;
