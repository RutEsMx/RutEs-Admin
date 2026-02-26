import { fakerES_MX as faker } from "@faker-js/faker";
import {
  OPTIONS_BLOOD_TYPES,
  OPTIONS_TYPE_SERVICES,
  SCHOOL_GRADES,
  STATES_MX,
} from "../utils/options";

const generateStudentMock = () => {
  return {
    name: faker.person.firstName(),
    lastName: faker.person.lastName().split(" ")[0],
    secondLastName: faker.person.lastName().split(" ")[0],
    birthDate: faker.date
      .birthdate({ min: 5, max: 18, mode: "age" })
      .toISOString()
      .split("T")[0],
    bloodType: faker.helpers.arrayElement(OPTIONS_BLOOD_TYPES).value,
    allergies: faker.helpers.arrayElement(["", "Ninguna", "Polvo", "Nueces"]),
    grade: faker.helpers.arrayElement(SCHOOL_GRADES).value,
    group: faker.helpers.arrayElement(["A", "B", "C"]),
    enrollment: faker.string.alphanumeric({ length: 10, casing: "upper" }),
    serviceType: faker.helpers.arrayElement(OPTIONS_TYPE_SERVICES).value,
    avatar: "",
    includeFather: faker.datatype.boolean(),
    includeMother: faker.datatype.boolean(),
    address: {
      street: faker.location.streetAddress(),
      number: faker.location.buildingNumber(),
      interiorNumber: faker.datatype.boolean()
        ? faker.location.buildingNumber()
        : "",
      neighborhood: faker.location.street(),
      postalCode: faker.location.zipCode("#####"),
      city: faker.location.city(),
      state: faker.helpers.arrayElement(STATES_MX).value,
    },
  };
};

const generateFatherMock = () => {
  return {
    name: faker.person.firstName("male"),
    lastName: faker.person.lastName().split(" ")[0],
    secondLastName: faker.person.lastName().split(" ")[0],
    phone: faker.string.numeric(10),
    email: faker.internet.email().toLowerCase(),
    avatar: "",
    emailExist: false,
  };
};

const generateMotherMock = () => {
  return {
    name: faker.person.firstName("female"),
    lastName: faker.person.lastName().split(" ")[0],
    secondLastName: faker.person.lastName().split(" ")[0],
    phone: faker.string.numeric(10),
    email: faker.internet.email().toLowerCase(),
    avatar: "",
  };
};

const generateTutorMock = () => {
  return {
    name: faker.person.firstName(),
    lastName: faker.person.lastName().split(" ")[0],
    secondLastName: faker.person.lastName().split(" ")[0],
    phone: faker.string.numeric(10),
    email: faker.internet.email().toLowerCase(),
    avatar: "",
    emailExist: false,
  };
};

export {
  generateStudentMock,
  generateFatherMock,
  generateMotherMock,
  generateTutorMock,
};
