import React from "react";
import { Bell, XCircle, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotification } from "@/hooks/useNotification";
import { useAuthStore } from "@/store/useAuthStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-hot-toast";

const Notification = () => {
  const notifications = useNotification();
  const { token } = useAuthStore();

  const handleDismiss = async (id) => {
    try {
      const response = await fetch(`/api/notifications/markAsRead/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      toast.success("Notification marked as read");
    } catch (error) {
      console.error("Error dismissing notification:", error);
      toast.error("Failed to dismiss notification");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative rounded-full p-2 hover:bg-accent"
          aria-label="Notifications"
        >
          <Bell className="h-6 w-6" />
          {notifications.length > 0 && (
            <Badge className="absolute -top-1 -right-1 rounded-full bg-red-500 text-white text-xs p-1">
              {notifications.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 max-h-96 overflow-auto">
        <div className="p-4">
          <h4 className="text-lg font-semibold">Notifications</h4>
        </div>
        <Separator />
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No new notifications
          </div>
        ) : (
          notifications &&
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification._id}
              className="flex items-start gap-3"
            >
              <div className="flex-grow">
                <p className="text-sm">{notification.message}</p>
                <span className="text-xs text-muted-foreground">
                  {new Date(notification.timestamp).toLocaleString()}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDismiss(notification._id)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Dismiss notification"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notification;
