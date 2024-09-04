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
import { ITEMS_PER_PAGE } from "@/lib/constants";

import { DatePickerWithRange } from "./date-picker-range";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function FilterRecords({
  totalRecords,
}: {
  totalRecords: number;
}): ReactElement {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
  });
  const [searchByNameAndCarNumber, setSearchByNameAndCarNumber] =
    useState<string>("");
  const [showMoreFilters, setShowMoreFilters] = useState<boolean>(false);
  const [isCreditFilter, setIscreditFilter] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { replace } = useRouter();
  const pageNumber = Number.isFinite(Number(searchParams.get("page")))
    ? Number(searchParams.get("page")) || 1
    : 1;

  if (searchParams.get("page") === "1") {
    params.delete("page");
    replace(`${pathname}?${params}`);
  }

  const handleFilterApply = (): void => {
    if (date?.from) {
      params.set("startDate", dayjs(date.from).unix().toString());
    }
    if (date?.to && date.to !== date.from) {
      params.set("endDate", dayjs(date.to).unix().toString());
    }
    params.set("search", searchByNameAndCarNumber);
    if (searchByNameAndCarNumber === "") {
      params.delete("search");
    }
    if (isCreditFilter) {
      params.set("isCredit", isCreditFilter.toString());
    } else {
      params.delete("isCredit");
    }
    replace(`${pathname}?${params}`);
  };

  const handlePagination = (direction: "prev" | "next"): void => {
    const params = new URLSearchParams(searchParams);
    switch (direction) {
      case "next":
        params.set("page", (pageNumber + 1).toString());
        break;
      case "prev":
        params.set("page", (pageNumber - 1).toString());
        break;
    }
    replace(`${pathname}?${params}`);
  };
  return (
    <div className="grid grid-cols-12 lg:grid-cols-11 gap-2 max-sm:grid max-sm:p-2 max-sm:h-1/2 relative">
      <div className="col-span-3 max-sm:col-span-8 max-sm:order-1 sm:order-2">
        <Input
          className="w-full text-xs"
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
          className="data-[state=checked]:bg-[#3458D6]"
          color="#3458D6"
          checked={isCreditFilter}
          onCheckedChange={setIscreditFilter}
        />
        <Label htmlFor="airplane-mode">Only credits</Label>
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
          type="submit"
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
