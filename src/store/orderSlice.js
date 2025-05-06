import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createOrder as createOrderAPI,
  fetchAllOrders as fetchAllOrdersAPI,
  updateOrderStatus as updateOrderStatusAPI,
} from "../services/OrderApiRequest";

// Thunks
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAllOrdersAPI();
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      return await createOrderAPI(orderData);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, newStatus }, { rejectWithValue }) => {
    try {
      return await updateOrderStatusAPI(orderId, newStatus);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    items: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchOrders
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // updateOrderStatus
      .addCase(updateOrderStatus.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updated = action.payload;
        state.items = state.items.map((o) =>
          o.orderId === updated.orderId ? updated : o
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
