import type { Metadata } from "next";
import "./globals.css";

import { Inter } from "next/font/google";
import { Toaster } from "sonner";

import AuthProvider from "@/context/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Car Wash Credit System",
  description: "Car Wash Credit System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} h-screen`}>
        <Toaster richColors />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
