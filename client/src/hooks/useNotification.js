import { useState, useEffect } from "react";
import { useSocket } from "./useSocket";
import { toast } from "sonner";

export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("newNotification", (notification) => {
      setNotifications((prev) => [
        { ...notification, time: new Date() },
        ...prev,
      ]);

      toast.success(notification.message, {
        duration: 4000,
        position: "top-center",
      });
    });

    return () => {
      socket.off("newNotification");
    };
  }, [socket]);

  return notifications;
};
