'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/ui';

export function BooksHeader() {
  const setCreateBookDialogOpen = useUIStore((state) => state.setCreateBookDialogOpen);

  return (
    <div className="flex items-center justify-between mb-8">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-4xl font-bold mb-2">My Books</h1>
        <p className="text-muted-foreground">Manage your journal collections</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        <Button onClick={() => setCreateBookDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Book
        </Button>
      </motion.div>
    </div>
  );
}

