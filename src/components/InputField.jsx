import { Field } from "formik";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Label } from "./ui/label";

const InputField = ({
  label,
  type,
  name,
  value,
  onChange,
  error,
  className,
  style,
  uppercase = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex flex-col text-xs m-2">
      <Label htmlFor={name} className="mb-1">
        {label}
      </Label>
      <div className="flex flex-row gap-2">
        <Field
          name={name}
          type={type === "password" && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          className={`h-8 border border-gray rounded-sm px-3 py-1 w-full ${
            className || ""
          }`}
          style={{
            textTransform: uppercase ? "uppercase" : "none",
            ...style,
          }}
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
