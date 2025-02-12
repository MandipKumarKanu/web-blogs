import {
  fetchBlog,
  getUnApprovedBlog,
  approveBlog,
  rejectBlog,
} from "@/components/api/blog";
import getErrorMessage from "@/components/utils/getErrorMsg";
import { toast } from "sonner";
import { create } from "zustand";

export const useBlogStore = create((set) => ({
  loading: true,
  error: null,
  blogs: [],
  totalPages: 1,
  currentPage: 1,

  getBlogs: async (pg, limit) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchBlog(pg, limit);
      const { blogs, currentPage, totalPages } = response.data;
      set({ loading: false, blogs, totalPages, currentPage });
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },

  getUnBlogs: async (pg, limit) => {
    set({ loading: true, error: null });
    try {
      const response = await getUnApprovedBlog({ pg, limit });
      const { blogs, currentPage, totalPages } = response.data;
      set({ loading: false, blogs, totalPages, currentPage, error: null });
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },

  approveBlog: async (blogId) => {
    set({ loading: true, error: null });
    try {
      await approveBlog(blogId);
      toast.success("Blog Approved Successfully");
      set((state) => ({
        blogs: state.blogs.filter((blog) => blog._id !== String(blogId)),
        loading: false,
        error: null,
      }));
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });
      toast.error(getErrorMessage(error));
    }
  },

  rejectBlog: async (blogId) => {
    set({ loading: true, error: null });
    try {
      await rejectBlog(blogId);
      toast.success("Blog Rejected Successful");
      set((state) => ({
        blogs: state.blogs.filter((blog) => blog._id !== String(blogId)),
        loading: false,
        error: null,
      }));
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });
      toast.error(getErrorMessage(error));
    }
  },
}));
