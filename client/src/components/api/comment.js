import axios from "axios";
import { baseURL, customAxios } from "../config/axios";

export async function fetchCommentByBlog(blogId) {
  const url = `comment/${blogId}`;
  return axios.get(`${baseURL}/${url}`);
}

export async function createComment(blogId, content, parentComment = null) {
  const url = `comment`;
  return customAxios.post(`${baseURL}/${url}`, {
    blogId,
    content,
    parentComment,
  });
}

export async function updateComment(cId, content) {
  const url = `comment/${cId}`;
  return customAxios.patch(`${baseURL}/${url}`, {
    content,
  });
}

export async function deleteComment(cId) {
  const url = `comment/${cId}`;
  return customAxios.delete(`${baseURL}/${url}`);
}
