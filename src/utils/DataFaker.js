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