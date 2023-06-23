
// OPTIONS_TYPE_SERVICES 
// Completo - Servicio completo (mañana y tarde)
// Media ruta de mañana - el servicio brindado es solo por la mañana, costo reducido del servicio
// Media ruta de tarde - el servicio brindado es solo por la tarde, costo reducido del servicio
// Beca - el servicio es gratuito para el alumno
// Segundo hijo - si el alumno tiene un hermano en el colegio, el servicio es con costo reducido
// Tercer hijo o más - si el alumno tiene dos o más hermanos en el colegio, el servicio es con costo reducido

const OPTIONS_TYPE_SERVICES = [
  { value: '', label: 'Seleccione una opción' },
  { value: 'complete', label: 'Completo' },
  { value: 'halfMorning', label: 'Media Ruta Mañana' },
  { value: 'halfAfternoon', label: 'Media Ruta Tarde' },
  { value: 'scholarship', label: 'Beca' },
  { value: 'secondChild', label: 'Segundo Hijo' },
  { value: 'thirdChild', label: 'Tercer Hijo o más' }
]

const OPTIONS_BLOOD_TYPES = [
  { value: '', label: 'Seleccione una opción' },
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' }
]

const STATUS = {
  active: 'Activo',
  inactive: 'Inactivo',
}

const STATUS_TRAVEL = {
  absent: 'Ausente',
  toSchool: 'En camino a escuela',
  toHome: 'En camino a casa',
}

const COLORS = {
  active: "text-green",
  inactive: "text-red",
  absent: "text-yellow",
  toSchool: "text-warning",
  toHome: "text-blue",
}

export {
  OPTIONS_TYPE_SERVICES,
  OPTIONS_BLOOD_TYPES,
  STATUS,
  COLORS,
  STATUS_TRAVEL,
}