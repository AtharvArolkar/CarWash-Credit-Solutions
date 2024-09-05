import axios, { AxiosError, AxiosResponse } from "axios";

import { ApiMethod } from "@/types/common";
import { AddTicketPayload, GetTicketsPayload } from "@/types/ticket";

import {
  ChangePasswordPayload,
  GetAccessRefreshPayload,
  GetUserPayload,
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
    | string
): Promise<AxiosResponse> => {
  const callOption = {
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    switch (method) {
      case ApiMethod.GET:
        return await axios.get(url, callOption);
      case ApiMethod.POST:
        return await axios.post(url, payload, callOption);
      case ApiMethod.DELETE:
        return await axios.delete(url, callOption);
    }
  } catch (error) {
    throw error;
  }
};
