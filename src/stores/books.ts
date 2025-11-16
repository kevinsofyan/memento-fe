import { create } from "zustand";
import { IBook } from "@/types/journal";

interface BooksState {
  books: IBook[];
  selectedBook: IBook | null;
  setBooks: (books: IBook[]) => void;
  addBook: (book: IBook) => void;
  updateBook: (id: string, book: Partial<IBook>) => void;
  deleteBook: (id: string) => void;
  selectBook: (book: IBook | null) => void;
}

export const useBooksStore = create<BooksState>((set) => ({
  books: [],
  selectedBook: null,
  setBooks: (books) => set({ books }),
  addBook: (book) => set((state) => ({ books: [...state.books, book] })),
  updateBook: (id, updatedBook) =>
    set((state) => ({
      books: state.books.map((book) =>
        book.id === id ? { ...book, ...updatedBook } : book
      ),
    })),
  deleteBook: (id) =>
    set((state) => ({
      books: state.books.filter((book) => book.id !== id),
    })),
  selectBook: (book) => set({ selectedBook: book }),
}));
