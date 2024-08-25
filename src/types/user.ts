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
