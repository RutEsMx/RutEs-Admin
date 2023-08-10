import { generateParents } from "@/utils/DataFaker";
import { getStudents } from "./StudentsServices";
import { getUsers } from "./UsersServices";
import { getSchools } from "./SchoolServices";
import { getUnits } from "./UnitsServices";
import { setUnits } from "@/store/useUnitsStore";

const data = generateParents(25);

export async function fetchData(options) {
  await new Promise((r) => setTimeout(r, 500));

  return {
    rows: data.slice(
      options.pageIndex * options.pageSize,
      (options.pageIndex + 1) * options.pageSize,
    ),
    pageCount: Math.ceil(data.length / options.pageSize),
  };
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

  return data.json();
}

export async function fetchDataSchools(options) {
  const { data } = await getSchools({ ...options });

  return data.json();
}

export async function fetchDataUnits(options) {
  const data = await getUnits({ ...options });
  setUnits(data);
  return data;
}
