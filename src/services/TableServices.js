import { getStudents } from "./StudentsServices";
import { getSchools } from "./SchoolServices";
import { getParents } from "./ParentsSevices";

export async function fetchDataParents(options) {
  const data = await getParents({ ...options });
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

export async function fetchDataSchools(options) {
  const { data } = await getSchools({ ...options });

  return data.json();
}

export const setStructureDatatable = (data) => {
  const dataTable = {
    rows: data,
  };
  return dataTable;
};
