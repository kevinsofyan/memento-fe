import { User } from "@/schemas";

export interface Book {
  id: string;
  title: string;
  description?: string;
  coverColor?: string;
  emoji?: string;
  entriesCount?: number;
  users: User[];
  createdAt: string;
  updatedAt: string;
}

export interface Entry {
  id: string;
  bookId: string;
  title: string;
  content: string;
  mood?: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
}

export interface CreateBookInput {
  title: string;
  description?: string;
  coverColor: string;
  emoji?: string;
}

export interface UpdateBookInput {
  id: string;
  title?: string;
  description?: string;
  coverColor?: string;
  emoji?: string;
}

export interface CreateEntryInput {
  bookId: string;
  title: string;
  content: string;
  mood?: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  tags?: string[];
}

export interface UpdateEntryInput {
  id: string;
  title?: string;
  content?: string;
  mood?: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  tags?: string[];
  isFavorite?: boolean;
}

