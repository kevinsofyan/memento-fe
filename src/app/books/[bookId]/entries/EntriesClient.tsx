'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Heart, Calendar, Grid3x3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EntryCard } from '@/components/journal/EntryCard';
import { useDeleteEntry, useUpdateEntry } from '@/lib/api/hooks';
import { Entry } from '@/types/journal';
import { cn } from '@/lib/utils';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

interface EntriesClientProps {
  initialEntries: Entry[];
}

export function EntriesClient({ initialEntries }: EntriesClientProps) {
  const { mutate: deleteEntry } = useDeleteEntry();
  const { mutate: updateEntry } = useUpdateEntry();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterMode, setFilterMode] = useState<'all' | 'favorites'>('all');

  const filteredEntries = initialEntries
    .filter(
      (entry) =>
        (entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.content.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (filterMode === 'all' || entry.isFavorite)
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const toggleFavorite = (id: string) => {
    const entry = initialEntries.find((e) => e.id === id);
    if (entry) {
      updateEntry({ id, isFavorite: !entry.isFavorite });
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-4 mb-8"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={filterMode === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterMode('all')}
          >
            <Calendar className="h-4 w-4 mr-2" />
            All
          </Button>
          <Button
            variant={filterMode === 'favorites' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterMode('favorites')}
          >
            <Heart className="h-4 w-4 mr-2" />
            Favorites
          </Button>
        </div>

        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {filteredEntries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {searchQuery || filterMode === 'favorites' ? 'No entries found' : 'No entries yet'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery || filterMode === 'favorites'
              ? 'Try a different search or filter'
              : 'Start writing your first journal entry'}
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className={cn(
            'grid gap-6',
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          )}
        >
          {filteredEntries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onDelete={deleteEntry}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </motion.div>
      )}
    </>
  );
}

