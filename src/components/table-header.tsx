import { ReactElement, ReactNode } from "react";

export default function TableHeader({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <th
      scope="col"
      className="px-6 py-3 text-start text-sm font-medium text-gray-500 dark:text-neutral-500"
    >
      {children}
    </th>
  );
}
