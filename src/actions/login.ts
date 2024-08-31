"use server";

import { CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";

import { signIn } from "@/auth";
import { FormError } from "@/types/common";

export async function login(_: any, formData: FormData): Promise<FormError> {
  const identifier = formData.get("identifier");
  const password = formData.get("password");
  const errorObject: FormError = {
    errors: { identifier: "", password: "", apiError: "" },
  };

  if (!identifier) {
    errorObject.errors.identifier = "Please enter your email or phone number";
  }

  if (!password) {
    errorObject.errors.password = "Please enter your password";
  }

  if (
    errorObject?.errors?.identifier?.trim() ||
    errorObject.errors.password?.trim()
  ) {
    return errorObject;
  }

  try {
    await signIn("credentials", {
      identifier: identifier?.toString(),
      password: password?.toString(),
      redirect: false,
    });
  } catch (error) {
    return {
      errors: {
        email: "",
        password: "",
        apiError: (error as CredentialsSignin).message.split(".")[0],
      },
    };
  }
  redirect("/");
}
