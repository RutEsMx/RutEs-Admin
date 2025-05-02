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
import { Download, AlertCircle, CheckCircle2 } from "lucide-react";

export default function BulkUploadPage() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadResults, setUploadResults] = useState(null);
  const { school } = useAuthContext();

  const handleFileChange = (event) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setUploadResults(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setUploadResults({
        status: "error",
        message: "Por favor selecciona un archivo para cargar.",
      });
      return;
    }

    setIsLoading(true);
    setUploadResults({
      status: "loading",
      message: "Subiendo y procesando archivo...",
    });

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
        setUploadResults({
          status: "error",
          message: result.message,
          processedRows: result.processedRows,
          errors: result.errors,
          totalRows: result.totalRows,
        });
      } else {
        setUploadResults({
          status: "success",
          message: result.message,
          results: result.results,
          totalRows: result.results.length,
        });
        setFile(null);
        const fileInput = document.getElementById("file-upload");
        if (fileInput) {
          fileInput.value = "";
        }
      }
    } catch (error) {
      setUploadResults({
        status: "error",
        message: `Error: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderResultsSummary = () => {
    if (!uploadResults)
      return (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500 text-sm">
            Los resultados de la carga se mostrarán aquí
          </p>
        </div>
      );

    const { status, message, errors, processedRows, totalRows, results } =
      uploadResults;

    return (
      <div className="space-y-4 h-full">
        <div
          className={`p-4 rounded-lg ${
            status === "error"
              ? "bg-red-50"
              : status === "success"
              ? "bg-green-50"
              : "bg-blue-50"
          }`}
        >
          <div className="flex items-center gap-2">
            {status === "error" ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            )}
            <p className="text-sm font-medium">{message}</p>
          </div>
        </div>

        {errors && errors.length > 0 && (
          <div className="border rounded-lg p-4 flex-1">
            <h3 className="font-medium mb-2">Detalles de errores por fila:</h3>
            <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto">
              {errors.map((error, index) => (
                <div
                  key={index}
                  className="text-sm text-red-600 flex items-start gap-2 p-2 hover:bg-red-50 rounded-lg"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Fila {error.row}: {error.error}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">
                Se procesaron exitosamente {processedRows} de {totalRows} filas
              </p>
            </div>
          </div>
        )}

        {results && (
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Resumen de carga:</h3>
            <p className="text-sm text-gray-600">
              Se procesaron exitosamente {totalRows} filas
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-2 gap-6">
        {/* Columna Izquierda - Formulario */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Carga Masiva de Estudiantes</CardTitle>
              <CardDescription>
                Sube un archivo Excel para añadir múltiples estudiantes y padres
                a la vez. Por favor asegúrate de que el archivo siga el formato
                de plantilla requerido.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="file-upload">
                    Archivo de Hoja de Cálculo
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    disabled={isLoading}
                  />
                </div>
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

        {/* Columna Derecha - Resultados */}
        <div className="bg-white rounded-lg border p-6 min-h-[500px]">
          <h2 className="text-lg font-semibold mb-4">Resultados de la Carga</h2>
          {renderResultsSummary()}
        </div>
      </div>
    </div>
  );
}
