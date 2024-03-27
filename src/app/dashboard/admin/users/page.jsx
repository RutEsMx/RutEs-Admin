"use client";
import DataTable from "@/components/Table/DataTable";
import AdminCreateButton from "@/components/AdminCreateButton";
import { useUsersStore } from "@/store/useUsersStore";
import { useEffect } from "react";
import { getUsers } from "@/services/UsersServices";

const Page = () => {
  const { users } = useUsersStore();
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <div className="grid grid-cols-2">
        <h1 className="font-bold text-3xl">Usuarios</h1>
        <div className="grid-start-2 me-5">
          <AdminCreateButton href={"/dashboard/admin/users/create"} />
        </div>
      </div>
      <div className="grid grid-rows-1 gap-4">
        <DataTable type={"users"} list={users} />
      </div>
    </>
  );
};

export default Page;
