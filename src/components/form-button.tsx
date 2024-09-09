"use client";
import { ReactElement } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "./ui/button";

interface FormSubmitButtonProps {
  name: string;
  className?: string;
}
export default function FormSubmitButton({
  name,
  className = "w-full h-[50px] mt-5 text-sm bg-gradient-to-r from-[#3458D6] to-blue-400",
}: FormSubmitButtonProps): ReactElement {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className={className} disabled={pending}>
      {pending ? "Loading..." : name}
    </Button>
  );
}
