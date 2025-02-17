import { create } from "zustand";
import { authSignIn, authSignUp } from "../components/api/user";
import { toast } from "sonner";
import getErrorMessage from "../components/utils/getErrorMsg";
import { jwtDecode } from "jwt-decode";
import { replace } from "react-router-dom";

export const useAuthStore = create((set) => ({
  loading: false,
  error: null,
  token: null,
  user: null,

  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),

  login: async (email, password, navigate) => {
    set({ loading: true, error: null });
    try {
      const response = await authSignIn({ email, password });
      const token = response.data.accessToken;
      const decodedUser = jwtDecode(token).user;
      console.log(decodedUser);
      set({ loading: false, user: decodedUser, token });
      toast.success("Logged-in Successful");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
      set({ error: error, loading: false });
    }
  },

  signUp: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await authSignUp(data);
      const token = response.data.accessToken;
      const decodedUser = jwtDecode(token).user;
      set({ loading: false, user: decodedUser, token });
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error(getErrorMessage(error));

      set({ error: error, loading: false });
    }
  },

  logout: async()=>{
    console.log("logout")
  }
}));
