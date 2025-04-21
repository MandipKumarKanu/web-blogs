import { create } from "zustand";
import { customAxios } from "@/components/config/axios";

const useCategoryTagStore = create((set) => ({
  categories: [],
  tags: [],
  loading: false,
  error: null,

  fetchCategoriesAndTags: async () => {
    set({ loading: true, error: null });
    try {
      const categoryResponse = await customAxios.get("/categories?limit=all");
      const tagResponse = await customAxios.get("/tags?limit=all");

      set({
        categories: categoryResponse.data.categories || [],
        tags: tagResponse.data.tags || [],
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching categories and tags:", error);
      set({ error: error.message, loading: false });
    }
  },
}));

export default useCategoryTagStore;
