"use client";

import { useAuthContext } from "@/context/AuthContext";
import ButtonLink from "@/components/ButtonLink";

const AdminCreateButton = ({ href }) => {
  const { profile } = useAuthContext();

  const isAdmin =
    profile?.roles?.includes("admin-rutes") ||
    profile?.roles?.includes("admin");

  !isAdmin && null;
  return (
    <div className="flex justify-end gap-2">
      {isAdmin && <ButtonLink href={href}>Crear</ButtonLink>}
    </div>
  );
};

export default AdminCreateButton;
