// OPTIONS_TYPE_SERVICES
// Completo - Servicio completo (mañana y tarde)
// Media ruta de mañana - el servicio brindado es solo por la mañana, costo reducido del servicio
// Media ruta de tarde - el servicio brindado es solo por la tarde, costo reducido del servicio
// Beca - el servicio es gratuito para el alumno
// Segundo hijo - si el alumno tiene un hermano en el colegio, el servicio es con costo reducido
// Tercer hijo o más - si el alumno tiene dos o más hermanos en el colegio, el servicio es con costo reducido

const OPTIONS_TYPE_SERVICES = [
  { value: "complete", label: "Servicio completo" },
  // { value: "halfMorning", label: "Media Ruta Mañana" }, // Viaje a la escuela
  // { value: "halfAfternoon", label: "Media Ruta Tarde" }, // Viaje a la casa
  // { value: "scholarship", label: "Beca" },
  // { value: "secondChild", label: "Segundo Hijo" },
  // { value: "thirdChild", label: "Tercer Hijo o más" },
];

const OPTIONS_BLOOD_TYPES = [
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
  // { value: "minor-user", label: "Usuario limitado" },
];

const OPTIONS_USER_ROLES_ADMIN_RUTES = [
  { value: "admin-rutes", label: "Admin RutEs" },
  { value: "admin", label: "Admin escuela" },
  { value: "user-school", label: "Usuario escuela" },
  // { value: "minor-user", label: "Usuario limitado" },
];

const STATUS = {
  active: "Activo",
  inactive: "Inactivo",
};

const STATUS_TRAVEL = {
  absent: "Ausente",
  toSchool: "En camino a escuela",
  toHome: "En camino a casa",
  workshop: "En camino a casa desde taller",
  waiting: "Esperando",
  "in-transit": "En tránsito",
  delivered: "Entregado",
  finished: "Finalizado",
};

const COLORS = {
  active: "text-green-500",
  inactive: "text-red-500",
  absent: "text-yellow-500",
  toSchool: "text-green-600",
  toHome: "text-green-500",
  workshop: "text-gray-500",
  finished: "text-gray-500",
  waiting: "text-orange-400",
  "in-transit": "text-blue-500",
  delivered: "text-green-600",
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

const TRAVEL_WITH_FRIEND_OPTIONS = [
  { value: "pending", label: "Pendiente" },
  { value: "accepted", label: "Aceptado" },
  { value: "rejected", label: "Rechazado" },
];

const TRAVEL_WITH_FRIEND_STATUS = {
  pending: "Pendiente",
  accepted: "Aceptado",
  rejected: "Rechazado",
};

const TYPE_TRAVEL = {
  toSchool: "Viaje a la escuela",
  toHome: "Viaje a la casa",
  workshop: "Taller",
};

const STATES_MX = [
  { value: "AGU", label: "Aguascalientes" },
  { value: "BCN", label: "Baja California" },
  { value: "BCS", label: "Baja California Sur" },
  { value: "CAM", label: "Campeche" },
  { value: "CHP", label: "Chiapas" },
  { value: "CHH", label: "Chihuahua" },
  { value: "CDMX", label: "Ciudad de México" },
  { value: "COA", label: "Coahuila" },
  { value: "COL", label: "Colima" },
  { value: "DUR", label: "Durango" },
  { value: "GUA", label: "Guanajuato" },
  { value: "GRO", label: "Guerrero" },
  { value: "HID", label: "Hidalgo" },
  { value: "JAL", label: "Jalisco" },
  { value: "MEX", label: "México" },
  { value: "MIC", label: "Michoacán" },
  { value: "MOR", label: "Morelos" },
  { value: "NAY", label: "Nayarit" },
  { value: "NLE", label: "Nuevo León" },
  { value: "OAX", label: "Oaxaca" },
  { value: "PUE", label: "Puebla" },
  { value: "QUE", label: "Querétaro" },
  { value: "ROO", label: "Quintana Roo" },
  { value: "SLP", label: "San Luis Potosí" },
  { value: "SIN", label: "Sinaloa" },
  { value: "SON", label: "Sonora" },
  { value: "TAB", label: "Tabasco" },
  { value: "TAM", label: "Tamaulipas" },
  { value: "TLA", label: "Tlaxcala" },
  { value: "VER", label: "Veracruz" },
  { value: "YUC", label: "Yucatán" },
  { value: "ZAC", label: "Zacatecas" },
];

//dropdown to grades of the school
const SCHOOL_GRADES = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
];

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
  TRAVEL_WITH_FRIEND_OPTIONS,
  TRAVEL_WITH_FRIEND_STATUS,
  STATES_MX,
  TYPE_TRAVEL,
  //adding grades to dropdown
  SCHOOL_GRADES,
};
