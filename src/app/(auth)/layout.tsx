import { Inter } from "next/font/google";
import MainLayout from "@/layouts/main-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Car Wash Credit System",
  description: "Car Wash Credit System",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
