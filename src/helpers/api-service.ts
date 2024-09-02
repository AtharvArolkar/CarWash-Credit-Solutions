import axios, { AxiosResponse } from "axios";

import { ApiMethod } from "@/types/common";

import {
  ChangePasswordPayload,
  GetAccessRefreshPayload,
  GetUserPayload,
} from "../types/user";
import { GetTicketsPayload } from "@/types/ticket";

export const callApi = async <Type>(
  url: string,
  method: ApiMethod,
  token?: string,
  payload?:
    | GetAccessRefreshPayload
    | ChangePasswordPayload
    | GetUserPayload
    | GetTicketsPayload
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
  }
};
