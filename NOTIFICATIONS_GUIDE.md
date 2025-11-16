# Notification System Usage Guide

This guide shows how to use the reusable notification and confirmation dialog system in the Memento app.

## Components

### 1. Toast Notifications (`notifications`)

For showing quick feedback messages to users.

### 2. Confirm Dialog (`ConfirmDialog`)

For asking users to confirm important actions (like deletions).

---

## Toast Notifications

Import from `@/lib/notifications`:

```typescript
import { notifications } from "@/lib/notifications";
```

### Available Methods:

#### Success Notification

```typescript
notifications.success(
  "Book created",
  "Your book has been created successfully."
);
```

#### Error Notification

```typescript
notifications.error("Failed to delete", "Please try again later.");
```

#### Info Notification

```typescript
notifications.info("New feature", "Check out our new dark mode!");
```

#### Warning Notification

```typescript
notifications.warning(
  "Storage limit",
  "You are approaching your storage limit."
);
```

#### Loading Notification

```typescript
const loadingToast = notifications.loading(
  "Syncing...",
  "Please wait while we sync your data."
);
// Later, dismiss it:
toast.dismiss(loadingToast);
```

#### Promise Notification

Auto-updates based on promise state:

```typescript
notifications.promise(apiCall(), {
  loading: "Uploading...",
  success: "Upload complete!",
  error: "Upload failed",
});
```

---

## Confirm Dialog

Import from `@/components/ConfirmDialog`:

```typescript
import { ConfirmDialog } from "@/components/ConfirmDialog";
```

### Example Usage:

```typescript
'use client';

import { useState } from 'react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { notifications } from '@/lib/notifications';

export function MyComponent() {
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    itemId: null,
    itemName: '',
  });

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteDialog({ open: true, itemId: id, itemName: name });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialog.itemId) {
      try {
        await deleteItem(deleteDialog.itemId);
        notifications.success('Deleted', \`"\${deleteDialog.itemName}" has been deleted.\`);
        setDeleteDialog({ open: false, itemId: null, itemName: '' });
      } catch (error) {
        notifications.error('Failed to delete', 'Please try again.');
      }
    }
  };

  return (
    <>
      <button onClick={() => handleDeleteClick('123', 'My Item')}>
        Delete Item
      </button>

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        onConfirm={handleConfirmDelete}
        title="Delete Item"
        description={\`Are you sure you want to delete "\${deleteDialog.itemName}"? This action cannot be undone.\`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        isLoading={false}
      />
    </>
  );
}
```

### Props:

| Prop           | Type                                                | Default     | Description                     |
| -------------- | --------------------------------------------------- | ----------- | ------------------------------- |
| `open`         | `boolean`                                           | -           | Controls dialog visibility      |
| `onOpenChange` | `(open: boolean) => void`                           | -           | Called when dialog should close |
| `onConfirm`    | `() => void`                                        | -           | Called when user confirms       |
| `title`        | `string`                                            | -           | Dialog title                    |
| `description`  | `string`                                            | -           | Dialog description/warning text |
| `confirmText`  | `string`                                            | `'Confirm'` | Text for confirm button         |
| `cancelText`   | `string`                                            | `'Cancel'`  | Text for cancel button          |
| `variant`      | `'default' \| 'destructive' \| 'warning' \| 'info'` | `'default'` | Visual style variant            |
| `isLoading`    | `boolean`                                           | `false`     | Shows loading state             |

### Variants:

- **`default`**: Blue info icon, standard button
- **`destructive`**: Red trash icon, red button (for delete actions)
- **`warning`**: Yellow warning icon, yellow button
- **`info`**: Blue info icon, blue button

---

## Real-World Example: Delete Book with Confirmation

See implementation in `src/app/books/BooksContentClient.tsx`:

```typescript
export function BooksContentClient() {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    bookId: string | null;
    bookTitle: string;
  }>({
    open: false,
    bookId: null,
    bookTitle: '',
  });

  const { remove } = useBookMutations();

  const handleDeleteClick = (bookId: string, bookTitle: string) => {
    setDeleteDialog({ open: true, bookId, bookTitle });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.bookId) {
      remove.mutate(deleteDialog.bookId, {
        onSuccess: () => {
          notifications.success(
            'Book deleted',
            \`"\${deleteDialog.bookTitle}" has been permanently deleted.\`
          );
          setDeleteDialog({ open: false, bookId: null, bookTitle: '' });
        },
        onError: (error: any) => {
          notifications.error(
            'Failed to delete book',
            error?.message || 'Please try again.'
          );
        },
      });
    }
  };

  return (
    <>
      <BookCard onDelete={() => handleDeleteClick(book.id, book.title)} />

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, bookId: null, bookTitle: '' })}
        onConfirm={handleConfirmDelete}
        title="Delete Book"
        description={\`Are you sure you want to delete "\${deleteDialog.bookTitle}"? This will permanently delete all entries.\`}
        variant="destructive"
        isLoading={remove.isPending}
      />
    </>
  );
}
```

---

## Best Practices

1. **Always use confirmation dialogs for destructive actions** (delete, permanent changes)
2. **Show success notifications** after successful mutations
3. **Show error notifications** when operations fail
4. **Use loading state** in confirm dialogs during async operations
5. **Keep messages concise** but informative
6. **Use appropriate variants** to match the action's severity

---

## Setup

The toast system is already configured in `src/lib/providers/index.tsx`:

```typescript
import { Toaster } from '@/components/ui/toaster';

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthGuard>{children}</AuthGuard>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
};
```

No additional setup required - just import and use! 🎉
