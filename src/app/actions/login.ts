"use server";
import { ReactElement } from "react";

import { signIn } from "@/auth";
import { LoginFormError } from "@/types/common";
import { log } from "console";
import { CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";
// import { signIn } from "next-auth/react";

export async function login(prevState: any, formData: FormData) {
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
    console.log("Sign in call");
    const result = await signIn("credentials", {
      identifier: identifier?.toString(),
      password: password?.toString(),
      redirect: false,
    });
    console.log(result, "ssssssssssssss");
  } catch (error) {
    console.log((error as CredentialsSignin).message, error);
    return {
      errors: {
        email: "",
        password: "",
        loginError: (error as CredentialsSignin).message.split(".")[0],
      },
    };
  }
  // redirect("/");
}
