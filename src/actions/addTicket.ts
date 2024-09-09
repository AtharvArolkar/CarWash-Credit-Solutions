"use server";

import { AxiosError } from "axios";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { callApi } from "@/helpers/api-service";
import { checkErrorResponse } from "@/helpers/response-checker";
import { apiRoutes, paths } from "@/lib/routes";
import { ApiMethod, ApiResponse, FormError } from "@/types/common";
import { AddTicketPayload, WashType } from "@/types/ticket";
import { PaymentMethod } from "@/types/transaction";

export async function addTicket(
  _: any,
  formData: FormData
): Promise<FormError | void> {
  const authUser = await auth();
  const errorObject: FormError = {
    errors: {
      carModel: "",
      carNumber: "",
      washType: "",
      price: "",
      isCredit: "",
      paid: "",
      pricePaid: "",
      paymentMethod: "",
      creditUser: "",
      apiError: "",
    },
  };

  const carModel = formData.get("carModel");
  const carNumber = formData.get("carNumber");
  const washType = formData.get("washType");
  const price = formData.get("price");
  const isCredit = formData.get("isCredit");
  const paid = formData.get("paid");
  const pricePaid = formData.get("pricePaid");
  const paymentMethod = formData.get("paymentMethod");
  const creditUser = formData.get("creditUser");

  if (!carModel) {
    errorObject.errors.carModel = "Car model is required";
  }
  if (!carNumber) {
    errorObject.errors.carNumber = "Car number is required";
  }
  if (!washType) {
    errorObject.errors.washType = "Wash type is required";
  }
  if (!price) {
    errorObject.errors.price = "Price is required";
  }

  if ((paid === "true" || pricePaid) && !paymentMethod) {
    errorObject.errors.paymentMethod =
      "If amount is paid, payment method is required";
  }

  if (isCredit === "true" && !creditUser) {
    errorObject.errors.creditUser = "If credit user, client name is required";
  }

  if (Number(pricePaid) > Number(price)) {
    errorObject.errors.pricePaid =
      "Paid amount cant be greater then total amount";
  }

  if (
    errorObject?.errors?.carModel?.trim() ||
    errorObject?.errors?.carNumber?.trim() ||
    errorObject?.errors?.washType?.trim() ||
    errorObject?.errors?.price?.trim() ||
    errorObject?.errors?.pricePaid?.trim() ||
    errorObject?.errors?.paymentMethod?.trim() ||
    errorObject?.errors?.creditUser?.trim()
  ) {
    return errorObject;
  }

  const payload: AddTicketPayload = {
    carNumber: carNumber?.toString()!,
    carModel: carModel?.toString()!,
    washType: washType?.toString() as WashType,
    price: Number(price),
    createdBy: authUser?.user._id,
  };

  if (paid === "true") {
    payload.pricePaid = Number(price);
  } else {
    if (pricePaid) {
      payload.pricePaid = Number(pricePaid);
    } else {
      payload.pricePaid = 0;
    }
  }

  if ((paid === "true" || pricePaid) && paymentMethod) {
    payload.paymentMethod = paymentMethod as PaymentMethod;
  }

  if (isCredit === "true") {
    payload.isCredit = true;
    payload.clientId = creditUser?.toString();
  }

  try {
    await callApi(
      apiRoutes.addTickets,
      ApiMethod.POST,
      authUser?.accessToken,
      payload
    );
    revalidatePath(paths.records);
    errorObject.success = true;
    return errorObject;
  } catch (error) {
    const apiError = error as AxiosError<ApiResponse>;
    await checkErrorResponse(apiError);
    errorObject.errors.apiError =
      apiError.response?.data.message ?? "Something went wrong";
    return errorObject;
  }
}
