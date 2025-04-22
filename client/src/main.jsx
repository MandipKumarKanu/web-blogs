import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { setupInterceptors } from "@/components/config/axios";
import { useAuthStore } from "@/store/useAuthStore";
import "./index.css";

setupInterceptors(
  () => useAuthStore.getState().token,
  useAuthStore.getState().setToken,
  useAuthStore.getState().setUser
);

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);


