// src/store/categorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCategories as fetchCategoriesAPI,
  createCategory as createCategoryAPI,
  deleteCategory as deleteCategoryAPI,
} from "../services/CategoryApiRequest";

// Thunks
export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCategoriesAPI();
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createCategory = createAsyncThunk(
  "categories/create",
  async (categoryData, { rejectWithValue }) => {
    try {
      return await createCategoryAPI(categoryData);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (categoryId, { rejectWithValue }) => {
    try {
      await deleteCategoryAPI(categoryId);
      return categoryId;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    items: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchCategories
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // createCategory
      .addCase(createCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.unshift(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // deleteCategory
      .addCase(deleteCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter(
          (c) => c.categoryId !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
