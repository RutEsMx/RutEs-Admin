import { getStudents } from "./StudentsServices";
import { getUsers } from "./UsersServices";
import { getSchools } from "./SchoolServices";
import { getUnits } from "./UnitsServices";
import { setUnits } from "@/store/useUnitsStore";
import { getParents } from "./ParentsSevices";

export async function fetchDataParents(options) {
  const data = await getParents({ ...options });
  console.log("🚀 ~ file: TableServices.js:9 ~ fetchDataParents ~ data:", data);
  if (data?.error) return data;
  return data;
}

export async function fetchDataStudents(options) {
  const data = await getStudents(options?.schoolId);

  return {
    rows: data?.slice(
      options.pageIndex * options.pageSize,
      (options.pageIndex + 1) * options.pageSize,
    ),
    pageCount: Math.ceil(data?.length / options.pageSize),
  };
}

export async function fetchDataUsers(options) {
  const data = await getUsers({ ...options });
  if (data?.error) return data;
  return data;
}

export async function fetchDataSchools(options) {
  const { data } = await getSchools({ ...options });

  return data.json();
}

export async function fetchDataUnits(options) {
  const data = await getUnits({ ...options });
  if (data?.error) return data;
  setUnits(data);
  return data;
}
