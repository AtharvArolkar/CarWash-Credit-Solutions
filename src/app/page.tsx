"use client";
import Image from "next/image";
import bcrypt from "bcryptjs";
import UserModel from "@/models/user.model";
import dbConnect from "@/lib/db-connect";
import { signOut } from "next-auth/react";
export default function Home() {
  // const pass = await bcrypt.hash("Atharv", 10);

  // try {
  //   await dbConnect();
  //   const newUser = new UserModel({
  //     email: "atharvarolkar2410@gmail.com",
  //     phoneNumber: 7218018201,
  //     name: "Atharv Arolkar",
  //     password: "$2a$10$j7QpJD1JPgL5XUNZz.dv.evjP5w4T2584ohtbmbsDCUh83U7tHNBy",
  //     role: "ADMIN",
  //     isVerified: true,
  //   });

  //   await newUser.save();
  // } catch (error) {
  //   console.error(error);
  // }

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
