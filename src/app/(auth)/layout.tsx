import { Metadata } from "next";
import { Inter } from "next/font/google";

import MainLayout from "@/layouts/main-layout";

export const metadata: Metadata = {
  title: "Car Wash Credit System",
  description: "Car Wash Credit System",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
