"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Modal = () => {
  const router = useRouter();

  useEffect(() => {
    window.my_modal_1.showModal();
  }, []);

  const handleClick = () => {
    router.back();
  };

  return (
    <dialog id="my_modal_1" className="modal">
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Hello!</h3>
        <p className="py-4">Press ESC key or click the button below to close</p>
        <div className="modal-action">
          {/* if there is a button in form, it will close the modal */}
          <button onClick={handleClick} className="btn">
            Cerrar
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default Modal;
