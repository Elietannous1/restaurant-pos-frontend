// src/services/DashboardApiRequest.js
import api from "./MainApi"; // Use the custom API instance

export const getBarChartData = async (startDate, endDate, productNames) => {
  try {
    // The interceptor in "api" will attach the Authorization header automatically.
    const response = await api.get("/sales/top-selling", {
      params: { startDate, endDate },
    });

    if (!response.data || !Array.isArray(response.data)) {
      throw new Error("Invalid data format received");
    }

    // Group sales by product and sum their quantitySold
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

    const chartData = Object.values(aggregatedSales);
    return chartData;
  } catch (error) {
    console.error("Error fetching bar chart data:", error);
    throw error.response?.data || "Failed to fetch bar chart data";
  }
};

export const getLineChartData = async (startDate, endDate) => {
  try {
    const response = await api.get("/sales/top-selling", {
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

    // Convert aggregated data into the format needed for the line chart
    const formattedData = Object.keys(salesByDate).map((date) => ({
      saleDate: date,
      totalSales: salesByDate[date],
    }));

    return formattedData;
  } catch (error) {
    console.error("Error fetching line chart data:", error);
    throw error.response?.data || "Failed to fetch line chart data";
  }
};

export const getTodaysSales = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];
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

export const getTotalSalesLast30Days = async () => {
  try {
    const today = new Date();
    const salesPromises = [];
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
    const responses = await Promise.all(salesPromises);
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
