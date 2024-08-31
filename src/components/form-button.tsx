"use client";
import { ReactElement } from "react";
import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";

export default function FormSubmitButton(): ReactElement {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full h-[50px] mt-5 text-sm bg-gradient-to-r from-[#3458D6] to-blue-400"
      disabled={pending}
    >
      {pending ? "Loading..." : "Change Password"}
    </Button>
  );
}
