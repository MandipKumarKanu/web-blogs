import React from "react";
import { useNotification } from "@/hooks/useNotification";
import { useAuthStore } from "@/store/useAuthStore";

const Notification = () => {
  const notifications = useNotification();
  const { token } = useAuthStore();

  const handleDismiss = async (index) => {
    try {
      const notification = notifications[index];

      const response = await fetch(
        `/api/notifications/markAsRead/${notification._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      setNotifications((prevNotifications) =>
        prevNotifications.filter((_, i) => i !== index)
      );
    } catch (error) {
      console.error("Error dismissing notification:", error);
      toast.error("Failed to dismiss notification");
    }
  };

  return null;
};

export default Notification;
