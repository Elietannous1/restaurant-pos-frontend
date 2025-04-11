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

export const getLineChartData = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${BaseURL}/sales/top-selling`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      params: { startDate, endDate },
    });

    if (!response.data || !Array.isArray(response.data)) {
      throw new Error("Invalid data format received");
    }

    // Aggregate sales per date
    const salesByDate = response.data.reduce((acc, sale) => {
      const { saleDate, quantitySold } = sale;
      if (!acc[saleDate]) {
        acc[saleDate] = 0;
      }
      acc[saleDate] += quantitySold;
      return acc;
    }, {});

    // Convert to array format suitable for Recharts
    const formattedData = Object.keys(salesByDate).map((date) => ({
      saleDate: date,
      totalSales: salesByDate[date],
    }));

    return formattedData; // [{ saleDate: "2025-02-20", totalSales: 17 }]
  } catch (error) {
    console.error("Error fetching line chart data:", error);
    throw error.response?.data || "Failed to fetch sales data";
  }
};

export const getTodaysSales = async () => {
  try {
    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const response = await axios.get(`${BaseURL}/order/income`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      params: { date: today, period: "day" },
    });
    // Parse the response data which should be a string representing a number
    const sales = parseFloat(response.data);
    if (isNaN(sales)) {
      console.warn(
        "Parsed today's sales is NaN. Response data was:",
        response.data
      );
    }
    return sales;
  } catch (error) {
    console.error("Error fetching today's sales:", error);
    throw error.response?.data || "Failed to fetch today's sales";
  }
};

export const getTotalSalesLast30Days = async () => {
  try {
    const today = new Date();
    // Create an array of promises for the last 30 days (using period "day")
    const salesPromises = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const formattedDate = date.toISOString().split("T")[0];
      salesPromises.push(
        axios.get(`${BaseURL}/order/income`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          params: { date: formattedDate, period: "day" },
        })
      );
    }
    // Wait for all API calls to resolve
    const responses = await Promise.all(salesPromises);
    // Sum the sales, parsing each response data into a float
    const totalSales = responses.reduce((sum, res) => {
      const dailySale = parseFloat(res.data);
      if (isNaN(dailySale)) {
        console.warn("Parsed daily sale is NaN. Response data was:", res.data);
        return sum;
      }
      return sum + dailySale;
    }, 0);
    return totalSales;
  } catch (error) {
    console.error("Error fetching total sales for last 30 days:", error);
    throw (
      error.response?.data || "Failed to fetch total sales for last 30 days"
    );
  }
};
