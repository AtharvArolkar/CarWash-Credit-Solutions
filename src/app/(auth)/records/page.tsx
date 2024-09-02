import dayjs from "dayjs";
import { ReactElement, ReactNode, Suspense } from "react";

import { auth } from "@/auth";
import FilterRecords from "@/components/filter-records";
import SuspenseLoading from "@/components/suspense-loading";
import { callApi } from "@/helpers/api-service";
import { TABLE_DATE_FORMAT } from "@/lib/constants";
import { apiRoutes } from "@/lib/routes";
import { ApiMethod } from "@/types/common";
import { GetTicketsPayload, TicketReponse, WashType } from "@/types/ticket";

interface RecordsSearchParams {
  search?: string;
  page?: string;
  startDate?: string;
  endDate?: string;
}

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
    payload.endDate = Number(searchParams?.endDate);
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

  return (
    <div className="p-4 overflow-y-auto drop-shadow-sm rounded-l-md border-2">
      <div className="overflow-y rounded-sm border-[1px] max-sm:hidden">
        <div className="h-20 items-center px-6 grid grid-cols-12">
          <div className="col-span-4 text-xl text-gray-600 font-bold">
            {`${recordsList.data.returnedTickets ?? 0} Record(s)`}
          </div>
          <div className="col-span-8">
            <FilterRecords totalRecords={recordsList.data.totalTickets ?? 0} />
          </div>
        </div>
        <table className="table-auto min-w-full divide-y divide-gray-200 dark:divide-neutral-700 border-20 border-gray-100 rounded-md overflow-y-scroll">
          <thead className="bg-gray-100 rounded-t-md h-16  sticky top-0">
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
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700 sm:overflow-y-scroll">
            {recordsList.data.tickets.map(
              (ticket: TicketReponse, key: number) => {
                return (
                  <tr key={key}>
                    <TableDataCell>
                      {ticket.client?.name ?? "Client"}
                    </TableDataCell>
                    <TableDataCell>{ticket.carNumber}</TableDataCell>
                    <TableDataCell>{ticket.carModel}</TableDataCell>
                    <TableDataCell>
                      {getWashTypeLabel(ticket.washType as WashType)}
                    </TableDataCell>
                    <TableDataCell>{ticket.price}</TableDataCell>
                    <TableDataCell>{ticket.pricePaid}</TableDataCell>
                    <TableDataCell>
                      <div
                        className={`rounded-sm text-white p-[1px] text-[12px] w-8 flex justify-center ${
                          ticket.isCredit
                            ? "bg-red-100 text-red-500"
                            : "bg-green-100 text-green-500"
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
