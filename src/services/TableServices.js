import { generateParents } from "@/utils/DataFaker"

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