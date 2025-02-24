import React, { useState } from "react";
import {
  PenTool,
  Moon,
  Sun,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "./context/theme-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/useAuthStore";
import Notification from "./Notification";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const { user, logout } = useAuthStore();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Popular", path: "/popular" },
    { label: "New", path: "/new" },
    { label: "Topics", path: "/topics" },
  ];

  const NavLinks = ({ className = "", onClick = () => {} }) => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          onClick={onClick}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 
            ${
              location.pathname === item.path
                ? "bg-primary/10 text-primary hover:bg-primary/15"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            } ${className}`}
        >
          {item.label}
        </Link>
      ))}
    </>
  );

  const ThemeToggle = ({ className = "" }) => (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`p-2.5 rounded-full transition-all duration-200 hover:bg-accent/80 
        active:scale-95 relative overflow-hidden ${className}`}
      aria-label="Toggle theme"
    >
      <div className="relative h-5 w-5">
        <Sun
          className={`absolute h-5 w-5 transform transition-all duration-500 
            ${isDark ? "rotate-0 opacity-100" : "rotate-90 opacity-0"}`}
        />
        <Moon
          className={`absolute h-5 w-5 transform transition-all duration-500 
            ${isDark ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`}
        />
      </div>
    </button>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <Link
          to="/"
          className="flex items-center gap-3 transition-transform duration-200 hover:scale-105"
        >
          <PenTool className="h-7 w-7 text-primary transition-colors group-hover:text-primary/80" />
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            FutureBlog
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1.5">
          <NavLinks />
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div iv className="flex items-center gap-2">
              {/* <Notification /> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1 rounded hover:bg-accent/80 transition-colors">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={user.profileImage}
                        alt="User Avatar"
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40">
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link to="/login" className="flex items-center">
              <User className="h-6 w-6" />
            </Link>
          )}

          <ThemeToggle />
        </div>

        <div className="flex md:hidden items-center gap-2">
          {/* <Notification /> */}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                className="p-2.5 rounded-lg transition-all duration-200 hover:bg-accent active:scale-95"
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent className="flex flex-col h-full w-[300px] sm:w-[380px]">
              <SheetHeader className="border-b pb-6 mb-6">
                <ThemeToggle />
                {user ? (
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={user.avatar}
                        alt="User Avatar"
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/10 text-primary text-lg">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-base font-semibold">
                        {user.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </Link>
                ) : (
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary text-lg">
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-base font-semibold">Guest</span>
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="text-sm text-muted-foreground underline"
                      >
                        Login
                      </Link>
                    </div>
                  </div>
                )}
              </SheetHeader>
              <nav className="flex flex-col gap-2">
                <NavLinks
                  className="w-full hover:translate-x-1 transition-transform"
                  onClick={() => setIsOpen(false)}
                />
              </nav>
              {user && (
                <div className="mt-auto pt-6 border-t">
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
