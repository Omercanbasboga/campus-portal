import axiosClient from "./axiosClient";

export const getDashboardTrends = async () => {
  try {
    const response = await axiosClient.get("/api/v1/session/agg-system-trends/dashboard");
    return response.data;
  } catch (error) {
    console.error("Dashboard verisi çekilirken hata oluştu:", error);
    throw error;
  }
};

export const getChartTrends = async () => {
  try {
    const response = await axiosClient.get("/api/v1/session/agg-system-trends/charts");
    return response.data;
  } catch (error) {
    console.error("Grafik verileri çekilirken hata oluştu:", error);
    throw error;
  }
};

export const getAllSystemTrends = async () => {
  try {
    const response = await axiosClient.get("/api/v1/session/agg-system-trends");
    return response.data;
  } catch (error) {
    console.error("Detaylı trend verisi çekilirken hata oluştu:", error);
    throw error;
  }
};
