import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { entriesService } from '../services';
import { Entry, CreateEntryInput, UpdateEntryInput } from '@/types/journal';
import { useEntriesStore } from '@/stores/entries';
import { BOOKS_QUERY_KEY } from './useBooks';

export const ENTRIES_QUERY_KEY = 'entries';

export function useEntries(bookId?: string) {
  const setEntries = useEntriesStore((state) => state.setEntries);

  return useQuery({
    queryKey: bookId ? [ENTRIES_QUERY_KEY, { bookId }] : [ENTRIES_QUERY_KEY],
    queryFn: async () => {
      const entries = await entriesService.getAll(bookId);
      setEntries(entries);
      return entries;
    },
  });
}

export function useEntry(id: string) {
  return useQuery({
    queryKey: [ENTRIES_QUERY_KEY, id],
    queryFn: () => entriesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateEntry() {
  const queryClient = useQueryClient();
  const addEntry = useEntriesStore((state) => state.addEntry);

  return useMutation({
    mutationFn: (data: CreateEntryInput) => entriesService.create(data),
    onMutate: async (newEntry) => {
      await queryClient.cancelQueries({ queryKey: [ENTRIES_QUERY_KEY] });
      
      const previousEntries = queryClient.getQueryData<Entry[]>([ENTRIES_QUERY_KEY]);
      
      const optimisticEntry: Entry = {
        id: `temp-${Date.now()}`,
        ...newEntry,
        tags: newEntry.tags || [],
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      queryClient.setQueryData<Entry[]>(
        [ENTRIES_QUERY_KEY],
        (old = []) => [optimisticEntry, ...old]
      );
      
      return { previousEntries };
    },
    onError: (err, newEntry, context) => {
      if (context?.previousEntries) {
        queryClient.setQueryData([ENTRIES_QUERY_KEY], context.previousEntries);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [ENTRIES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [BOOKS_QUERY_KEY] });
      addEntry(data);
    },
  });
}

export function useUpdateEntry() {
  const queryClient = useQueryClient();
  const updateEntry = useEntriesStore((state) => state.updateEntry);

  return useMutation({
    mutationFn: (data: UpdateEntryInput) => entriesService.update(data),
    onMutate: async (updatedEntry) => {
      await queryClient.cancelQueries({ queryKey: [ENTRIES_QUERY_KEY] });
      
      const previousEntries = queryClient.getQueryData<Entry[]>([ENTRIES_QUERY_KEY]);
      
      queryClient.setQueryData<Entry[]>(
        [ENTRIES_QUERY_KEY],
        (old = []) => old.map(entry => 
          entry.id === updatedEntry.id 
            ? { ...entry, ...updatedEntry, updatedAt: new Date().toISOString() }
            : entry
        )
      );
      
      return { previousEntries };
    },
    onError: (err, updatedEntry, context) => {
      if (context?.previousEntries) {
        queryClient.setQueryData([ENTRIES_QUERY_KEY], context.previousEntries);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [ENTRIES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ENTRIES_QUERY_KEY, data.id] });
      updateEntry(data.id, data);
    },
  });
}

export function useDeleteEntry() {
  const queryClient = useQueryClient();
  const deleteEntry = useEntriesStore((state) => state.deleteEntry);

  return useMutation({
    mutationFn: (id: string) => entriesService.delete(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: [ENTRIES_QUERY_KEY] });
      
      const previousEntries = queryClient.getQueryData<Entry[]>([ENTRIES_QUERY_KEY]);
      
      queryClient.setQueryData<Entry[]>(
        [ENTRIES_QUERY_KEY],
        (old = []) => old.filter(entry => entry.id !== deletedId)
      );
      
      return { previousEntries };
    },
    onError: (err, deletedId, context) => {
      if (context?.previousEntries) {
        queryClient.setQueryData([ENTRIES_QUERY_KEY], context.previousEntries);
      }
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [ENTRIES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [BOOKS_QUERY_KEY] });
      deleteEntry(id);
    },
  });
}

