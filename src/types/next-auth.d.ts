import { JWT } from "next-auth/jwt";
import { UserRole } from "./user";

import { User as MongoUser } from "@/types/user";

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
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    accessToken?: string;
    refreshToken?: string;
    user: {
      id: string;
      role: UserRole;
    };
  }
}
