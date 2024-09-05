"use client";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import {
  MutableRefObject,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

import { addTicket } from "@/actions/addTicket";
import { callApi } from "@/helpers/api-service";
import { checkErrorResponse } from "@/helpers/response-checker";
import { apiRoutes } from "@/lib/routes";
import { getWashTypeLabel } from "@/lib/utils";
import { ApiMethod, ApiResponse } from "@/types/common";
import { TicketReponse, WashType } from "@/types/ticket";
import { PaymentMethod } from "@/types/transaction";
import { AddUsersClientObject, User } from "@/types/user";

import { AppModal } from "./app-modal";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
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

interface AddEditRecordProps {
  ticket?: TicketReponse;
  children: ReactElement;
}
export default function AddEditRecord({
  children,
}: AddEditRecordProps): ReactElement {
  const dialogRef = useRef(null);
  return (
    <AppModal
      modalTitle={"Add New Record"}
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
  const pricePaidRef = useRef(null);
  const isPaidRef = useRef(null);
  const [selectedWashType, setSelectedWashType] = useState<string | undefined>(
    undefined
  );
  const [amount, setAmount] = useState<string>("");
  const [isCreditUser, setIsCreditUser] = useState<boolean>(false);
  const [hasPaid, setHasPaid] = useState<boolean>(false);
  const [amountPaid, setAmountPaid] = useState<string>("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | undefined
  >(undefined);
  const [selectedClient, setSelectedClient] = useState<string | undefined>(
    undefined
  );

  const [clientUser, setClientUsers] = useState<AddUsersClientObject[]>([]);
  const authUser = useSession();
  const [state, formAction] = useFormState(addTicket, null);
  useEffect(() => {
    (async function () {
      try {
        const clientUserList = await callApi<ApiResponse>(
          apiRoutes.getClientUsers,
          ApiMethod.GET,
          authUser.data?.accessToken
        );
        setClientUsers(
          clientUserList.data.users?.map((user: User) => {
            return { _id: user._id, name: user.name };
          }) ?? []
        );
      } catch (error) {
        const apiError = error as AxiosError<ApiResponse>;
        checkErrorResponse(apiError);
      }
    })();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (state?.errors.apiError) {
      toast.error(state?.errors.apiError);
    }
    if (state?.success) {
      toast.success("Successfully created a record");
      // @ts-ignore: Object is possibly 'null'.
      dialogRef.current.click();
    }
  }, [state]);

  return (
    <form action={formAction}>
      <div className="flex max-sm:flex-col gap-2">
        <div className="w-full sm:flex sm:justify-center sm:flex-col pt-1  sm:mb-4">
          <Label htmlFor="carModel" className="mb-1">
            Car Model
          </Label>
          <Input
            type={"text"}
            name={"carModel"}
            className={`sm:h-[50px] w-full sm:w-72 text-sm bg-slate-50`}
          />
          <p className="text-xs text-destructive italic h-2">
            {state?.errors?.carModel}
          </p>
        </div>
        <div className="w-full sm:flex sm:justify-center sm:flex-col pt-1  sm:mb-4">
          <Label htmlFor="carNumber" className="mb-1">
            Car Number
          </Label>
          <Input
            type={"text"}
            name={"carNumber"}
            className={`sm:h-[50px] w-full  sm:w-72 text-sm bg-slate-50`}
          />
          <p className="text-xs text-destructive italic h-2">
            {state?.errors?.carNumber}
          </p>
        </div>
      </div>
      <div className="flex max-sm:flex-col gap-2">
        <div className="w-full sm:flex sm:justify-center sm:flex-col pt-1  sm:mb-4 sm:w-72">
          <Label htmlFor="washType" className="mb-1">
            Wash Type
          </Label>
          <Select
            name="washType"
            value={selectedWashType}
            onValueChange={setSelectedWashType}
          >
            <SelectTrigger className="sm:h-[50px] w-full  sm:w-72 text-sm bg-slate-50">
              <SelectValue placeholder="Select the wash type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select</SelectLabel>
                {Object.values(WashType).map((wash) => {
                  return (
                    <SelectItem value={wash} key={wash}>
                      {`${getWashTypeLabel(wash)} Wash`}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="text-xs text-destructive italic h-2">
            {state?.errors?.washType}
          </p>
        </div>
        <div className="w-full sm:flex sm:justify-center sm:flex-col pt-1  sm:mb-4">
          <Label htmlFor="price" className="mb-1">
            Amount
          </Label>
          <Input
            type={"number"}
            name={"price"}
            className={`sm:h-[50px] w-full  sm:w-72 text-sm bg-slate-50`}
            onChange={(e) => {
              setAmount(e.target.value);
              if (hasPaid) {
                // @ts-ignore: Object is possibly 'null'.
                pricePaidRef.current.value = e.target.value;
                setAmountPaid(e.target.value);
              }
              if (e.target.value === "") {
                setHasPaid(false);
              }
            }}
          />
          <p className="text-xs text-destructive italic h-2">
            {state?.errors?.price}
          </p>
        </div>
      </div>

      <div className="flex max-sm:flex-col gap-2 ">
        <div className="w-full flex flex-row pt-1 gap-4 sm:mb-4 sm:w-full max-sm:pt-4">
          <div className="flex items-center gap-1">
            <Checkbox
              checked={isCreditUser}
              onCheckedChange={(value) => {
                setIsCreditUser(Boolean(value));
                if (!Boolean(value)) {
                  // @ts-ignore: Object is possibly 'null'
                  setSelectedClient("");
                }
              }}
            />
            <input
              type="hidden"
              name="isCredit"
              value={isCreditUser ? "true" : "false"}
            />
            <label
              htmlFor="isCredit"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Credit User
            </label>
          </div>
          <div className="flex items-center gap-1">
            <Checkbox
              ref={isPaidRef}
              checked={hasPaid}
              onCheckedChange={(value) => {
                setHasPaid(Boolean(value));
                if (Boolean(value)) {
                  // @ts-ignore: Object is possibly 'null'.
                  pricePaidRef.current.value = amount;
                  setAmountPaid(amount);
                }
                if (!Boolean(value)) {
                  // @ts-ignore: Object is possibly 'null'.
                  pricePaidRef.current.value = "";
                  setSelectedPaymentMethod("");
                }
              }}
              disabled={!hasPaid && amount === ""}
            />
            <input
              type="hidden"
              name="paid"
              value={hasPaid ? "true" : "false"}
            />
            <label
              htmlFor="paid"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Paid
            </label>
          </div>
        </div>
        <div className="w-full sm:flex sm:justify-center sm:flex-col pt-1  sm:mb-4">
          <Label htmlFor="pricePaid" className="mb-1">
            Amount Paid
          </Label>
          <Input
            ref={pricePaidRef}
            type="number"
            name={"pricePaid"}
            className={`sm:h-[50px] w-full  sm:w-72 text-sm bg-slate-50`}
            disabled={amount === "" || hasPaid}
            onChange={(e) => {
              setAmountPaid(e.target.value);
            }}
          />
          <p className="text-xs text-destructive italic h-2">
            {state?.errors.pricePaid}
          </p>
        </div>
      </div>

      <div className="flex max-sm:flex-col gap-2">
        <div className="w-full sm:flex sm:justify-center sm:flex-col pt-1  sm:mb-4 sm:w-72">
          <Label htmlFor="paymentMethod" className="mb-1">
            Payment Method
          </Label>
          <Select
            name="paymentMethod"
            value={selectedPaymentMethod}
            onValueChange={setSelectedPaymentMethod}
          >
            <SelectTrigger
              className="sm:h-[50px] w-full  sm:w-72 text-sm bg-slate-50"
              disabled={amountPaid === ""}
            >
              <SelectValue placeholder="Select the payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select</SelectLabel>
                {Object.values(PaymentMethod).map((paymentMet) => {
                  return (
                    <SelectItem value={paymentMet} key={paymentMet}>
                      {paymentMet}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="text-xs text-destructive italic h-2">
            {state?.errors?.paymentMethod}
          </p>
        </div>
        <div className="w-full sm:flex sm:justify-center sm:flex-col pt-1  sm:mb-4">
          <Label htmlFor="creditUser" className="mb-1">
            Select Client
          </Label>
          <Select
            name="creditUser"
            value={selectedClient}
            onValueChange={setSelectedClient}
          >
            <SelectTrigger
              className="sm:h-[50px] w-full  sm:w-72 text-sm bg-slate-50"
              disabled={!isCreditUser}
            >
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {clientUser.map((client) => {
                return (
                  <SelectItem value={client._id} key={client._id}>
                    {client.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <p className="text-xs text-destructive italic h-2">
            {state?.errors?.creditUser}
          </p>
        </div>
      </div>
      <div className="flex max-sm:flex-col gap-2 sm:justify-end mt-2">
        <Button
          type="submit"
          className="max-sm:w-full sm:w-36 h-12 text-sm bg-gradient-to-r from-[#3458D6] to-blue-400 flex justify-evenly sm:justify-center sm:gap-1 max-sm:text-xs"
        >
          Add
        </Button>
      </div>
    </form>
  );
}
