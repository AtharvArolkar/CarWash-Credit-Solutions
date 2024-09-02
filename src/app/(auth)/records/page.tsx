import Loading from "@/app/loading";
import { auth } from "@/auth";
import SuspenseLoading from "@/components/suspense-loading";
import { Input } from "@/components/ui/input";
import { callApi } from "@/helpers/api-service";
import { TABLE_DATE_FORMAT } from "@/lib/constants";
import { apiRoutes } from "@/lib/routes";
import { ApiMethod } from "@/types/common";
import { GetTicketsPayload, TicketReponse, WashType } from "@/types/ticket";
import dayjs from "dayjs";
import { ReactElement, ReactNode, Suspense } from "react";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";

function TableHeader({ children }: { children: ReactNode }): ReactElement {
  return (
    <th
      scope="col"
      className="px-6 py-3 text-start text-sm font-medium text-gray-500 dark:text-neutral-500"
    >
      {children}
    </th>
  );
}

function TableDataCell({ children }: { children: ReactNode }): ReactElement {
  return (
    <td
      scope="col"
      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200"
    >
      {children}
    </td>
  );
}

interface RecordsSearchParams {
  search?: string;
  page?: string;
  startDate?: string;
  endDate?: string;
}

export default function Records({
  searchParams,
}: {
  searchParams?: RecordsSearchParams;
}): ReactElement {
  return (
    <Suspense fallback={<SuspenseLoading loadingText="Loading Records..." />}>
      <RecordsList searchParams={searchParams} />
    </Suspense>
  );
}

async function RecordsList({
  searchParams,
}: {
  searchParams?: RecordsSearchParams;
}): Promise<ReactElement> {
  const authToken = await auth();
  const payload: GetTicketsPayload = {
    page: 1,
    startDate: 1725107307,
  };

  if (Number.isFinite(Number(searchParams?.page))) {
    payload.page = Number(searchParams?.page) ?? undefined;
  }

  if (searchParams?.search) {
    payload.search = searchParams.search;
  }

  if (Number.isFinite(Number(searchParams?.startDate))) {
    payload.startDate = Number(searchParams?.startDate);
  }

  if (Number.isFinite(Number(searchParams?.endDate))) {
    payload.startDate = Number(searchParams?.endDate);
  }

  const recordsList = await callApi(
    apiRoutes.getTickets,
    ApiMethod.POST,
    authToken?.accessToken,
    payload
  );

  const getWashTypeLabel = (washTypeValue: WashType): string => {
    switch (washTypeValue) {
      case WashType.bodyWash:
        return "Body";
      case WashType.fullWash:
        return "Full";
    }
  };
  console.log(recordsList.data.returnedTickets);
  return (
    <div className="p-4 overflow-y drop-shadow-sm rounded-l-md border-2">
      <div className="overflow-y rounded-sm border-[1px] max-sm:hidden">
        <div className="h-16 items-center px-6 grid grid-cols-12">
          <div className="col-span-5 text-xl text-gray-600 font-bold">
            {`Records ${recordsList.data.returnedTickets ?? 0} | ${
              recordsList.data.totalTickets ?? 0
            }`}
          </div>
          <div className="col-span-3">
            <Input
              className="w-full text-xs"
              placeholder="Search By Client Name / Car no."
            />
          </div>
          <div className="col-span-3">s</div>
          <div className="col-span-1 fill-transparent text-gray-600 flex gap-2 justify-end">
            <ChevronLeft strokeWidth={1} />
            {searchParams?.page ?? 1}
            <ChevronRight strokeWidth={1} />
          </div>
        </div>
        <table className="table-auto min-w-full divide-y divide-gray-200 dark:divide-neutral-700 border-20 border-gray-100 rounded-md overflow-scroll h-full">
          <thead className="bg-gray-100 rounded-t-md h-16">
            <tr>
              <TableHeader>Name</TableHeader>
              <TableHeader>Car Number</TableHeader>
              <TableHeader>Car Model</TableHeader>
              <TableHeader>Wash Type</TableHeader>
              <TableHeader>Price</TableHeader>
              <TableHeader>Price Paid</TableHeader>
              <TableHeader>Is Credit</TableHeader>
              <TableHeader>Created By</TableHeader>
              <TableHeader>Created At</TableHeader>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
            {recordsList.data.tickets.map(
              (ticket: TicketReponse, key: number) => {
                return (
                  <tr key={key}>
                    <TableDataCell>{ticket.client?.name ?? "-"}</TableDataCell>
                    <TableDataCell>{ticket.carNumber}</TableDataCell>
                    <TableDataCell>{ticket.carModel}</TableDataCell>
                    <TableDataCell>
                      {getWashTypeLabel(ticket.washType as WashType)}
                    </TableDataCell>
                    <TableDataCell>{ticket.price}</TableDataCell>
                    <TableDataCell>{ticket.pricePaid}</TableDataCell>
                    <TableDataCell>
                      <div
                        className={`rounded-sm text-white p-1 text-xs w-8 flex justify-center ${
                          ticket.isCredit ? "bg-red-500" : "bg-green-500"
                        }`}
                      >
                        {ticket.isCredit ? "Yes" : "No"}
                      </div>
                    </TableDataCell>
                    <TableDataCell>{ticket.entryBy?.name ?? ""}</TableDataCell>
                    <TableDataCell>
                      {dayjs(ticket.createdAt).format(TABLE_DATE_FORMAT)}
                    </TableDataCell>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
