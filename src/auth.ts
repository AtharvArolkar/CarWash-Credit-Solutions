import NextAuth, { CredentialsSignin } from "next-auth";
import credentials from "next-auth/providers/credentials";
import dbConnect from "./lib/db-connect";
import UserModel from "./models/user.model";
import bcrypt from "bcryptjs";
import axios, { AxiosError } from "axios";
import { GetAccessRefreshResponse, GetAccessResponse } from "./types/user";
import jwt from "jsonwebtoken";
import { headers } from "next/headers";
import { JWT } from "next-auth/jwt";

async function getRefreshAndAccessToken(): Promise<GetAccessRefreshResponse> {
  try {
    //TODO : Add routes in route file
    const response = await axios.get<GetAccessRefreshResponse>(
      "/api/generateAccessRefreshTokens"
    );
    const { accessToken, refreshToken } = response.data;
    return { accessToken, refreshToken };
  } catch (error) {
    return {
      error: "AccessTokenError",
    };
  }
}
async function refreshAccessToken(
  token: JWT
): Promise<GetAccessRefreshResponse> {
  try {
    //TODO : Add routes in route file
    const response = await axios.get<GetAccessRefreshResponse>(
      "/api/refreshAccessToken",
      { headers: { Authorization: `Bearer ${token.refreshToken}` } }
    );
    const { accessToken } = response.data;
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
    credentials({
      credentials: {
        identifier: { label: "Identifier" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credential: any) {
        const { identifier, password } = credential;

        if (!identifier || !password) {
          throw new CredentialsSignin(
            "Invalid phone number / email and password",
            { status: STATUS_CODES.BAD_REQUEST }
          );
        }

        console.log(credentials);
        await dbConnect();

        try {
          const user = await UserModel.findOne({
            $or: [{ email: identifier }, { phoneNumber: Number(identifier) }],
          });

          if (!user) {
            throw new CredentialsSignin("User not found", {
              status: STATUS_CODES.NOT_FOUND,
            });
          }

          if (!user.isVerified) {
            throw new CredentialsSignin(
              "Generate a password for your account",
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
          console.error("Error while authenticating the user", error);
          throw new CredentialsSignin("Something went wrong", {
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
          });
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        const { accessToken, refreshToken, error } =
          await getRefreshAndAccessToken();
        // token.user.role = user.role!;
        console.log(accessToken, refreshToken);
        return {
          ...token,
          accessToken,
          refreshToken,
          error,
        };
      }
      try {
        jwt.verify(token.accessToken ?? "", process.env.ACCESS_TOKEN_SECRET!);
        return token;
      } catch (error) {
        const {
          accessToken,
          refreshToken,
          error: tokenError,
        } = await refreshAccessToken(token);
        if (tokenError === "RefreshTokenExpired") {
          await signOut();
        }
        return { ...token, accessToken, refreshToken, error: tokenError };
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
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
