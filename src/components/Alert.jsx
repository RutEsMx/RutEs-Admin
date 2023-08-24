const Alert = ({ isOpen, message, type }) => {
  if (!isOpen) return null;
  const typeClass = {
    info: "alert-info",
    success: "alert-success",
    error: "alert-error",
    warning: "alert-warning",
  };

  return (
    <div className={`alert ${typeClass[type]}`}>
      <span>{message}</span>
    </div>
  );
};

export default Alert;
