# ✨ FutureBlog ✨

> 🚀 A modern, full-featured blogging platform designed to empower creators, readers, and innovators! Built with a sleek React frontend and a robust Node.js backend, it offers a responsive UI, real-time features, and advanced tools such as AI summarization and personalized recommendations.

## 📋 Table of Contents

1. [✨ Features](#-features)
2. [🛠️ Tech Stack](#️-tech-stack)
3. [🧰 Tools & Dependencies](#-tools--dependencies)
4. [🏗️ Architecture Overview](#️-architecture-overview)
5. [📂 Project Structure](#-project-structure)
6. [🚀 Getting Started](#-getting-started)
7. [⚙️ Available Scripts](#️-available-scripts)
8. [🔗 REST API Reference](#-rest-api-reference)
9. [🧠 State Management](#-state-management)
10. [🎨 Styling & UI Libraries](#-styling--ui-libraries)
11. [🧪 Testing](#-testing)
12. [☁️ Deployment](#️-deployment)
13. [🚦 CI/CD Pipeline](#-cicd-pipeline)
14. [🤝 Contributing](#-contributing)
15. [📜 License](#-license)
16. [🙌 Acknowledgements](#-acknowledgements)
17. [📬 Contact](#-contact)

---

## ✨ Features

- 🖥️ **Modern UI**: Responsive, accessible design with TailwindCSS, shadcn/ui, and Radix
- 🔒 **Authentication & Authorization**: Secure signup/login with JWT & refresh tokens, role-based access
- 📝 **Rich Text Editor**: Blog creation with CKEditor 5, image uploads, scheduling, categories & tags
- ⏰ **Scheduling**: Plan your content calendar by scheduling posts for future publication
- 💬 **Nested Comments**: Real-time threaded discussions—reply, edit, delete comments
- 🤖 **AI Summarization**: Auto-generated blog summaries via Gemini API
- 🧠 **Personalized Recommendations**: Smart suggestions based on reading history and preferences
- 📈 **Trending & Recent**: Discover what's popular and fresh at a glance
- 🔍 **Search & Filter**: Find exactly what you're looking for with powerful search tools
- 📱 **Social Sharing**: Spread your content with one-click sharing to major platforms
- 📊 **User Dashboard**: Track performance metrics and manage all your content
- 👑 **Admin Panel**: Comprehensive tools for content moderation and user management
- ♿ **Accessibility**: Built with inclusivity in mind for all users
- 🌓 **Dark Mode**: Easy on the eyes with theme persistence

---

## 🛠️ Tech Stack

| Layer          | Technology                                                   |
| -------------- | ------------------------------------------------------------ |
| Frontend       | ⚛️ React 18, 🧭 React Router v6, 🐻 Zustand, 🎨 TailwindCSS  |
| UI Libraries   | 🧩 shadcn/ui, 🔘 Radix UI, 🎭 Lucide Icons, ✨ Framer Motion |
| Text Editor    | 📝 CKEditor 5                                                |
| Backend        | 🟢 Node.js, 🚂 Express                                       |
| Database       | 🍃 MongoDB, 🦅 Mongoose                                      |
| Authentication | 🔑 JWT, 🔒 bcrypt, 🍪 HTTP-only secure cookies               |
| AI Services    | 🧠 Gemini API                                                |
| Utilities      | 🔄 axios, 📅 date-fns, ✅ zod, 📋 react-hook-form            |

---

## 🧰 Tools & Dependencies

- 📦 **Package Manager**: npm
- ✅ **Validation**: Zod for schema validation (frontend)
- 📋 **Forms**: react-hook-form for accessible, performant forms
- 🔄 **Version Control**: Git, GitHub
- 🚦 **CI/CD**: GitHub Actions
- ☁️ **Deployment**: Vercel (client), also Vercel for API using MongoDB Cluster URI

---

## 🏗️ Architecture Overview

FutureBlog follows a client–server model:

1. **Client (React)**:

   - SPA using React Router for navigation
   - Zustand for global state management
   - Communicates via REST API

2. **Server (Node.js/Express)**:

   - Modularized route controllers
   - Middleware (auth, error-handling)
   - Service layer for business logic

3. **Database (MongoDB)**:
   - Collections for Users, Blogs, Comments, Tags, Categories
   - Mongoose schemas enforcing relationships and validation

---

## 📂 Project Structure

```bash
futureblog/
├─ client/             # 🖥️ React application
│  ├─ public/          # 🌐 Static assets
│  └─ src/
│     ├─ components/   # 🧩 Reusable UI components
│     ├─ features/     # 🛠️ Domain-specific modules
│     ├─ hooks/        # 🪝 Custom React hooks
│     ├─ lib/          # 🔧 Utilities & API clients
│     ├─ pages/        # 📄 Route components
│     ├─ store/        # 🗄️ Zustand stores
│     ├─ styles/       # 🎨 Tailwind and global CSS
│     └─ main.jsx, App.jsx  # ⚛️ Entry & root component
├─ server/             # 🖧 Node.js API
│  ├─ controllers/     # 🎮 Request handlers
│  ├─ models/          # 📊 Mongoose schemas
│  ├─ routes/          # 🛣️ Express route definitions
│  ├─ middleware/      # 🔍 Auth, error handling, logging
│  ├─ services/        # ⚙️ Business logic / DB access
│  ├─ utils/           # 🔧 Helpers & validators
│  ├─ config/          # ⚙️ Env configuration
│  └─ app.js, server.js# 🚀 Startup scripts
└─ .github/            # 🔄 CI/CD workflows
```

---

## 🚀 Getting Started

### 📋 Prerequisites

- 🟢 Node.js v18+ and npm
- 🍃 MongoDB Atlas or local MongoDB instance
- 🧠 Gemini API key
- ☁️ Cloudinary API key

### 💻 Installation

1. **Clone the repo**:

```bash
git clone https://github.com/MandipKumarKanu/AI-mern-blog.git
```

2. **Backend setup**:

```bash
cd AI-mern-blog/server
npm install
```

3. **Frontend setup**:

```bash
cd ../client
npm install
```

### 🔐 Environment Variables

Create `.env` files in both `server/` and `client/`:

**server/.env**

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/futureblog
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_jwt_secret
PORT=5000
IMGBB_API_KEY=your_imgbb_api_key
GEMINI_API_KEY=your_gemini_api_key
```

**client/.env**

```env
VITE_API_URL=http://localhost:5000/api
VITE_IMGBB_API_KEY=your_imgbb_api_key
```

### 🏃‍♂️ Running the App

**Start the server:**

```bash
cd server
node index.js # nodejs
# or
npm run dev  # nodemon or ts-node
```

**Start the client:**

```bash
cd client
npm run dev
```

- 🌐 Open http://localhost:5173 in your browser.

---

## ⚙️ Available Scripts

| Command         | Directory | Description                                  |
| --------------- | --------- | -------------------------------------------- |
| `npm run dev`   | server    | 🔄 Start API server in development (nodemon) |
| `npm start`     | server    | 🚀 Start API server in production            |
| `npm run build` | client    | 🏗️ Build React app for production            |
| `npm run dev`   | client    | 🖥️ Start React app for development           |

---

## 🔗 REST API Reference

### 🔐 Authentication

- **POST** `/api/auth/register` — Register new user
- **POST** `/api/auth/login` — Login, returns access + refresh tokens
- **POST** `/api/auth/refresh` — Refresh access token
- **GET** `/api/auth/profile` — Get current user profile

### 📝 Blogs

- **GET** `/api/blogs` — List blogs (pagination, filters)
- **GET** `/api/blogs/:id` — Retrieve single blog
- **POST** `/api/blogs` — Create new blog (auth)
- **PATCH** `/api/blogs/:id` — Update blog (owner/admin)
- **DELETE** `/api/blogs/:id` — Delete blog (owner/admin)

### 💬 Comments

- **GET** `/api/blogs/:id/comments` — List comments
- **POST** `/api/blogs/:id/comments` — Add comment (auth)
- **PATCH** `/api/comments/:commentId` — Edit comment
- **DELETE** `/api/comments/:commentId` — Delete comment

### 👑 Admin

- **GET** `/api/admin/pending-blogs` — List unapproved posts
- **PATCH** `/api/admin/blogs/:id/approve` — Approve blog
- **PATCH** `/api/admin/blogs/:id/reject` — Reject blog with reason
- **GET** `/api/admin/users` — Manage users

---

## 🧠 State Management

Used **Zustand** for lightweight, performant global state:

```js
// src/store/authStore.js
import create from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}));
```

✨ Custom hooks wrap API calls and store updates to keep components slim.

---

## 🎨 Styling & UI Libraries

- 🎨 **TailwindCSS** for utility-first styling
- 🧩 **shadcn/ui**: Accessible React components
- 🔘 **Radix UI** primitives for low-level control
- 🎭 **Lucide Icons**: Feather-inspired SVG icons
- ✨ **Framer Motion** for smooth animations

---

## ☁️ Deployment

- 🖥️ **Client**: Deployed on Vercel (automatic on push to main)
- 🖧 **Server**: Hosted on Vercel (used MongoDB URI of cluster)
- ⚙️ **Environment**: Set env vars in platform dashboard; configure build & start scripts as above

---

## 🚦 CI/CD Pipeline

Configured via **.github/workflows/ci.yml**:

1. 📥 Checkout code
2. 📦 Install dependencies
3. 🏗️ Build client
4. 🚀 Deploy on merge to `main`

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. 🍴 Fork the repository
2. 🌿 Create your feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add some amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🔄 Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📜 License

MIT License © 2025 Mandip Kumar Kanu

---

## 🙌 Acknowledgements

- 🧠 Gemini API
- 🧩 shadcn/ui
- 📋 React Hook Form
- 🐻 Zustand
- 🔘 Radix UI
- 📝 CKEditor
- 🎨 TailwindCSS

---

## 📬 Contact

- 🐙 GitHub: [MandipKumarKanu](https://github.com/MandipKumarKanu)
- 📧 Email: mandipkk.dev@gmail.com

---

> 💡 **Pro Tip**: Star ⭐ this repo to stay updated with the latest features!
