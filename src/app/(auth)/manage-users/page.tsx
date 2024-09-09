import { Pencil, Plus, Trash2 } from "lucide-react";
import { ReactElement, Suspense } from "react";

import { auth } from "@/auth";
import AddEditRecord from "@/components/add-edit-records-form";
import NoRecord from "@/components/no-records";
import SuspenseLoading from "@/components/suspense-loading";
import TableDataCell from "@/components/table-body";
import TableHeader from "@/components/table-header";
import { Button } from "@/components/ui/button";
import { callApi } from "@/helpers/api-service";
import { apiRoutes } from "@/lib/routes";
import { ApiMethod } from "@/types/common";
import { UserListPayload, UserResponse } from "@/types/user";

function UserCard({
  user,
  loggedUserId,
}: {
  user: UserResponse;
  loggedUserId: string;
}): ReactElement {
  return (
    <div
      className={`p-4 border-[0.5px] my-1 border-y-gray-200 rounded-sm flex justify-between gap-4`}
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="font-bold text-lg">{user.name}</div>
        <div className="text-sm">{user.phoneNumber}</div>
        <div className="text-sm">
          {user.role
            ? `${user.role[0]}${user.role.substring(1).toLowerCase()}`
            : "-"}
        </div>
      </div>
      <div className="flex flex-col justify-between items-end w-full p-1">
        <div className="fill-transparent flex flex-row justify-between">
          <Pencil className="w-5 h-5 mx-2" />
          <span
            className={`${user._id === loggedUserId ? "text-gray-500" : ""}`}
          >
            <Trash2 className="w-5 h-5" />
          </span>
        </div>
        {user.isVerified ? "Verified" : "Not Verified"}
      </div>
    </div>
  );
}

export default function ManageUsers(): ReactElement {
  return (
    <Suspense fallback={<SuspenseLoading loadingText="Loading Users..." />}>
      <UsersList />
    </Suspense>
  );
}

async function UsersList(): Promise<ReactElement> {
  const authToken = await auth();
  // TODO: Add search functionality.
  const payload: UserListPayload = {};
  const usersList = await callApi(
    apiRoutes.getUsers,
    ApiMethod.POST,
    authToken?.accessToken,
    payload
  );

  return (
    <>
      <div className="overflow-y-auto rounded-l-md sm:border-2 h-full no-scrollbar">
        <div className="overflow-y rounded-sm sticky top-0">
          <div className="flex justify-between items-center h-20 sticky top-0 bg-white px-4 max-sm:hidden">
            <div className="text-2xl text-gray-600 font-bold  max-sm:hidden">
              Users(s)
            </div>
            <AddEditRecord>
              <Button
                type="submit"
                className="h-12 max-sm:w-24 sm:w-48 p-3 text-sm bg-gradient-to-r from-[#3458D6] to-blue-400 fill-transparent flex max-sm:justify-start gap-2"
              >
                <Plus className="w-5 h-5" />
                <span className="max-sm:hidden">Add New User</span>
              </Button>
            </AddEditRecord>
          </div>
          <div className="overflow-x-scroll sticky top-80  sm:-z-10 w-full no-scrollbar">
            <table className="table-fixed min-w-full divide-y overflow-x-auto divide-gray-200 dark:divide-neutral-700 border-20 border-gray-100 rounded-md overflow-y-scroll  max-sm:hidden no-scrollbar">
              <thead className="bg-gray-100 rounded-t-md h-16 sticky top-0 ">
                <tr>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Phone Number</TableHeader>
                  <TableHeader>Role</TableHeader>
                  <TableHeader>Verified</TableHeader>
                  <TableHeader>{``}</TableHeader>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700 sm:overflow-y-scroll  overflow-x-scroll no-scrollbar">
                {usersList.data.users.map((user: UserResponse, key: number) => {
                  return (
                    <tr key={key} className="group">
                      <TableDataCell>{user.name ?? "-"}</TableDataCell>
                      <TableDataCell>{user.email ?? "-"}</TableDataCell>
                      <TableDataCell>{user.phoneNumber ?? "-"}</TableDataCell>
                      <TableDataCell>
                        {user.role
                          ? `${user.role[0]}${user.role
                              .substring(1)
                              .toLowerCase()}`
                          : "-"}
                      </TableDataCell>
                      <TableDataCell>
                        {user.isVerified ? "Yes" : "No"}
                      </TableDataCell>
                      <TableDataCell>
                        <div>
                          <div className="invisible group-hover:visible flex justify-around">
                            <Button className="bg-white border-[#3458D6] text-[#3458D6] border-[1px] hover:bg-white">
                              Edit
                            </Button>
                            <Button
                              className="bg-white border-[#3458D6] text-[#3458D6] border-[1px] hover:bg-white"
                              disabled={user._id === authToken?.user._id}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </TableDataCell>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {usersList.data.users.length === 0 && <NoRecord />}
          </div>
        </div>
        <div className="sm:hidden -z-20">
          {usersList.data.users.map((user: UserResponse, key: number) => {
            return (
              <UserCard
                user={user}
                loggedUserId={authToken?.user._id}
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
