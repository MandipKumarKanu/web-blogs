import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const PROD_URL = "/api/api"; //production api
export const DEV_URL = import.meta.env.VITE_DEV_URL; //development api

export const baseURL =  import.meta.env.MODE === "development" ? DEV_URL : PROD_URL;
// export const baseURL = PROD_URL;
// export const baseURL = "https://web-blogs-tau.vercel.app/api";

export const customAxios = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  baseURL,
});

export const setupInterceptors = (getToken, setToken, updateUser) => {
  let tokenPromise = new Promise((resolve) => {
    const token = getToken();
    if (token) {
      resolve(token);
    } else {
      resolve(null);
    }
  });

  customAxios.interceptors.request.use(
    async (config) => {
      const token = await tokenPromise;
      if (token) {
        const decoded = jwtDecode(token);
        // console.log(decoded, "axios");
        config.headers.Authorization =` Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  customAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._isRetry) {
        originalRequest._isRetry = true;
        try {
          const response = await axios.get(`${baseURL}/auth/refresh`, {
            withCredentials: true,
          });

          const { accessToken } = response.data;
          const decodedUser = jwtDecode(accessToken).user;

          setToken(accessToken);
          updateUser(decodedUser);

          tokenPromise = Promise.resolve(accessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return customAxios(originalRequest);
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    }
  );
};

