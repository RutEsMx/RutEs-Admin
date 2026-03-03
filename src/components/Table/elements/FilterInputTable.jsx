"use client";
import { useState, useEffect } from "react";

export default function FilterInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      className="p-2 m-1 shadow-sm border rounded w-full max-w-xs sm:max-w-md"
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
