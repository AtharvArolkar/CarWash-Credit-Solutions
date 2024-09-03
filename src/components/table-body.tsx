import { ReactElement, ReactNode } from "react";

export default function TableDataCell({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <td
      scope="col"
      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200"
    >
      {children}
    </td>
  );
}
