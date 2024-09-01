"use client";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { ReactElement } from "react";
import { useFormState } from "react-dom";

import { paths } from "@/lib/routes";
import { FormError } from "@/types/common";

import FormSubmitButton from "./form-button";
import { Input } from "./ui/input";

interface FormComponentProps {
  formAction: (prevState: any, formData: FormData) => any | Promise<FormError>;
  formChildrens: {
    name: string;
    type: string;
    placeholder: string;
    className?: string;
  }[];
  submitButtonName: string;
  formTitle?: string;
}
export default function FormComponent({
  formAction,
  formChildrens,
  submitButtonName,
  formTitle,
}: FormComponentProps): ReactElement {
  const [state, modifiedAction] = useFormState(formAction, null);

  const getRedirectPath = (error?: string): string => {
    switch (error) {
      case "Generate a new password for your account":
        return paths.setPassword;
      case "You are not allowed to perform this action. Please login.":
        return paths.login;
      default:
        return paths.home;
    }
  };
  return (
    <form
      className="bottom-0 px-3 flex max-sm:h-full flex-col justify-end  sm:w-96 sm:relative sm:border-[1px] sm:rounded-sm sm:py-10 w-full"
      action={modifiedAction}
    >
      {formTitle && (
        <p className="text-2xl w-full font-bold flex justify-center mb-10">
          {formTitle}
        </p>
      )}
      {formChildrens.map((field, key) => {
        const { name, type, placeholder, className } = field;
        return (
          <div
            key={key}
            className="w-full sm:flex sm:justify-center sm:items-center sm:flex-col pt-1  mb-4"
          >
            <Input
              type={type}
              name={name}
              placeholder={placeholder}
              className={`h-[50px] w-full text-sm bg-slate-50 ${className}`}
            />
            <p className="text-xs text-destructive italic">
              {state?.errors?.[name]}
            </p>
          </div>
        );
      })}
      <FormSubmitButton name={submitButtonName} />
      <div
        className={`h-16 mt-3 mb-5 w-full sm:${
          !state?.errors.apiError ? "hidden" : ""
        } sm:mb-0`}
      >
        {state?.errors.apiError && (
          <div className="bg-red-200 h-full p-2 flex items-center rounded-sm pl-4 text-sm text-red-600 fill-transparent">
            <TriangleAlert className="mr-1 w-5 h-8 " fill="white" />
            <div className="text-red-600">
              {state?.errors?.apiError}
              {(state?.errors.apiError ===
                "Generate a new password for your account" ||
                state.errors.apiError ===
                  "You are not allowed to perform this action. Please login.") && (
                <Link
                  href={getRedirectPath(state?.errors.apiError)}
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
  );
}
