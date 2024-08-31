import { JWT } from "next-auth/jwt";

import { User as MongoUser } from "@/types/user";

import { UserRole } from "./user";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      _id: string;
      role: UserRole;
      isVerified: boolean;
    } & DefaultSession["user"];
  }

  interface User extends MongoUser {}
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
  interface User extends MongoUser {}
}
