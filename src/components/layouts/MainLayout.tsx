'use client';

import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { CreateBookDialog } from '@/components/journal/CreateBookDialog';
import { useUser } from '@/lib/api/hooks';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {

  
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="ml-64 min-h-screen"
      >
        {children}
      </motion.main>
      <CreateBookDialog />
    </div>
  );
};

