"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useBookMutations } from "@/lib/api/hooks";
import { useUIStore } from "@/stores/ui";
import { notifications } from "@/lib/notifications";

const createBookSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().max(500, "Description is too long").optional(),
  coverColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color"),
  emoji: z.string().max(2, "Please use a single emoji").optional(),
});

type CreateBookForm = z.infer<typeof createBookSchema>;

const PRESET_COLORS = [
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#06B6D4",
];

export const CreateBookDialog = () => {
  const isOpen = useUIStore((state) => state.isCreateBookDialogOpen);
  const setIsOpen = useUIStore((state) => state.setCreateBookDialogOpen);
  const { create } = useBookMutations();

  const form = useForm<CreateBookForm>({
    resolver: zodResolver(createBookSchema),
    defaultValues: {
      title: "",
      description: "",
      coverColor: PRESET_COLORS[0],
      emoji: "",
    },
  });

  const onSubmit = (data: CreateBookForm) => {
    create.mutate(data, {
      onSuccess: () => {
        notifications.success(
          "Book created",
          `"${data.title}" has been created successfully.`
        );
        form.reset();
        setIsOpen(false);
      },
      onError: (error: any) => {
        notifications.error(
          "Failed to create book",
          error?.message || "Please try again."
        );
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Book</DialogTitle>
          <DialogDescription>
            Create a new journal book to organize your entries.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      className="mt-1"
                      placeholder="My Journal"
                      error={!!form.formState.errors.title}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What's this book about?"
                      className="min-h-[80px] mt-2"
                      error={!!form.formState.errors.description}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={create.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={create.isPending}>
                {create.isPending ? "Creating..." : "Create Book"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
