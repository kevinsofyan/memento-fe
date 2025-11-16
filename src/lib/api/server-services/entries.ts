import { serverApiClient } from "../server-client";
import {
  IEntry,
  IEntryDTO,
  IEntriesQueryParams,
  transformEntryDTO,
} from "@/types/journal";
import { IPaginatedResponse } from "@/types/misc";

export const entriesServerService = {
  getAll: async (
    params?: IEntriesQueryParams
  ): Promise<IPaginatedResponse<IEntry>> => {
    try {
      const response = await serverApiClient.get<IPaginatedResponse<IEntryDTO>>(
        "/journal/entries/my",
        {
          cache: "no-store",
          params,
        }
      );
      return {
        data: response.data.map(transformEntryDTO),
        pagination: response.pagination,
      };
    } catch (error) {
      if (error && typeof error === "object" && "digest" in error) {
        throw error;
      }
      console.error("Failed to fetch entries:", error);
      return {
        data: [],
        pagination: { page: 1, limit: 10, total: 0, total_pages: 0 },
      };
    }
  },
  getByBookId: async (bookId: string): Promise<IEntry[]> => {
    try {
      const response = await serverApiClient.get<IPaginatedResponse<IEntryDTO>>(
        `/journal/books/${bookId}/entries`,
        {
          cache: "no-store",
        }
      );
      return response.data.map(transformEntryDTO);
    } catch (error) {
      if (error && typeof error === "object" && "digest" in error) {
        throw error;
      }
      console.error("Failed to fetch entries:", error);
      return [];
    }
  },
  getById: async (id: string): Promise<IEntry | null> => {
    try {
      const dto = await serverApiClient.get<IEntryDTO>(
        `/journal/entries/${id}`,
        {
          cache: "no-store",
        }
      );
      return transformEntryDTO(dto);
    } catch (error) {
      if (error && typeof error === "object" && "digest" in error) {
        throw error;
      }
      console.error("Failed to fetch entry:", error);
      return null;
    }
  },
};
