import { ReactElement, ReactNode } from "react";

import NavigationPanel from "@/components/navigation-panel";

interface MainLayoutProps {
  children: ReactNode;
}
export default function MainLayout({
  children,
}: MainLayoutProps): ReactElement {
  return (
    <div className="grid max-sm:grid-rows-12 gap-2 h-screen sm:grid-cols-12">
      <aside className=" order-2 sm:order-1 max-sm:row-span-1 sm:col-span-2">
        <NavigationPanel />
      </aside>
      <section className="order-1 sm:order-2 max-sm:row-span-11 sm:col-span-10 sm:overflow-y-scroll p-4">
        {children}
      </section>
    </div>
  );
}
