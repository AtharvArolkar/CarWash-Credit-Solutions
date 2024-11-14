import cash from "/public/cash.png";
import gpay from "/public/gpay.png";
import dayjs from "dayjs";
import { Plus } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { ReactElement, Suspense } from "react";

import { auth } from "@/auth";
import AddEditRecord from "@/components/add-edit-records-form";
import FilterRecords from "@/components/filter-records";
import NoRecord from "@/components/no-records";
import SuspenseLoading from "@/components/suspense-loading";
import TableDataCell from "@/components/table-body";
import TableHeader from "@/components/table-header";
import { Button } from "@/components/ui/button";
import { callApi } from "@/helpers/api-service";
import { RECORDS_QUERY, TABLE_DATE_FORMAT } from "@/lib/constants";
import { apiRoutes, paths } from "@/lib/routes";
import { getWashTypeLabel, isStringFiniteNumber } from "@/lib/utils";
import { ApiMethod } from "@/types/common";
import { GetTicketsPayload, TicketReponse, WashType } from "@/types/ticket";
import { PaymentMethod } from "@/types/transaction";

interface RecordsSearchParams {
  [RECORDS_QUERY.SEARCH]?: string;
  [RECORDS_QUERY.PAGE]?: string;
  [RECORDS_QUERY.START_DATE]?: string;
  [RECORDS_QUERY.END_DATE]?: string;
  [RECORDS_QUERY.HIDE_CREDITS]?: string;
}

function getPaymentImagePath(paymentMethod: string): StaticImageData | "" {
  switch (paymentMethod) {
    case PaymentMethod.cash:
      return cash;
    case PaymentMethod.gpay:
      return gpay;
    default:
      return "";
  }
}

