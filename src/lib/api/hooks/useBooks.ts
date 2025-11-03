import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { booksService } from '../services';
import { Book, CreateBookInput, UpdateBookInput } from '@/types/journal';
import { useBooksStore } from '@/stores/books';

export const BOOKS_QUERY_KEY = 'books';

export function useBooks() {
  const setBooks = useBooksStore((state) => state.setBooks);

  return useQuery({
    queryKey: [BOOKS_QUERY_KEY],
    queryFn: async () => {
      const books = await booksService.getAll();
      setBooks(books);
      return books;
    },
  });
}

export function useBook(id: string) {
  return useQuery({
    queryKey: [BOOKS_QUERY_KEY, id],
    queryFn: () => booksService.getById(id),
    enabled: !!id,
  });
}

export function useCreateBook() {
  const queryClient = useQueryClient();
  const addBook = useBooksStore((state) => state.addBook);

  return useMutation({
    mutationFn: (data: CreateBookInput) => booksService.create(data),
    onMutate: async (newBook) => {
      await queryClient.cancelQueries({ queryKey: [BOOKS_QUERY_KEY] });
      
      const previousBooks = queryClient.getQueryData<Book[]>([BOOKS_QUERY_KEY]);
      
      const optimisticBook: Book = {
        id: `temp-${Date.now()}`,
        ...newBook,
        entriesCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      queryClient.setQueryData<Book[]>(
        [BOOKS_QUERY_KEY],
        (old = []) => [...old, optimisticBook]
      );
      
      return { previousBooks };
    },
    onError: (err, newBook, context) => {
      if (context?.previousBooks) {
        queryClient.setQueryData([BOOKS_QUERY_KEY], context.previousBooks);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [BOOKS_QUERY_KEY] });
      addBook(data);
    },
  });
}

export function useUpdateBook() {
  const queryClient = useQueryClient();
  const updateBook = useBooksStore((state) => state.updateBook);

  return useMutation({
    mutationFn: (data: UpdateBookInput) => booksService.update(data),
    onMutate: async (updatedBook) => {
      await queryClient.cancelQueries({ queryKey: [BOOKS_QUERY_KEY] });
      
      const previousBooks = queryClient.getQueryData<Book[]>([BOOKS_QUERY_KEY]);
      
      queryClient.setQueryData<Book[]>(
        [BOOKS_QUERY_KEY],
        (old = []) => old.map(book => 
          book.id === updatedBook.id 
            ? { ...book, ...updatedBook, updatedAt: new Date().toISOString() }
            : book
        )
      );
      
      return { previousBooks };
    },
    onError: (err, updatedBook, context) => {
      if (context?.previousBooks) {
        queryClient.setQueryData([BOOKS_QUERY_KEY], context.previousBooks);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [BOOKS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [BOOKS_QUERY_KEY, data.id] });
      updateBook(data.id, data);
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();
  const deleteBook = useBooksStore((state) => state.deleteBook);

  return useMutation({
    mutationFn: (id: string) => booksService.delete(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: [BOOKS_QUERY_KEY] });
      
      const previousBooks = queryClient.getQueryData<Book[]>([BOOKS_QUERY_KEY]);
      
      queryClient.setQueryData<Book[]>(
        [BOOKS_QUERY_KEY],
        (old = []) => old.filter(book => book.id !== deletedId)
      );
      
      return { previousBooks };
    },
    onError: (err, deletedId, context) => {
      if (context?.previousBooks) {
        queryClient.setQueryData([BOOKS_QUERY_KEY], context.previousBooks);
      }
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [BOOKS_QUERY_KEY] });
      deleteBook(id);
    },
  });
}

