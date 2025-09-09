export type BaseResponseDto<T> = {
  success: boolean;
  message: string;
  code: number;
  data: T;
};

export type BaseRequestParams = {
  limit?: number;
  page?: number;
  q?: string;
};

export type BaseResponsePaginate<T> = {
  message: string;
  data: T;
  meta: {
    has_more?: boolean;
    is_first_page: boolean;
    limit: number;
    next_cursor?: {
      cursor_id: string;
      cursor_time: string;
      next_url: string;
    };
  };
};
