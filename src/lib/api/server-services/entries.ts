import { serverApiClient } from '../server-client';
import { Entry, EntryDTO, EntriesQueryParams, transformEntryDTO } from '@/types/journal';
import { PaginatedResponse } from '@/types/misc';

export const entriesServerService = {
  getAll: async (params?: EntriesQueryParams): Promise<PaginatedResponse<Entry>> => {
    try {
      const response = await serverApiClient.get<PaginatedResponse<EntryDTO>>('/entries', {
        cache: 'no-store',
        params,
      });
      return {
        data: response.data.map(transformEntryDTO),
        pagination: response.pagination,
      };
    } catch (error) {
      console.error('Failed to fetch entries:', error);
      return {
        data: [],
        pagination: { page: 1, limit: 10, total: 0, total_pages: 0 },
      };
    }
  },

  getById: async (id: string): Promise<Entry | null> => {
    try {
      const dto = await serverApiClient.get<EntryDTO>(`/entries/${id}`, { cache: 'no-store' });
      return transformEntryDTO(dto);
    } catch (error) {
      console.error('Failed to fetch entry:', error);
      return null;
    }
  },
};

