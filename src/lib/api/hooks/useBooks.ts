import { useQuery, useMutation } from "@tanstack/react-query";
import { booksService } from "../services";
import {
  IBook,
  ICreateBookInput,
  IUpdateBookInput,
  IBooksQueryParams,
} from "@/types/journal";
import { useBooksStore } from "@/stores/books";
import { useMemo, useEffect } from "react";

export const BOOKS_QUERY_KEY = ["booksServer"];
export const BOOK_QUERY_KEY = ["bookServer"];

export function useFetchBook(id?: string) {
  return useQuery({
    queryKey: ["bookServer", id],
    queryFn: () => booksService.getById(id!),
    enabled: !!id,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFetchBooks(params?: IBooksQueryParams) {
  return useQuery({
    queryKey: ["booksServer", params],
    queryFn: () => booksService.getAll(params),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBook(id?: string) {
  const selectedBook = useBooksStore((state) => state.selectedBook);
  const selectBook = useBooksStore((state) => state.selectBook);
  const book = selectedBook;
  const { data: queryBook, isLoading, error, refetch } = useFetchBook(id);

  useEffect(() => {
    if (queryBook) {
      selectBook(queryBook);
    }
  }, [queryBook, selectBook]);

  useEffect(() => {
    if (error) {
      selectBook(null);
    }
  }, [error, selectBook]);

  const updateBookData = (bookData: IBook) => {
    selectBook(bookData);
  };

  const removeBookData = () => {
    selectBook(null);
  };

  return useMemo(
    () => ({
      book,
      isLoading,
      error,
      setBook: updateBookData,
      clearBook: removeBookData,
      refetch,
    }),
    [book, isLoading, error, refetch]
  );
}

export function useBooks(params?: IBooksQueryParams) {
  const storeBooks = useBooksStore((state) => state.books);
  const setStoreBooks = useBooksStore((state) => state.setBooks);

  const {
    data: queryBooksResponse,
    isLoading,
    error,
    refetch,
  } = useFetchBooks(params);

  useEffect(() => {
    if (queryBooksResponse) {
      setStoreBooks(queryBooksResponse.data);
    }
  }, [queryBooksResponse, setStoreBooks]);

  const books = storeBooks;

  const updateBooks = (booksData: IBook[]) => {
    setStoreBooks(booksData);
  };

  const removeBooks = () => {
    setStoreBooks([]);
  };

  return useMemo(
    () => ({
      books,
      isLoading,
      error,
      setBooks: updateBooks,
      clearBooks: removeBooks,
      refetch,
    }),
    [books, isLoading, error, refetch]
  );
}

export function useBookMutations() {
  const addBook = useBooksStore((state) => state.addBook);
  const updateBookInStore = useBooksStore((state) => state.updateBook);
  const deleteBookFromStore = useBooksStore((state) => state.deleteBook);

  const create = useMutation({
    mutationFn: booksService.create,
    onSuccess: (book) => {
      addBook(book);
    },
  });

  const update = useMutation({
    mutationFn: booksService.update,
    onSuccess: (book) => {
      updateBookInStore(book.id, book);
    },
  });

  const remove = useMutation({
    mutationFn: booksService.delete,
    onSuccess: (_, id) => {
      deleteBookFromStore(id);
    },
  });

  return { create, update, remove };
}
