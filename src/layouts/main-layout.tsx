"use client";
import NavigationPanel from "@/components/navigation-panel";
import { useSession } from "next-auth/react";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import { useRef } from "react";

import { useOnClickOutside } from "usehooks-ts";
interface MainLayoutProps {
  children: ReactNode;
}
export default function MainLayout({
  children,
}: MainLayoutProps): ReactElement {
  const navRef = useRef(null);
  const [navigationOpen, setNavigationOpen] = useState<boolean>(false);
  const handleClickOutsideNav = (): void => {
    if (navigationOpen) {
      setNavigationOpen(false);
    }
  };

  useOnClickOutside(navRef, handleClickOutsideNav);

  const handleMenuClick = (): void => {
    console.log("click");
    setNavigationOpen((prev) => !prev);
  };
  const session = useSession();
  console.log(session);
  return (
    <div className="grid grid-cols-7">
      <aside className="col-span-1" ref={navRef}>
        <NavigationPanel
          navigationOpen={navigationOpen}
          handleMenuClick={handleMenuClick}
        />
      </aside>
      <section className="col-span-6">{children}</section>
    </div>
  );
}
