import axiosClient from "./axiosClient";

export const getCohortAnalysisDashboard = async () => {
  try {
    const response = await axiosClient.get("/api/v1/session/cohort-analysis/dashboard");
    return response.data;
  } catch (error) {
    console.error("Cohort Analiz verileri çekilirken hata oluştu:", error);
    throw error;
  }
};
