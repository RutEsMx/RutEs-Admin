import { useState, useEffect } from "react"

export default function FilterInput ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input 
      className="p-1 m-1 shadow-md border rounded w-1/4"
      {...props} value={value} onChange={e => setValue(e.target.value)} 
    />
  )
}