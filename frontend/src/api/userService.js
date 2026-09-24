import axiosClient from "./axiosClient";

const userService = {
  signUp: async (userData) => {
    const response = await axiosClient.post("/user/register", userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await axiosClient.post("/user/login", credentials);
    return response.data;
  },

  logout: async () => {
    const response = await axiosClient.post("/user/logout");
    return response.data;
  },

  // Exchange the httpOnly refresh cookie for a fresh access cookie + current user
  refresh: async () => {
    const response = await axiosClient.post("/user/refresh");
    return response.data;
  },

  // Return the current user based on the access-token cookie
  getMe: async () => {
    const response = await axiosClient.get("/user/me");
    return response.data;
  },

  // Update profile username and/or profile picture (multipart/form-data)
  updateProfile: async (formData) => {
    const response = await axiosClient.put("/user/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};

export default userService;
