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

export const callApi1 = async <Type>(
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
  console.log(
    payload,
    payload && method !== ApiMethod.GET ? JSON.stringify(payload) : undefined,
    "ssssssssssssssssssssssssssssss",
    method.toString(),
    ApiMethod[method]
  );
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
    console.log(url);
    const response = await fetch(url, options);
    console.log("AFGTERR");
    // if (!response.ok) {
    //   console.log(response);
    //   throw response;
    //   // console.log("ddddddddddddddd");
    //   // const errorText = await response.text();
    //   // console.log(errorText, "wwwwwwwwwwwwwwwwwww");
    //   // throw new Error(
    //   //   `HTTP error! status: ${response.status}, message: ${errorText}`
    //   // );
    // }

    if (response.ok) {
      try {
        const data = await response.json();
        console.log(data, "DATAAAAAAAAAAA");
        return data;
      } catch (error) {
        const err = await response.text();
        console.log(err, error, "ERRORRRRRRRRRRRRR");
        throw error;
      }
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
};
