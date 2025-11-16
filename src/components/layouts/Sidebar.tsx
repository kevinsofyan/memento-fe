"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Home,
  Settings,
  Plus,
  Moon,
  Sun,
  ChevronUp,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/ui";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/api/hooks";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth";
import { queryClient } from "@/lib/providers/query-client";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/books", label: "Books", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useUIStore((state) => state.theme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);
  const setCreateBookDialogOpen = useUIStore(
    (state) => state.setCreateBookDialogOpen
  );
  const { user, clearUser } = useUser();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    clearAuth();
    clearUser();
    queryClient.clear();

    try {
      await fetch("/api/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }

    router.push("/login");
    router.refresh();
  };

  return (
    <motion.aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-card z-50">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground"
            >
              <BookOpen className="h-5 w-5" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold">Memento</h1>
              <p className="text-xs text-muted-foreground">Your Journal</p>
            </div>
          </Link>
        </div>

        <div className="px-3 py-4">
          <Button
            className="w-full justify-start gap-2"
            onClick={() => setCreateBookDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            New Book
          </Button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r"
                    />
                  )}
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border">
          {user && (
            <div>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-full p-4 flex items-center gap-3 hover:bg-accent/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <UserIcon className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-border"
                  >
                    <div className="p-2 space-y-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3"
                        onClick={toggleTheme}
                        size="sm"
                      >
                        {theme === "dark" ? (
                          <>
                            <Sun className="h-4 w-4" />
                            <span>Light Mode</span>
                          </>
                        ) : (
                          <>
                            <Moon className="h-4 w-4" />
                            <span>Dark Mode</span>
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                        size="sm"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                      >
                        <LogOut className="h-4 w-4" />
                        <span>
                          {isLoggingOut ? "Signing out..." : "Sign Out"}
                        </span>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};
