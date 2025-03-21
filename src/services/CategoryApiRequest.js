// src/services/CategoryApiRequest.js
import axios from "axios";
import BaseURL from "../config/BaseURL";
import { getToken } from "../utils/storage";

/**
 * Fetches all categories from the backend.
 * Expects an API response with an array of categories.
 */
export const getCategories = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${BaseURL}/category`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data || !Array.isArray(response.data)) {
      throw new Error("Invalid categories data format received");
    }

    return response.data; // Returns an array of categories
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error.response?.data || "Failed to fetch categories";
  }
};

/**
 * Fetches products for a specific category.
 * Expects an API endpoint that returns the products for the given categoryId.
 * Adjust the endpoint URL if your API design differs.
 */
export const getProductsByCategory = async (id) => {
  try {
    const token = getToken();
    const response = await axios.get(`${BaseURL}/category/products/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { id },
    });

    let productsArray = [];
    // If the API returns an array directly
    if (Array.isArray(response.data)) {
      productsArray = response.data;
    }
    // If the API returns an object with a products property
    else if (response.data && Array.isArray(response.data.products)) {
      productsArray = response.data.products;
    } else {
      throw new Error("Invalid products data format received");
    }

    return productsArray;
  } catch (error) {
    console.error(`Error fetching products for category ${id}:`, error);
    throw error.response?.data || "Failed to fetch products by category";
  }
};
