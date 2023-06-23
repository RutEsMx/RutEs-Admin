export default function HeaderTable({ className, children }) {
  return (
    <div className={`bg-yellow p-1 flex items-center justify-center ${className || ''}`}>
      <h1>{children}</h1>
    </div>
  );
}