import { generateParents, generateStudents } from "@/utils/DataFaker"
import { getStudents } from "./StudentsServices"
import { getUsers } from "./UsersServices"

const data = generateParents(25)

export async function fetchData(options) {
  await new Promise(r => setTimeout(r, 500))
  
  return {
    rows: data.slice(
      options.pageIndex * options.pageSize,
      (options.pageIndex + 1) * options.pageSize
    ),
    pageCount: Math.ceil(data.length / options.pageSize),
  }
}


export async function fetchDataStudents(options) {
  const data = await getStudents(options?.schoolId)
  
  return {
    rows: data?.slice(
      options.pageIndex * options.pageSize,
      (options.pageIndex + 1) * options.pageSize
    ),
    pageCount: Math.ceil(data?.length / options.pageSize),
  }
}

export async function fetchDataUsers(options) {
  const data = await getUsers(options?.schoolId)
  
  return {
    rows: data?.slice(
      options.pageIndex * options.pageSize,
      (options.pageIndex + 1) * options.pageSize
    ),
    pageCount: Math.ceil(data?.length / options.pageSize),
  }
}