export interface PaginatedResponse<D> {
  page: number;
  take: number;
  total: number;
  isFinish: boolean;
  rest: number;
  data: D;
}

export type PaginatedRequest<D = unknown> = {
  page?: number;
  take?: number;
} & D;
