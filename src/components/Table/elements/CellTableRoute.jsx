"use client";
import { useRoutesStore } from "@/store/useRoutesStore";

export default function CellTableRoute({ className = "", children }) {
  const { routes } = useRoutesStore();
  const route = routes?.find((route) => route?.id === children);
  return (
    <div className={`max-w-full truncate ${className}`}>
      <span title={route?.name}>{route?.name}</span>
    </div>
  );
}
