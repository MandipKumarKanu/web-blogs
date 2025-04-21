import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import SettingsPage from "@/pages/settings";
import UsersPage from "@/pages/users";
import CategoriesPage from "@/pages/categories";
import TagsPage from "@/pages/tag";
import BlogsPage from "@/pages/blogs";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPage = location.pathname.split("/")[2] || "dashboard";

  const renderPage = () => {
    switch (currentPage) {
      case "users":
        return <UsersPage />;
      case "categories":
        return <CategoriesPage />;
      case "blogs":
        return <BlogsPage />;
      case "tags":
        return <TagsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <MainContent />;
    }
  };

  const handleNavigate = (page) => {
    navigate(`/admin/${page}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="h-14 border-b bg-card flex items-center px-4 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mr-2"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </header>

      <div className="flex flex-1 min-h-0">
        <Sidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          onNavigate={handleNavigate}
        />

        <div className="flex-1 h-[calc(100vh-3.5rem)] overflow-y-auto lg:h-screen">
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;