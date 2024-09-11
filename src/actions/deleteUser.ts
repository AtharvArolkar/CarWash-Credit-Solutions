"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { callApi } from "@/helpers/api-service";
import { apiRoutes, paths } from "@/lib/routes";
import { ApiMethod } from "@/types/common";

export async function deleteUser(userId: string): Promise<void> {
  const authUser = await auth();
  try {
    await callApi(
      `${apiRoutes.deleteUser}/${userId}`,
      ApiMethod.DELETE,
      authUser?.accessToken
    );
    revalidatePath(paths.manageUsers);
  } catch (error) {}
}
