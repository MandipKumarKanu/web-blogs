# Future Blogs – Blogging Platform

Welcome to **Future Blogs**! This is a full-stack blogging platform with both backend and frontend implementations. It provides features like user authentication, blog publishing, scheduling, comments, notifications, and real-time updates.

## Project Structure

This project follows a full-stack architecture, with separate directories for the frontend and backend:

```
Future-Blogs/
│
├── backend/        # Backend REST API (Node.js, Express, MongoDB)
├── client/       # Frontend application (React.js)
├── .gitignore      # Git ignore file
└──README.md       # Project documentation
```

### Backend

The backend is built with **Node.js** and **Express**, and it provides a REST API for all the core functionalities. The backend manages things like:

- **User Authentication**: Register, login, JWT authentication.
- **Blog Management**: CRUD operations for blog posts.
- **Comments**: Manage comments on blogs (with support for nested comments).
- **Scheduled Publishing**: Automatically publish blogs at scheduled times.
- **Admin Panel**: Manage users, blogs, and categories.

The backend uses **MongoDB** for the database, with **Mongoose** for data modeling.

### Frontend

The frontend is a React application where users can interact with the blog platform. Features include:

- **User Interface**: Display and interact with blogs, comments, and profiles.
- **Authentication**: Login and registration forms.
- **Blog Management**: View, create, update, and delete blogs.
- **Real-time Notifications**: Notifications for likes, comments, etc.
  
The frontend uses **React.js** and is styled with **TailwindCSS**.

## Tech Stack

### Backend
- **Node.js** & **Express** – REST API server
- **MongoDB** & **Mongoose** – Database & ODM
- **JWT** – Authentication
- **bcryptjs** – Password hashing
- **node-cron** – Cron jobs for scheduled publishing
- **Socket.IO** – Real-time features (integration upcoming)

### Frontend
- **React.js** – JavaScript framework for building the user interface
- **Zustan** – For state management
- **Axios** – For making HTTP requests to the backend
- **Tailwind CSS** / **Styled Components** – For styling

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MandipKumarKanu/AI-mern-blog.git
   cd AI-mern-blog
   ```

2. **Install dependencies for the backend:**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables for the backend:**
   Copy `.env.example` to `.env` and update the values for things like database connection, JWT secrets, etc.

4. **Install dependencies for the frontend:**
   ```bash
   cd ../client
   npm install
   ```

5. **Run the development server:**

   **Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   The API will be available at http://localhost:5000.

   **Frontend:**
   ```bash
   cd client
   npm run dev
   ```
   The React app will be available at http://localhost:5173.

## Contributing

Feel free to open an issue or submit a pull request for any changes or improvements! We welcome contributions from the community.

## License

This project is open-source and available under the MIT License.