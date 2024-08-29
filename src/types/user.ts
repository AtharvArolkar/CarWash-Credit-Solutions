import { Document, Types } from "mongoose";

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

export interface ChangePasswordPayload {
  identifier?: string;
  oldPassword?: string;
  newPassword: string;
}
