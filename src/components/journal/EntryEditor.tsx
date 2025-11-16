"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Smile, Frown, Meh, SmilePlus, Angry, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEntryMutations } from "@/lib/api/hooks";
import { cn } from "@/lib/utils";
import { notifications } from "@/lib/notifications";
import { IEntry, getTextFromContent } from "@/types/journal";
import { TipTapEditor } from "./TipTapEditor";

const entrySchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  content: z.any().refine((val) => {
    // Validate it's not empty JSON
    if (!val) return false;
    if (typeof val === "object" && val.type === "doc") {
      return val.content && val.content.length > 0;
    }
    return true;
  }, "Content is required"),
  mood: z.enum(
    ["great", "good", "okay", "bad", "terrible"],
    "Mood is required"
  ),
  tags: z.string(),
});

type EntryForm = z.infer<typeof entrySchema>;

const MOODS = [
  { value: "great", icon: SmilePlus, label: "Great", color: "text-green-500" },
  { value: "good", icon: Smile, label: "Good", color: "text-blue-500" },
  { value: "okay", icon: Meh, label: "Okay", color: "text-yellow-500" },
  { value: "bad", icon: Frown, label: "Bad", color: "text-orange-500" },
  { value: "terrible", icon: Angry, label: "Terrible", color: "text-red-500" },
] as const;

interface EntryEditorProps {
  bookId: string;
  entry?: IEntry;
}

export const EntryEditor = ({ bookId, entry }: EntryEditorProps) => {
  const router = useRouter();
  const { create, update } = useEntryMutations();

  const isEditing = !!entry;
  // Extract content for editor (handles both JSON and legacy text formats)
  const getContentForEditor = (content: any): any => {
    if (!content) return "";
    // If it's already TipTap JSON format
    if (typeof content === "object" && content.type === "doc") return content;
    // If it's legacy text format
    if (content.text) return content.text;
    // If it's plain string
    if (typeof content === "string") return content;
    return "";
  };

  const form = useForm<EntryForm>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: entry?.title || "",
      content: entry ? getContentForEditor(entry.content) : "",
      mood: entry?.mood || undefined,
      tags: entry?.tags.join(", ") || "",
    },
  });

  const onSubmit = (data: EntryForm) => {
    const tags = data.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (isEditing) {
      update.mutate(
        {
          id: entry.id,
          title: data.title,
          content: data.content, // Now sends JSON object
          mood: data.mood,
          tags,
        },
        {
          onSuccess: () => {
            notifications.success(
              "Entry updated",
              "Your changes have been saved."
            );
          },
          onError: (error: any) => {
            notifications.error(
              "Failed to update entry",
              error?.message || "Please try again."
            );
          },
        }
      );
    } else {
      create.mutate(
        {
          bookId,
          title: data.title,
          content: data.content, // Now sends JSON object
          mood: data.mood,
          tags,
        },
        {
          onSuccess: () => {
            notifications.success(
              "Entry created",
              "Your entry has been saved."
            );
            router.push(`/books/${bookId}/entries`);
          },
          onError: (error: any) => {
            notifications.error(
              "Failed to create entry",
              error?.message || "Please try again."
            );
          },
        }
      );
    }
  };

  return (
    <div>
      <Button
        variant="ghost"
        onClick={() => router.push(`/books/${bookId}/entries`)}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Entries
      </Button>

      <h1 className="text-3xl font-bold mb-8">
        {isEditing ? "Edit Entry" : "New Entry"}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="What's on your mind?"
                    error={!!form.formState.errors.title}
                    className="text-xl"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <TipTapEditor
                    content={field.value}
                    onChange={field.onChange}
                    placeholder="Start writing your thoughts... You can add images, links, and format your text."
                    error={!!form.formState.errors.content}
                    entryId={entry?.id}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mood"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>How are you feeling?</FormLabel>
                <FormControl>
                  <div className="flex gap-3">
                    {MOODS.map((mood) => {
                      const Icon = mood.icon;
                      return (
                        <button
                          key={mood.value}
                          type="button"
                          className={cn(
                            "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all hover:scale-105",
                            field.value === mood.value
                              ? "border-primary bg-accent"
                              : "border-transparent bg-muted/50"
                          )}
                          onClick={() => field.onChange(mood.value)}
                        >
                          <Icon className={cn("h-7 w-7", mood.color)} />
                          <span className="text-sm">{mood.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Tags (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="work, travel, family (comma separated)"
                    error={!!form.formState.errors.tags}
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
              onClick={() => router.push(`/books/${bookId}/entries`)}
              disabled={create.isPending || update.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={create.isPending || update.isPending}
            >
              {create.isPending || update.isPending
                ? "Saving..."
                : isEditing
                ? "Update Entry"
                : "Create Entry"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
