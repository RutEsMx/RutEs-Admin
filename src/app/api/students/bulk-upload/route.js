import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { firestore } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { sendPassword } from "@/services/MailService";
import { customInitApp } from "@/firebase/admin";

// Init the Firebase SDK every time the server is called
customInitApp();

// Define the expected headers based on the structure
const EXPECTED_HEADERS = [
  "nombre_estudiante",
  "apellido_paterno_estudiante",
  "apellido_materno_estudiante",
  "fecha_nacimiento_estudiante",
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
  "existe_padre",
  "existe_madre",
];

// Function to map Excel data to the format expected by createParentsByForm
const mapRowToStudentData = (rowData) => {
  return {
    // Student data
    name: rowData.nombre_estudiante?.trim(),
    lastName: rowData.apellido_paterno_estudiante?.trim(),
    secondLastName: rowData.apellido_materno_estudiante?.trim(),
    birthDate: rowData.fecha_nacimiento_estudiante?.trim(),
    bloodType: rowData.tipo_sangre_estudiante?.trim(),
    allergies: rowData.alergias_estudiante?.trim(),
    grade: rowData.grado_estudiante?.trim(),
    group: rowData.grupo_estudiante?.trim(),
    enrollment: rowData.matricula_estudiante?.trim(),
    serviceType: rowData.tipo_servicio_estudiante?.trim(),

    // Address data
    address: {
      street: rowData.calle_direccion?.trim(),
      number: rowData.numero_direccion?.trim(),
      interiorNumber: rowData.numero_interior_direccion?.trim(),
      neighborhood: rowData.colonia_direccion?.trim(),
      postalCode: rowData.codigo_postal_direccion?.trim(),
      city: rowData.ciudad_direccion?.trim(),
      state: rowData.estado_direccion?.trim(),
    },

    // Father data
    father: {
      name: rowData.nombre_padre?.trim(),
      lastName: rowData.apellido_paterno_padre?.trim(),
      secondLastName: rowData.apellido_materno_padre?.trim(),
      phone: rowData.telefono_padre?.trim(),
      email: rowData.email_padre?.trim(),
    },

    // Mother data
    mother: {
      name: rowData.nombre_madre?.trim(),
      lastName: rowData.apellido_paterno_madre?.trim(),
      secondLastName: rowData.apellido_materno_madre?.trim(),
      phone: rowData.telefono_madre?.trim(),
      email: rowData.email_madre?.trim(),
    },

    // Additional required fields
    includeFather: Boolean(rowData.nombre_padre),
    includeMother: Boolean(rowData.nombre_madre),
    countTutors: 0, // No tutors in bulk upload for now
    existFather: rowData.existe_padre === "SI" ? true : false,
    existMother: rowData.existe_madre === "SI" ? true : false,
  };
};

// Server-side function to create parent profile
const createParentProfileServer = async (
  parent,
  schoolId,
  roles,
  schoolName,
) => {
  if (!parent.email) return null;

  // Create user in Firebase Auth
  const auth = getAuth();
  const password = Math.random().toString(36).slice(-8);
  const userCredential = await auth.createUser({
    email: parent.email,
    password: password,
    displayName: `${parent?.name} ${parent?.lastName || ""} ${
      parent?.secondLastName || ""
    }`.trim(),
  });
  const uid = userCredential.uid;

  // Send welcome email with password
  const context = {
    name: `${parent?.name} ${parent?.lastName || ""} ${
      parent?.secondLastName || ""
    }`.trim(),
    school: schoolName,
    password,
  };
  await sendPassword(parent.email, context, "Cuenta creada", "WELCOME");

  // Create profile document
  const profileData = {
    ...parent,
    id: uid,
    password,
    roles: roles || ["user"],
    schoolId,
    avatar: null,
    isFirstTime: roles.find((role) => role === "user" || role === "tutor")
      ? true
      : false,
    isNeedPinDrop: roles.find((role) => role === "user") ? true : false,
  };

  await firestore().collection("profile").doc(uid).set(profileData);
  return { id: uid, ...profileData };
};

