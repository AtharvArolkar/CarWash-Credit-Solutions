import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  if (req.nextUrl.pathname === "/change-password") {
    return NextResponse.next();
  }
  if (!req.auth && !req.nextUrl.pathname.includes("/login")) {
    return NextResponse.redirect(
      new URL(`http://localhost:3000/login`, req.url)
    );
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
