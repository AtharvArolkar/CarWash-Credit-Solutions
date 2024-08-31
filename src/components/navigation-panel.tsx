"use client";
import {
  BadgeCent,
  Contact,
  LayoutDashboard,
  LogOut,
  Maximize2,
  Menu,
  Minimize2,
  SquareKanban,
  User,
  UserRoundPen,
} from "lucide-react";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { MouseEventHandler, ReactElement, useEffect, useState } from "react";

import { isUserAdmin, isUserEmployee } from "@/helpers/auth";
import { logOut } from "@/helpers/sign-out";
import { paths } from "@/lib/routes";

interface NavigationPanelProps {
  navigationOpen: boolean;
  handleMenuClick: MouseEventHandler<SVGSVGElement> | undefined;
}

interface ListItemProps {
  navigationOpen: boolean;
  path?: string;
  className?: string;
  children: ReactElement;
}

function ListItem({
  navigationOpen,
  path,
  className,
  children,
}: ListItemProps): ReactElement {
  return (
    <li
      className={`${className} flex items-center text-white hover:bg-blue-500 hover:p-2 hover:rounded-sm hover:mr-2 transition-all ${
        navigationOpen ? "w-full" : ""
      }`}
    >
      {path ? (
        <Link
          className={`flex items-center text-white ${
            navigationOpen ? "w-full" : ""
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

export default function NavigationPanel({
  navigationOpen,
  handleMenuClick,
}: NavigationPanelProps): ReactElement {
  const [authUser, setAuthUser] = useState<Session | null>(null);
  const [showProfileDetails, setShowProfileDetails] = useState<boolean>(false);
  const handleLogout = async (): Promise<void> => {
    await logOut();
  };

  useEffect(() => {
    (async function () {
      const session = await getSession();
      setAuthUser(session);
    })();
  }, []);

  const handleProfileNameClick = (): void => {
    setShowProfileDetails((prev) => !prev);
  };

  return (
    <nav
      className={`h-full bg-gradient-to-r from-[#3458D6] to-blue-400 rounded-r-lg flex flex-col justify-between text-sm drop-shadow-2xl
                ease-out ${
                  navigationOpen ? "absolute w-2/3 sm:w-1/5 z-50 sm:pl-4" : ""
                }`}
    >
      <div>
        <ul className="h-full rounded-lg flex p-1 flex-col items-center gap-5 sm:gap-10 mt-3">
          <li
            className={` flex items-center text-white ${
              navigationOpen ? "w-full" : ""
            }`}
          >
            <Menu
              className="h-8 w-8 text-white hover:p-1 hover:rounded-sm hover:mr-2 transition-all"
              strokeWidth={1}
              onClick={handleMenuClick}
            />
          </li>
          <li
            className={`flex ${
              showProfileDetails ? "" : "items-center"
            } text-white ${navigationOpen ? "w-full" : ""}`}
          >
            <div>
              <User className="h-8 w-8" fill="white" strokeWidth={1} />
            </div>
            <div className="mr-1.5">
              {navigationOpen && (
                <div className="flex flex-col ml-2 h-full">
                  {authUser?.user ? (
                    <div
                      className={`flex text-xs ${
                        showProfileDetails ? "flex-col" : "h-full items-center"
                      }`}
                    >
                      <div
                        className={`${
                          showProfileDetails ? "text-xl font-bold" : "text-xl"
                        }`}
                      >
                        Welcome, {authUser?.user?.name.split(" ")[0] ?? "--:--"}
                      </div>
                      {showProfileDetails && (
                        <div className="ease-linear transition-all ">
                          <div>{authUser?.user?.phoneNumber ?? "--:--"}</div>
                          <div>{authUser?.user?.email ?? "--:--"}</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>Loading...</>
                  )}
                </div>
              )}
            </div>
            {navigationOpen && (
              <div className={`${showProfileDetails ? "mt-2" : ""}`}>
                {!showProfileDetails ? (
                  <Maximize2
                    className="h-4 w-4"
                    onClick={handleProfileNameClick}
                  />
                ) : (
                  <Minimize2
                    className="h-4 w-4"
                    onClick={handleProfileNameClick}
                  />
                )}
              </div>
            )}
          </li>
          <ListItem navigationOpen={navigationOpen} path={paths.home}>
            <>
              <LayoutDashboard className="h-8 w-8" strokeWidth={1} />
              {navigationOpen && <p className="ml-2">Dashboard</p>}
            </>
          </ListItem>
          {isUserEmployee(authUser) && (
            <ListItem navigationOpen={navigationOpen} path={paths.records}>
              <>
                <SquareKanban className="h-8 w-8" strokeWidth={1} />
                {navigationOpen && <p className="ml-2">Records</p>}
              </>
            </ListItem>
          )}
          {isUserEmployee(authUser) && (
            <ListItem navigationOpen={navigationOpen} path={paths.credits}>
              <>
                <BadgeCent className="h-8 w-8" strokeWidth={1} />
                {navigationOpen && <p className="ml-2">Credits</p>}
              </>
            </ListItem>
          )}
          {isUserAdmin(authUser) && (
            <ListItem navigationOpen={navigationOpen} path={paths.manageUsers}>
              <>
                <Contact className="h-8 w-8" strokeWidth={1} />
                {navigationOpen && <p className="ml-2">Manage Users</p>}
              </>
            </ListItem>
          )}
        </ul>
      </div>
      <div>
        <ul className=" h-full flex p-1 flex-col items-center gap-5 sm:gap-10  mb-2">
          <ListItem navigationOpen={navigationOpen} path={paths.editProfile}>
            <>
              <UserRoundPen className="h-8 w-8" strokeWidth={1} />
              {navigationOpen && <p className="ml-2">Edit Profile</p>}
            </>
          </ListItem>
          <ListItem navigationOpen={navigationOpen} className="cursor-pointer">
            <>
              <LogOut
                className="h-8 w-8"
                strokeWidth={1}
                onClick={handleLogout}
              />
              {navigationOpen && <p className="ml-2">Logout</p>}
            </>
          </ListItem>
        </ul>
      </div>
    </nav>
  );
}
