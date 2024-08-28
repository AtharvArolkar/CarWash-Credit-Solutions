"use server";

import { signIn } from "@/auth";
import { LoginFormError } from "@/types/common";
import { CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";

export async function login(
  _: any,
  formData: FormData
): Promise<LoginFormError> {
  const identifier = formData.get("identifier");
  const password = formData.get("password");
  const errorObject: LoginFormError = {
    errors: { email: "", password: "", loginError: "" },
  };

  if (!identifier) {
    errorObject.errors.email = "Please enter your email or phone number";
  }

  if (!password) {
    errorObject.errors.password = "Please enter your password";
  }

  if (errorObject.errors.email.trim() || errorObject.errors.password.trim()) {
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
        loginError: (error as CredentialsSignin).message.split(".")[0],
      },
    };
  }
  redirect("/");
}
