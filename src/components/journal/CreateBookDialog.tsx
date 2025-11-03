'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { useCreateBook } from '@/lib/api/hooks';
import { useUIStore } from '@/stores/ui';

const createBookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  coverColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color'),
  emoji: z.string().max(2, 'Please use a single emoji').optional(),
});

type CreateBookForm = z.infer<typeof createBookSchema>;

const PRESET_COLORS = [
  '#6366F1',
  '#8B5CF6',
  '#EC4899',
  '#EF4444',
  '#F59E0B',
  '#10B981',
  '#3B82F6',
  '#06B6D4',
];

export const CreateBookDialog = () => {
  const isOpen = useUIStore((state) => state.isCreateBookDialogOpen);
  const setIsOpen = useUIStore((state) => state.setCreateBookDialogOpen);
  const { mutate: createBook, isPending } = useCreateBook();

  const form = useForm<CreateBookForm>({
    resolver: zodResolver(createBookSchema),
    defaultValues: {
      title: '',
      description: '',
      coverColor: PRESET_COLORS[0],
      emoji: '',
    },
  });

  const onSubmit = (data: CreateBookForm) => {
    createBook(data, {
      onSuccess: () => {
        form.reset();
        setIsOpen(false);
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
                      className="min-h-[80px]"
                      error={!!form.formState.errors.description}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emoji"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Emoji (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="📖"
                      maxLength={2}
                      error={!!form.formState.errors.emoji}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverColor"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Cover Color</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <div className="flex gap-2 flex-wrap">
                        {PRESET_COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className="w-10 h-10 rounded-lg border-2 transition-all hover:scale-110"
                            style={{
                              backgroundColor: color,
                              borderColor: field.value === color ? 'white' : 'transparent',
                            }}
                            onClick={() => field.onChange(color)}
                          />
                        ))}
                      </div>
                      <Input
                        type="color"
                        className="h-10"
                        {...field}
                      />
                    </div>
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
                {isPending ? 'Creating...' : 'Create Book'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

