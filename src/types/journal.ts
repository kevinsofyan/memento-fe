import { User } from "@/schemas";

export interface BooksQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface EntriesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  bookId?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface BookDTO {
  id: string;
  owner_id: string;
  title: string;
  description?: string;
  cover_color?: string;
  emoji?: string;
  entries_count?: number;
  created_at: string;
  updated_at: string;
  owner: User;
  users: User[];
}

export interface Book {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  coverColor?: string;
  emoji?: string;
  entriesCount?: number;
  createdAt: string;
  updatedAt: string;
  owner: User;
  users: User[];
}

export interface EntryDTO {
  id: string;
  book_id: string;
  title: string;
  content: string;
  mood?: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  tags: string[];
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
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

export function transformBookDTO(dto: BookDTO): Book {
  return {
    id: dto.id,
    ownerId: dto.owner_id,
    title: dto.title,
    description: dto.description,
    coverColor: dto.cover_color,
    emoji: dto.emoji,
    entriesCount: dto.entries_count,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    owner: dto.owner,
    users: dto.users,
  };
}

export function transformEntryDTO(dto: EntryDTO): Entry {
  return {
    id: dto.id,
    bookId: dto.book_id,
    title: dto.title,
    content: dto.content,
    mood: dto.mood,
    tags: dto.tags,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    isFavorite: dto.is_favorite,
  };
}

export function transformBookInput(input: CreateBookInput) {
  return {
    title: input.title,
    description: input.description,
    cover_color: input.coverColor,
    emoji: input.emoji,
  };
}

export function transformBookUpdateInput(input: UpdateBookInput) {
  const { id, ...rest } = input;
  return {
    title: rest.title,
    description: rest.description,
    cover_color: rest.coverColor,
    emoji: rest.emoji,
  };
}

export function transformEntryInput(input: CreateEntryInput) {
  return {
    book_id: input.bookId,
    title: input.title,
    content: input.content,
    mood: input.mood,
    tags: input.tags,
  };
}

export function transformEntryUpdateInput(input: UpdateEntryInput) {
  const { id, ...rest } = input;
  return {
    title: rest.title,
    content: rest.content,
    mood: rest.mood,
    tags: rest.tags,
    is_favorite: rest.isFavorite,
  };
}

