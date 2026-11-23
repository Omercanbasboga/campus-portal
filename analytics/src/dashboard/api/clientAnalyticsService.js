import axiosClient from "./axiosClient";

export const getClientAnalyticsDashboard = async () => {
  try {
    const response = await axiosClient.get("/api/v1/session/client-analytics/dashboard");
    return response.data;
  } catch (error) {
    console.error("Client Analytics verileri çekilirken hata oluştu:", error);
    throw error;
  }
};
