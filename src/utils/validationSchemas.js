import * as Yup from "yup";
const REGEX_PHONE = /^(\+\d{1,3}[- ]?)?\d{10}$/;
const REGEX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
import { auth } from "@/firebase/client";
import { fetchSignInMethodsForEmail } from "firebase/auth";

const emailExists = async (email, obj) => {
  if (obj.parent.isEdit) return true;
  try {
    const exist = await fetchSignInMethodsForEmail(auth, email);
    if (exist.length > 0) return false;
    return true;
  } catch (error) {
    return false;
  }
};

const validateStudent = Yup.object().shape({
  name: Yup.string().nullable().required("Nombre requerido"),
  lastName: Yup.string().nullable().required("Apellido Paterno requerido"),
  secondLastName: Yup.string().nullable(),
  birthDate: Yup.date().nullable(),
  bloodType: Yup.string().nullable(),
  allergies: Yup.string().nullable(),
  grade: Yup.string().nullable(),
  group: Yup.string().nullable(),
  enrollment: Yup.string().nullable().required("Matricula requerida"),
  serviceType: Yup.string().nullable().required("Tipo de Servicio requerido"),
  includeFather: Yup.boolean()
    .nullable()
    .test("oneParent", "Selecciona al menos un padre", function (value) {
      const { includeMother } = this.parent;
      return value || includeMother;
    }),
  includeMother: Yup.boolean()
    .nullable()
    .test("oneParent", "Selecciona al menos un padre", function (value) {
      const { includeFather } = this.parent;
      return value || includeFather;
    }),
  // schoolId: Yup.string().nullable().required('Escuela requerida'),
  // avatar: Yup.string().nullable().required('Avatar requerido'),
});

const validateFather = Yup.object().shape({
  father: Yup.object().shape({
    name: Yup.string().nullable().required("Nombre requerido"),
    lastName: Yup.string().nullable().required("Apellido Paterno requerido"),
    secondLastName: Yup.string().nullable(),
    phone: Yup.string()
      .nullable()
      .matches(REGEX_PHONE, "Teléfono inválido")
      .required("Teléfono requerido"),
    phoneEmergency: Yup.string()
      .nullable()
      .matches(REGEX_PHONE, "Teléfono inválido"),
    phoneFamily: Yup.string()
      .nullable()
      .matches(REGEX_PHONE, "Teléfono inválido"),
    email: Yup.string()
      .nullable()
      .email("Correo inválido")
      .required("Correo requerido")
      .test("email-exists", "Correo ya existe", emailExists),
    // schoolId: Yup.string().nullable().required('Escuela requerida'),
    // avatar: Yup.string().nullable().required('Avatar requerido'),
  }),
});

const validateMother = Yup.object().shape({
  mother: Yup.object().shape({
    name: Yup.string().nullable().required("Nombre requerido"),
    lastName: Yup.string().nullable().required("Apellido Paterno requerido"),
    secondLastName: Yup.string().nullable(),
    phone: Yup.string()
      .nullable()
      .matches(REGEX_PHONE, "Teléfono inválido")
      .required("Teléfono requerido"),
    phoneEmergency: Yup.string()
      .nullable()
      .matches(REGEX_PHONE, "Teléfono inválido"),
    phoneFamily: Yup.string()
      .nullable()
      .matches(REGEX_PHONE, "Teléfono inválido"),
    email: Yup.string()
      .nullable()
      .email("Correo inválido")
      .required("Correo requerido")
      .test("email-exists", "Correo ya existe", emailExists),
    // avatar: Yup.string().nullable().required('Avatar requerido'),
    // schoolId: Yup.string().nullable().required('Escuela requerida'),
  }),
});

const validateTutors = (step) =>
  Yup.object().shape({
    [`tutors_${step}`]: Yup.object().shape({
      name: Yup.string().nullable().required("Nombre requerido"),
      lastName: Yup.string().nullable().required("Apellido Paterno requerido"),
      secondLastName: Yup.string().nullable(),
      phone: Yup.string()
        .nullable()
        .matches(REGEX_PHONE, "Teléfono inválido")
        .required("Teléfono requerido"),
      active: Yup.boolean().nullable(),
      email: Yup.string()
        .nullable()
        .email("Correo inválido")
        .required("Correo requerido")
        .test("email-exists", "Correo ya existe", emailExists),
      // avatar: Yup.string().nullable().required('Avatar requerido'),
      // schoolId: Yup.string().nullable().required('Escuela requerida'),
    }),
  });

