"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

const Avatar = ({
  src,
  alt = "Avatar",
  fallback,
  className,
  size = "default",
}) => {
  const [error, setError] = useState(false);

  const sizes = {
    sm: "h-8 w-8 text-xs",
    default: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!src || error) {
    return (
      <div
        className={cn(
          "rounded-full bg-primary flex items-center justify-center font-semibold text-white",
          sizes[size],
          className,
        )}
      >
        {fallback || getInitials(alt)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className={cn(
        "rounded-full object-cover ring-2 ring-white",
        sizes[size],
        className,
      )}
    />
  );
};

export { Avatar };
