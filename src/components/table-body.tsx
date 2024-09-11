import Link from "next/link";
import { ReactElement, ReactNode } from "react";

export default function TableDataCell({
  path,
  children,
}: {
  path?: string;
  children: ReactNode;
}): ReactElement {
  return (
    <td
      scope="col"
      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200"
    >
      {path && <Link href={path}>{children}</Link>}
      {!path && children}
    </td>
  );
}
