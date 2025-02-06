import { create } from "zustand";
import { authSignIn, authSignUp } from "../api/user";
import { toast } from "sonner";
import getErrorMessage from "../utils/getErrorMsg";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: null,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await authSignIn({ email, password });
      console.log(response.data);
      set({ loading: false, user: response.data.accessToken });
      toast.success("Logged-in Successful");
    } catch (error) {
      toast.error(getErrorMessage(error));
      set({ error: error, loading: false });
    }
  },

  signUp: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await authSignUp(data);
      console.log(response);
      set({ loading: false, user: response.data.accessToken });
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error(getErrorMessage(error));

      set({ error: error, loading: false });
    }
  },
}));
