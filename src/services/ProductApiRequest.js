import axios from "axios"; // HTTP client for making API requests
import BaseURL from "../config/BaseURL"; // Base URL for backend endpoints
import { getToken } from "../utils/storage"; // Utility to retrieve stored JWT

/**
 * Fetch all products and build a mapping of product ID → productName.
 * @returns {Promise<{ productNames: Record<number,string>, rawProducts: Array }>}
 */
export const fetchProductNames = async () => {
  try {
    const token = getToken(); // Retrieve JWT for authorization
    console.log("Auth token: ", token);

    // GET /product with Authorization header
    const response = await axios.get(`${BaseURL}/product`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Validate that the response is an array
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error("Invalid product data format received");
    }

    // Build an object: { [productId]: productName, … }
    const productNames = response.data.reduce((acc, product) => {
      if (product.id && product.productName) {
        acc[product.id] = product.productName;
      }
      return acc;
    }, {});

    // Return both the mapping and the raw array
    return { productNames, rawProducts: response.data };
  } catch (error) {
    console.error("Error fetching product names:", error);
    // Propagate server error message or fallback
    throw error.response?.data || "Failed to fetch product names";
  }
};

/**
 * Retrieve full list of products.
 * @returns {Promise<Array>} – array of product objects
 */
export const fetchProducts = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${BaseURL}/product`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error.response?.data || "Failed to fetch products";
  }
};

/**
 * Create a new product on the backend.
 * @param {object} productData – { productName, price, description, isAvailable, categoryId }
 * @returns {Promise<object>} – newly created product
 */
export const createProduct = async (productData) => {
  try {
    const token = getToken();
    const response = await axios.post(`${BaseURL}/product/add`, productData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error.response?.data || "Failed to create product";
  }
};

/**
 * Delete a product by ID.
 * @param {number|string} productId
 * @returns {Promise<object>} – deletion result
 */
export const deleteProduct = async (productId) => {
  try {
    const token = getToken();
    // Note: DELETE endpoint uses POST with query param
    const response = await axios.post(
      `${BaseURL}/product/remove?id=${productId}`,
      null,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error.response?.data || "Failed to delete product";
  }
};

/**
 * Update an existing product.
 * @param {number|string} productId
 * @param {object} productData – updated fields for product
 * @returns {Promise<object>} – updated product
 */
export const updateProduct = async (productId, productData) => {
  try {
    const token = getToken();
    const response = await axios.put(
      `${BaseURL}/product/update?id=${productId}`,
      productData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error.response?.data || "Failed to update product";
  }
};
