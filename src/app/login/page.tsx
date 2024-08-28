"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

import loginBg from "/public/login-bg.jpg";
import { useFormState } from "react-dom";
import { login } from "../actions/login";
import Link from "next/link";
export default function Login() {
  const [state, loginAction] = useFormState(login, null);
  return (
    <div className="w-full h-screen relative">
      <Image src={loginBg} alt="bg" className="-z-5 w-full h-150" />
      <form className="bottom-20 px-5 absolute w-screen" action={loginAction}>
        {/* <Label htmlFor="identifier">Email or Phone Number</Label> */}
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
        <p className="py-2 flex justify-end text-sm">Forgot password?</p>
        <Button type="submit" className="w-full h-[60px] mt-5 text-md">
          Log in
        </Button>
        <div className="h-16 mt-5">
          {state?.errors.loginError && (
            <div className="bg-red-200 h-full p-2 flex content-center justify-center rounded-sm">
              <div className="text-red-600">
                {state?.errors.loginError}
                {state?.errors.loginError ===
                  "Generate a password for your account" && (
                  <Link
                    href="/changePassword"
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
