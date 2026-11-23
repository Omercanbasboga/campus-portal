import axiosClient from "./axiosClient";

export const getAllUserSegments = async () => {
  try {
    const response = await axiosClient.get("/api/v1/session/user-segments");
    return response.data;
  } catch (error) {
    console.error("Segment verileri çekilirken hata oluştu:", error);
    throw error;
  }
};

export const getUserSegmentById = async (id) => {
  try {
    const response = await axiosClient.get(`/api/v1/session/user-segments/${id}`);
    return response.data;
  } catch (error) {
    console.error(`ID: ${id} olan segment çekilirken hata oluştu:`, error);
    throw error;
  }
};

export const getUserSegmentsDashboard = async () => {
  try {
    const response = await axiosClient.get("/api/v1/session/user-segments/dashboard");
    return response.data;
  } catch (error) {
    console.error("Segment dashboard verileri çekilirken hata oluştu:", error);
    throw error;
  }
};
