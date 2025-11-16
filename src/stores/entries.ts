import { create } from "zustand";
import { IEntry } from "@/types/journal";

interface EntriesState {
  entries: IEntry[];
  selectedEntry: IEntry | null;
  setEntries: (entries: IEntry[]) => void;
  addEntry: (entry: IEntry) => void;
  updateEntry: (id: string, entry: Partial<IEntry>) => void;
  deleteEntry: (id: string) => void;
  selectEntry: (entry: IEntry | null) => void;
}

export const useEntriesStore = create<EntriesState>((set) => ({
  entries: [],
  selectedEntry: null,
  setEntries: (entries) => set({ entries }),
  addEntry: (entry) => set((state) => ({ entries: [entry, ...state.entries] })),
  updateEntry: (id, updatedEntry) =>
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === id ? { ...entry, ...updatedEntry } : entry
      ),
    })),
  deleteEntry: (id) =>
    set((state) => ({
      entries: state.entries.filter((entry) => entry.id !== id),
    })),
  selectEntry: (entry) => set({ selectedEntry: entry }),
}));
