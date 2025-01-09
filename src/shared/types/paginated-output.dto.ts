export class PaginatedOutputDto<T> {
  data: T[];
  meta: {
    totalPages: number;
  };
}
