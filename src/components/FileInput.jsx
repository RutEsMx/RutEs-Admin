import Image from "next/image";
import { useEffect, useState } from "react";
import { downloadURL } from "@/utils/functionsClient";

const FileInput = ({ label, onChange, value, ...props }) => {
  const [fileName, setFileName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file.name);
    setImageUrl("");
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
    onChange(event);
  };

  useEffect(() => {
    const getImage = async () => {
      if (value) {
        if (typeof value === "string") {
          try {
            const url = await downloadURL(value);
            setImageUrl(url);
          } catch (error) {
            console.error(error);
          }
        } else {
          const file = value;
          const reader = new FileReader();
          reader.onload = () => {
            setImageUrl(reader.result);
          };
          reader.readAsDataURL(file);
        }
      }
    };
    getImage();
  }, [value]);

  return (
    <div className="grid grid-rows-1">
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
        <div className="avatar flex items-center justify-center my-4">
          <div className="w-28 rounded">
            <Image
              src={imageUrl || "/rutes_icon.png"}
              alt={label}
              width={200}
              height={200}
            />
            {fileName && <div className="file-name">{fileName}</div>}
          </div>
        </div>
        <input
          type="file"
          className="file-input file-input-bordered w-full max-w-xs"
          onChange={handleFileChange}
          {...props}
        />
      </div>
    </div>
  );
};

export default FileInput;
