import { PaginatedResponse } from '@/types/misc';
import { apiClient } from '../client';
import { 
  Entry, 
  EntryDTO, 
  CreateEntryInput, 
  UpdateEntryInput,
  EntriesQueryParams,
  transformEntryDTO,
  transformEntryInput,
  transformEntryUpdateInput
} from '@/types/journal';

export const entriesService = {
  getAll: async (params?: EntriesQueryParams): Promise<PaginatedResponse<Entry>> => {
    const response = await apiClient.get<PaginatedResponse<EntryDTO>>('/entries', { params });
    return {
      data: response.data.map(transformEntryDTO),
      pagination: response.pagination,
    };
  },

  getById: async (id: string): Promise<Entry> => {
    const dto = await apiClient.get<EntryDTO>(`/entries/${id}`);
    return transformEntryDTO(dto);
  },

  create: async (data: CreateEntryInput): Promise<Entry> => {
    const dto = await apiClient.post<EntryDTO>('/entries', transformEntryInput(data));
    return transformEntryDTO(dto);
  },

  update: async ({ id, ...data }: UpdateEntryInput): Promise<Entry> => {
    const dto = await apiClient.patch<EntryDTO>(`/entries/${id}`, transformEntryUpdateInput({ id, ...data }));
    return transformEntryDTO(dto);
  },

  delete: (id: string) =>
    apiClient.delete<void>(`/entries/${id}`),
};

