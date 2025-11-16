import { IPaginatedResponse } from "@/types/misc";
import { apiClient } from "../client";
import {
  IEntry,
  IEntryDTO,
  ICreateEntryInput,
  IUpdateEntryInput,
  IEntriesQueryParams,
  transformEntryDTO,
  transformEntryInput,
  transformEntryUpdateInput,
} from "@/types/journal";

export const entriesService = {
  getAll: async (
    params?: IEntriesQueryParams
  ): Promise<IPaginatedResponse<IEntry>> => {
    const response = await apiClient.get<IPaginatedResponse<IEntryDTO>>(
      "/journal/entries/my",
      { params }
    );
    return {
      data: response.data.map(transformEntryDTO),
      pagination: response.pagination,
    };
  },

  getById: async (id: string): Promise<IEntry> => {
    const dto = await apiClient.get<IEntryDTO>(`/journal/entries/${id}`);
    return transformEntryDTO(dto);
  },

  create: async (bookId: string, data: ICreateEntryInput): Promise<IEntry> => {
    const dto = await apiClient.post<IEntryDTO>(
      `/journal/books/${bookId}/entries`,
      transformEntryInput(data)
    );
    return transformEntryDTO(dto);
  },

  update: async ({ id, ...data }: IUpdateEntryInput): Promise<IEntry> => {
    const dto = await apiClient.put<IEntryDTO>(
      `/journal/entries/${id}`,
      transformEntryUpdateInput({ id, ...data })
    );
    return transformEntryDTO(dto);
  },

  delete: (id: string) => apiClient.delete<void>(`/journal/entries/${id}`),
};
