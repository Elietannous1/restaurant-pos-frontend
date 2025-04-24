// src/services/DashboardApiRequest.js

import api from "./MainApi"; // Axios instance with base URL + auth interceptor

/**
 * Fetch and aggregate top‐selling product data for a bar chart.
 * @param {string} startDate – ISO date (YYYY-MM-DD) to begin range
 * @param {string} endDate – ISO date (YYYY-MM-DD) to end range
 * @param {object} productNames – mapping of productId → productName
 * @returns {Promise<Array<{productName: string, quantitySold: number}>>}
 */
export const getBarChartData = async (startDate, endDate, productNames) => {
  try {
    // GET /sales/top-selling?startDate=…&endDate=…
    const response = await api.get("/sales/top-selling", {
      params: { startDate, endDate },
    });

    // Validate response format
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error("Invalid data format received");
    }

    // Aggregate quantities by product ID
    const aggregatedSales = response.data.reduce((acc, item) => {
      if (acc[item.product]) {
        acc[item.product].quantitySold += item.quantitySold;
      } else {
        acc[item.product] = {
          productName: productNames[item.product] || "Unknown",
          quantitySold: item.quantitySold,
        };
      }
      return acc;
    }, {});

    // Convert to array form for chart component
    return Object.values(aggregatedSales);
  } catch (error) {
    console.error("Error fetching bar chart data:", error);
    // Propagate backend error message or default
    throw error.response?.data || "Failed to fetch bar chart data";
  }
};

/**
 * Fetch and aggregate sales totals per day for a line chart.
 * @param {string} startDate – ISO date to begin range
 * @param {string} endDate – ISO date to end range
 * @returns {Promise<Array<{saleDate: string, totalSales: number}>>}
 */
export const getLineChartData = async (startDate, endDate) => {
  try {
    // Note: using same endpoint as bar chart; backend groups by date
    const response = await api.get("/sales/top-selling", {
      params: { startDate, endDate },
    });

    if (!response.data || !Array.isArray(response.data)) {
      throw new Error("Invalid data format received");
    }

    // Sum quantitySold per saleDate
    const salesByDate = response.data.reduce((acc, sale) => {
      const { saleDate, quantitySold } = sale;
      acc[saleDate] = (acc[saleDate] || 0) + quantitySold;
      return acc;
    }, {});

    // Format for chart: [{ saleDate, totalSales }, …]
    return Object.keys(salesByDate).map((date) => ({
      saleDate: date,
      totalSales: salesByDate[date],
    }));
  } catch (error) {
    console.error("Error fetching line chart data:", error);
    throw error.response?.data || "Failed to fetch line chart data";
  }
};

/**
 * Fetch today's total sales amount.
 * @returns {Promise<number>} – parsed float of today's income
 */
export const getTodaysSales = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];
    // GET /order/income?date=YYYY-MM-DD&period=day
    const response = await api.get("/order/income", {
      params: { date: today, period: "day" },
    });
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

/**
 * Fetch and sum daily sales for the last 30 days.
 * @returns {Promise<number>} – total sales over 30-day window
 */
export const getTotalSalesLast30Days = async () => {
  try {
    const today = new Date();
    const salesPromises = [];

    // Build an array of 30 GET requests, one per day
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const formattedDate = date.toISOString().split("T")[0];
      salesPromises.push(
        api.get("/order/income", {
          params: { date: formattedDate, period: "day" },
        })
      );
    }

    // Wait for all daily‐income requests
    const responses = await Promise.all(salesPromises);

    // Sum up parsed floats, ignoring NaN days
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
