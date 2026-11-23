import axiosClient from "./axiosClient";

export const getFuturePredictionsDashboard = async () => {
  try {
    const response = await axiosClient.get("/api/v1/session/future-predictions/dashboard");
    return response.data;
  } catch (error) {
    console.error("Gelecek tahmin verileri çekilirken hata oluştu:", error);
    throw error;
  }
};
