import { AxiosError } from "axios";

import { STATUS_CODES } from "@/lib/constants";
import { ApiResponse } from "@/types/common";

import { logOut } from "./sign-out";

export async function checkErrorResponse(
  res: AxiosError<ApiResponse>
): Promise<void> {
  if (res.response?.status === STATUS_CODES.LOGIN_REQUIRED) {
    await logOut();
  } else {
    throw res;
  }
}
