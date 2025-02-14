import { PenTool, Moon, Sun } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "./context/theme-provider";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Popular", path: "/popular" },
    { label: "New", path: "/new" },
    { label: "Topics", path: "/topics" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <Link to="/" className="flex items-center gap-3 group">
          <PenTool className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            FutureBlog
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname === item.path
                  ? "bg-primary/10 text-primary hover:bg-primary/15"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="p-2 rounded-full transition-all hover:bg-accent relative overflow-hidden"
          aria-label="Toggle theme"
        >
          <div className="relative h-6 w-6">
            <Sun
              className={`absolute h-6 w-6 transform transition-all duration-500 ${
                isDark ? "rotate-0 opacity-100" : "rotate-90 opacity-0"
              }`}
            />
            <Moon
              className={`absolute h-6 w-6 transform transition-all duration-500 ${
                isDark ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
              }`}
            />
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