// Server-side function to create student with parents
const createStudentWithParentsServer = async (data, schoolId, schoolName) => {
  const {
    father,
    mother,
    includeMother,
    includeFather,
    existFather,
    existMother,
    ...studentData
  } = data;

  // Create parent profiles
  const [fatherProfile, motherProfile] = await Promise.all([
    includeFather && !existFather
      ? createParentProfileServer(father, schoolId, ["user"], schoolName)
      : existFather
      ? firestore()
          .collection("profile")
          .where("email", "==", father.email)
          .get()
          .then((snapshot) => snapshot.docs[0].data())
      : null,
    includeMother && !existMother
      ? createParentProfileServer(mother, schoolId, ["user"], schoolName)
      : existMother
      ? firestore()
          .collection("profile")
          .where("email", "==", mother.email)
          .get()
          .then((snapshot) => snapshot.docs[0].data())
      : null,
  ]);

  // Create student document
  studentData.schoolId = schoolId;
  studentData.fullName = [
    studentData?.name,
    studentData?.lastName,
    studentData?.secondLastName,
  ];

  const studentRef = firestore().collection("students").doc();
  await studentRef.set(studentData);

  const parents = [];
  const updates = [];

  // Update father's profile with student reference
  if (fatherProfile?.id) {
    updates.push(
      firestore()
        .collection("profile")
        .doc(fatherProfile.id)
        .update({
          students: firestore.FieldValue.arrayUnion(studentRef),
        }),
    );
    parents.push(fatherProfile);
  }

  // Update mother's profile with student reference
  if (motherProfile?.id) {
    updates.push(
      firestore()
        .collection("profile")
        .doc(motherProfile.id)
        .update({
          students: firestore.FieldValue.arrayUnion(studentRef),
        }),
    );
    parents.push(motherProfile);
  }

  // Update student with parent references
  updates.push(
    firestore()
      .collection("students")
      .doc(studentRef.id)
      .update({
        parents: parents.map((parent) =>
          firestore().collection("profile").doc(parent.id),
        ),
        tutors: [],
        tutorActive: null,
      }),
  );

  await Promise.all(updates);

  return { success: true, message: "Estudiante creado correctamente" };
};

export async function POST(request) {
  const schoolId = request.headers.get("schoolId");
  const schoolName = request.headers.get("schoolName");

  if (!schoolId || !schoolName) {
    return NextResponse.json(
      {
        message: "Missing required headers: schoolId and schoolName",
      },
      { status: 400 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded." },
        { status: 400 },
      );
    }

    // Check file type
    if (
      file.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && // .xlsx
      file.type !== "application/vnd.ms-excel" // .xls
    ) {
      // .csv
      return NextResponse.json(
        {
          message:
            "Invalid file type. Please upload an Excel (.xlsx, .xls) or CSV (.csv) file.",
        },
        { status: 400 },
      );
    }

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "buffer" });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (!data || data.length <= 1) {
      return NextResponse.json(
        { message: "File is empty or contains only headers." },
        { status: 400 },
      );
    }

    const headerRow = data[0];
    // Validate headers
    if (JSON.stringify(headerRow) !== JSON.stringify(EXPECTED_HEADERS)) {
      return NextResponse.json(
        {
          message:
            "Invalid file headers. Please ensure the file columns match the required format.",
          expected: EXPECTED_HEADERS,
          received: headerRow,
        },
        { status: 400 },
      );
    }

    const dataRows = data.slice(1);
    const results = [];
    const errors = [];

    // Process each row
    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const rowNumber = i + 2; // +1 for slice, +1 for 1-based indexing

      try {
        // Convert row array to object using headers
        const rowData = EXPECTED_HEADERS.reduce((obj, header, index) => {
          obj[header] = row[index] !== undefined ? String(row[index]) : "";
          return obj;
        }, {});

        // Map the row data to the format expected by createParentsByForm
        const studentData = mapRowToStudentData(rowData);
        // Create the student and parents using server-side function
        const result = await createStudentWithParentsServer(
          studentData,
          schoolId,
          schoolName,
        );

        if (result?.error) {
          throw new Error(result.error);
        }

        results.push({ row: rowNumber, status: "Success" });
      } catch (error) {
        errors.push({ row: rowNumber, error: error.message });
      }
    }

    // Return results
    if (errors.length > 0) {
      return NextResponse.json(
        {
          message: `Processed file with ${errors.length} errors out of ${dataRows.length} data rows.`,
          processedRows: results.length,
          errors: errors,
        },
        { status: 400 },
      );
    } else {
      return NextResponse.json(
        {
          message: `Successfully processed ${results.length} data rows.`,
          results: results,
        },
        { status: 200 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: `Failed to process file: ${error.message}` },
      { status: 500 },
    );
  }
}
