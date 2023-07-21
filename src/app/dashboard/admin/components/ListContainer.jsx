"use client";
import { useEffect, useState } from "react";
import School from "./School";
import Users from "./Users";
import { useAuthContext } from "@/context/AuthContext";

const ListContainer = () => {
  const { profile } = useAuthContext();
  const [type, setType] = useState("school");

  const isAdminRutes = profile?.roles?.includes("admin-rutes");

  const handleMenu = (type) => {
    setType(type);
  };

  useEffect(() => {
    if (type === "school") {
      document.getElementById("school").classList.add("bg-slate-500");
      document.getElementById("users").classList.remove("bg-slate-500");
    } else if (type === "schools") {
      document.getElementById("schools").classList.add("bg-slate-500");
      document.getElementById("users").classList.remove("bg-slate-500");
    } else {
      document.getElementById("users").classList.add("bg-slate-500");
      document.getElementById("school").classList.remove("bg-slate-500");
    }
  }, [type]);

  const RenderComponent = () => {
    if (type === "school") {
      return <School />;
    } else if (type === "users") {
      return <Users />;
    } else if (type === "schools") {
      return <School />;
    }
  };

  return (
    <>
      <div className="grid grid-cols-5 gap-4 p-2">
        <div className="col-span-1">
          <ul className="rounded-2xl bg-slate-400 h-screen">
            <li
              className={`font-bold p-2 cursor-pointer text-center rounded-t-2xl`}
              onClick={() => handleMenu("school")}
              id="school"
            >
              Escuela
            </li>
            <li
              className={`font-bold p-2 cursor-pointer text-center`}
              onClick={() => handleMenu("users")}
              id="users"
            >
              Usuarios
            </li>
            {isAdminRutes && (
              <li
                className={`font-bold p-2 cursor-pointer text-center`}
                onClick={() => handleMenu("schools")}
                id="schools"
              >
                Escuelas
              </li>
            )}
          </ul>
        </div>
        <div className="col-span-4">
          <RenderComponent />
        </div>
      </div>
    </>
  );
};

export default ListContainer;
