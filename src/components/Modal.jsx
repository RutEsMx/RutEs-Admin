"use client";
import { useEffect } from "react";

const Modal = ({ children }) => {
  useEffect(() => {
    window.success_modal.showModal();
  }, []);

  return (
    <dialog id="success_modal" className="modal">
      {children}
    </dialog>
  );
};

export default Modal;
