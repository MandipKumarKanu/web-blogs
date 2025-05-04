# 🚀 Future Blogs – Blogging Platform Backend

Welcome to the **Future Blogs** backend! This is a Node.js/Express REST API for a modern blogging platform 📝, supporting features like user authentication 🔐, blog publishing 📬 (including scheduled posts ⏰), categories 📂, tags 🏷️, comments 💬, notifications 🔔, statistics 📊, and more. The backend is built with MongoDB 🍃 (via Mongoose), JWT authentication 🛡️, and includes both scheduled and upcoming real-time features ⚡.

## 📚 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🔐 Environment Variables](#-environment-variables)
- [📡 API Overview](#-api-overview)
- [⏱️ Scheduled Publishing (Cron)](#️-scheduled-publishing-cron)
- [💬 Socket.IO (Upcoming Real-time)](#-socketio-upcoming-real-time)
- [🧪 Development](#-development)
- [🚀 Deployment](#-deployment)
- [📄 License](#-license)
- [🤝 Contributing](#-contributing)
- [📞 Contact](#-contact)

## ✨ Features

- 🔐 **User Authentication**: Register, login, JWT-based auth, role-based access (user, author, admin)
- 📝 **Blog Management**: Create, update, delete, like, share, and schedule blogs
- ⏱️ **Scheduled Publishing**: Blogs can be scheduled for future publication (auto-published via cron)
- 📂 **Categories & Tags**: Organize blogs with categories and tags (admin managed)
- 💬 **Comments**: Nested comments, like/unlike, delete, and update
- 🔔 **Notifications**: User notifications for events (e.g., likes)
- 📊 **Statistics**: Admin dashboard for stats (total users, blogs, categories, tags, recent activity)
- 🔍 **Search & Recommendations**: Search blogs by tags, query, and get personalized or random recommendations
- ⚡ **Real-time (Socket.IO)**: Socket.IO setup is ready for real-time features like notifications (integration upcoming)
- 🛡️ **Admin Panel Support**: Admin endpoints for managing users, blogs, categories, and tags

## 🛠️ Tech Stack

- **Node.js** & **Express** – REST API server ⚙️
- **MongoDB** & **Mongoose** – Database & ODM 🍃
- **JWT** – Authentication 🛡️
- **bcryptjs** – Password hashing 🔑
- **node-cron** – Scheduled tasks ⏲️
- **Socket.IO** – Real-time features 🔌
- **CORS** – Cross-origin resource sharing 🌐
- **dotenv** – Environment variable management 🧪

## 📁 Project Structure

```
backend/
│
├── controllers/         # Route handlers (business logic)
├── middleware/          # Auth, role, and user middlewares
├── models/              # Mongoose schemas (User, Blog, Category, Tag, Comment, Notification)
├── routes/              # Express route definitions
├── utils/               # Helper utilities (e.g., HTML styling, user interests)
├── config/              # Database connection
├── corn.js              # Cron job for scheduled publishing
├── index.js             # Main server entry point
├── package.json         # Dependencies and scripts
├── .env.example         # Example environment variables
└── ...                  # Other supporting files
```

## 🔐 Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
MONGO_URI=mongodb://localhost:27017/blog
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_jwt_secret
PORT=5000
IMGBB_API_KEY=your_imgbb_api_key
GEMINI_API_KEY=your_gemini_api_key
```

## 📡 API Overview

➡️ Full list of APIs for features like authentication, blogs, categories, tags, comments, notifications, and statistics is available in the respective sections below.

Use tools like **Postman** or **Thunder Client** to test and explore the endpoints! 🧪

## ⏱️ Scheduled Publishing (Cron)

- **File:** [`corn.js`](corn.js)
- **How it works:** Every 5 minutes, a cron job checks for blogs with `status: "scheduled"` and a `scheduledPublishDate` in the past. These blogs are automatically published ✅.
- **Activation:** The cron job runs automatically in production (see [`index.js`](index.js)).

## 💬 Socket.IO (Upcoming Real-time)

- **File:** [`socket.js`](socket.js)
- **Purpose:** Prepared for future integration of real-time features such as instant notifications 🔔, live comments 💬, etc.
- **Status:** Socket.IO is not yet active but will be enabled in an upcoming update 🔄.

## 🧪 Development

1. **Install dependencies:**

```bash
npm install
```

2. **Set up your `.env` file** (see [Environment Variables](#-environment-variables)).

3. **Run the server in development:**

```bash
npm run dev
```

4. **API will be available at:**
   `http://localhost:5000/api/`

## 🚀 Deployment

- **Production:**
  - The cron job for scheduled publishing runs automatically
  - CORS is configured for your deployed frontend domains 🌐
  - See [`vercel.json`](vercel.json) for Vercel deployment config (if using Vercel)

## 📄 License

This project is open-source and available under the [MIT License](LICENSE) 📃.

## 🤝 Contributing

Pull requests and issues are welcome! 🙌 Please open an issue to discuss your ideas 💡 or report bugs 🐞.

## 📞 Contact

For questions or support, please contact [mandipkk.com.np](https://mandipkk.com.np) 📬 or open an issue on the repository.
