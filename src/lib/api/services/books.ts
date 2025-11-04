import { PaginatedResponse } from '@/types/misc';
import { apiClient } from '../client';
import { 
  Book, 
  BookDTO, 
  CreateBookInput, 
  UpdateBookInput,
  BooksQueryParams,
  transformBookDTO,
  transformBookInput,
  transformBookUpdateInput
} from '@/types/journal';

export const booksService = {
  getAll: async (params?: BooksQueryParams): Promise<PaginatedResponse<Book>> => {
    const response = await apiClient.get<PaginatedResponse<BookDTO>>('/journal/books', { params });
    return {
      data: response.data.map(transformBookDTO),
      pagination: response.pagination,
    };
  },

  getById: async (id: string): Promise<Book> => {
    const dto = await apiClient.get<BookDTO>(`/journal/books/${id}`);
    return transformBookDTO(dto);
  },

  create: async (data: CreateBookInput): Promise<Book> => {
    const dto = await apiClient.post<BookDTO>('/journal/books', transformBookInput(data));
    return transformBookDTO(dto);
  },

  update: async ({ id, ...data }: UpdateBookInput): Promise<Book> => {
    const dto = await apiClient.patch<BookDTO>(`/journal/books/${id}`, transformBookUpdateInput({ id, ...data }));
    return transformBookDTO(dto);
  },

  delete: (id: string) =>
    apiClient.delete<void>(`/journal/books/${id}`),
};

