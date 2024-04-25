import { Button } from "./ui/button";

export default function ButtonAction({
  onClick,
  children,
  color = "bg-primary",
  ...props
}) {
  const colorClasses = {
    "bg-primary": "bg-primary hover:bg-primary-foreground",
    "bg-light-gray": "bg-muted hover:bg-muted-foreground",
    "bg-warning":
      "bg-destructive hover:bg-destructive-foreground text-white hover:text-black",
  };

  return (
    <Button
      className={`${
        colorClasses[color]
      } rounded-md px-2 py-1 w-fit flex flex-row items-center justify-center cursor-pointer ${
        props.disabled ? "opacity-50 hover:bg-primary" : ""
      }`}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );
}
