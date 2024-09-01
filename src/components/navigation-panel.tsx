"use client";
import carLogo from "/public/carLogo.png";
import {
  BadgeCent,
  Contact,
  LayoutDashboard,
  LogOut,
  SquareKanban,
  User,
} from "lucide-react";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MouseEventHandler, ReactElement, useEffect, useState } from "react";

import { isUserAdmin, isUserEmployee } from "@/helpers/auth";
import { logOut } from "@/helpers/sign-out";
import { paths } from "@/lib/routes";

interface ListItemProps {
  path?: string;
  className?: string;
  children: ReactElement | ReactElement[];
  onClick?: MouseEventHandler<HTMLLIElement>;
}

function ListItem({
  path,
  className,
  children,
  onClick,
}: ListItemProps): ReactElement {
  const pathName = usePathname();
  return (
    <li
      className={`${className} flex items-center text-white sm:hover:text-lg sm:p-2 sm:hover:rounded-sm sm:hover:mr-2 transition-all sm:w-auto w-full sm:my-5 max-sm:justify-center max-sm:p-1  ${
        path === pathName
          ? "max-sm:border-t-[3px] max-sm:border-t-slate-200 sm:bg-white sm:rounded-sm sm:mr-2"
          : ""
      }`}
      onClick={onClick}
    >
      {path ? (
        <Link
          className={`flex items-center max-sm:flex-col max-sm:p-0 sm:w-full ${
            path === pathName ? "sm:text-[#3458D6]" : ""
          }`}
          href={path}
        >
          {children}
        </Link>
      ) : (
        <>{children}</>
      )}
    </li>
  );
}

export default function NavigationPanel(): ReactElement {
  const [authUser, setAuthUser] = useState<Session | null>(null);
  const handleLogout = async (): Promise<void> => {
    await logOut();
  };

  useEffect(() => {
    (async function () {
      const session = await getSession();
      setAuthUser(session);
    })();
  }, []);

  return (
    <nav
      className={`h-full bg-gradient-to-r from-[#3458D6] to-blue-400 max-sm:rounded-t-md sm:rounded-r-lg flex flex-col max-sm:text-xs sm:text-sm drop-shadow-2xl
                ease-out sm:pl-4`}
    >
      <div className="hidden sm:block w-full ">
        <ul className=" h-full sm:p-1 flex-col items-center  max-sm:justify-evenly gap-5 sm:gap-10 mb-2">
          <li
            className={`mt-4 w-full bg flex items-center text-white transition-all sm:w-auto sm:my-5 max-sm:justify-center max-sm:p-1 `}
          >
            <>
              <Image
                className="h-9 w-11 text-white "
                src={carLogo}
                alt="logo"
              />
              <p className="text-2xl ml-2 font-sans font-bold ">App Name</p>
            </>
          </li>
        </ul>
      </div>
      <div className="max-sm:h-full">
        <ul className="sm:h-full sm:p-1 flex flex-row sm:block sm:mt-3  max-sm:h-full">
          <ListItem
            path={paths.viewProfile}
            className="sm:pl-5 fill-transparent group"
          >
            <User
              className="max-sm:h-5 max-sm:w-5 sm:h-8 sm:w-8"
              strokeWidth={1}
            />
            <p className="sm:ml-2 text-md max-sm:hidden">
              {authUser?.user
                ? `Welcome, ${authUser?.user?.name.split(" ")[0] ?? "--:--"}`
                : "Loading..."}
            </p>
            <p className="sm:ml-2 sm:hidden">Profile</p>
          </ListItem>
          <ListItem
            path={paths.home}
            className="sm:pl-5 fill-transparent group"
          >
            <LayoutDashboard
              className="max-sm:h-5 max-sm:w-5 sm:h-8 sm:w-8 "
              strokeWidth={1}
            />
            <p className="sm:ml-2">Dashboard</p>
          </ListItem>
          {isUserEmployee(authUser) && (
            <ListItem
              path={paths.records}
              className="sm:pl-5 fill-transparent group"
            >
              <SquareKanban
                className="max-sm:h-5 max-sm:w-5 sm:h-8 sm:w-8"
                strokeWidth={1}
              />
              <p className="sm:ml-2">Records</p>
            </ListItem>
          )}
          {isUserEmployee(authUser) && (
            <ListItem
              path={paths.credits}
              className="sm:pl-5 fill-transparent  group"
            >
              <BadgeCent
                className="max-sm:h-5 max-sm:w-5 sm:h-8 sm:w-8"
                strokeWidth={1}
              />
              <p className="sm:ml-2">Credits</p>
            </ListItem>
          )}
          {isUserAdmin(authUser) && (
            <ListItem
              path={paths.manageUsers}
              className="sm:pl-5 fill-transparent group"
            >
              <Contact
                className="max-sm:h-5 max-sm:w-5 sm:h-8 sm:w-8"
                strokeWidth={1}
              />
              <p className="sm:ml-2 max-sm:hidden">Manage Users</p>
              <p className="sm:ml-2 sm:hidden">Manage</p>
            </ListItem>
          )}
          <ListItem
            className="sm:pl-5 fill-transparent group max-sm:hidden cursor-pointer"
            onClick={handleLogout}
          >
            <>
              <LogOut
                className="max-sm:h-5 max-sm:w-5 sm:h-8 sm:w-8"
                strokeWidth={1}
              />
              <p className="sm:ml-2">Logout</p>
            </>
          </ListItem>
        </ul>
      </div>
    </nav>
  );
}
