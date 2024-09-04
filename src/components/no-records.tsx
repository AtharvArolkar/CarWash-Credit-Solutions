import { ReactElement } from "react";

export default function NoRecord(): ReactElement {
  return (
    <div className="w-full h-52 max-sm:h-96 flex justify-center items-center">
      No Record found, try changing the filter.
    </div>
  );
}
