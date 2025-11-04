'use client';

import { motion } from 'framer-motion';
import { BookOpen, Plus, TrendingUp, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUIStore } from '@/stores/ui';
import { useUser, useBooksList, useEntriesList } from '@/lib/api/hooks';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function HomeClient() {
  const setCreateBookDialogOpen = useUIStore((state) => state.setCreateBookDialogOpen);

  useUser();
  const { data: booksResponse } = useBooksList({ limit: 100 });
  const { data: entriesResponse } = useEntriesList({ limit: 100 });

  const books = booksResponse?.data || [];
  const entries = entriesResponse?.data || [];

  const stats = [
    {
      title: 'Total Books',
      value: books.length,
      icon: BookOpen,
      description: 'Collections created',
    },
    {
      title: 'Total Entries',
      value: entries.length,
      icon: Calendar,
      description: 'Memories captured',
    },
    {
      title: 'This Month',
      value: entries.filter(
        (entry) =>
          new Date(entry.createdAt).getMonth() === new Date().getMonth() &&
          new Date(entry.createdAt).getFullYear() === new Date().getFullYear()
      ).length,
      icon: TrendingUp,
      description: 'Entries this month',
    },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold mb-3">
          Welcome back to <span className="text-primary">Memento</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Capture your thoughts, preserve your memories
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.title} variants={item}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Books</CardTitle>
                  <CardDescription>Your journal collections</CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={() => setCreateBookDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Book
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {books.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    No books yet. Create your first journal!
                  </p>
                  <Button onClick={() => setCreateBookDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Book
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {books.slice(0, 5).map((book) => (
                    <Link key={book.id} href={`/books/${book.id}/entries`}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                      >
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                          style={{
                            backgroundColor: book.coverColor + '20',
                          }}
                        >
                          {book.emoji || '📖'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{book.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {book.entriesCount} {book.entriesCount === 1 ? 'entry' : 'entries'}
                          </p>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Entries</CardTitle>
              <CardDescription>Your latest thoughts</CardDescription>
            </CardHeader>
            <CardContent>
              {entries.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">No entries yet. Start journaling!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {entries.slice(0, 5).map((entry) => (
                    <motion.div
                      key={entry.id}
                      whileHover={{ x: 4 }}
                      className="p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                    >
                      <h4 className="font-medium truncate mb-1">{entry.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{entry.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(entry.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}

