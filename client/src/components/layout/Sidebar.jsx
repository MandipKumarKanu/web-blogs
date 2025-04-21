import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  LayoutDashboard,
  Users,
  FolderTree,
  FileText,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen, onNavigate }) => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname.split("/")[2] || "dashboard";
    setActiveItem(currentPath);
  }, [location]);

  const { user } = useAuthStore();

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    { id: "users", label: "Users", icon: <Users className="h-5 w-5" /> },
    {
      id: "categories",
      label: "Categories",
      icon: <FolderTree className="h-5 w-5" />,
    },
    {
      id: "tags",
      label: "Tags",
      icon: <FolderTree className="h-5 w-5" />,
    },
    { id: "blogs", label: "Blogs", icon: <FileText className="h-5 w-5" /> },
  ];

  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-30 lg:relative lg:translate-x-0"
          >
            <motion.aside
              initial={false}
              animate={{
                width: isOpen ? 288 : 80,
                transition: { type: "spring", stiffness: 300, damping: 30 },
              }}
              className={cn(
                "h-full flex flex-col border-r bg-card shadow-md lg:shadow-none"
              )}
            >
              <div className="h-14 flex items-center justify-between border-b px-4">
                <div className="flex items-center overflow-hidden">
                  <LayoutDashboard className="h-6 w-6 text-primary" />
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="ml-2 text-lg font-semibold whitespace-nowrap"
                    >
                      Admin Panel
                    </motion.span>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(!isOpen)}
                  className="lg:flex hidden"
                >
                  <motion.div
                    animate={{ rotate: isOpen ? 0 : 180 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </motion.div>
                </Button>
              </div>

              <div className="flex-1 overflow-auto py-4 px-3">
                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <Button
                      key={item.id}
                      variant={activeItem === item.id ? "secondary" : "ghost"}
                      className={cn(
                        "w-full relative group transition-all duration-300 rounded-md",
                        isOpen
                          ? "justify-start px-4 py-3 text-sm"
                          : "justify-center px-0 py-3"
                      )}
                      onClick={() => onNavigate(item.id)}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center",
                          isOpen ? "" : "w-full"
                        )}
                      >
                        {item.icon}
                        {isOpen && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="ml-3 whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </div>

                      {!isOpen && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-card rounded-md shadow-lg opacity-0 scale-95 transform transition-all group-hover:opacity-100 group-hover:scale-100 z-50 hidden lg:block">
                          <span className="whitespace-nowrap text-sm">
                            {item.label}
                          </span>
                        </div>
                      )}
                    </Button>
                  ))}
                </nav>
              </div>

              <div className="border-t p-4 flex items-center justify-between">
                <div className="flex items-center overflow-hidden">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground flex-shrink-0">
                    A
                  </div>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="ml-3 overflow-hidden"
                    >
                      <p className="text-sm font-medium whitespace-nowrap">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground whitespace-nowrap truncate max-w-32">
                        {user.email}
                      </p>
                    </motion.div>
                  )}
                </div>
                <ModeToggle />
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && isDesktop && (
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="fixed top-5 left-[0] z-40 bg-card border shadow-md lg:flex hidden"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}
    </>
  );
};

export default Sidebar;