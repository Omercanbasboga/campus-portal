import axiosClient from "./axiosClient";

export const getSecurityAlertsDashboard = async () => {
  try {
    const response = await axiosClient.get("/api/v1/session/security-alerts/dashboard");
    return response.data;
  } catch (error) {
    console.error("Güvenlik alarm verileri çekilirken hata oluştu:", error);
    throw error;
  }
};
