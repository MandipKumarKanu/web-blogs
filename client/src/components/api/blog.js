import axios from "axios";
import { baseURL, customAxios } from "../config/axios";

export async function createBlog(data) {
  const url = "blogs/";
  return customAxios.post(`${url}`, data);
}

export async function fetchBlog(data) {
  const url = `blogs/?page=${data.pg}&limit=${data.limit}`;
  return customAxios.get(`${url}`);
}

export async function getUnApprovedBlog(data) {
  console.log(data);
  const url = `blogs/unapproved?page=${data.pg}&limit=${data.limit}`;
  return customAxios.get(`/${url}`);
}

export async function approveBlog(blogId) {
  console.log(blogId);
  const url = `blogs/${blogId}/approve`;
  return customAxios.patch(`$${url}`);
}

export async function rejectBlog(blogId) {
  const url = `blogs/${blogId}/reject`;
  return customAxios.patch(`${url}`);
}

export async function getLatestBlogsByViews() {
  const url = `blogs/popular/views`;
  return axios.get(`${baseURL}/${url}`);
}

export async function getPopularBlogs(data) {
  const url = `blogs/popular?page=${data.pg}&limit=${data.limit}`;
  return axios.get(`${baseURL}/${url}`);
}

export async function getBlogById(id) {
  const url = `blogs/${id}`;
  return axios.get(`${baseURL}/${url}`);
}

export async function summarizeBlog(id) {
  const url = `blogs/summarize/${id}`;
  return axios.get(`${baseURL}/${url}`);
}

export async function popMonth() {
  const url = `blogs/popularmonth/`;
  return axios.get(`${baseURL}/${url}`);
}

export async function getRecommended(id, bId) {
  const url = `blogs/recommended/${id}`;
  return customAxios.post(`${url}`, { bId });
}

export async function likeBlog(id, status = undefined) {
  const url = `blogs/like/${id}`;
  return customAxios.post(`${url}`, {
    status,
  });
}

export async function incView(id) {
  const url = `blogs/views/${id}`;
  return axios.patch(`${baseURL}/${url}`);
}

export async function incShare(id) {
  const url = `blogs/shares/${id}`;
  return axios.patch(`${baseURL}/${url}`);
}

export async function getByCategory(categoryId, page = 1, limit = 15) {
  const url = `blogs/filter?category=${categoryId}&page=${page}&limit=${limit}`;
  return axios.get(`${baseURL}/${url}`);
}

export async function getByCategoryGrp(cts) {
  const url = `blogs/by-categories`;
  return axios.post(`${baseURL}/${url}`, cts);
}

export async function onUpdateBlog(blogId, data) {
  const url = `blogs/${blogId}`;
  return customAxios.patch(`${url}`, data);
}

export async function deleteBlog(blogId, data) {
  const url = `blogs/${blogId}`;
  return customAxios.delete(`${url}`, data);
}
