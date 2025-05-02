"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { Download } from "lucide-react";

export default function BulkUploadPage() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { school } = useAuthContext();

  const handleFileChange = (event) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setMessage(null); // Clear previous messages
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    setIsLoading(true);
    setMessage("Uploading and processing file...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/students/bulk-upload", {
        method: "POST",
        body: formData,
        headers: {
          schoolId: school.id,
          schoolName: school.name,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      setMessage(`Successfully processed file: ${result.message}`);
      setFile(null); // Clear the file input
      // Optionally reset the form or input element
      const fileInput = document.getElementById("file-upload");
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Carga Masiva de Estudiantes</CardTitle>
          <CardDescription>
            Sube un archivo Excel para añadir múltiples estudiantes y padres a
            la vez. Por favor asegúrate de que el archivo siga el formato de
            plantilla requerido.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="file-upload">Archivo de Hoja de Cálculo</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                disabled={isLoading}
              />
            </div>
            {message && (
              <p
                className={`mt-4 text-sm ${
                  message.startsWith("Error:")
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {message}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <a
              href="/templates/students_template.xlsx"
              download="plantilla-estudiantes.xlsx"
            >
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Descargar Plantilla
              </Button>
            </a>
            <Button type="submit" disabled={!file || isLoading}>
              {isLoading ? "Procesando..." : "Subir Archivo"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
