import axios from "axios";
import { baseURL } from "../config/axios";

export async function authSignUp(data) {
  const url = "auth/register";
  return axios.post(`${baseURL}/${url}`, data);
}

export async function authSignIn(data) {
  const url = "auth/login";
  return axios.post(`${baseURL}/${url}`, data);
}
