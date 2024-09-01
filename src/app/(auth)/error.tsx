"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { logOut } from "@/helpers/sign-out";
import { LOGIN_REQUIRED_MESSAGE } from "@/lib/constants";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="h-screen w-full flex justify-center align-center flex-col gap-10">
      <h1 className="text-3xl font-bold text-center">Something went wrong!</h1>
      <h2 className="text-xl font-bold text-center">
        We are sorry for the inconvenience
      </h2>
      <Button
        className="w-40 h-[50px] mt-5 text-sm bg-gradient-to-r from-[#3458D6] to-blue-400 self-center"
        onClick={() => reset()}
      >
        Try again
      </Button>
    </div>
  );
}
