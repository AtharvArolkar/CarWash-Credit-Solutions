"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { TriangleAlert } from "lucide-react";
import loginBg from "/public/login-bg.jpg";
import { useFormState, useFormStatus } from "react-dom";
import { login } from "../../actions/login";
import Link from "next/link";
import { ReactElement } from "react";
import { paths } from "@/lib/routes";

function FormSubmitButton(): ReactElement {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full h-[60px] mt-5 text-md"
      disabled={pending}
    >
      {pending ? "Loading..." : "Log in"}
    </Button>
  );
}
export default function Login(): ReactElement {
  const [state, loginAction] = useFormState(login, null);
  return (
    <div className="w-full h-screen relative">
      <Image src={loginBg} alt="bg" className="-z-5 w-full h-150" />
      <form className="bottom-5 px-5 absolute w-screen" action={loginAction}>
        <p className="text-2xl font-bold flex justify-center mb-10">
          Welcome! to Car Wash
        </p>
        <Input
          type="text"
          name="identifier"
          placeholder="Email or phone number"
          className="h-[60px] text-md bg-slate-50"
        />
        <p className="mb-5 text-xs text-destructive italic pt-1">
          {state?.errors?.email}
        </p>
        <Input
          type="password"
          name="password"
          placeholder="Password"
          className="h-[60px] text-md bg-slate-50"
        />
        <p className="text-xs text-destructive italic pt-1">
          {state?.errors?.password}
        </p>
        {/* TODO: Confirm forgot password logic */}
        {/* <p className="py-2 flex justify-end text-sm">
          Forgot password?
        </p> */}
        <FormSubmitButton />
        <div className="h-16 mt-5">
          {state?.errors.loginError && (
            <div className="bg-red-200 h-full p-2 flex justify-center items-center rounded-sm pl-4">
              <TriangleAlert className="text-red-600 mr-3 text-sm" />
              <div className="text-red-600">
                {state?.errors.loginError}
                {state?.errors.loginError ===
                  "Generate a new password for your account" && (
                  <Link
                    href={paths.changePassword}
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
