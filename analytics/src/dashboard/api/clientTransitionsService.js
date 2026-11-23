import axiosClient from "./axiosClient";

export const getClientTransitionsDashboard = async () => {
  try {
    const response = await axiosClient.get("/api/v1/session/client-transitions/dashboard");
    return response.data;
  } catch (error) {
    console.error("Client Transitions verileri çekilirken hata oluştu:", error);
    throw error;
  }
};
