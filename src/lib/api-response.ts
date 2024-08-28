export const createApiResponse = (
  success: boolean,
  statusCode: number,
  message?: string,
  body?: any
): Response => {
  return Response.json({ success, message, ...body }, { status: statusCode });
};
