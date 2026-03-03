"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export default function ButtonAction({
  onClick,
  children,
  color = "bg-primary",
  loading = false,
  disabled = false,
  ...props
}) {
  const colorClasses = {
    "bg-primary":
      "bg-primary hover:bg-primary-hover active:scale-[0.98] disabled:opacity-50",
    "bg-light-gray":
      "bg-muted hover:bg-muted-hover active:scale-[0.98] disabled:opacity-50",
    "bg-warning":
      "bg-destructive hover:bg-destructive-foreground text-white hover:text-black active:scale-[0.98] disabled:opacity-50",
  };

  return (
    <Button
      className={`${colorClasses[color]} rounded-md px-2 py-1 w-fit flex flex-row items-center justify-center cursor-pointer gap-2 transition-all duration-200 ease-in-out`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
