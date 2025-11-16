import { serverApiClient } from "../server-client";
import {
  IBook,
  IBookDTO,
  IBooksQueryParams,
  transformBookDTO,
} from "@/types/journal";
import { IPaginatedResponse } from "@/types/misc";

export const booksServerService = {
  getAll: async (
    params?: IBooksQueryParams
  ): Promise<IPaginatedResponse<IBook>> => {
    try {
      const response = await serverApiClient.get<IPaginatedResponse<IBookDTO>>(
        "/journal/books",
        { cache: "no-store", params }
      );
      return {
        data: response.data.map(transformBookDTO),
        pagination: response.pagination,
      };
    } catch (error) {
      if (error && typeof error === "object" && "digest" in error) {
        throw error;
      }
      console.error("Failed to fetch books:", error);
      return {
        data: [],
        pagination: { page: 1, limit: 10, total: 0, total_pages: 0 },
      };
    }
  },

  getById: async (id: string): Promise<IBook | null> => {
    try {
      const dto = await serverApiClient.get<IBookDTO>(`/journal/books/${id}`, {
        cache: "no-store",
      });
      return transformBookDTO(dto);
    } catch (error) {
      if (error && typeof error === "object" && "digest" in error) {
        throw error;
      }
      console.error("Failed to fetch book:", error);
      return null;
    }
  },
};
