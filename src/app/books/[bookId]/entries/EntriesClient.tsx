"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, Grid3x3, List, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EntryCard } from "@/components/journal/EntryCard";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useEntries, useEntryMutations } from "@/lib/api/hooks";
import { IEntry, getTextFromContent } from "@/types/journal";
import { cn } from "@/lib/utils";
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

interface EntriesClientProps {
  bookId: string;
}

export function EntriesClient({ bookId }: EntriesClientProps) {
  const router = useRouter();
  const { entries } = useEntries({ bookId });
  const { remove } = useEntryMutations();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    entryId: string | null;
    entryTitle: string;
  }>({
    open: false,
    entryId: null,
    entryTitle: "",
  });

  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredEntries = entries
    .filter(
      (entry) =>
        entry.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        getTextFromContent(entry.content)
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase())
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const handleDeleteClick = (entryId: string, entryTitle: string) => {
    setDeleteDialog({ open: true, entryId, entryTitle });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.entryId) {
      remove.mutate(deleteDialog.entryId, {
        onSuccess: () => {
          notifications.success(
            "Entry deleted",
            `"${deleteDialog.entryTitle}" has been permanently deleted.`
          );
          setDeleteDialog({ open: false, entryId: null, entryTitle: "" });
        },
        onError: (error: any) => {
          notifications.error(
            "Failed to delete entry",
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
            placeholder="Search entries..."
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

      {filteredEntries.length === 0 ? (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {searchQuery ? "No entries found" : "No entries yet"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? "Try a different search query"
              : "Start writing your first journal entry"}
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
          {filteredEntries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onClick={() =>
                router.push(`/books/${bookId}/entries/${entry.id}`)
              }
              onDelete={() => handleDeleteClick(entry.id, entry.title)}
            />
          ))}
        </motion.div>
      )}

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, entryId: null, entryTitle: "" })
        }
        onConfirm={handleConfirmDelete}
        title="Delete Entry"
        description={`Are you sure you want to delete "${deleteDialog.entryTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        isLoading={remove.isPending}
      />

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => router.push(`/books/${bookId}/entries/new`)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow z-50"
      >
        <Plus className="h-6 w-6" />
      </motion.button>
    </>
  );
}
