import { ReactElement } from "react";

export interface LoginFormError {
  errors: {
    email: string;
    password: string;
    loginError: string | ReactElement;
  };
}

export enum ApiMethod {
  "GET",
  "POST",
  "DELETE",
}

export interface ChangePasswordFormError {
  errors: {
    email: string;
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    apiError: string;
  };
}

export interface ApiResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  body?: any;
}
