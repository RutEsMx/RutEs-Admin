import { Field } from "formik";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

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
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex flex-col text-xs m-2">
      <label htmlFor={name} className="mb-1">
        {label}
      </label>
      <div className="flex flex-row gap-2">
        <Field
          name={name}
          type={type === "password" && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          className={`h-8 border border-gray rounded-sm p-1 w-full ${
            className || ""
          }`}
          {...props}
        />
        {type === "password" ? (
          <div className="w-8 h-8 flex items-center justify-center">
            {showPassword ? (
              <EyeSlashIcon
                onClick={() => setShowPassword(false)}
                className="h-6 w-6 text-gray-500"
              />
            ) : (
              <EyeIcon
                onClick={() => setShowPassword(true)}
                className="h-6 w-6 text-gray-500"
              />
            )}
          </div>
        ) : null}
      </div>
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};

export default InputField;
