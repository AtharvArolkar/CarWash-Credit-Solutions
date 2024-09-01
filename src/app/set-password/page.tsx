import loginBg from "/public/login-bg.jpg";
import Image from "next/image";
import { ReactElement } from "react";

import { changePassword } from "@/actions/changePassword";
import { auth } from "@/auth";
import FormComponent from "@/components/form-component";

export default async function ModifyPassword(): Promise<ReactElement> {
  const authUser = await auth();
  return (
    <div className="w-full h-full  relative flex flex-col justify-center sm:items-center">
      {!authUser && (
        <Image src={loginBg} alt="bg" className="-z-5 h-[300px] sm:hidden" />
      )}
      <FormComponent
        formAction={changePassword}
        formChildrens={[
          {
            name: `${!authUser ? "identifier" : "oldPassword"}`,
            type: `${!authUser ? "text" : "password"}`,
            placeholder: `${
              !authUser ? "Email or phone number" : "Old Password"
            }`,
          },
          {
            name: "newPassword",
            type: "password",
            placeholder: "New Password",
          },
          {
            name: "confirmNewPassword",
            type: "password",
            placeholder: "Confirm New Password",
          },
        ]}
        submitButtonName="Change Password"
      />
    </div>
  );
}
