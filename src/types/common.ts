import { ReactElement } from "react";

export interface LoginFormError {
  errors: {
    email: string;
    password: string;
    loginError: string | ReactElement;
  };
}
