import axios from "axios";
import { baseURL, customAxios } from "../config/axios";

export async function authSignUp(data) {
  const url = "auth/register";
  return axios.post(`${baseURL}/${url}`, data);
}

export async function authSignIn(data) {
  const url = "auth/login";
  return customAxios.post(`${baseURL}/${url}`, data);
}
