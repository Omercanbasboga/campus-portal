import axiosClient from "./axiosClient";

export const getPeakPredictionsDashboard = async () => {
  try {
    const response = await axiosClient.get("/api/v1/session/peak-predictions/dashboard");
    return response.data;
  } catch (error) {
    console.error("Peak tahmin verileri çekilirken hata oluştu:", error);
    throw error;
  }
};
