import { ReactElement } from "react";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { callApi } from "@/helpers/api-service";
import { logOut } from "@/helpers/sign-out";
import { apiRoutes } from "@/lib/routes";
import { ApiMethod } from "@/types/common";

export default async function ViewProfile(): Promise<ReactElement> {
  const authUser = await auth();
  const response = await callApi(
    apiRoutes.getProfileDetails,
    ApiMethod.GET,
    authUser?.accessToken
  );

  const profileDetails = await response.body;
  return (
    <form action={logOut}>
      <Button type="submit">Logout</Button>
    </form>
  );
}
