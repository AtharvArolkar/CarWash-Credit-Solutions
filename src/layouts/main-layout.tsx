import { ReactElement, ReactNode } from "react";

import { auth } from "@/auth";
import NavigationPanel from "@/components/navigation-panel";

interface MainLayoutProps {
  children: ReactNode;
}
export default async function MainLayout({
  children,
}: MainLayoutProps): Promise<ReactElement> {
  const authUser = await auth();
  return (
    <div className="grid max-sm:grid-rows-12 h-full sm:grid-cols-12">
      <aside className=" order-2 sm:order-1 max-sm:row-span-1 sm:col-span-2">
        <NavigationPanel authUser={authUser} />
      </aside>
      <section className="order-1 sm:order-2 max-sm:row-span-11 sm:col-span-10 sm:overflow-y-scroll p-4 sm:shadow-xl sm:rounded-l-lg">
        {children}
      </section>
    </div>
  );
}
