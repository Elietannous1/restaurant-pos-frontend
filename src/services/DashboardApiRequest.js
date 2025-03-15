import axios from "axios";
import BaseURL from "../config/BaseURL";
import { getToken } from "../utils/storage";

export const getBarChartData = async (startDate, endDate, productNames) => {
  try {
    const token = getToken();
    console.log("Auth token: ", token);

    // Fetch data from the backend
    const response = await axios.get(`${BaseURL}/sales/top-selling`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { startDate, endDate }, // Send calculated dates in request
    });

    // Check if the response data is valid
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error("Invalid data format received");
    }

    // Group sales by product ID and sum the quantitySold for each product
    const aggregatedSales = response.data.reduce((acc, item) => {
      // If the product already exists in the accumulator, add the quantitySold
      if (acc[item.product]) {
        acc[item.product].quantitySold += item.quantitySold;
      } else {
        // If it's the first time the product is encountered, add it to the accumulator
        acc[item.product] = {
          productName: productNames[item.product] || "Unknown", // Get product name
          quantitySold: item.quantitySold,
        };
      }
      return acc;
    }, {});

    // Convert the aggregated sales object back to an array of chart data
    const chartData = Object.values(aggregatedSales);

    // Return the aggregated chart data
    return chartData;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error.response?.data || "Failed to fetch dashboard data";
  }
};
