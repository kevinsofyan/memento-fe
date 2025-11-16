"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Grid3x3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookCard } from "@/components/journal/BookCard";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { cn } from "@/lib/utils";
import { useBookMutations, useBooks } from "@/lib/api/hooks";
import { useDebounce } from "@/hooks/useDebounce";
import { notifications } from "@/lib/notifications";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export function BooksContentClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    bookId: string | null;
    bookTitle: string;
  }>({
    open: false,
    bookId: null,
    bookTitle: "",
  });

  // Debounce search query to avoid excessive API calls
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { books } = useBooks({ limit: 100 });
  const { remove } = useBookMutations();

  const handleDeleteClick = (bookId: string, bookTitle: string) => {
    setDeleteDialog({ open: true, bookId, bookTitle });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.bookId) {
      remove.mutate(deleteDialog.bookId, {
        onSuccess: () => {
          notifications.success(
            "Book deleted",
            `"${deleteDialog.bookTitle}" has been permanently deleted.`
          );
          setDeleteDialog({ open: false, bookId: null, bookTitle: "" });
        },
        onError: (error: any) => {
          notifications.error(
            "Failed to delete book",
            error?.message || "Please try again."
          );
        },
      });
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
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            className="pl-10"
          />
        </div>

        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {books.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <h3 className="text-xl font-semibold mb-2">
            {searchQuery ? "No books found" : "No books yet"}
          </h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? "Try a different search query"
              : "Create your first journal book to get started"}
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className={cn(
            "grid gap-6",
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          )}
        >
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onDelete={() => handleDeleteClick(book.id, book.title)}
            />
          ))}
        </motion.div>
      )}

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, bookId: null, bookTitle: "" })
        }
        onConfirm={handleConfirmDelete}
        title="Delete Book"
        description={`Are you sure you want to delete "${deleteDialog.bookTitle}"? This action cannot be undone and will permanently delete all entries in this book.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        isLoading={remove.isPending}
      />
    </>
  );
}
