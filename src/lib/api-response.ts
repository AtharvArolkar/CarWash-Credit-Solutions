import { ApiResponse } from "@/types/common";

export const createApiResponse = ({
  success,
  statusCode,
  message,
  body,
}: ApiResponse): Response => {
  return Response.json({ success, message, body }, { status: statusCode });
};
