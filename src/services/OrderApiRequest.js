// src/services/OrderApiRequest.js
import api from "./MainApi"; // Import the custom API instance

/**
 * 1. Create an Order
 *    Endpoint: POST /order/create
 *    Expects an order object (or array of orders) in the request body
 */
export const createOrder = async (orderData) => {
  try {
    console.log("orderData", orderData);
    // Use the custom API instance; the token is attached automatically via the interceptor.
    const response = await api.post("/order/create", orderData);
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
    // The custom API instance will set the Authorization header automatically
    const response = await api.get("/order");
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
 *    Endpoint: PUT /order/update/status?id={orderId}
 *    Pass the orderId in the URL, and the new status in the request body
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await api.put(`/order/update/status?id=${orderId}`, {
      orderStatus: newStatus,
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating order ${orderId} status:`, error);
    throw error.response?.data || "Failed to update order status";
  }
};
