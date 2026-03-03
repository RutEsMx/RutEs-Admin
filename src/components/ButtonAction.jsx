"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import Spinner from "@/components/ui/Spinner";

export default function ButtonAction({
  onClick,
  children,
  color = "bg-primary",
  loading = false,
  disabled = false,
  ...props
}) {
  const colorClasses = {
    "bg-primary": "bg-primary hover:bg-primary-hover text-white",
    "bg-light-gray": "bg-muted hover:bg-muted-hover text-black",
    "bg-warning": "bg-destructive hover:bg-destructive-foreground text-white",
  };

  return (
    <Button
      className={`${colorClasses[color]} rounded-md px-3 py-2 min-w-[44px] flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </Button>
  );
}
