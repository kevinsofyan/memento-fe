import { serverApiClient } from '../server-client';
import { Entry } from '@/types/journal';

export const entriesServerService = {
  getAll: async (bookId?: string): Promise<Entry[]> => {
    try {
      const params = bookId ? { bookId } : undefined;
      return await serverApiClient.get<Entry[]>('/entries', {
        cache: 'no-store',
        params,
      });
    } catch (error) {
      console.error('Failed to fetch entries:', error);
      return [];
    }
  },

  getById: async (id: string): Promise<Entry | null> => {
    try {
      return await serverApiClient.get<Entry>(`/entries/${id}`, { cache: 'no-store' });
    } catch (error) {
      console.error('Failed to fetch entry:', error);
      return null;
    }
  },
};

