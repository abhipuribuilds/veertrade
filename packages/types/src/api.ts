export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: ApiError | null;
  meta: PaginationMeta | null;
}

export interface ApiError {
  code: string;
  message: string;
  details: Record<string, string[]> | null;
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
