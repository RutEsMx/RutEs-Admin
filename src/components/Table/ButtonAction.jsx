export default function ButtonAction({onClick, children}) {
  return (
    <button
      className="bg-light-gray hover:bg-gray text-black text-xs font-bold py-2 sm:py-1 px-4 sm:px-2 rounded border"
      onClick={onClick}
    >
      {children}
    </button>
  );
}