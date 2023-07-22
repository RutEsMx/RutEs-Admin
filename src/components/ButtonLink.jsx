import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function ButtonLink({
  icon,
  color = "bg-yellow",
  children,
  className,
  href,
}) {
  const colorClasses = {
    "bg-yellow": "bg-yellow hover:bg-yellow-hover",
    "bg-light-gray": "bg-light-gray hover:bg-gray",
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
    <div
      className={`${colorClasses[color]} rounded-md h-full px-4 py-2 w-fit items-center justify-center ${className} `}
    >
      <Icon className="h-4 w-4 text-black" />
      <Link href={href}>{children}</Link>
    </div>
  );
}
