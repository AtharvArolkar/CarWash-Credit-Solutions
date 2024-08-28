"use client";
import Image from "next/image";
import bcrypt from "bcryptjs";
import UserModel from "@/models/user.model";
import dbConnect from "@/lib/db-connect";
import { signOut } from "next-auth/react";
import { ReactElement } from "react";
export default function Home(): ReactElement {
  return (
    <>
      <button
        style={{ background: "white", color: "black" }}
        onClick={async () => await signOut()}
      >
        Signout
      </button>
    </>
  );
}
