import axios from "axios";

export const baseURL = "http://localhost:5000/api";

export const customAxios = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL,
  withCredentials: true,
});
