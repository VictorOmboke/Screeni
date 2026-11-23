import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:26000/api",
  withCredentials: true,
});

// Attach token to headers before outgoing requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle access token refresh after response or error
api.interceptors.response.use(
  // Pass response through for any 2xx status code
  (response) => response,
  // Triggered by any 4xx or 500 status code
  async (error) => {
    const originalRequest = error.config; // Store request details

    // Catch 401 error codes and avoid infinite retry loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Call refresh token route
      try {
        const res = await axios.post(
          "http://localhost:26000/api/auth/refresh-token",
          {},
          { withCredentials: true } // Ensure refresh token is sent along with request
        );

        // Generate new access token
        const newAccessToken = res.data.accessToken;
        localStorage.setItem("token", newAccessToken);

        // Retry the request with a new access token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, remove the token and direct user to login page
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Pass rejection along for all other error status codes
    return Promise.reject(error);
  }
);

export default api;
