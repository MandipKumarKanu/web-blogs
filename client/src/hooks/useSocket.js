import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";

const SOCKET_URL ="http://localhost:5000";

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const { token, user } = useAuthStore();

  useEffect(() => {
    if (!token || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }
    const newSocket = io(SOCKET_URL, {
      auth: {
        token,
      },
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      if (user.id) {
        newSocket.emit("joinRoom", user.id);
      }
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    newSocket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [token, user]);

  return socket;
};
