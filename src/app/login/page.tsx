"use client";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { TriangleAlert } from "lucide-react";
import loginBg from "/public/login-bg.jpg";
import { useFormState } from "react-dom";
import { login } from "../../actions/login";
import Link from "next/link";
import { ReactElement } from "react";
import { paths } from "@/lib/routes";
import FormSubmitButton from "@/components/form-button";

export default function Login(): ReactElement {
  const [state, loginAction] = useFormState(login, null);
  return (
    <div className="w-full h-screen relative flex justify-center sm:items-center">
      <Image src={loginBg} alt="bg" className="-z-5 h-[300px] sm:hidden" />
      <form
        className="bottom-0 px-3 absolute w-full sm:w-96 sm:relative sm:border-[1px] sm:rounded-sm sm:py-10 sm:flex sm:justify-center sm:items-center sm:px-5 sm:flex-col"
        action={loginAction}
      >
        <p className="text-2xl w-full font-bold flex justify-center mb-10">
          Welcome! to Car Wash
        </p>
        <Input
          type="text"
          name="identifier"
          placeholder="Email or phone number"
          className="h-[50px] w-full text-sm bg-slate-50"
        />
        <p className="mb-3 text-xs text-destructive italic pt-1">
          {state?.errors?.email}
        </p>
        <Input
          type="password"
          name="password"
          placeholder="Password"
          className="h-[50px] w-full text-sm bg-slate-50"
        />
        <p className="text-xs text-destructive italic pt-1">
          {state?.errors?.password}
        </p>
        {/* TODO: Confirm forgot password logic */}
        {/* <p className="py-2 flex justify-end text-sm">
          Forgot password?
        </p> */}
        <FormSubmitButton name="Login" />
        <div
          className={`h-16 mt-3 mb-5 w-full sm:${
            !state?.errors.loginError ? "hidden" : ""
          } sm:mb-0`}
        >
          {state?.errors.loginError && (
            <div className="bg-red-200 h-full p-2 flex items-center rounded-sm pl-4 text-sm">
              <TriangleAlert className="text-red-600 mr-1 w-5 h-8" />
              <div className="text-red-600">
                {state?.errors.loginError}
                {state?.errors.loginError ===
                  "Generate a new password for your account" && (
                  <Link
                    href={paths.setPassword}
                    className="pl-1 text-blue-500 underline"
                  >
                    here
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
