"use server";

import { auth } from "@/auth";
import { FormError } from "@/types/common";

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
}
