// src/services/CategoryApiRequest.js
import api from "./MainApi"; // Import our custom API instance

/**
 * Fetches all categories from the backend.
 * Expects an API response with an array of categories.
 */
export const getCategories = async () => {
  try {
    const response = await api.get("/category");
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
    const response = await api.get("/category/products/", {
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

/**
 * Creates a new category.
 * Expects an object with category details.
 */
export const createCategory = async (categoryData) => {
  try {
    const response = await api.post("/category/create", categoryData);
    if (!response.data || typeof response.data !== "object") {
      throw new Error("Invalid category data format received");
    }
    return response.data; // Returns the created category object
  } catch (error) {
    console.error("Error creating category:", error);
    throw error.response?.data || "Failed to create category";
  }
};

/**
 * Deletes a category.
 * Expects a successful deletion message or the deleted category object.
 */
export const deleteCategory = async (categoryId) => {
  try {
    const response = await api.post(`/category/delete/?id=${categoryId}`, null);
    return response.data;
  } catch (error) {
    console.error(`Error deleting category ${categoryId}:`, error);
    throw error.response?.data || "Failed to delete category";
  }
};
