import { IPaginatedResponse } from "@/types/misc";
import { apiClient } from "../client";
import {
  IBook,
  IBookDTO,
  ICreateBookInput,
  IUpdateBookInput,
  IBooksQueryParams,
  transformBookDTO,
  transformBookInput,
  transformBookUpdateInput,
} from "@/types/journal";

export const booksService = {
  getAll: async (
    params?: IBooksQueryParams
  ): Promise<IPaginatedResponse<IBook>> => {
    const response = await apiClient.get<IPaginatedResponse<IBookDTO>>(
      "/journal/books",
      { params }
    );
    return {
      data: response.data.map(transformBookDTO),
      pagination: response.pagination,
    };
  },

  getById: async (id: string): Promise<IBook> => {
    const dto = await apiClient.get<IBookDTO>(`/journal/books/${id}`);
    return transformBookDTO(dto);
  },

  create: async (data: ICreateBookInput): Promise<IBook> => {
    const dto = await apiClient.post<IBookDTO>(
      "/journal/books",
      transformBookInput(data)
    );
    return transformBookDTO(dto);
  },

  update: async ({ id, ...data }: IUpdateBookInput): Promise<IBook> => {
    const dto = await apiClient.patch<IBookDTO>(
      `/journal/books/${id}`,
      transformBookUpdateInput({ id, ...data })
    );
    return transformBookDTO(dto);
  },

  delete: (id: string) => apiClient.delete<void>(`/journal/books/${id}`),
};
