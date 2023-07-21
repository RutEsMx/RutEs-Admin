export default function CellTable({ className = "", children }) {
  return (
    <div className={`m-1 w-100 ${className}`}>
      <span>{children}</span>
    </div>
  );
}
