import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
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
import Loader from "./components/Loader";
import ProtectedRoute from "./components/ProtectedRoute";
import FAQPage from "./components/FAQ";
import SearchComponent from "./components/SearchComponent";
import Dashboard from "./components/layout/Dashboard";
import useCategoryTagStore from "@/store/useCategoryTagStore";
import { Plus } from "lucide-react";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import { useLocalStorage } from "./hooks/use-localStorage";
const EditBlog = lazy(() => import("./components/EditBlog"));

const App = () => {
  const { token, setUser, setToken, user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [name, setName] = useLocalStorage("interest", []);

  const {
    fetchCategoriesAndTags,
    categories,
    tags,
    loading: categoryTagLoading,
  } = useCategoryTagStore();

  useEffect(() => {
    setupInterceptors(() => token, setToken, setUser);
  }, []);

  useResetScrollPosition(location);

  useEffect(() => {
    const fetchAccessToken = async () => {
      setLoading(true);
      try {
        const url = `auth/refresh/`;
        const response = await customAxios.get(`${url}`);
        const token = response.data.accessToken;
        const decodedUser = jwtDecode(token).user;
        if (token) {
          setUser(decodedUser);
          setToken(token);
          setName(decodedUser.interests);
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

  useEffect(() => {
    fetchCategoriesAndTags();
  }, []);

  if (loading || categoryTagLoading) {
    return <Loader />;
  }

  const isAdminRoute = location.pathname.startsWith("/admin");

  const canAddBlog =
    token && user && (user.role === "admin" || user.role === "author");

  return (
    <ThemeProvider defaultTheme="light">
      <ErrorBoundary>
        {!isAdminRoute && <Header />}
        <div className="min-h-[100dvh] relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<AllBlog />} />
            <Route path="/blog/:id" element={<BlogPage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/popular" element={<PopularBlog />} />
            <Route path="/topics" element={<TopicPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forget" element={<ForgotPassword />} />
            <Route path="/new" element={<NewBlog />} />
            <Route path="/faq" element={<FAQPage />} />

            <Route element={<ProtectedRoute />}>
              <Route
                path="/admin/*"
                element={
                  user?.role === "admin" ? (
                    <Dashboard />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
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
            <Route path="*" element={<NotFound />} />
          </Routes>

          {canAddBlog && (
            <button
              onClick={() => navigate("/add")}
              title="Add Blog"
              className="fixed bottom-8 right-8 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-dark transition"
            >
              <Plus className="h-6 w-6" />
            </button>
          )}
        </div>
        {!isAdminRoute && <Footer />}
        <Toaster richColors />
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
