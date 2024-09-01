import { NextResponse } from "next/server";

import { auth } from "@/auth";

import { isUserAdmin, isUserEmployee } from "./helpers/auth";
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

  if (isUserEmployee(req.auth) && !isUserAdmin(req.auth)) {
    if (req.nextUrl.pathname.includes(paths.manageUsers)) {
      return NextResponse.redirect(new URL(paths.home, req.url));
    }
  }

  if (!isUserEmployee(req.auth)) {
    if (
      req.nextUrl.pathname.includes(paths.records) ||
      req.nextUrl.pathname.includes(paths.credits) ||
      req.nextUrl.pathname.includes(paths.manageUsers)
    ) {
      return NextResponse.redirect(new URL(paths.home, req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
