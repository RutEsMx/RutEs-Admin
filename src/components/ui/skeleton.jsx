"use client";

const Skeleton = ({ className = "", variant = "default" }) => {
  const variants = {
    default: "animate-pulse bg-gray-200 rounded",
    text: "animate-pulse bg-gray-200 h-4 rounded",
    circular: "animate-pulse bg-gray-200 rounded-full",
    card: "animate-pulse bg-gray-200 rounded-lg h-32",
    table: "animate-pulse bg-gray-200 h-8 rounded",
  };

  return (
    <div className={`${variants[variant]} ${className}`} aria-hidden="true" />
  );
};

export default Skeleton;
