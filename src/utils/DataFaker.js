import { faker } from '@faker-js/faker'

export const generateRoutes = () => {
  const routes = []
  for (let i = 0; i < 5; i++) {
    const tracking = faker.location.nearbyGPSCoordinate({origin: [19.4186701, -99.1085741], radius: 10})
    const stops = [
      faker.location.nearbyGPSCoordinate({origin: [19.4186701, -99.1085741], radius: 10}),
      faker.location.nearbyGPSCoordinate({origin: [19.4186701, -99.1085741], radius: 10}),
      faker.location.nearbyGPSCoordinate({origin: [19.4186701, -99.1085741], radius: 10})
    ]
    routes.push({
      id: faker.string.uuid(),
      name: faker.internet.displayName(),
      description: faker.lorem.paragraph(),
      stops: [
        {
          lat: stops[0][0],
          lng: stops[0][1]
        },
        {
          lat: stops[1][0],
          lng: stops[1][1]
        },
        {
          lat: stops[2][0],
          lng: stops[2][1]
        }
      ],
      tracking: {
        lat: tracking[0],
        lng: tracking[1]
      },
      status: faker.helpers.arrayElement(['active', 'inactive', 'schoolToHome', 'homeToSchool'])
    })
  }
  return routes
}

const newPerson = () => {
  const name = faker.person.firstName()
  const lastName = faker.person.lastName()
  const secondLastName = faker.person.lastName()
  const fullName = `${name} ${lastName} ${secondLastName}`
  return {
    name,
    lastName,
    secondLastName,
    fullName: fullName,
    phone: faker.phone.number('+52 55 ### ## ##'),
    age: faker.helpers.rangeToNumber({ min: 18, max: 70}),
    email: faker.internet.email(),
    status: faker.helpers.arrayElement(['active', 'inactive']),
    id: faker.string.uuid()
  }
}
const newStudent = () => {
  return {
    name: faker.person.firstName(),
    lastName: faker.person.lastName(),
    secondLastName: faker.person.lastName(),
    age: faker.helpers.rangeToNumber(5, 12),
    status: faker.helpers.arrayElement(['active', 'inactive']),
    statusTravel: faker.helpers.arrayElement(['absent', 'toSchool', 'toHome', '']),
    id: faker.string.uuid()
  }
}

export const generateParents = (length) => {
    const parents = []
    for (let i = 0; i < length; i++) {
      const person = {
        "tutors": [
          {
            ...newPerson()
          },
          {
            ...newPerson()
          },
        ],
        ...newPerson(),
        "students": {
          ...newStudent()
        },
      }
      parents.push(person)
    }
    return parents
}