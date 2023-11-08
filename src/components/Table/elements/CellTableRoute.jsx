import { useRoutesStore } from "@/store/useRoutesStore";

export default function CellTableRoute({ className = "", children }) {
  const { routes } = useRoutesStore();
  const route = routes?.find((route) => route?.id === children);
  return (
    <div className={`m-1 w-100 ${className}`}>
      <span>{route?.name}</span>
    </div>
  );
}