const validateUsers = Yup.object().shape({
  name: Yup.string().nullable().required("Nombre requerido"),
  lastName: Yup.string().nullable().required("Apellido Paterno requerido"),
  secondLastName: Yup.string().nullable(),
  phone: Yup.string()
    .nullable()
    .matches(REGEX_PHONE, "Teléfono inválido")
    .required("Teléfono requerido"),
  roles: Yup.array()
    .min(1, "Rol requerido")
    .nullable()
    .required("Rol requerido"),
  email: Yup.string()
    .nullable()
    .email("Correo inválido")
    .required("Correo requerido")
    .test("email-exists", "Correo ya existe", emailExists),
  // avatar: Yup.string().nullable().required('Avatar requerido'),
  // schoolId: Yup.string().nullable().required('Escuela requerida'),
});

const validateSchool = Yup.object().shape({
  name: Yup.string().nullable().required("Nombre requerido"),
  address: Yup.string().nullable(),
  phone: Yup.string()
    .nullable()
    .matches(REGEX_PHONE, "Teléfono inválido")
    .required("Teléfono requerido"),
  email: Yup.string()
    .nullable()
    .email("Correo inválido")
    .required("Correo requerido")
    .test("email-exists", "Correo ya existe", emailExists),
  // logo: Yup.string().nullable().required('Avatar requerido'),
});

const validationLogin = Yup.object().shape({
  email: Yup.string()
    .nullable()
    .email("Correo inválido")
    .required("Correo requerido"),
  password: Yup.string().nullable().required("Contraseña requerida"),
});

const validateUnits = Yup.object().shape({
  model: Yup.string().nullable().required("Modelo requerido"),
  year: Yup.number()
    .max(
      new Date().getFullYear(),
      `El valor debe ser menor o igual a ${new Date().getFullYear()}`,
    )
    .nullable()
    .required("Año requerido"),
  plate: Yup.string().nullable().required("Placa requerida"),
  adminNumber: Yup.string()
    .nullable()
    .required("Número de administración requerido"),
  passengers: Yup.number()
    .max(100)
    .nullable()
    .required("Número de pasajeros requerido"),
});

const validateAuxiliar = Yup.object().shape({
  isEdit: Yup.boolean().nullable(),
  name: Yup.string().nullable().required("Nombre requerido"),
  lastName: Yup.string().nullable().required("Apellido Paterno requerido"),
  secondLastName: Yup.string().nullable(),
  phone: Yup.string()
    .nullable()
    .matches(REGEX_PHONE, "Teléfono inválido")
    .required("Teléfono requerido"),
  email: Yup.string()
    .nullable()
    .email("Correo inválido")
    .required("Correo requerido")
    .test("email-exists", "Correo ya existe", emailExists),
  adminNumber: Yup.string().nullable().required("Número de empleado requerido"),
  avatar: Yup.string().nullable().required("Avatar requerido"),
  password: Yup.string()
    .nullable()
    .matches(REGEX_PASSWORD, "Contraseña inválida")
    .required("Contraseña requerida"),
  confirmPassword: Yup.string()
    .nullable()
    .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden")
    .required("Confirmar contraseña requerida"),
});

const validateDriver = Yup.object().shape({
  name: Yup.string().nullable().required("Nombre requerido"),
  lastName: Yup.string().nullable().required("Apellido Paterno requerido"),
  secondLastName: Yup.string().nullable(),
  phone: Yup.string()
    .nullable()
    .matches(REGEX_PHONE, "Teléfono inválido")
    .required("Teléfono requerido"),
  adminNumber: Yup.string().nullable().required("Número de empleado requerido"),
  license: Yup.string().nullable().required("Licencia requerida"),
  // avatar: Yup.string().nullable().required('Avatar requerido'),
});

const validateRoute = Yup.object().shape({
  name: Yup.string().nullable().required("Nombre de ruta requerido"),
  capacity: Yup.number().nullable().required("Capacidad requerida"),
  unit: Yup.string().nullable().required("Unidad requerida"),
  driver: Yup.string().nullable().required("Conductor requerido"),
  auxiliar: Yup.string().nullable().required("Auxiliar requerido"),
});

export {
  validateStudent,
  validateFather,
  validateMother,
  validateTutors,
  validateUsers,
  validateSchool,
  validationLogin,
  validateUnits,
  validateAuxiliar,
  validateDriver,
  validateRoute,
};
