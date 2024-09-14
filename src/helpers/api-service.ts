import { ApiMethod } from "@/types/common";
import { AddTicketPayload, GetTicketsPayload } from "@/types/ticket";

import {
  AddUserPayload,
  ChangePasswordPayload,
  GetAccessRefreshPayload,
  GetUserPayload,
  UserListPayload,
} from "../types/user";

export const callApi = async <Type>(
  url: string,
  method: ApiMethod,
  token?: string,
  payload?:
    | GetAccessRefreshPayload
    | ChangePasswordPayload
    | GetUserPayload
    | GetTicketsPayload
    | AddTicketPayload
    | UserListPayload
    | AddUserPayload
    | string
): Promise<Type> => {
  const options: RequestInit = {
    method: method.toString(),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    },
    body:
      payload && method !== ApiMethod.GET ? JSON.stringify(payload) : undefined,
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.log(errorText);
      // throw new Error(
      //   `HTTP error! status: ${response.status}, message: ${errorText}`
      // );
    }

    const data: Type = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};
