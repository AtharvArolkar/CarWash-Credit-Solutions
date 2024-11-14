import axios, { AxiosResponse } from "axios";

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
): Promise<any> => {
  const options: RequestInit = {
    method: ApiMethod[method],
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    },
    body:
      payload && method !== ApiMethod.GET ? JSON.stringify(payload) : undefined,
  };
  try {
    const response = await fetch(url, options);
    if (response.ok) {
      try {
        const data = await response.json();
        return data;
      } catch (error) {
        const err = await response.text();
        throw error;
      }
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
};
