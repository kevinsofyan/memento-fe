import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { entriesService } from '../services';
import { Entry, CreateEntryInput, UpdateEntryInput, EntriesQueryParams } from '@/types/journal';
import { BOOKS_QUERY_KEY } from './useBooks';

export const ENTRIES_QUERY_KEY = 'entries';

export function useEntry(id?: string) {
  return useQuery({
    queryKey: [ENTRIES_QUERY_KEY, id],
    queryFn: () => entriesService.getById(id!),
    enabled: !!id,
  });
}

export function useEntriesList(params?: EntriesQueryParams) {
  return useQuery({
    queryKey: [ENTRIES_QUERY_KEY, params],
    queryFn: () => entriesService.getAll(params),
  });
}

export function useEntryMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: entriesService.create,
    onSuccess: (entry) => {
      queryClient.invalidateQueries({ queryKey: [ENTRIES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [BOOKS_QUERY_KEY] });
      queryClient.setQueryData([ENTRIES_QUERY_KEY, entry.id], entry);
    },
  });

  const update = useMutation({
    mutationFn: entriesService.update,
    onSuccess: (entry) => {
      queryClient.invalidateQueries({ queryKey: [ENTRIES_QUERY_KEY] });
      queryClient.setQueryData([ENTRIES_QUERY_KEY, entry.id], entry);
    },
  });

  const remove = useMutation({
    mutationFn: entriesService.delete,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [ENTRIES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [BOOKS_QUERY_KEY] });
      queryClient.removeQueries({ queryKey: [ENTRIES_QUERY_KEY, id] });
    },
  });

  return { create, update, remove };
}

