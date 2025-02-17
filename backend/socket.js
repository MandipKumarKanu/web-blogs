const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

function setupSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      // Remove 'Bearer ' prefix if present
      const tokenString = token.startsWith("Bearer ") ? token.slice(7) : token;

      try {
        const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);

        if (!decoded || !decoded.user || !decoded.user.id) {
          return next(new Error("Authentication error: Invalid token"));
        }

        const user = await User.findById(decoded.user.id);

        if (!user) {
          return next(new Error("Authentication error: User not found"));
        }

        // Attach user to socket
        socket.user = user;
        next();
      } catch (jwtError) {
        console.error("JWT Verification failed:", jwtError);
        return next(new Error("Authentication error: Invalid token"));
      }
    } catch (error) {
      console.error("Socket authentication error:", error);
      return next(new Error("Authentication error: " + error.message));
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.user.id);

    socket.on("joinRoom", (userId) => {
      // Verify the user is joining their own room
      if (socket.user.id.toString() === userId.toString()) {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
      } else {
        console.warn(`User ${socket.user.id} attempted to join room ${userId}`);
      }
    });

    socket.on("error", (error) => {
      console.error("Socket error for user", socket.user.id, ":", error);
    });

    socket.on("disconnect", (reason) => {
      console.log("User disconnected:", socket.user.id, "Reason:", reason);
    });
  });

  return io;
}

module.exports = setupSocket;
