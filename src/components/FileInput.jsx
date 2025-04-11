/*import Image from "next/image";
import { useEffect, useState } from "react";

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
          setImageUrl(value);
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

export default FileInput;*/

import Image from "next/image";
import { useEffect, useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const FileInput = ({ 
  label, 
  onChange, 
  value, 
  onUploadComplete, // Nueva prop para manejar la URL final
  storagePath = "uploads", // Ruta base en Firebase Storage
  ...props 
}) => {
  const [fileName, setFileName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validaciones básicas
    if (!file.type.match("image.*")) {
      setError("Solo se permiten archivos de imagen");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB máximo
      setError("El archivo es demasiado grande (máx. 5MB)");
      return;
    }

    setError(null);
    setFileName(file.name);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 1. Mostrar preview local
      const reader = new FileReader();
      reader.onload = () => setImageUrl(reader.result);
      reader.readAsDataURL(file);

      // 2. Subir a Firebase Storage
      const storage = getStorage();
      const fileExt = file.name.split('.').pop();
      const filename = `${Date.now()}.${fileExt}`;
      const storageRef = ref(storage, `${storagePath}/${filename}`);
      
      const uploadTask = uploadBytes(storageRef, file);
      
      // Opcional: Si quieres mostrar progreso (necesitarías usar uploadBytesResumable)
      // uploadTask.on('state_changed', 
      //   (snapshot) => {
      //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      //     setUploadProgress(progress);
      //   },
      //   (error) => { /* manejar error */ },
      //   () => { /* completado */ }
      // );

      await uploadTask;
      
      // 3. Obtener URL pública
      const downloadURL = await getDownloadURL(storageRef);
      
      // 4. Notificar al componente padre
      if (onUploadComplete) {
        onUploadComplete(downloadURL);
      }
      
      // 5. Actualizar estado local con la URL permanente
      setImageUrl(downloadURL);
      
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Error al subir el archivo");
      setImageUrl("");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }

    // Notificar al componente padre (Formik) sobre el cambio
    onChange(event);
  };

  useEffect(() => {
    if (value) {
      if (typeof value === "string") {
        // Si es una URL (de Firebase Storage o una existente)
        setImageUrl(value);
      } else if (value instanceof File) {
        // Si es un objeto File (preview local)
        const reader = new FileReader();
        reader.onload = () => setImageUrl(reader.result);
        reader.readAsDataURL(value);
      }
    }
  }, [value]);

  return (
    <div className="grid grid-rows-1">
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
        
        <div className="avatar flex items-center justify-center my-4">
          <div className="w-28 rounded relative">
            <Image
              src={imageUrl || "/rutes_icon.png"}
              alt={label}
              width={200}
              height={200}
              className="object-contain"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white text-sm">
                  Subiendo... {Math.round(uploadProgress)}%
                </span>
              </div>
            )}
          </div>
        </div>

        {fileName && (
          <div className="text-sm text-gray-600 truncate mb-2">
            {fileName}
          </div>
        )}

        {error && (
          <div className="text-sm text-red-500 mb-2">{error}</div>
        )}

        <input
          type="file"
          className="file-input file-input-bordered w-full max-w-xs"
          onChange={handleFileChange}
          accept="image/*"
          disabled={isUploading}
          {...props}
        />

        {isUploading && (
          <progress
            className="progress progress-primary w-full mt-2"
            value={uploadProgress}
            max="100"
          ></progress>
        )}
      </div>
    </div>
  );
};

export default FileInput;
