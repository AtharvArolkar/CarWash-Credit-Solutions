import { JWTPayload } from "jose";
import { Document } from "mongoose";

export interface User extends Document {
  email: string;
  phoneNumber: number;
  name: string;
  password: string;
  role: UserRole;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
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

export interface JWTPayloadObject extends JWTPayload {
  identifier: string;
  exp?: number;
  iat?: number;
}

export interface AddUsersClientObject {
  _id: string;
  name: string;
}

export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  phoneNumber: number;
  role: UserRole;
  isVerified: boolean;
}

export interface AddUserPayload {
  name: string;
  phoneNumber: number;
  role: UserRole;
  email?: string;
}
