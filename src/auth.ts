import { AxiosError } from "axios";
import bcrypt from "bcryptjs";
import NextAuth, { CredentialsSignin } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

import { callApi, callApi1 } from "./helpers/api-service";
import { verifyJWT } from "./helpers/jwt-verify";
import { STATUS_CODES } from "./lib/constants";
import { apiRoutes, paths } from "./lib/routes";
import { ApiMethod, ApiResponse } from "./types/common";
import {
  GetAccessRefreshPayload,
  GetAccessRefreshResponse,
  GetUserPayload,
} from "./types/user";

async function getRefreshAndAccessToken(
  identifier: string
): Promise<GetAccessRefreshResponse> {
  try {
    const payload: GetAccessRefreshPayload = {
      identifier,
    };
    const response = await callApi1<ApiResponse>(
      apiRoutes.generateAccessRefreshTokens,
      ApiMethod.POST,
      undefined,
      payload
    );
    const { accessToken, refreshToken } = response.body;
    return { accessToken, refreshToken };
  } catch (error) {
    return {
      error: "AccessTokenError",
    };
  }
}
async function refreshAccessToken(
  token: JWT,
  identifier: string
): Promise<GetAccessRefreshResponse> {
  try {
    const payload: GetAccessRefreshPayload = {
      identifier,
    };

    const response = await callApi1<ApiResponse>(
      apiRoutes.refreshAccessToken,
      ApiMethod.POST,
      token.refreshToken,
      payload
    );
    const { accessToken } = response.body;
    return { accessToken };
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      error:
        axiosError.response?.status === STATUS_CODES.UNAUTHORIZED
          ? "RefreshTokenExpired"
          : "AccessTokenError",
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: {},
        password: {},
      },
      async authorize(credential: any) {
        const { identifier, password } = credential;

        if (!identifier || !password) {
          throw new CredentialsSignin(
            "Invalid phone number / email and password",
            { status: STATUS_CODES.BAD_REQUEST }
          );
        }

        try {
          const payload: GetUserPayload = { identifier };
          const response = await callApi1<ApiResponse>(
            apiRoutes.checkUser,
            ApiMethod.POST,
            undefined,
            payload
          );
          const data = response;
          console.log(data, response);

          if (!data.body) {
            throw new CredentialsSignin("User not found", {
              status: STATUS_CODES.NOT_FOUND,
            });
          }
          const { user } = data.body;

          if (!user.isVerified) {
            throw new CredentialsSignin(
              "Generate a new password for your account",
              {
                status: STATUS_CODES.UNAUTHORIZED,
              }
            );
          }
          const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new CredentialsSignin("Incorrect credentials", {
              status: STATUS_CODES.UNAUTHORIZED,
            });
          }

          return user;
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        const { accessToken, refreshToken } = await getRefreshAndAccessToken(
          user._id as string
        );
        token.user = user;
        token.accessToken = accessToken;
        token.refreshToken = refreshToken;
        return token;
      }

      try {
        await verifyJWT(
          token.accessToken ?? "",
          process.env.ACCESS_TOKEN_SECRET ?? ""
        );
        return token;
      } catch (error) {
        const { accessToken, error: tokenError } = await refreshAccessToken(
          token,
          user._id as string
        );
        if (tokenError === "RefreshTokenExpired") {
          await signOut();
        }
        token.accessToken = accessToken;
        return token;
      }
    },

    async session({ session, token }) {
      if (token) {
        session.user = token.user;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }
      return session;
    },
  },
  pages: {
    signIn: paths.login,
  },
  session: {
    strategy: "jwt",
  },
});
