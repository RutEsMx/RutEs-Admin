"use client";
import React from "react";

export default function IconButton({
  children,
  onClick,
  ariaLabel,
  title,
  variant = "ghost", // ghost | solid | danger
  size = "sm", // sm | md
  disabled = false,
  ...props
}) {
  const sizeClasses = {
    sm: "p-2 h-9 w-9",
    md: "p-3 h-10 w-10",
  };

  const variantClasses = {
    ghost: "bg-transparent hover:bg-gray-100 text-black",
    solid: "bg-primary hover:bg-primary-hover text-white",
    danger: "bg-warning hover:bg-warning/90 text-white",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title || ariaLabel}
      className={`rounded-md inline-flex items-center justify-center ${
        sizeClasses[size]
      } ${
        variantClasses[variant]
      } transition-shadow shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
        props.className || ""
      }`}
      {...props}
    >
      {children}
    </button>
  );
}
