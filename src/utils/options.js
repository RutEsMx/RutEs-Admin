// OPTIONS_TYPE_SERVICES
// Completo - Servicio completo (mañana y tarde)
// Media ruta de mañana - el servicio brindado es solo por la mañana, costo reducido del servicio
// Media ruta de tarde - el servicio brindado es solo por la tarde, costo reducido del servicio
// Beca - el servicio es gratuito para el alumno
// Segundo hijo - si el alumno tiene un hermano en el colegio, el servicio es con costo reducido
// Tercer hijo o más - si el alumno tiene dos o más hermanos en el colegio, el servicio es con costo reducido

const OPTIONS_TYPE_SERVICES = [
  { value: "", label: "Seleccione una opción" },
  { value: "complete", label: "Completo" },
  { value: "halfMorning", label: "Media Ruta Mañana" }, // Viaje a la escuela
  { value: "halfAfternoon", label: "Media Ruta Tarde" }, // Viaje a la casa
  // { value: "scholarship", label: "Beca" },
  // { value: "secondChild", label: "Segundo Hijo" },
  // { value: "thirdChild", label: "Tercer Hijo o más" },
];

const OPTIONS_BLOOD_TYPES = [
  { value: "", label: "Seleccione una opción" },
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
];

const OPTIONS_USER_ROLES_ADMIN = [
  { value: "admin", label: "Admin escuela" },
  { value: "user-school", label: "Usuario escuela" },
  { value: "minor-user", label: "Usuario limitado" },
];

const OPTIONS_USER_ROLES_ADMIN_RUTES = [
  { value: "admin-rutes", label: "Admin RutEs" },
  { value: "admin", label: "Admin escuela" },
  { value: "user-school", label: "Usuario escuela" },
  { value: "minor-user", label: "Usuario limitado" },
];

const STATUS = {
  active: "Activo",
  inactive: "Inactivo",
};

const STATUS_TRAVEL = {
  absent: "Ausente",
  toSchool: "En camino a escuela",
  toHome: "En camino a casa",
};

const COLORS = {
  active: "text-green",
  inactive: "text-red",
  absent: "text-yellow",
  toSchool: "text-green",
  toHome: "text-blue",
};

const COLORS_HEX = {
  active: "#049818",
  inactive: "#4F504F",
  rutes: "#FFBF3B",
};

const DAYS = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
};

const DAYS_OPTIONS = [
  { value: "all", label: "Todos los días" },
  { value: "monday", label: "Lunes" },
  { value: "tuesday", label: "Martes" },
  { value: "wednesday", label: "Miércoles" },
  { value: "thursday", label: "Jueves" },
  { value: "friday", label: "Viernes" },
];

const CURRENT_DAY =
  DAYS_OPTIONS.slice(1)[new Date().getDay() - 1]?.value || "monday";

export {
  OPTIONS_TYPE_SERVICES,
  OPTIONS_BLOOD_TYPES,
  STATUS,
  COLORS,
  STATUS_TRAVEL,
  OPTIONS_USER_ROLES_ADMIN_RUTES,
  OPTIONS_USER_ROLES_ADMIN,
  DAYS,
  DAYS_OPTIONS,
  COLORS_HEX,
  CURRENT_DAY,
};
