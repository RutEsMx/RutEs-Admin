import * as Yup from 'yup';
const REGEX_PHONE = /^(\+\d{1,3}[- ]?)?\d{10}$/;

const emailExists = async (email) => {
  try {
    // await firebase.auth().fetchSignInMethodsForEmail(email);
    return true;
  } catch (error) {
    return false;
  }
}


const validateStudent = Yup.object().shape({
  name: Yup.string().nullable().required('Nombre requerido'),
  lastName: Yup.string().nullable().required('Apellido Paterno requerido'),
  secondLastName: Yup.string().nullable(),
  birthDate: Yup.date().nullable(),
  bloodType: Yup.string().nullable(),
  allergies: Yup.string().nullable(),
  grade: Yup.string().nullable(),
  group: Yup.string().nullable(),
  enrollment: Yup.string().nullable().required('Matricula requerida'),
  serviceType: Yup.string().nullable().required('Tipo de Servicio requerido'),
  includeFather: Yup.boolean().nullable().test(
    'oneParent',
    'Selecciona al menos un padre',
    function (value) {
      const { includeMother } = this.parent;
      return value || includeMother;
    }),
  includeMother: Yup.boolean().nullable().test(
    'oneParent',
    'Selecciona al menos un padre',
    function (value) {
      const { includeFather } = this.parent;
      return value || includeFather;
    }),
  // avatar: Yup.string().nullable().required('Avatar requerido'),
})

const validateFather = Yup.object().shape({
  father: Yup.object().shape({
    name: Yup.string().nullable().required('Nombre requerido'),
    lastName: Yup.string().nullable().required('Apellido Paterno requerido'),
    secondLastName: Yup.string().nullable(),
    phone: Yup.string().nullable().matches(REGEX_PHONE, 'Teléfono inválido').required('Teléfono requerido'),
    phoneEmergency: Yup.string().nullable().matches(REGEX_PHONE, 'Teléfono inválido'),
    phoneFamily: Yup.string().nullable().matches(REGEX_PHONE, 'Teléfono inválido'),
    email: Yup.string().nullable().email('Correo inválido').required('Correo requerido').test('email-exists', 'Correo ya existe', emailExists),
    // avatar: Yup.string().nullable().required('Avatar requerido'),
  })
});

const validateMother = Yup.object().shape({
  mother: Yup.object().shape({
    name: Yup.string().nullable().required('Nombre requerido'),
    lastName: Yup.string().nullable().required('Apellido Paterno requerido'),
    secondLastName: Yup.string().nullable(),
    phone: Yup.string().nullable().matches(REGEX_PHONE, 'Teléfono inválido').required('Teléfono requerido'),
    phoneEmergency: Yup.string().nullable().matches(REGEX_PHONE, 'Teléfono inválido'),
    phoneFamily: Yup.string().nullable().matches(REGEX_PHONE, 'Teléfono inválido'),
    email: Yup.string().nullable().email('Correo inválido').required('Correo requerido').test('email-exists', 'Correo ya existe', emailExists),
    // avatar: Yup.string().nullable().required('Avatar requerido'),
  }),
});

const validateTutors = (step) => Yup.object().shape({
  [`tutors_${step}`]: Yup.object().shape({
    name: Yup.string().nullable().required('Nombre requerido'),
    lastName: Yup.string().nullable().required('Apellido Paterno requerido'),
    secondLastName: Yup.string().nullable(),
    phone: Yup.string().nullable().matches(REGEX_PHONE, 'Teléfono inválido').required('Teléfono requerido'),
    active: Yup.boolean().nullable(),
    email: Yup.string().nullable().email('Correo inválido').required('Correo requerido').test('email-exists', 'Correo ya existe', emailExists),
    // avatar: Yup.string().nullable().required('Avatar requerido'),
  })
});

const validateUsers = Yup.object().shape({
  name: Yup.string().nullable().required('Nombre requerido'),
  lastName: Yup.string().nullable().required('Apellido Paterno requerido'),
  secondLastName: Yup.string().nullable(),
  phone: Yup.string().nullable().matches(REGEX_PHONE, 'Teléfono inválido').required('Teléfono requerido'),
  roles: Yup.array().nullable().required('Rol requerido'),
  email: Yup.string().nullable().email('Correo inválido').required('Correo requerido').test('email-exists', 'Correo ya existe', emailExists),
  // avatar: Yup.string().nullable().required('Avatar requerido'),
});

const validateSchool = Yup.object().shape({
  name: Yup.string().nullable().required('Nombre requerido'),
  address: Yup.string().nullable(),
  phone: Yup.string().nullable().matches(REGEX_PHONE, 'Teléfono inválido').required('Teléfono requerido'),
  email: Yup.string().nullable().email('Correo inválido').required('Correo requerido').test('email-exists', 'Correo ya existe', emailExists),
  // logo: Yup.string().nullable().required('Avatar requerido'),
});


export {
  validateStudent,
  validateFather,
  validateMother,
  validateTutors,
  validateUsers,
  validateSchool,
}