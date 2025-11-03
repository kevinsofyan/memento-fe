import { apiClient } from '../client';
import { Entry, CreateEntryInput, UpdateEntryInput } from '@/types/journal';

export const entriesService = {
  create: (data: CreateEntryInput) =>
    apiClient.post<Entry>('/entries', data),

  update: ({ id, ...data }: UpdateEntryInput) =>
    apiClient.patch<Entry>(`/entries/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<void>(`/entries/${id}`),
};

