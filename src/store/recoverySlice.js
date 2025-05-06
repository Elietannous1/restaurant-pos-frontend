import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  requestRecoveryEmail,
  verifyRecoveryCode,
  resetPassword,
} from "../services/RecoveryApiRequest";

// 1️⃣ Send recovery email
export const requestRecovery = createAsyncThunk(
  "recovery/request",
  async (email, { rejectWithValue }) => {
    try {
      await requestRecoveryEmail(email);
      return email;
    } catch (err) {
      return rejectWithValue(
        typeof err === "string"
          ? err
          : err.message || "Failed to send recovery email"
      );
    }
  }
);

// 2️⃣ Verify code
export const verifyRecovery = createAsyncThunk(
  "recovery/verify",
  async ({ email, code }, { rejectWithValue }) => {
    try {
      await verifyRecoveryCode(email, code);
      return { email };
    } catch (err) {
      return rejectWithValue(
        typeof err === "string"
          ? err
          : err.message || "Failed to verify recovery code"
      );
    }
  }
);

// 3️⃣ Reset password
export const resetPasswordThunk = createAsyncThunk(
  "recovery/reset",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      await resetPassword(email, password);
      return { email };
    } catch (err) {
      return rejectWithValue(
        typeof err === "string"
          ? err
          : err.message || "Failed to reset password"
      );
    }
  }
);

const recoverySlice = createSlice({
  name: "recovery",
  initialState: {
    request: { status: "idle", error: null },
    verify: { status: "idle", error: null },
    reset: { status: "idle", error: null },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // requestRecovery
      .addCase(requestRecovery.pending, (state) => {
        state.request.status = "loading";
        state.request.error = null;
      })
      .addCase(requestRecovery.fulfilled, (state) => {
        state.request.status = "succeeded";
      })
      .addCase(requestRecovery.rejected, (state, action) => {
        state.request.status = "failed";
        state.request.error = action.payload;
      })

      // verifyRecovery
      .addCase(verifyRecovery.pending, (state) => {
        state.verify.status = "loading";
        state.verify.error = null;
      })
      .addCase(verifyRecovery.fulfilled, (state) => {
        state.verify.status = "succeeded";
      })
      .addCase(verifyRecovery.rejected, (state, action) => {
        state.verify.status = "failed";
        state.verify.error = action.payload;
      })

      // resetPasswordThunk
      .addCase(resetPasswordThunk.pending, (state) => {
        state.reset.status = "loading";
        state.reset.error = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.reset.status = "succeeded";
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.reset.status = "failed";
        state.reset.error = action.payload;
      });
  },
});

export default recoverySlice.reducer;
