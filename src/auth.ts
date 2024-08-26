import NextAuth, { CredentialsSignin } from "next-auth";
import credentials from "next-auth/providers/credentials";
import dbConnect from "./lib/db-connect";
import UserModel from "./models/user.model";
import bcrypt from "bcryptjs";
import axios from "axios";
import { GetAccessRefreshResponse } from "./types/user";

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
        try {
          //TODO : Add routes in route file
          const response = await axios.get<GetAccessRefreshResponse>(
            "/api/generateAccessRefreshTokens"
          );
          const { accessToken, refreshToken } = response.data;
          return { ...token, accessToken, refreshToken, user };
        } catch (error) {
          return {
            ...token,
            error: "RefreshTokenError",
          };
        }
      }

      // if access token expired
      // request new access token with refresh token as bearer
      // if response is refresh token expired , logout the user and show login page
      // if recieved new access token, forward the token

      return token;
    },

    async session({ session, token, user }) {
      return session;
    },
  },
});
