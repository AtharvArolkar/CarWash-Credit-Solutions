"use server";
import { signOut } from "@/auth";
import { paths } from "@/lib/routes";

export async function logOut(): Promise<void> {
  await signOut({ redirectTo: paths.login });
}
