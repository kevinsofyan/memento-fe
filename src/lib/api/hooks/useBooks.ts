import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { booksService } from '../services';
import { Book, CreateBookInput, UpdateBookInput, BooksQueryParams } from '@/types/journal';

export const BOOKS_QUERY_KEY = 'books';

export function useBook(id?: string) {
  return useQuery({
    queryKey: [BOOKS_QUERY_KEY, id],
    queryFn: () => booksService.getById(id!),
    enabled: !!id,
  });
}

export function useBooksList(params?: BooksQueryParams) {
  return useQuery({
    queryKey: [BOOKS_QUERY_KEY, params],
    queryFn: () => booksService.getAll(params),
  });
}

export function useBookMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: booksService.create,
    onSuccess: (book) => {
      queryClient.invalidateQueries({ queryKey: [BOOKS_QUERY_KEY] });
      queryClient.setQueryData([BOOKS_QUERY_KEY, book.id], book);
    },
  });

  const update = useMutation({
    mutationFn: booksService.update,
    onSuccess: (book) => {
      queryClient.invalidateQueries({ queryKey: [BOOKS_QUERY_KEY] });
      queryClient.setQueryData([BOOKS_QUERY_KEY, book.id], book);
    },
  });

  const remove = useMutation({
    mutationFn: booksService.delete,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [BOOKS_QUERY_KEY] });
      queryClient.removeQueries({ queryKey: [BOOKS_QUERY_KEY, id] });
    },
  });

  return { create, update, remove };
}

