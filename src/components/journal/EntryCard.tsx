'use client';

import { motion } from 'framer-motion';
import { Calendar, Heart, Tag, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { Entry } from '@/types/journal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EntryCardProps {
  entry: Entry;
  onDelete?: (id: string) => void;
  onEdit?: (entry: Entry) => void;
  onToggleFavorite?: (id: string) => void;
  onClick?: (entry: Entry) => void;
}

const moodEmojis = {
  great: '😊',
  good: '🙂',
  okay: '😐',
  bad: '😞',
  terrible: '😢',
};

const moodColors = {
  great: 'text-green-500',
  good: 'text-blue-500',
  okay: 'text-yellow-500',
  bad: 'text-orange-500',
  terrible: 'text-red-500',
};

export const EntryCard = ({
  entry,
  onDelete,
  onEdit,
  onToggleFavorite,
  onClick,
}: EntryCardProps) => {
  const handleClick = () => {
    onClick?.(entry);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="group relative overflow-hidden cursor-pointer hover:shadow-md"
        onClick={handleClick}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold line-clamp-1">
                  {entry.title}
                </h3>
                {entry.mood && (
                  <span className={cn('text-xl', moodColors[entry.mood])}>
                    {moodEmojis[entry.mood]}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              {onToggleFavorite && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'h-8 w-8',
                    entry.isFavorite ? 'text-red-500' : 'opacity-0 group-hover:opacity-100'
                  )}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onToggleFavorite(entry.id);
                  }}
                >
                  <Heart className={cn('h-4 w-4', entry.isFavorite && 'fill-current')} />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {entry.content}
          </p>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {new Date(entry.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              {entry.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  <span>{entry.tags.length}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onEdit(entry);
                  }}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onDelete(entry.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
              {entry.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-md bg-accent text-accent-foreground"
                >
                  {tag}
                </span>
              ))}
              {entry.tags.length > 3 && (
                <span className="px-2 py-1 text-xs text-muted-foreground">
                  +{entry.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

