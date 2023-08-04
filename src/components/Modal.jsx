const Modal = () => {
  // < button className = "btn" onClick = {()=> window.my_modal_1.showModal()}> open modal</button >
  return (
    <dialog id="modal_dialog" className="modal">
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Hello!</h3>
        <p className="py-4">Press ESC key or click the button below to close</p>
        <div className="modal-action">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn">Close</button>
        </div>
      </form>
    </dialog>
  );
};

export default Modal;
