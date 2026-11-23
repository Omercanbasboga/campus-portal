import axiosClient from "./axiosClient";

export const getAllUserProfiles = async () => {
  try {
    const response = await axiosClient.get("/api/v1/session/user-profiles");
    return response.data;
  } catch (error) {
    console.error("Kullanıcı profilleri çekilirken hata oluştu:", error);
    throw error;
  }
};

export const getUserProfileById = async (id) => {
  try {
    const response = await axiosClient.get(`/api/v1/session/user-profiles/${id}`);
    return response.data;
  } catch (error) {
    console.error(`ID: ${id} olan kullanıcı profili çekilirken hata oluştu:`, error);
    throw error;
  }
};

export const getUserProfilesDashboard = async (topN = 10) => {
  try {
    const response = await axiosClient.get("/api/v1/session/user-profiles/dashboard", {
      params: { topN },
    });
    return response.data;
  } catch (error) {
    console.error("Kullanıcı profilleri dashboard verileri çekilirken hata oluştu:", error);
    throw error;
  }
};
