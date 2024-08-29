import { GetAccessRefreshPayload } from "./../types/user";
import axios, { AxiosResponse } from "axios";
import { ApiMethod } from "@/types/common";

export const callApi = async (
  url: string,
  method: ApiMethod,
  token?: string,
  payload?: GetAccessRefreshPayload | string
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
