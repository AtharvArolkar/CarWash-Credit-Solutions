"use client";
import dayjs from "dayjs";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Search,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactElement, useState } from "react";
import { DateRange } from "react-day-picker";

import { Switch } from "@/components/ui/switch";
import { ITEMS_PER_PAGE, RECORDS_QUERY } from "@/lib/constants";
import { isStringFiniteNumber } from "@/lib/utils";

import { DatePickerWithRange } from "./date-picker-range";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function FilterRecords({
  totalRecords,
}: {
  totalRecords: number;
}): ReactElement {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { replace } = useRouter();
  const [date, setDate] = useState<DateRange | undefined>({
    from:
      (isStringFiniteNumber(params?.get(RECORDS_QUERY.START_DATE)) &&
        dayjs
          .unix(Number(params?.get(RECORDS_QUERY.START_DATE)) ?? "")
          .toDate()) ||
      new Date(),
    to:
      (isStringFiniteNumber(params?.get(RECORDS_QUERY.END_DATE)) &&
        dayjs
          .unix(Number(params?.get(RECORDS_QUERY.END_DATE)) ?? "")
          .toDate()) ||
      undefined,
  });
  const [searchByNameAndCarNumber, setSearchByNameAndCarNumber] =
    useState<string>("");
  const [showMoreFilters, setShowMoreFilters] = useState<boolean>(false);
  const [isCreditFilter, setIscreditFilter] = useState<boolean>(
    params?.get(RECORDS_QUERY.HIDE_CREDITS) === "true" || false
  );
  const pageNumber = isStringFiniteNumber(searchParams.get(RECORDS_QUERY.PAGE))
    ? Number(searchParams.get(RECORDS_QUERY.PAGE)) || 1
    : 1;

  if (searchParams.get(RECORDS_QUERY.PAGE) === "1") {
    params.delete(RECORDS_QUERY.PAGE);
    replace(`${pathname}?${params}`);
  }

  const handleFilterApply = (): void => {
    if (date?.from) {
      params.set(RECORDS_QUERY.START_DATE, dayjs(date.from).unix().toString());
    } else {
      params.delete(RECORDS_QUERY.START_DATE);
    }
    if (date?.to && date.to !== date.from) {
      params.set(RECORDS_QUERY.END_DATE, dayjs(date.to).unix().toString());
    } else {
      params.delete(RECORDS_QUERY.END_DATE);
    }
    params.set(RECORDS_QUERY.SEARCH, searchByNameAndCarNumber);
    if (searchByNameAndCarNumber === "") {
      params.delete(RECORDS_QUERY.SEARCH);
    }
    if (isCreditFilter) {
      params.set(RECORDS_QUERY.HIDE_CREDITS, isCreditFilter.toString());
    } else {
      params.delete(RECORDS_QUERY.HIDE_CREDITS);
    }
    replace(`${pathname}?${params}`);
  };

  const handlePagination = (direction: "prev" | "next"): void => {
    const params = new URLSearchParams(searchParams);
    switch (direction) {
      case "next":
        params.set(RECORDS_QUERY.PAGE, (pageNumber + 1).toString());
        break;
      case "prev":
        params.set(RECORDS_QUERY.PAGE, (pageNumber - 1).toString());
        break;
    }
    replace(`${pathname}?${params}`);
  };
  return (
    <div className="grid grid-cols-12 lg:grid-cols-11 gap-2 max-sm:grid max-sm:p-2 max-sm:h-1/2 relative">
      <div className="col-span-3 max-sm:col-span-8 max-sm:order-1 sm:order-2">
        <Input
          className="w-full max-sm:text-sm sm:text-xs"
          placeholder="Search By Client Name / Car no."
          onChange={(e) => {
            setSearchByNameAndCarNumber(e.target.value);
          }}
        />
      </div>
      <div className="h-full lg:col-span-1 sm:col-span-2 max-sm:col-span-3 fill-transparent text-gray-600 flex items-center justify-end max-sm:order-4 sm:order-5">
        <Button
          className="p-0 bg-transparent  hover:bg-transparent text-gray-600"
          onClick={() => handlePagination("prev")}
          disabled={pageNumber - 1 === 0}
        >
          <ChevronLeft
            className="w-7 h-7 hover:w-8 hover:h-8"
            strokeWidth={1}
          />
        </Button>
        <span>{pageNumber}</span>
        <Button
          className="p-0 bg-transparent hover:bg-transparent text-gray-600"
          onClick={() => handlePagination("next")}
          disabled={pageNumber * ITEMS_PER_PAGE > totalRecords}
        >
          <ChevronRight
            className="w-7 h-7 hover:w-8 hover:h-8"
            strokeWidth={1}
          />
        </Button>
      </div>

      <div
        className={` col-span-2 max-sm:col-span-12 max-sm:order-5 flex items-center justify-end gap-2 sm:order-1 max-sm:${
          showMoreFilters ? "block" : "hidden"
        }`}
      >
        <Switch
          id="credits"
          className="data-[state=checked]:bg-[#3458D6]"
          color="#3458D6"
          checked={isCreditFilter}
          onCheckedChange={setIscreditFilter}
        />
        <Label htmlFor="credits">Hide credits</Label>
      </div>
      <div className={`col-span-3 max-sm:col-span-9 max-sm:order-3 sm:order-3`}>
        <DatePickerWithRange
          className="text-gray-500  fill-transparent"
          date={date}
          setDate={setDate}
        />
      </div>
      <div className={`col-span-2 max-sm:col-span-4 max-sm:order-2 sm:order-4`}>
        <Button
          className="w-full h-full text-sm bg-gradient-to-r from-[#3458D6] to-blue-400 fill-transparent flex justify-evenly sm:justify-center sm:gap-1 max-sm:text-xs"
          onClick={handleFilterApply}
        >
          <Search className="w-5 h-5 max-sm:h:4 max-sm:h-4" />
          Search
        </Button>
      </div>

      <Button
        type="submit"
        className="sm:hidden h-6 max-sm:rounded-b-sm max-sm:w-12 p-3 bg-white text-black drop-shadow-md text-sm flex max-sm:justify-center gap-2 max-sm:absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-sm:-bottom-7 z-10 absolute fill-transparent focus:bg-white"
        onClick={() => {
          setShowMoreFilters((prev) => !prev);
        }}
      >
        {showMoreFilters ? <ChevronUp /> : <ChevronDown />}
      </Button>
    </div>
  );
}
