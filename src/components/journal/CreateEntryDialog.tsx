'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Smile, Frown, Meh, SmilePlus, Angry } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useCreateEntry } from '@/lib/api/hooks';
import { useUIStore } from '@/stores/ui';
import { cn } from '@/lib/utils';

const createEntrySchema = z.object({
  bookId: z.string().min(1, 'Book is required'),
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
  mood: z.enum(['great', 'good', 'okay', 'bad', 'terrible']).optional(),
  tags: z.string(),
});

type CreateEntryForm = z.infer<typeof createEntrySchema>;

const MOODS = [
  { value: 'great', icon: SmilePlus, label: 'Great', color: 'text-green-500' },
  { value: 'good', icon: Smile, label: 'Good', color: 'text-blue-500' },
  { value: 'okay', icon: Meh, label: 'Okay', color: 'text-yellow-500' },
  { value: 'bad', icon: Frown, label: 'Bad', color: 'text-orange-500' },
  { value: 'terrible', icon: Angry, label: 'Terrible', color: 'text-red-500' },
] as const;

interface CreateEntryDialogProps {
  bookId: string;
}

export const CreateEntryDialog = ({ bookId }: CreateEntryDialogProps) => {
  const isOpen = useUIStore((state) => state.isCreateEntryDialogOpen);
  const setIsOpen = useUIStore((state) => state.setCreateEntryDialogOpen);
  const { mutate: createEntry, isPending } = useCreateEntry();

  const form = useForm<CreateEntryForm>({
    resolver: zodResolver(createEntrySchema),
    defaultValues: {
      bookId,
      title: '',
      content: '',
      mood: undefined,
      tags: '',
    },
  });

  const onSubmit = (data: CreateEntryForm) => {
    const tags = data.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    createEntry(
      {
        bookId: data.bookId,
        title: data.title,
        content: data.content,
        mood: data.mood,
        tags,
      },
      {
        onSuccess: () => {
          form.reset();
          setIsOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Entry</DialogTitle>
          <DialogDescription>
            Write down your thoughts and memories.
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
                      placeholder="What's on your mind?"
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
              name="content"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Start writing..."
                      className="min-h-[200px]"
                      error={!!form.formState.errors.content}
                      {...field}
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
                    <div className="flex gap-2">
                      {MOODS.map((mood) => {
                        const Icon = mood.icon;
                        return (
                          <button
                            key={mood.value}
                            type="button"
                            className={cn(
                              'flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all hover:scale-105',
                              field.value === mood.value
                                ? 'border-primary bg-accent'
                                : 'border-transparent bg-muted/50'
                            )}
                            onClick={() => field.onChange(mood.value)}
                          >
                            <Icon className={cn('h-6 w-6', mood.color)} />
                            <span className="text-xs">{mood.label}</span>
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
                onClick={() => setIsOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Creating...' : 'Create Entry'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

