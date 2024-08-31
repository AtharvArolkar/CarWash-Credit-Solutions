import { Session } from "next-auth";

import { UserRole } from "@/types/user";

export const isUserAdmin = (authUser: Session | null): boolean => {
  "use client";
  return authUser?.user?.role && authUser?.user.role === UserRole.admin;
};

export const isUserEmployee = (authUser: Session | null): boolean => {
  "use client";
  return (
    authUser?.user?.role &&
    authUser?.user.role &&
    (authUser?.user.role === UserRole.admin ||
      authUser?.user.role === UserRole.employee)
  );
};
