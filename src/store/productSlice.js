// src/store/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchProducts as fetchProductsAPI,
  createProduct as createProductAPI,
  updateProduct as updateProductAPI,
  deleteProduct as deleteProductAPI,
} from "../services/ProductApiRequest";

// Thunks
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchProductsAPI();
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/create",
  async (productData, { rejectWithValue }) => {
    try {
      return await createProductAPI(productData);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const updated = await updateProductAPI(id, productData);
      return updated;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteProductAPI(id);
      return id;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (b) => {
    b
      // fetchProducts
      .addCase(fetchProducts.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(fetchProducts.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = a.payload;
      })
      .addCase(fetchProducts.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload;
      })

      // createProduct
      .addCase(createProduct.fulfilled, (s, a) => {
        s.items.unshift(a.payload);
      })

      // updateProduct
      .addCase(updateProduct.fulfilled, (s, a) => {
        s.items = s.items.map((p) => (p.id === a.payload.id ? a.payload : p));
      })

      // deleteProduct
      .addCase(deleteProduct.fulfilled, (s, a) => {
        s.items = s.items.filter((p) => p.id !== a.payload);
      });
  },
});

export default productSlice.reducer;
