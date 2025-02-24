import {
  fetchBlog,
  getUnApprovedBlog,
  approveBlog,
  rejectBlog,
  getLatestBlogsByViews,
  getPopularBlogs,
  popMonth,
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
  weekLoad: true,
  weekError: true,
  weeklyPopularBlogs: [],
  popularMonthBlog: [],
  popLoading: true,
  popError: null,

  getAllBlogs: async (pg, limit) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchBlog({ pg, limit });
      const { blogs, currentPage, totalPages } = response.data;
      set({ loading: false, blogs, totalPages, currentPage, error: null });
      return blogs;
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },

  getAllPopular: async (pg, limit) => {
    set({ loading: true, error: null });
    try {
      const response = await getPopularBlogs();
      const { blogs } = response.data;
      set({ loading: false, blogs, error: null });
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },

  getWeeklyPop: async () => {
    set({ weekLoad: true, weekError: null });
    try {
      const response = await getLatestBlogsByViews();
      const { blogs } = response.data;
      set({ weekLoad: false, weeklyPopularBlogs: blogs, weekError: null });
    } catch (error) {
      set({ weekError: getErrorMessage(error), weekLoad: false });
    }
  },

  getPopularMonthBlog: async () => {
    set({ popLoading: true, popError: null });
    try {
      const response = await popMonth();
      const { blogs } = response.data;
      set({ popLoading: false, popularMonthBlog: blogs, popError: null });
    } catch (error) {
      set({ popError: getErrorMessage(error), popLoading: false });
    }
  },

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
