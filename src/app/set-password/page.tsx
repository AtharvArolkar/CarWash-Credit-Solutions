"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { TriangleAlert } from "lucide-react";
import loginBg from "/public/login-bg.jpg";
import { useFormState, useFormStatus } from "react-dom";
import { ReactElement } from "react";
import { useSession } from "next-auth/react";
import Loading from "../loading";
import { changePassword } from "@/actions/changePassword";

function FormSubmitButton(): ReactElement {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full h-[50px] mt-5 text-sm"
      disabled={pending}
    >
      {pending ? "Loading..." : "Change Password"}
    </Button>
  );
}
export default function ModifyPassword(): ReactElement {
  const [state, changePasswordAction] = useFormState(changePassword, null);
  const authUser = useSession().status;

  if (authUser === "loading") {
    return <Loading />;
  }
  return (
    <div className="w-full h-screen relative flex justify-center sm:items-center">
      {authUser === "unauthenticated" && (
        <Image
          src={loginBg}
          alt="bg"
          className="-z-5 w-screen h-screen sm:hidden"
        />
      )}
      <form
        className={`bottom-0 px-3 absolute w-full sm:w-96  sm:relative sm:border-[1px] sm:rounded-sm sm:py-10 sm:flex sm:justify-center ${
          authUser === "authenticated"
            ? "flex justify-center flex-col relative items-center"
            : ""
        } sm:px-5 sm:items-center sm:flex-col`}
        action={changePasswordAction}
      >
        <div className="flex justify-center text-6xl font-bold mb-10">Logo</div>
        <Input
          type={authUser === "unauthenticated" ? "text" : "password"}
          name={authUser === "unauthenticated" ? "identifier" : "oldPassword"}
          placeholder={
            authUser === "unauthenticated"
              ? "Email or phone number"
              : "Old Password"
          }
          className="h-[50px] text-sm bg-slate-50"
        />
        <p className="mb-3 text-xs text-destructive italic pt-1">
          {state?.errors?.email || state?.errors.oldPassword}
        </p>
        <Input
          type="password"
          name="newPassword"
          placeholder="New Password"
          className="h-[50px] text-sm bg-slate-50"
        />
        <p className="mb-3 text-xs text-destructive italic pt-1">
          {state?.errors?.newPassword}
        </p>
        <Input
          type="password"
          name="confirmNewPassword"
          placeholder="Confirm New Password"
          className="h-[50px] text-sm bg-slate-50"
        />
        <p className="text-xs text-destructive italic pt-1">
          {state?.errors?.confirmNewPassword}
        </p>
        <FormSubmitButton />
        <div
          className={`h-16 mt-3 mb-5 w-full sm:${
            !state?.errors.apiError ? "hidden" : ""
          } sm:mb-0`}
        >
          {state?.errors.apiError && (
            <div className="bg-red-200 h-full p-2 flex items-center rounded-sm pl-4 text-sm">
              <TriangleAlert className="text-red-600 mr-1 w-5 h-8" />
              <div className="text-red-600">{state?.errors.apiError}</div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
