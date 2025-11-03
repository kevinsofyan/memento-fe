'use client';

import { motion } from 'framer-motion';
import { MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { Book } from '@/types/journal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface BookCardProps {
  book: Book;
  onDelete?: (id: string) => void;
  onEdit?: (book: Book) => void;
}

export const BookCard = ({ book, onDelete, onEdit }: BookCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/books/${book.id}/entries`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="group relative overflow-hidden cursor-pointer hover:shadow-lg"
        onClick={handleClick}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundColor: book.coverColor }}
        />
        <div className="relative p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {book.emoji && (
                <span className="text-4xl">{book.emoji}</span>
              )}
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                }}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-2 line-clamp-1">
            {book.title}
          </h3>

          {book.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {book.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <span className="text-sm text-muted-foreground">
              {book.entriesCount} {book.entriesCount === 1 ? 'entry' : 'entries'}
            </span>

            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onEdit(book);
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onDelete(book.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-primary"
          initial={{ width: 0 }}
          whileHover={{ width: '100%' }}
          transition={{ duration: 0.3 }}
        />
      </Card>
    </motion.div>
  );
};

