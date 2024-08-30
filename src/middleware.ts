import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { paths } from "./lib/routes";

export default auth((req) => {
  if (req.nextUrl.pathname === paths.setPassword) {
    return NextResponse.next();
  }
  if (!req.auth && !req.nextUrl.pathname.includes(paths.login)) {
    return NextResponse.redirect(new URL(paths.login, req.url));
  }

  if (req.auth && req.nextUrl.pathname === paths.login) {
    return NextResponse.redirect(new URL(paths.home, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
