type ApiResponse<T> = {
  message: string;
  code: number;
  data: T;
};

type ApiErrorResponse = {
  message: string;
  code: string;
};
