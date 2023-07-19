import { Field, ErrorMessage } from "formik";

const SelectField = ({ name, labelTitle, options, error, ...props }) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-1">
        {labelTitle}
      </label>
      <Field
        name={name}
        component="select"
        className="border border-opacity-50 border-black rounded-sm p-1"
        {...props}
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Field>
      {error && <span className="text-red">{error}</span>}
    </div>
  );
};

export default SelectField;
