"use client";
import { ReactElement, ReactNode, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

import NavigationPanel from "@/components/navigation-panel";

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
    setNavigationOpen((prev) => !prev);
  };

  return (
    <div className="grid grid-cols-7 sm:grid-cols-12 gap-2 h-screen p-1">
      <aside className="col-span-1" ref={navRef}>
        <NavigationPanel
          navigationOpen={navigationOpen}
          handleMenuClick={handleMenuClick}
        />
      </aside>
      <section className="col-span-6 sm:col-span-11">{children}</section>
    </div>
  );
}
