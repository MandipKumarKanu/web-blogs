import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./components/context/theme-provider";
import { Toaster } from "./components/ui/sonner";
import { lazy, Suspense, useEffect, useState } from "react";
import {
  baseURL,
  customAxios,
  setupInterceptors,
} from "./components/config/axios";
import { useAuthStore } from "./store/useAuthStore";
import { jwtDecode } from "jwt-decode";
import useResetScrollPosition from "./hooks/useResetScrollPosition";
import useCategoryTagStore from "@/store/useCategoryTagStore";
import { Plus } from "lucide-react";
import ErrorBoundary from "./components/ErrorBoundary";
import { useLocalStorage } from "./hooks/use-localStorage";
import Loader from "./components/Loader";
import AboutUs from "./components/AboutUs";
import { TooltipProvider } from "./components/ui/tooltip";

const Home = lazy(() => import("./components/Home"));
const Header = lazy(() => import("./components/Header"));
const Footer = lazy(() => import("./components/Footer"));
const AuthPages = lazy(() => import("./components/AuthPages"));
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const ForgotPassword = lazy(() => import("./components/ForgotPassword"));
const Add = lazy(() => import("./Features/AddBlog"));
const ApproveBlog = lazy(() => import("./Features/ApproveBlog"));
const AllBlog = lazy(() => import("./pages/AllBlog"));
const PopularBlog = lazy(() => import("./pages/PopularBlog"));
const NewBlog = lazy(() => import("./pages/NewBlog"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const TopicPage = lazy(() => import("./pages/TopicPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const FAQPage = lazy(() => import("./components/FAQ"));
const Dashboard = lazy(() => import("./components/layout/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const EditBlog = lazy(() => import("./components/EditBlog"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));

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
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <ErrorBoundary>
        <TooltipProvider>
          <Suspense fallback={<Loader />}>
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
                <Route path="/profile/:id" element={<ProfilePage />} />
                <Route path="/about" element={<AboutUs />} />

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
          </Suspense>
          <Toaster richColors />
        </TooltipProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
