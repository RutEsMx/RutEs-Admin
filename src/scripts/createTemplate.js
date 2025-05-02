const fs = require("fs");
const path = require("path");

// Define the headers based on the structure
const headers = [
  "nombre_estudiante",
  "apellido_paterno_estudiante",
  "apellido_materno_estudiante",
  "fecha_nacimiento_estudiante", // YYYY-MM-DD
  "tipo_sangre_estudiante",
  "alergias_estudiante",
  "grado_estudiante",
  "grupo_estudiante",
  "matricula_estudiante",
  "tipo_servicio_estudiante",
  "calle_direccion",
  "numero_direccion",
  "numero_interior_direccion",
  "colonia_direccion",
  "codigo_postal_direccion",
  "ciudad_direccion",
  "estado_direccion",
  "nombre_padre",
  "apellido_paterno_padre",
  "apellido_materno_padre",
  "telefono_padre",
  "email_padre",
  "nombre_madre",
  "apellido_paterno_madre",
  "apellido_materno_madre",
  "telefono_madre",
  "email_madre",
];

// Create CSV content
const csvContent = headers.join(",") + "\n";

// Write the file
const outputPath = path.join(__dirname, "..", "..", "students_template.csv");
fs.writeFileSync(outputPath, csvContent);

console.log("Template file created successfully:", outputPath);
