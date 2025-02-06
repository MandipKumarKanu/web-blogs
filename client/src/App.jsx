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
import Add from "./components/Blog/Add";
// import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <ThemeProvider defaultTheme="light">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
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
