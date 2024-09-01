import { STATUS_CODES } from "@/lib/constants";
import { ApiResponse } from "@/types/common";
import { AxiosError } from "axios";

export async function checkErrorResponse(
  res: AxiosError<ApiResponse>
): Promise<void> {
  if (res.response?.status === STATUS_CODES.LOGIN_REQUIRED) {
    throw new Error(res.response.data.message ?? "Something went wrong!");
  }
}
