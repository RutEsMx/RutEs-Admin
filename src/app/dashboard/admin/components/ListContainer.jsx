"use client";
import { useState } from "react";
import School from "./School";
import Users from "./Users";

const ListContainer = () => {
  const [type, setType] = useState("school");

  const handleMenu = (type) => {
    setType(type);
  };

  return (
    <>
      <div className="grid grid-cols-5 gap-4 p-2">
        <div className="col-span-1">
          <ul className="rounded-2xl bg-slate-400 h-full">
            <li
              className="font-bold p-2 cursor-pointer text-center"
              onClick={() => handleMenu("school")}
            >
              Escuela
            </li>
            <li
              className="font-bold p-2 cursor-pointer text-center"
              onClick={() => handleMenu("users")}
            >
              Usuarios
            </li>
          </ul>
        </div>
        <div className="col-span-4">
          {type === "school" ? <School /> : <Users />}
        </div>
      </div>
    </>
  );
};

export default ListContainer;
