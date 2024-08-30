import { Document } from "mongoose";

export interface User extends Document {
  email: string;
  phoneNumber: number;
  name: string;
  password: string;
  role: UserRole;
  isVerified: boolean;
}

export enum UserRole {
  admin = "ADMIN",
  employee = "EMPLOYEE",
  client = "CLIENT",
}

export interface GetAccessRefreshResponse {
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

export interface GetAccessResponse {
  accessToken: string;
}

export interface GetAccessRefreshPayload {
  identifier: string;
}

export interface ChangePasswordPayload {
  identifier?: string;
  oldPassword?: string;
  newPassword: string;
}

export interface GetUserPayload {
  identifier: string;
}

export interface GetUserResponse {
  user: User;
}
