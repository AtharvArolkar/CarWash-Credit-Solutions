export interface FormError {
  errors: {
    [key: string]: string | undefined;
    apiError: string | undefined;
  };
  success?: boolean;
}

export enum ApiMethod {
  "GET",
  "POST",
  "DELETE",
}

export interface ApiResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  body?: any;
}
