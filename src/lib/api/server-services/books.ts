import { serverApiClient } from '../server-client';
import { Book } from '@/types/journal';

export const booksServerService = {
  getAll: async (): Promise<Book[]> => {
    try {
      return await serverApiClient.get<Book[]>('/journal/books', { cache: 'no-store' });
    } catch (error) {
      console.error('Failed to fetch books:', error);
      return [];
    }
  },

  getById: async (id: string): Promise<Book | null> => {
    try {
      return await serverApiClient.get<Book>(`/journal/books/${id}`, { cache: 'no-store' });
    } catch (error) {
      console.error('Failed to fetch book:', error);
      return null;
    }
  },
};

