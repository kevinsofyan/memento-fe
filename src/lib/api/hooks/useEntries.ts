import { useQuery, useMutation } from "@tanstack/react-query";
import { entriesService } from "../services";
import {
  IEntry,
  ICreateEntryInput,
  IUpdateEntryInput,
  IEntriesQueryParams,
} from "@/types/journal";
import { useEntriesStore } from "@/stores/entries";
import { useBooksStore } from "@/stores/books";
import { useMemo, useEffect } from "react";

export const ENTRIES_QUERY_KEY = ["getEntries"];
export const ENTRY_QUERY_KEY = ["getEntry"];

export function useFetchEntry(id?: string) {
  return useQuery({
    queryKey: [...ENTRY_QUERY_KEY, id],
    queryFn: () => entriesService.getById(id!),
    enabled: !!id,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFetchEntries(params?: IEntriesQueryParams) {
  return useQuery({
    queryKey: [...ENTRIES_QUERY_KEY, params],
    queryFn: () => {
      console.log("🔥 Fetching entries from API with params:", params);
      return entriesService.getAll(params);
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useEntry(id?: string) {
  const selectedEntry = useEntriesStore((state) => state.selectedEntry);
  const selectEntry = useEntriesStore((state) => state.selectEntry);

  const { data: queryEntry, isLoading, error, refetch } = useFetchEntry(id);

  useEffect(() => {
    if (queryEntry) {
      selectEntry(queryEntry);
    }
  }, [queryEntry, selectEntry]);

  useEffect(() => {
    if (error) {
      selectEntry(null);
    }
  }, [error, selectEntry]);

  const entry = selectedEntry;

  const updateEntryData = (entryData: IEntry) => {
    selectEntry(entryData);
  };

  const removeEntryData = () => {
    selectEntry(null);
  };

  return useMemo(
    () => ({
      entry,
      isLoading,
      error,
      setEntry: updateEntryData,
      clearEntry: removeEntryData,
      refetch,
    }),
    [entry, isLoading, error, refetch]
  );
}

export function useEntries(params?: IEntriesQueryParams) {
  const storeEntries = useEntriesStore((state) => state.entries);
  const setStoreEntries = useEntriesStore((state) => state.setEntries);

  const {
    data: queryEntriesResponse,
    isLoading,
    error,
    refetch,
  } = useFetchEntries(params);

  useEffect(() => {
    if (queryEntriesResponse) {
      setStoreEntries(queryEntriesResponse.data);
    }
  }, [queryEntriesResponse, setStoreEntries]);

  const entries = storeEntries;

  const updateEntries = (entriesData: IEntry[]) => {
    setStoreEntries(entriesData);
  };

  const removeEntries = () => {
    setStoreEntries([]);
  };

  return useMemo(
    () => ({
      entries,
      isLoading,
      error,
      setEntries: updateEntries,
      clearEntries: removeEntries,
      refetch,
    }),
    [entries, isLoading, error, refetch]
  );
}

export function useEntryMutations() {
  const addEntry = useEntriesStore((state) => state.addEntry);
  const updateEntryInStore = useEntriesStore((state) => state.updateEntry);
  const deleteEntryFromStore = useEntriesStore((state) => state.deleteEntry);
  const updateBookInStore = useBooksStore((state) => state.updateBook);

  const create = useMutation({
    mutationFn: (input: ICreateEntryInput) => {
      const { bookId, ...data } = input;
      return entriesService.create(bookId, data as any);
    },
    onSuccess: (entry) => {
      addEntry(entry);
      if (entry.bookId) {
        updateBookInStore(entry.bookId, {
          entriesCount: (entry as any).book?.entriesCount,
        });
      }
    },
  });

  const update = useMutation({
    mutationFn: (data: IUpdateEntryInput) => {
      return entriesService.update(data);
    },
    onSuccess: (entry) => {
      updateEntryInStore(entry.id, entry);
    },
  });

  const remove = useMutation({
    mutationFn: entriesService.delete,
    onSuccess: (_, id) => {
      deleteEntryFromStore(id);
    },
  });

  return { create, update, remove };
}
