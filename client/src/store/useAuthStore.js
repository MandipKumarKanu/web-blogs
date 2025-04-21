import { create } from "zustand";
import { authSignIn, authSignUp } from "../components/api/user";
import { toast } from "sonner";
import getErrorMessage from "../components/utils/getErrorMsg";
import { jwtDecode } from "jwt-decode";
import { replace } from "react-router-dom";
import { customAxios } from "@/components/config/axios";

export const useAuthStore = create((set) => ({
  loading: false,
  error: null,
  token: null,
  user: null,

  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),

  login: async (email, password, navigate, setName) => {
    set({ loading: true, error: null });
    try {
      const response = await authSignIn({ email, password });
      const token = response.data.accessToken;
      const decodedUser = jwtDecode(token).user;
      setName(decodedUser.interests);
      console.log(decodedUser);
      set({ loading: false, user: decodedUser, token });
      toast.success("Logged-in Successful");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
      set({ error: error, loading: false });
    }
  },

  signUp: async (data, navigate) => {
    set({ loading: true, error: null });
    try {
      const response = await authSignUp(data);
      const token = response.data.accessToken;
      console.log(token);
      const decodedUser = jwtDecode(token).user;
      set({ loading: false, user: decodedUser, token });
      toast.success(response.data.message);
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
      toast.error(getErrorMessage(error));
      set({ error: error, loading: false });
    }
  },

  logout: async (navigate) => {
    try {
      await customAxios.get("auth/logout");

      localStorage.removeItem("loggedIn");
      localStorage.removeItem("interest");

      set({ token: null, user: null, loading: false, error: null });

      navigate("/", { replace: true });

      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Failed to log out. Please try again.");
    }
  },
}));
