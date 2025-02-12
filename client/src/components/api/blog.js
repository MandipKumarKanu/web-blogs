import { baseURL, customAxios } from "../config/axios";

export async function createBlog(data) {
  const url = "blogs/";
  return customAxios.post(`${baseURL}/${url}`, data);
}

export async function fetchBlog(data) {
  const url = "blogs/";
  return customAxios.get(`${baseURL}/${url}`, {
    params: {
      page: data.pg,
      limit: data.limit,
    },
  });
}

export async function getUnApprovedBlog(data) {
  console.log(data);
  const url = `blogs/unapproved?page=${data.pg}&limit=${data.limit}`;
  return customAxios.get(`${baseURL}/${url}`);
}

export async function approveBlog(blogId) {
  console.log(blogId);
  const url = `blogs/${blogId}/approve`;
  return customAxios.patch(`${baseURL}/${url}`);
}

export async function rejectBlog(blogId) {
  const url = `blogs/${blogId}/reject`;
  return customAxios.patch(`${baseURL}/${url}`);
}
