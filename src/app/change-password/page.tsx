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
      className="w-full h-[60px] mt-5 text-md"
      disabled={pending}
    >
      {pending ? "Loading..." : "Change Password"}
    </Button>
  );
}
export default function ChangePassword(): ReactElement {
  const [state, changePasswordAction] = useFormState(changePassword, null);
  const authUser = useSession();

  if (authUser.status === "loading") {
    return <Loading />;
  }
  return (
    <div className="w-full h-screen relative">
      <Image src={loginBg} alt="bg" className="-z-5 w-full h-150" />
      <form
        className="bottom-5 px-5 absolute w-screen"
        action={changePasswordAction}
      >
        <div className="flex justify-center text-6xl font-bold mb-10">Logo</div>
        <Input
          type={authUser.status === "unauthenticated" ? "text" : "password"}
          name={
            authUser.status === "unauthenticated" ? "identifier" : "oldPassword"
          }
          placeholder={
            authUser.status === "unauthenticated"
              ? "Email or phone number"
              : "Old Password"
          }
          className="h-[60px] text-md bg-slate-50"
        />
        <p className="mb-5 text-xs text-destructive italic pt-1">
          {state?.errors?.email || state?.errors.oldPassword}
        </p>
        <Input
          type="password"
          name="newPassword"
          placeholder="New Password"
          className="h-[60px] text-md bg-slate-50"
        />
        <p className="mb-5 text-xs text-destructive italic pt-1">
          {state?.errors?.newPassword}
        </p>
        <Input
          type="password"
          name="confirmNewPassword"
          placeholder="Confirm New Password"
          className="h-[60px] text-md bg-slate-50"
        />
        <p className="text-xs text-destructive italic pt-1">
          {state?.errors?.confirmNewPassword}
        </p>
        <FormSubmitButton />
        <div className="h-16 mt-5">
          {state?.errors.apiError && (
            <div className="bg-red-200 h-full p-2 flex justify-center items-center rounded-sm pl-4">
              <TriangleAlert className="text-red-600 mr-3 text-sm" />
              <div className="text-red-600">{state?.errors.apiError}</div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
