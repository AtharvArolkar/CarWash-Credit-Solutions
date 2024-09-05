"use client";
import { ReactElement, useEffect, useRef, useState } from "react";

import { getWashTypeLabel } from "@/lib/utils";
import { TicketReponse, WashType } from "@/types/ticket";
import { PaymentMethod } from "@/types/transaction";
import { AddUsersClientObject } from "@/types/user";

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
  return (
    <AppModal
      modalTitle={"Add New Record"}
      modalContent={<AddEditRecordForm />}
      showSubmitButton={false}
    >
      {children}
    </AppModal>
  );
}

export function AddEditRecordForm(): ReactElement {
  const [isCreditUser, setIsCreditUser] = useState<boolean>(false);
  const [hasPaid, setHasPaid] = useState<boolean>(false);
  const pricePaidRef = useRef(null);
  const isPaidRef = useRef(null);
  const [clientUser, setClientUsers] = useState<AddUsersClientObject[]>([]);
  const [amount, setAmount] = useState<string>("");
  useEffect(() => {}, []);
  return (
    <form>
      <div className="flex max-sm:flex-col gap-2">
        <div className="w-full sm:flex sm:justify-center sm:flex-col pt-1  mb-4">
          <Label htmlFor="carModel" className="mb-1">
            Car Model
          </Label>
          <Input
            type={"text"}
            name={"carModel"}
            className={`h-[50px] w-full sm:w-72 text-sm bg-slate-50`}
          />
          <p className="text-xs text-destructive italic">
            {/* {state?.errors?.[name]} */}
          </p>
        </div>
        <div className="w-full sm:flex sm:justify-center sm:flex-col pt-1  mb-4">
          <Label htmlFor="carNumber" className="mb-1">
            Car Number
          </Label>
          <Input
            type={"text"}
            name={"carNumber"}
            className={`h-[50px] w-full  sm:w-72 text-sm bg-slate-50`}
          />
          <p className="text-xs text-destructive italic">
            {/* {state?.errors?.[name]} */}
          </p>
        </div>
      </div>
      <div className="flex max-sm:flex-col gap-2">
        <div className="w-full sm:flex sm:justify-center sm:flex-col pt-1  mb-4 sm:w-72">
          <Label htmlFor="washType" className="mb-1">
            Wash Type
          </Label>
          <Select name="washType">
            <SelectTrigger className="h-[50px] w-full  sm:w-72 text-sm bg-slate-50">
              <SelectValue placeholder="Select the wash type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
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
        </div>
        <div className="w-full sm:flex sm:justify-center sm:flex-col pt-1  mb-4">
          <Label htmlFor="price" className="mb-1">
            Amount
          </Label>
          <Input
            type={"number"}
            name={"price"}
            className={`h-[50px] w-full  sm:w-72 text-sm bg-slate-50`}
            onChange={(e) => {
              setAmount(e.target.value);
              if (hasPaid) {
                pricePaidRef.current.value = e.target.value;
              }
              if (e.target.value === "") {
                setHasPaid(false);
              }
            }}
          />
          <p className="text-xs text-destructive italic">
            {/* {state?.errors?.[name]} */}
          </p>
        </div>
      </div>

      <div className="flex max-sm:flex-col gap-2 ">
        <div className="w-full flex flex-row pt-1 gap-4 mb-4 sm:w-full">
          <div className="flex items-center gap-1">
            <Checkbox
              id="isCredit"
              checked={isCreditUser}
              onCheckedChange={(value) => {
                setIsCreditUser(Boolean(value));
              }}
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
              id="paid"
              ref={isPaidRef}
              checked={hasPaid}
              onCheckedChange={(value) => {
                setHasPaid(Boolean(value));
                if (Boolean(value)) {
                  console.log("checked");
                  pricePaidRef.current.value = amount;
                }
              }}
              disabled={!hasPaid && amount === ""}
            />
            <label
              htmlFor="paid"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Paid
            </label>
          </div>
        </div>
        <div className="w-full sm:flex sm:justify-center sm:flex-col pt-1  mb-4">
          <Label htmlFor="pricePaid" className="mb-1">
            Amount Paid
          </Label>
          <Input
            ref={pricePaidRef}
            type={"number"}
            name={"pricePaid"}
            className={`h-[50px] w-full  sm:w-72 text-sm bg-slate-50`}
            disabled={amount === "" || hasPaid}
          />
          <p className="text-xs text-destructive italic">
            {/* {state?.errors?.[name]} */}
          </p>
        </div>
      </div>

      <div className="flex max-sm:flex-col gap-2">
        <div className="w-full sm:flex sm:justify-center sm:flex-col pt-1  mb-4 sm:w-72">
          <Label htmlFor="paymentType" className="mb-1">
            Payment Method
          </Label>
          <Select name="paymentType">
            <SelectTrigger
              className="h-[50px] w-full  sm:w-72 text-sm bg-slate-50"
              disabled={!hasPaid}
            >
              <SelectValue placeholder="Select the payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
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
        </div>
        <div className="w-full sm:flex sm:justify-center sm:flex-col pt-1  mb-4">
          <Label htmlFor="creditUser" className="mb-1">
            Select Client
          </Label>
          <Select name="creditUser">
            <SelectTrigger
              className="h-[50px] w-full  sm:w-72 text-sm bg-slate-50"
              disabled={!isCreditUser}
            >
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {clientUser.map((client) => {
                  return (
                    <SelectItem value={client._id} key={client._id}>
                      {client.name}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="text-xs text-destructive italic">
            {/* {state?.errors?.[name]} */}
          </p>
        </div>
      </div>
      <div className="flex max-sm:flex-col gap-2 sm:justify-end">
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

// add ref for client user
