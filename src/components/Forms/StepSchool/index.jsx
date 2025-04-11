import FileInput from "@/components/FileInput";
import InputField from "@/components/InputField";
import { useFormikContext } from "formik";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";

const StepSchool = () => {
  const { values, handleChange, errors, setFieldValue, submitForm } = useFormikContext();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.currentTarget.files[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // 1. Subir el archivo a Firebase Storage
      const storage = getStorage();
      const storageRef = ref(storage, `school-logos/${file.name}_${Date.now()}`);
      await uploadBytes(storageRef, file);
      
      // 2. Obtener la URL de descarga
      const downloadURL = await getDownloadURL(storageRef);
      
      // 3. Guardar la URL en el formulario
      setFieldValue("logoURL", downloadURL);
      setFieldValue("logoFile", file); // Opcional: guardar el archivo también
    } catch (error) {
      console.error("Error uploading file:", error);
      setFieldValue("logoError", "Error al subir el logo");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 p-4 ">
        <div className="col-span-2">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <InputField
              label="Nombre"
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              error={errors.name}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Correo electrónico"
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              error={errors.email}
            />
            <InputField
              label="Teléfono"
              type="text"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              error={errors.phone}
              maxLength={10}
            />
            <InputField
              label="Clave"
              type="text"
              name="clave"
              value={values.clave}
              onChange={handleChange}
              error={errors.clave}
              maxLength={10}
            />
          </div>
        </div>
        <div>
          <div className="flex flex-col">
            <FileInput
              label="Logo"
              name="logo"
              onChange={handleFileChange}
              error={errors.logo || errors.logoError}
              disabled={isUploading}
            />
            {isUploading && <p className="text-sm text-gray-500">Subiendo logo...</p>}
            {values.logoURL && (
              <div className="mt-2">
                <p className="text-sm text-green-600">Logo cargado correctamente</p>
                <img 
                  src={values.logoURL} 
                  alt="Preview del logo" 
                  className="mt-2 h-20 object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepSchool;