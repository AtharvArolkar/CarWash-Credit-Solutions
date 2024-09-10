"use client";
import {
  MutableRefObject,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

import { addUser } from "@/actions/addUser";
import { UserResponse, UserRole } from "@/types/user";

import { AppModal } from "./app-modal";
import FormSubmitButton from "./form-button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface AddEditUserProps {
  user?: UserResponse;
  children: ReactElement;
}
export default function AddEditUser({
  children,
}: AddEditUserProps): ReactElement {
  const dialogRef = useRef(null);
  return (
    <AppModal
      modalTitle={"Add New User"}
      modalContent={<AddEditRecordForm dialogRef={dialogRef} />}
      showSubmitButton={false}
      dialogRef={dialogRef}
    >
      {children}
    </AppModal>
  );
}

export function AddEditRecordForm({
  dialogRef,
}: {
  dialogRef: MutableRefObject<null>;
}): ReactElement {
  const [userRole, setUserRole] = useState<string | undefined>(undefined);
  const [state, formAction] = useFormState(addUser, null);
  useEffect(() => {
    if (state?.errors.apiError) {
      toast.error(state?.errors.apiError);
    }
    if (state?.success) {
      toast.success("Successfully created a user");
      // @ts-ignore: Object is possibly 'null'.
      dialogRef.current.click();
    }
    //eslint-disable-next-line
  }, [state]);
  return (
    <form action={formAction}>
      <div className="flex max-sm:flex-col gap-2">
        <div className="w-full sm:flex sm:justify-center sm:flex-col pt-1  sm:mb-4">
          <Label htmlFor="name" className="mb-1">
            Name
          </Label>
          <Input
            type={"text"}
            name={"name"}
            className={`sm:h-[50px] w-full sm:w-72 text-sm bg-slate-50`}
          />
          <p className="text-xs text-destructive italic h-2">
            {state?.errors?.name}
          </p>
        </div>
        <div className="w-full sm:flex sm:justify-center sm:flex-col pt-1  sm:mb-4">
          <Label htmlFor="phoneNumber" className="mb-1">
            Phone Number
          </Label>
          <Input
            type={"number"}
            name={"phoneNumber"}
            className={`sm:h-[50px] w-full sm:w-72 text-sm bg-slate-50`}
          />
          <p className="text-xs text-destructive italic h-2">
            {state?.errors?.phoneNumber}
          </p>
        </div>
      </div>
      <div className="flex max-sm:flex-col gap-2">
        <div className="w-full sm:flex sm:justify-center sm:flex-col pt-1  sm:mb-4">
          <Label htmlFor="email" className="mb-1">
            Email
          </Label>
          <Input
            type={"text"}
            name={"email"}
            className={`sm:h-[50px] w-full sm:w-72 text-sm bg-slate-50`}
          />
          <p className="text-xs text-destructive italic h-2"></p>
        </div>
        <div className="w-full sm:flex sm:justify-center sm:flex-col pt-1  sm:mb-4">
          <Label htmlFor="phoneNumber" className="mb-1">
            User Role
          </Label>
          <Select name="role" value={userRole} onValueChange={setUserRole}>
            <SelectTrigger className="sm:h-[50px] w-full  sm:w-72 text-sm bg-slate-50">
              <SelectValue placeholder="Select the role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select</SelectLabel>
                {Object.values(UserRole).map((role) => {
                  return (
                    <SelectItem value={role} key={role}>
                      {role
                        ? `${role[0]}${role.substring(1).toLowerCase()}`
                        : "-"}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="text-xs text-destructive italic h-2">
            {state?.errors?.role}
          </p>
        </div>
      </div>
      <div className="flex max-sm:flex-col gap-2 sm:justify-end mt-2">
        <FormSubmitButton
          name="Submit"
          className="max-sm:w-full sm:w-36 h-12 text-sm bg-gradient-to-r from-[#3458D6] to-blue-400 flex justify-evenly sm:justify-center sm:gap-1 max-sm:text-xs"
        />
      </div>
    </form>
  );
}
