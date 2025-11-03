'use client';

import { motion } from 'framer-motion';
import { BookOpen, Home, Settings, Plus, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/UserMenu';
import { useUIStore } from '@/stores/ui';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/books', label: 'Books', icon: BookOpen },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const theme = useUIStore((state) => state.theme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);
  const setCreateBookDialogOpen = useUIStore((state) => state.setCreateBookDialogOpen);

  return (
    <motion.aside
      className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-card z-50"
    >
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
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
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

        <div className="space-y-0">
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
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
          </div>
          <UserMenu />
        </div>
      </div>
    </motion.aside>
  );
};

