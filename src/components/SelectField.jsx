import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "./ui/label";

const SelectField = ({
  name,
  labelTitle,
  options,
  error,
  placeholder = "Selecciona un elemento",
  ...props
}) => {
  return (
    <div className="flex flex-col text-xs m-2">
      <Label htmlFor={name} className="mb-1">
        {labelTitle}
      </Label>
      <Select {...props}>
        <SelectTrigger className="h-8 rounded-sm" id={name}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map(({ value, label }) => (
              <SelectItem value={value} key={value}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && <span className="text-red-500 text-xs pt-1">{error}</span>}
    </div>
  );
};

export default SelectField;