function RecordCard({
  ticket,
  getWashTypeLabel,
}: {
  ticket: TicketReponse;
  getWashTypeLabel: (washTypeValue: WashType) => string;
}): ReactElement {
  return (
    <Link href={`${paths.records}/${ticket._id}`}>
      <div
        className={`p-4 border-[0.5px] my-1 border-y-gray-200 rounded-sm flex justify-between gap-4`}
      >
        <div className="flex flex-col gap-2 w-full">
          <div className="font-bold text-lg">
            {ticket.client?.name ?? "Client"}
          </div>
          <div className="text-sm">{` ${ticket.carModel} | ${ticket.carNumber}`}</div>
          <div className="text-sm">{`${getWashTypeLabel(
            ticket.washType as WashType
          )} Wash`}</div>
        </div>
        <div className="col-span-1 flex justify-center items-center w-20">
          {ticket.paymentMethod && (
            <Image
              src={getPaymentImagePath(ticket?.paymentMethod) as string}
              alt="payment"
              width={30}
              height={30}
            />
          )}
        </div>
        <div className="flex justify-center items-center w-full p-1">
          <div
            className={`p-3 rounded-3xl flex items-center justify-center font-bold text-sm ${
              ticket.pricePaid === ticket.price
                ? "bg-green-100 text-green-500 border-green-500 border-[0.5px]"
                : ticket.isCredit
                ? "bg-yellow-200 text-yellow-800 border-yellow-800 border-[0.5px]"
                : "bg-red-200 text-red-500 border-red-500 border-[0.5px]"
            }`}
          >
            {`Price: ${ticket.price}`}
          </div>
        </div>
      </div>
    </Link>
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

  if (isStringFiniteNumber(searchParams?.[RECORDS_QUERY.PAGE])) {
    payload.page = Number(searchParams?.[RECORDS_QUERY.PAGE]) ?? undefined;
  }

  if (searchParams?.[RECORDS_QUERY.SEARCH]) {
    payload.search = searchParams?.[RECORDS_QUERY.SEARCH];
  }

  if (isStringFiniteNumber(searchParams?.[RECORDS_QUERY.START_DATE])) {
    payload.startDate = Number(searchParams?.[RECORDS_QUERY.START_DATE]);
  }

  if (isStringFiniteNumber(searchParams?.[RECORDS_QUERY.END_DATE])) {
    payload.endDate = Number(searchParams?.[RECORDS_QUERY.END_DATE]);
  }

  if (searchParams?.[RECORDS_QUERY.HIDE_CREDITS]) {
    payload.hideCredits =
      searchParams?.[RECORDS_QUERY.HIDE_CREDITS] === "true" || false;
  }

  const response = await callApi(
    apiRoutes.getTickets,
    ApiMethod.POST,
    authToken?.accessToken,
    payload
  );

  const recordsList = await response.body;

  return (
    <>
      <div className="overflow-y-auto rounded-l-md sm:border-2 h-full no-scrollbar">
        <div className="overflow-y rounded-sm sticky top-0">
          <div className="flex justify-between items-center h-20 sticky top-0 bg-white px-4 max-sm:hidden">
            <div className="text-2xl text-gray-600 font-bold  max-sm:hidden">
              Record(s)
            </div>
            <AddEditRecord>
              <Button
                type="submit"
                className="h-12 max-sm:w-24 sm:w-48 p-3 text-sm bg-gradient-to-r from-[#3458D6] to-blue-400 fill-transparent flex max-sm:justify-start gap-2"
              >
                <Plus className="w-5 h-5" />
                <span className="max-sm:hidden">Add New Records</span>
              </Button>
            </AddEditRecord>
          </div>
          <div className="h-20 max-sm:h-auto items-center sm:px-6 grid grid-cols-12 sticky sm:top-20 sm:border-y-[1px] bg-white">
            <div className="col-span-2 text-xl text-gray-600 font-bold max-sm:hidden"></div>
            <div className="lg:col-span-10 col-span-12 bg-white">
              <FilterRecords totalRecords={recordsList.totalTickets ?? 0} />
            </div>
          </div>
          <div className="overflow-x-scroll sticky top-80  sm:-z-10 w-full no-scrollbar">
            <table className="table-fixed min-w-full divide-y overflow-x-auto divide-gray-200 dark:divide-neutral-700 border-20 border-gray-100 rounded-md overflow-y-scroll  max-sm:hidden no-scrollbar">
              <thead className="bg-gray-100 rounded-t-md h-16 sticky top-0 ">
                <tr>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Car Number</TableHeader>
                  <TableHeader>Car Model</TableHeader>
                  <TableHeader>Wash Type</TableHeader>
                  <TableHeader>Price</TableHeader>
                  <TableHeader>Price Paid</TableHeader>
                  <TableHeader>Payment Method</TableHeader>
                  <TableHeader>Is Credit</TableHeader>
                  <TableHeader>Created At</TableHeader>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700 sm:overflow-y-scroll  overflow-x-scroll no-scrollbar">
                {recordsList.tickets.map(
                  (ticket: TicketReponse, key: number) => {
                    return (
                      <tr key={key}>
                        <TableDataCell path={`${paths.records}/${ticket._id}`}>
                          {ticket.client?.name ?? "Client"}
                        </TableDataCell>
                        <TableDataCell path={`${paths.records}/${ticket._id}`}>
                          {ticket.carNumber}
                        </TableDataCell>
                        <TableDataCell path={`${paths.records}/${ticket._id}`}>
                          {ticket.carModel}
                        </TableDataCell>
                        <TableDataCell path={`${paths.records}/${ticket._id}`}>
                          {getWashTypeLabel(ticket.washType as WashType)}
                        </TableDataCell>
                        <TableDataCell path={`${paths.records}/${ticket._id}`}>
                          {ticket.price}
                        </TableDataCell>
                        <TableDataCell path={`${paths.records}/${ticket._id}`}>
                          {ticket.pricePaid}
                        </TableDataCell>
                        <TableDataCell path={`${paths.records}/${ticket._id}`}>
                          <>
                            {ticket.paymentMethod ? (
                              <Image
                                src={
                                  getPaymentImagePath(
                                    ticket.paymentMethod
                                  ) as string
                                }
                                alt="payment"
                                width={40}
                                height={40}
                              />
                            ) : (
                              ""
                            )}
                          </>
                        </TableDataCell>
                        <TableDataCell path={`${paths.records}/${ticket._id}`}>
                          {ticket.isCredit ? "Yes" : "No"}
                        </TableDataCell>
                        <TableDataCell path={`${paths.records}/${ticket._id}`}>
                          {dayjs(ticket.createdAt).format(TABLE_DATE_FORMAT)}
                        </TableDataCell>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
            {recordsList.tickets.length === 0 && <NoRecord />}
          </div>
        </div>
        <div className="sm:hidden -z-20">
          {recordsList.tickets.map((ticket: TicketReponse, key: number) => {
            return (
              <RecordCard
                ticket={ticket}
                getWashTypeLabel={getWashTypeLabel}
                key={key}
              />
            );
          })}
        </div>
      </div>
      <AddEditRecord>
        <Button
          type="submit"
          className="sm:hidden h-12 max-sm:rounded-3xl max-sm:w-12 sm:w-48 p-3 text-sm bg-gradient-to-r from-[#3458D6] to-blue-400 fill-transparent flex max-sm:justify-center gap-2 max-sm:absolute max-sm:right-6 max-sm:bottom-[100px] z-10"
        >
          <Plus className="w-15 h-15" />
        </Button>
      </AddEditRecord>
    </>
  );
}
