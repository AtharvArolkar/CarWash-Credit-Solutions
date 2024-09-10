"use server";

import { AxiosError } from "axios";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { callApi } from "@/helpers/api-service";
import { checkErrorResponse } from "@/helpers/response-checker";
import { apiRoutes, paths } from "@/lib/routes";
import { ApiMethod, ApiResponse, FormError } from "@/types/common";
import { AddUserPayload, UserRole } from "@/types/user";

export async function addUser(
  _: any,
  formData: FormData
): Promise<FormError | void> {
  const authUser = await auth();
  const errorObject: FormError = {
    errors: {
      name: "",
      phoneNumber: "",
      role: "",
      email: "",
      apiError: "",
    },
  };

  const name = formData.get("name");
  const phoneNumber = formData.get("phoneNumber");
  const role = formData.get("role");
  const email = formData.get("email");

  if (!name) {
    errorObject.errors.name = "Name is required";
  }

  if (!phoneNumber) {
    errorObject.errors.phoneNumber = "Phone number is required";
  }

  if (!role) {
    errorObject.errors.role = "Role is required";
  }

  if (
    errorObject.errors.name?.trim() ||
    errorObject.errors.phoneNumber?.trim() ||
    errorObject.errors.role?.trim()
  ) {
    return errorObject;
  }
  const payload: AddUserPayload = {
    name: name?.toString()!,
    phoneNumber: Number(phoneNumber?.toString()),
    role: role?.toString() as UserRole,
  };

  if (email) {
    payload.email = email.toString();
  }

  try {
    await callApi(
      apiRoutes.addUser,
      ApiMethod.POST,
      authUser?.accessToken,
      payload
    );
    revalidatePath(paths.manageUsers);
    errorObject.success = true;
    return errorObject;
  } catch (error) {
    const apiError = error as AxiosError<ApiResponse>;
    console.log(apiError, "@@@@@@@@@@@@@");
    await checkErrorResponse(apiError);
    console.log(apiError, "##################");
    errorObject.errors.apiError =
      apiError.response?.data.message ?? "Something went wrong";
    return errorObject;
  }
}
