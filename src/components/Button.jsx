"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const Button = ({
  children,
  color = "bg-primary",
  className = "",
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  ...props
}) => {
  const colorClasses = {
    "bg-primary":
      "bg-primary hover:bg-primary-hover active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary",
    "bg-light-gray":
      "bg-muted hover:bg-muted-hover active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-muted",
  };

  const handleClick = async (e) => {
    if (disabled || loading || !onClick) return;
    await onClick(e);
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`${colorClasses[color]} px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-all duration-200 ease-in-out ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
