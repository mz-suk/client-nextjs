export interface ApiResponse<T> {
  resultCode: number;
  resultMessage: string;
  result: T;
  apiSysCntcId?: string;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}
