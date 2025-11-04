import { serverApiClient } from '../server-client';
import { Book, BookDTO, BooksQueryParams, transformBookDTO } from '@/types/journal';
import { PaginatedResponse } from '@/types/misc';

export const booksServerService = {
  getAll: async (params?: BooksQueryParams): Promise<PaginatedResponse<Book>> => {
    try {
      const response = await serverApiClient.get<PaginatedResponse<BookDTO>>('/journal/books', { cache: 'no-store', params });
      return {
        data: response.data.map(transformBookDTO),
        pagination: response.pagination,
      };
    } catch (error) {
      console.error('Failed to fetch books:', error);
      return {
        data: [],
        pagination: { page: 1, limit: 10, total: 0, total_pages: 0 },
      };
    }
  },

  getById: async (id: string): Promise<Book | null> => {
    try {
      const dto = await serverApiClient.get<BookDTO>(`/journal/books/${id}`, { cache: 'no-store' });
      return transformBookDTO(dto);
    } catch (error) {
      console.error('Failed to fetch book:', error);
      return null;
    }
  },
};

