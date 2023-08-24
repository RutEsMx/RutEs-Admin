import { faker } from "@faker-js/faker";

export const generateRoutes = () => {
  const routes = [];
  for (let i = 0; i < 5; i++) {
    const tracking = faker.location.nearbyGPSCoordinate({
      origin: [19.4186701, -99.1085741],
      radius: 10,
    });
    const stops = [
      faker.location.nearbyGPSCoordinate({
        origin: [19.4186701, -99.1085741],
        radius: 10,
      }),
      faker.location.nearbyGPSCoordinate({
        origin: [19.4186701, -99.1085741],
        radius: 10,
      }),
      faker.location.nearbyGPSCoordinate({
        origin: [19.4186701, -99.1085741],
        radius: 10,
      }),
    ];
    routes.push({
      id: faker.string.uuid(),
      name: faker.internet.displayName(),
      description: faker.lorem.paragraph(),
      stops: [
        {
          lat: stops[0][0],
          lng: stops[0][1],
        },
        {
          lat: stops[1][0],
          lng: stops[1][1],
        },
        {
          lat: stops[2][0],
          lng: stops[2][1],
        },
      ],
      tracking: {
        lat: tracking[0],
        lng: tracking[1],
      },
      status: faker.helpers.arrayElement([
        "toHome",
        "toSchool",
        "",
      ]),
      notifications: [
        {
          title: faker.lorem.sentence(1),
          message: faker.lorem.sentence(5),
          date: faker.date.recent(),
        },
        {
          title: faker.lorem.sentence(1),
          message: faker.lorem.sentence(5),
          date: faker.date.recent(),
        },
        {
          title: faker.lorem.sentence(1),
          message: faker.lorem.sentence(5),
          date: faker.date.recent(),
        },
        {
          title: faker.lorem.sentence(1),
          message: faker.lorem.sentence(5),
          date: faker.date.recent(),
        },
      ]
    });
  }
  return routes;
};

const newPerson = () => {
  const name = faker.person.firstName();
  const lastName = faker.person.lastName();
  const secondLastName = faker.person.lastName();
  const fullName = `${name} ${lastName} ${secondLastName}`;
  return {
    name,
    lastName,
    secondLastName,
    fullName: fullName,
    phone: faker.phone.number("+52 55 ### ## ##"),
    age: faker.helpers.rangeToNumber({ min: 18, max: 70 }),
    email: faker.internet.email(),
    status: faker.helpers.arrayElement(["active", "inactive"]),
    id: faker.string.uuid(),
  };
};

const travels = [
  {
    day: "Lunes",
    type: "ida",
    route: {
      nameRoute: faker.helpers.arrayElement([
        "Ruta 1",
        "Ruta 2",
        "Ruta 3",
        "Ruta 4",
        "Ruta 5",
      ]),
    },
  },
  {
    day: "Lunes",
    type: "vuelta",
    route: {
      nameRoute: faker.helpers.arrayElement([
        "Ruta 1",
        "Ruta 2",
        "Ruta 3",
        "Ruta 4",
        "Ruta 5",
      ]),
    },
  },
  {
    day: "Martes",
    type: "ida",
    route: {
      nameRoute: faker.helpers.arrayElement([
        "Ruta 1",
        "Ruta 2",
        "Ruta 3",
        "Ruta 4",
        "Ruta 5",
      ]),
    },
  },
  {
    day: "Martes",
    type: "vuelta",
    route: {
      nameRoute: faker.helpers.arrayElement([
        "Ruta 1",
        "Ruta 2",
        "Ruta 3",
        "Ruta 4",
        "Ruta 5",
      ]),
    },
  },
];

// El statusTravel va a venir dentro del documento de viajes

const newStudent = () => {
  return {
    name: faker.person.firstName(),
    lastName: faker.person.lastName(),
    secondLastName: faker.person.lastName(),
    age: faker.helpers.rangeToNumber({ min: 5, max: 12 }),
    status: faker.helpers.arrayElement(["active", "inactive"]),
    statusTravel: faker.helpers.arrayElement([
      "absent",
      "toSchool",
      "toHome",
      "",
    ]),
    id: faker.string.uuid(),
    dayRoute: faker.helpers.arrayElement(travels),
  };
};

export const generateParents = (length) => {
  const parents = [];
  for (let i = 0; i < length; i++) {
    const students = [];
    // create a randowm array of students
    for (let j = 0; j < faker.helpers.rangeToNumber({ min: 1, max: 3 }); j++) {
      students.push(newStudent());
    }
    const person = {
      tutors: [
        {
          ...newPerson(),
        },
        {
          ...newPerson(),
        },
      ],
      ...newPerson(),
      students: students,
    };
    parents.push(person);
  }
  return parents;
};

export const generateStudents = (length) => {
  const students = [];
  for (let i = 0; i < length; i++) {
    students.push(newStudent());
  }
  return students;
};
