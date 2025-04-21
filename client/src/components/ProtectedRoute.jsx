import React, { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import Loader from "./Loader";
import { jwtDecode } from "jwt-decode";
import { baseURL, customAxios } from "./config/axios";

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token, setUser, setToken, user } = useAuthStore();

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const url = `auth/refresh/`;
        const response = await customAxios.get(`${url}`);
        const newToken = response.data.accessToken;
        const decodedUser = jwtDecode(newToken).user;
        if (newToken) {
          setUser(decodedUser);
          setToken(newToken);
        }
      } catch (error) {
        localStorage.setItem("loggedIn", "");
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    if (!token) {
      fetchAccessToken();
    } else {
      setLoading(false);
    }
  }, [token, setToken, setUser, navigate]);

  if (loading) {
    return <Loader />;
  }

  // if (!token || !user ) {
  //   return <Navigate to="/" replace />;
  // }

  if (token && user) {
    return <Outlet />;
  }
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
