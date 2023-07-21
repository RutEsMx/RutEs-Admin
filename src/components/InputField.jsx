import { Field } from "formik";

const InputField = ({
  label,
  type,
  name,
  value,
  onChange,
  error,
  ...props
}) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-1">
        {label}
      </label>
      <Field
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="border border-opacity-50 border-black rounded-sm p-1"
        {...props}
      />
      {error && <span className="text-red">{error}</span>}
    </div>
  );
};

export default InputField;
