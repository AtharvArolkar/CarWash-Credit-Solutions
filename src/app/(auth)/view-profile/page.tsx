import { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { logOut } from "@/helpers/sign-out";

export default function ViewProfile(): ReactElement {
  return (
    <form action={logOut}>
      <Button type="submit">Logout</Button>
    </form>
  );
}
