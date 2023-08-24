export default function HeaderTable({ className, children }) {
  return (
    <div
      className={`p-1 flex items-center justify-center font-bold ${
        className || ""
      }`}
    >
      <h1>{children}</h1>
    </div>
  );
}
