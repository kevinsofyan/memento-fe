import { apiClient } from '../client';
import { Book, CreateBookInput, UpdateBookInput } from '@/types/journal';

export const booksService = {
  create: (data: CreateBookInput) =>
    apiClient.post<Book>('/books', data),

  update: ({ id, ...data }: UpdateBookInput) =>
    apiClient.patch<Book>(`/books/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<void>(`/books/${id}`),
};

