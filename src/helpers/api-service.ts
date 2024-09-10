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
): Promise<AxiosResponse> => {
  const callOption = {
    headers: { Authorization: `Bearer ${token}` },
  };
  switch (method) {
    case ApiMethod.GET:
      return await axios.get(url, callOption);
    case ApiMethod.POST:
      return await axios.post(url, payload, callOption);
    case ApiMethod.DELETE:
      return await axios.delete(url, callOption);
    case ApiMethod.PATCH:
      return await axios.patch(url, payload, callOption);
    case ApiMethod.PUT:
      return await axios.put(url, payload, callOption);
  }
};
