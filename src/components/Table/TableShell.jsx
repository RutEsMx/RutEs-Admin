"use client";
import LogoLayout from "@/components/LogoLayout";

export default function TableShell({
  children,
  rightActions = null,
  className = "",
}) {
  return (
    <div className={`container mx-auto p-4 md:p-6 ${className}`}>
      <div className="flex justify-between items-center flex-wrap gap-4">
        <LogoLayout />
        <div className="flex flex-wrap gap-3 justify-end items-center">
          {rightActions}
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm mt-4 p-4">
        {children}
      </div>
    </div>
  );
}
