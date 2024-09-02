"use client";
import { ReactElement, useState } from "react";
import { Input } from "./ui/input";
import { DatePickerWithRange } from "./date-picker-range";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { DateRange } from "react-day-picker";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";

export default function FilterRecords({
  pageNumber = 1,
}: {
  pageNumber?: number;
}): ReactElement {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
  });

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleFilterApply = () => {
    const params = new URLSearchParams(searchParams);
    if (date?.from) {
      params.set("startDate", dayjs(date.from).unix().toString());
      replace(`${pathname}?${params}`);
    }
    if (date?.to) {
      params.set("endDate", dayjs(date.to).unix().toString());
      replace(`${pathname}?${params}`);
    }
    //eslint-disable-next-line
  };
  return (
    <div className="grid grid-cols-11 gap-2">
      <div className="col-span-4">
        <Input
          className="w-full text-xs"
          placeholder="Search By Client Name / Car no."
        />
      </div>
      <div className="col-span-4">
        <DatePickerWithRange
          className="text-gray-500  fill-transparent"
          date={date}
          setDate={setDate}
        />
      </div>
      <div className="col-span-2">
        <Button
          type="submit"
          className="w-full h-full text-sm bg-gradient-to-r from-[#3458D6] to-blue-400"
          //   disabled={pending}
        >
          Search
        </Button>
      </div>
      <div className="h-full col-span-1 fill-transparent text-gray-600 flex items-center justify-end">
        <Button className="p-0 bg-transparent text-gray-600">
          <ChevronLeft className="w-7 h-7 " strokeWidth={1} />
        </Button>
        <span>{pageNumber}</span>
        <Button className="p-0 bg-transparent text-gray-600 ">
          <ChevronRight className="w-7 h-7" strokeWidth={1} />
        </Button>
      </div>
    </div>
  );
}
