import { useEffect, useRef } from "react";

export default function CheckboxTable({ indeterminate, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !props.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return <input type="checkbox" ref={ref} {...props} />;
}
