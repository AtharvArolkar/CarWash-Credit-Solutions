import NextAuth, { CredentialsSignin } from "next-auth";
import credentials from "next-auth/providers/credentials";
import dbConnect from "./lib/db-connect";
import UserModel from "./models/user.model";
import bcrypt from "bcryptjs";
import axios, { AxiosError } from "axios";
import { GetAccessRefreshResponse } from "./types/user";
import jwt from "jsonwebtoken";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import * as jose from "jose";

async function getRefreshAndAccessToken(): Promise<GetAccessRefreshResponse> {
  try {
    //TODO : Add routes in route file
    const response = await axios.get<GetAccessRefreshResponse>(
      "http://localhost:3000/api/generateAccessRefreshTokens"
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
      "http://localhost:3000/api/refreshAccessToken",
      { headers: { Authorization: `Bearer ${token.refreshToken}` } }
    );
    const { accessToken } = response.data;
    return { accessToken };
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      error:
        axiosError.response?.status === 401
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

        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [{ email: identifier }, { phoneNumber: Number(identifier) }],
          });

          if (!user) {
            throw new CredentialsSignin("User not found", {
              status: 404,
            });
          }

          if (!user.isVerified) {
            throw new CredentialsSignin(
              "Generate a password for your account",
              {
                status: 401,
              }
            );
          }
          const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new CredentialsSignin("Incorrect credentials", {
              status: 401,
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
        const { accessToken, refreshToken } = await getRefreshAndAccessToken();
        token.user = user;
        token.accessToken = accessToken;
        token.refreshToken = refreshToken;
        return token;
      }
      try {
        await jose.jwtVerify(
          token.accessToken ?? "",
          new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET),
          {}
        );
        return token;
      } catch (error) {
        const { accessToken, error: tokenError } = await refreshAccessToken(
          token
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
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
