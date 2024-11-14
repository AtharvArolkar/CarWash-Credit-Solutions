import { ReactElement } from "react";

import { auth } from "@/auth";
import { callApi } from "@/helpers/api-service";
import { apiRoutes } from "@/lib/routes";
import { ApiMethod } from "@/types/common";

export default async function RecordDetails({
  params,
}: {
  params: { recordId: string };
}): Promise<ReactElement> {
  const authUser = await auth();
  const response = await callApi(
    `${apiRoutes.getTicketDetails}/${params.recordId}`,
    ApiMethod.GET,
    authUser?.accessToken
  );

  const ticketDetails = await response.body;
  return <></>;
}
