'use client';

import { motion } from 'framer-motion';
import { Plus, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/ui';
import { Book } from '@/types/journal';

interface EntriesHeaderProps {
  book?: Book | null;
}

export function EntriesHeader({ book }: EntriesHeaderProps) {
  const router = useRouter();
  const setCreateEntryDialogOpen = useUIStore((state) => state.setCreateEntryDialogOpen);

  return (
    <div className="mb-8">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-4">
        <Button variant="ghost" onClick={() => router.push('/books')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Books
        </Button>
        {book && (
        <div className="flex items-start gap-4">
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl"
            style={{
              backgroundColor: book.coverColor + '20',
            }}
          >
            {book.emoji || '📖'}
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
            {book.description && <p className="text-muted-foreground">{book.description}</p>}
          </div>
          <Button onClick={() => setCreateEntryDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        </div>
        )}
      </motion.div>
    </div>
  );
}

