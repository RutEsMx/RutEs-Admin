import { Field } from "formik";

const SelectField = ({ name, labelTitle, options, error, ...props }) => {
  return (
    <div className="flex flex-col m-2">
      <label htmlFor={name} className="mb-1 text-xs">
        {labelTitle}
      </label>
      <Field
        name={name}
        component="select"
        className="border border-gray rounded-sm p-1 h-full text-sm"
        {...props}
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Field>
      {error && <span className="text-red-500 text-xs pt-1">{error}</span>}
    </div>
  );
};

export default SelectField;
