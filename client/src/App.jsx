import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/context/theme-provider";
import Home from "./components/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AuthPages from "./components/AuthPages";
import Login from "./components/Login";
import Register from "./components/Register";
import { Toaster } from "./components/ui/sonner";
import ForgotPassword from "./components/ForgotPassword";
import Add from "./Features/AddBlog";
import { useEffect } from "react";
import {
  baseURL,
  customAxios,
  setupInterceptors,
} from "./components/config/axios";
import { useAuthStore } from "./store/useAuthStore";
import { jwtDecode } from "jwt-decode";
import ApproveBlog from "./Features/ApproveBlog";

const App = () => {
  const { token, setUser, setToken } = useAuthStore();
  useEffect(() => {
    setupInterceptors(() => token, setToken, setUser);
  }, []);

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const url = `/auth/refresh/`;
        const response = await customAxios.get(`${baseURL}${url}`);
        const token = response.data.accessToken;
        const decodedUser = jwtDecode(token).user;
        if (token) {
          setUser(decodedUser);
          setToken(token);
        }
      } catch (error) {
        localStorage.setItem("loggedIn", "");
      } finally {
      }
    };

    if (!token) {
      fetchAccessToken();
    } else {
      // setLoading(false);
    }
  }, [token, setToken, setUser]);
  return (
    <ThemeProvider defaultTheme="light">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/allblogs" element={<ApproveBlog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget" element={<ForgotPassword />} />
          <Route path="/add" element={<Add />} />
        </Routes>
        <Footer />
        <Toaster richColors />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
