export default function ButtonAction({
  onClick,
  children,
  color = "bg-yellow",
  ...props
}) {
  const colorClasses = {
    "bg-yellow": "bg-yellow hover:bg-yellow-hover",
    "bg-light-gray": "bg-light-gray hover:bg-gray",
    "bg-warning": "bg-warning hover:bg-warning-hover",
  };
  return (
    <button
      className={`${colorClasses[color]} rounded-md px-2 py-1 w-fit flex flex-row items-center justify-center cursor-pointer`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
