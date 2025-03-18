import axios from "axios";
import BaseURL from "../config/BaseURL";
import { getToken } from "../utils/storage";

export const fetchProductNames = async () => {
  try {
    const token = getToken();
    console.log("Auth token: ", token);

    // Fetch the product list from the backend
    const response = await axios.get(`${BaseURL}/product`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Check if the data is valid
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error("Invalid product data format received");
    }

    // Map the product data to a product ID -> name mapping
    const productNames = response.data.reduce((acc, product) => {
      // Assuming each product has an 'id' and 'productName' field
      if (product.id && product.productName) {
        acc[product.id] = product.productName;
      }
      return acc;
    }, {});

    // Return an object with both the mapped names and the raw product data
    return { productNames, rawProducts: response.data };
  } catch (error) {
    console.error("Error fetching product names:", error);
    throw error.response?.data || "Failed to fetch product names";
  }
};
