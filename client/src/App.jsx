import { Route, Routes, useLocation } from "react-router-dom";
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
import { lazy, Suspense, useEffect, useState } from "react";
import {
  baseURL,
  customAxios,
  setupInterceptors,
} from "./components/config/axios";
import { useAuthStore } from "./store/useAuthStore";
import { jwtDecode } from "jwt-decode";
import ApproveBlog from "./Features/ApproveBlog";
import AllBlog from "./pages/AllBlog";
import PopularBlog from "./pages/PopularBlog";
import NewBlog from "./pages/NewBlog";
import BlogPage from "./pages/BlogPage";
import useResetScrollPosition from "./hooks/useResetScrollPosition";
import TopicPage from "./pages/TopicPage";
import CategoryPage from "./pages/CategoryPage";
import ProfilePage from "./pages/ProfilePage";
import Notification from "./components/Notification";
// import ProtectedRoute from "./components/ProtectedRoute";
import Loader from "./components/Loader";
import ProtectedRoute from "./components/ProtectedRoute";
import FAQPage from "./components/FAQ";
const EditBlog = lazy(() => import("./components/EditBlog"));

const App = () => {
  const { token, setUser, setToken } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setupInterceptors(() => token, setToken, setUser);
  }, []);

  const location = useLocation();
  useResetScrollPosition(location);

  useEffect(() => {
    const fetchAccessToken = async () => {
      setLoading(true);
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
        setLoading(false);
      }
    };

    if (!token) {
      fetchAccessToken();
    } else {
      setLoading(false);
    }
  }, [token, setToken, setUser]);

  if (loading) {
    return <Loader />;
  }

  return (
    <ThemeProvider defaultTheme="light">
      <Header />
      <div className="min-h-[100dvh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<AllBlog />} />
          <Route path="/blog/:id" element={<BlogPage />} />
          <Route path="/category/:name" element={<CategoryPage />} />
          <Route path="/popular" element={<PopularBlog />} />
          <Route path="/topics" element={<TopicPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget" element={<ForgotPassword />} />
          <Route path="/new" element={<NewBlog />} />
          <Route path="/faq" element={<FAQPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/add" element={<Add />} />
            <Route path="/allblogs" element={<ApproveBlog />} />
            <Route
              path="/edit/:blogId"
              element={
                <Suspense fallback={<div>Loading editor...</div>}>
                  <EditBlog />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </div>
      <Footer />
      <Toaster richColors />
    </ThemeProvider>
  );
};

export default App;
