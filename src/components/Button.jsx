import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

export default function ButtonStep({
  icon,
  color = "bg-primary",
  children,
  className,
  ...props
}) {
  const colorClasses = {
    "bg-primary": "bg-primary hover:bg-primary-hover",
    "bg-light-gray": "bg-muted hover:bg-muted-hover",
  };

  function Icon(props) {
    switch (icon) {
      case "plus":
        return <PlusIcon {...props} />;
      case "minus":
        return <MinusIcon {...props} />;
      default:
        return null;
    }
  }

  return (
    <button
      className={`${colorClasses[color]} px-4 py-2 rounded-md flex items-center ${className} justify-center`}
      {...props}
    >
      <Icon className="h-4 w-4 text-black" />
      {children}
    </button>
  );
}
