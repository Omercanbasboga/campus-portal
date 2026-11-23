import axiosClient from "./axiosClient";

export const getBrowserOsDashboard = async () => {
  try {
    const response = await axiosClient.get("/api/v1/session/browser-os-stats/dashboard");
    return response.data;
  } catch (error) {
    console.error("Browser ve OS verileri çekilirken hata oluştu:", error);
    throw error;
  }
};
