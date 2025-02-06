import toast from "react-hot-toast";

export const ShowToast = (type, message) => {
  return toast[type](message, {
    style: {
      border: "1px solid hsl(var(--border))",
      backgroundColor: "hsl(var(--background))",
      padding: "12px",
      color: "hsl(var(--foreground))",
      fontSize: "14px",
    },
    iconTheme: {
      primary: "hsl(var(--primary))",
      secondary: "hsl(var(--secondary))",
    },
    duration: 3000,
  });
};
