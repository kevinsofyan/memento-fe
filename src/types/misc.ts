export interface IPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface IPaginatedResponse<T> {
  data: T[];
  pagination: IPagination;
}
