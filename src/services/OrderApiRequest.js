// src/services/OrderApiRequest.js
import axios from "axios";
import BaseURL from "../config/BaseURL";
import { getToken } from "../utils/storage";

/**
 * 1. Create an Order
 *    Endpoint: POST /order/create
 *    Expects an order object (or array of orders) in the request body
 */
export const createOrder = async (orderData) => {
  try {
    const token = getToken();
    console.log("orderData", orderData);
    const response = await axios.post(`${BaseURL}/order/create`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error.response?.data || "Failed to create order";
  }
};

/**
 * 2. Fetch All Orders
 *    Endpoint: GET /order
 *    Returns an array of orders
 */
export const fetchAllOrders = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${BaseURL}/order`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data || !Array.isArray(response.data)) {
      throw new Error("Invalid orders data format received");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error.response?.data || "Failed to fetch orders";
  }
};

/**
 * 3. Update Order Status
 *    Endpoint: PUT /order/update/status/:id
 *    Pass the orderId in the URL, and the new status in the request body
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const token = getToken();
    const response = await axios.put(
      `${BaseURL}/order/update/status/${orderId}`,
      { status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating order ${orderId} status:`, error);
    throw error.response?.data || "Failed to update order status";
  }
};
