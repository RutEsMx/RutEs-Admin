"use client";
import Modal from "@/components/Modal";
import { removeRoutes } from "@/services/RoutesServices";
import { useRouter } from "next/navigation";

export default function Page({ params }) {
  const { id } = params;
  const router = useRouter();
  const handleClick = async () => {
    const response = await removeRoutes(id);
    if (!response?.success) return;
    return router.replace("/dashboard/routes");
  };

  const handleCancel = () => {
    router.back();
  };
  return (
    <Modal>
      <form method="dialog" className="modal-box">
        <p className="py-4">¿Confirma la acción?</p>
        <div className="modal-action">
          <button
            onClick={handleCancel}
            className="btn bg-light-gray hover:bg-gray"
          >
            Cancelar
          </button>
          <button
            onClick={handleClick}
            className="btn bg-yellow hover:text-white hover:bg-yellow-hover"
          >
            Aceptar
          </button>
        </div>
      </form>
    </Modal>
  );
}
