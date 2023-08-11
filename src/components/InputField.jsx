import { Field } from "formik";

const InputField = ({
  label,
  type,
  name,
  value,
  onChange,
  error,
  className,
  ...props
}) => {
  return (
    <div className="flex flex-col text-xs m-2">
      <label htmlFor={name} className="mb-1">
        {label}
      </label>
      <Field
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`h-8 border border-gray rounded-sm p-1 ${className || ''}`}
        {...props}
      />
      {error && <span className="text-red">{error}</span>}
    </div>
  );
};

export default InputField;
