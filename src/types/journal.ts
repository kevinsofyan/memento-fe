import { IUser } from "./user";

export interface IBooksQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface IEntriesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  bookId?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface IBookDTO {
  id: string;
  owner_id: string;
  title: string;
  description?: string;
  cover_color?: string;
  emoji?: string;
  entries_count?: number;
  created_at: string;
  updated_at: string;
  owner: IUser;
  users: IUser[];
}

export interface IBook {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  coverColor?: string;
  emoji?: string;
  entriesCount?: number;
  createdAt: string;
  updatedAt: string;
  owner: IUser;
  users: IUser[];
}

export interface IEntryDTO {
  id: string;
  book_id: string;
  title: string;
  content: any;
  mood?: "great" | "good" | "okay" | "bad" | "terrible";
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface IEntry {
  id: string;
  bookId: string;
  title: string;
  content: any;
  mood?: "great" | "good" | "okay" | "bad" | "terrible";
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ICreateBookInput {
  title: string;
  description?: string;
  coverColor: string;
  emoji?: string;
}

export interface IUpdateBookInput {
  id: string;
  title?: string;
  description?: string;
  coverColor?: string;
  emoji?: string;
}

export interface ICreateEntryInput {
  bookId: string;
  title: string;
  content: any;
  mood?: "great" | "good" | "okay" | "bad" | "terrible";
  tags?: string[];
}

export interface IUpdateEntryInput {
  id: string;
  title?: string;
  content?: any;
  mood?: "great" | "good" | "okay" | "bad" | "terrible";
  tags?: string[];
}

export function transformBookDTO(dto: IBookDTO): IBook {
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

export function transformEntryDTO(dto: IEntryDTO): IEntry {
  return {
    id: dto.id,
    bookId: dto.book_id,
    title: dto.title,
    content: dto.content,
    mood: dto.mood,
    tags: dto.tags || [],
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function transformBookInput(input: ICreateBookInput) {
  return {
    title: input.title,
    description: input.description,
    cover_color: input.coverColor,
    emoji: input.emoji,
  };
}

export function transformBookUpdateInput(input: IUpdateBookInput) {
  const { id, ...rest } = input;
  return {
    title: rest.title,
    description: rest.description,
    cover_color: rest.coverColor,
    emoji: rest.emoji,
  };
}

export function transformEntryInput(input: ICreateEntryInput) {
  return {
    book_id: input.bookId,
    title: input.title,
    content: input.content,
    mood: input.mood,
    tags: input.tags,
  };
}

export function transformEntryUpdateInput(input: IUpdateEntryInput) {
  const { id, ...rest } = input;
  return {
    title: rest.title,
    content: rest.content,
    mood: rest.mood,
    tags: rest.tags,
  };
}

export function getTextFromContent(content: any): string {
  if (!content) return "";
  if (typeof content === "string") {
    if (content.startsWith("<")) {
      const div = document.createElement("div");
      div.innerHTML = content;
      return div.textContent || div.innerText || "";
    }
    return content;
  }
  if (content.text) return content.text;
  return "";
}
