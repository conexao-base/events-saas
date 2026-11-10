import { faker } from '@faker-js/faker'

// Dados consistentes entre execuções
faker.seed(67890)

export const clients = Array.from({ length: 500 }, () => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  return {
    id: faker.string.uuid(),
    firstName,
    lastName,
    username: faker.internet.username({ firstName, lastName }).toLowerCase(),
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    phoneNumber: faker.phone.number({ style: 'international' }),
    status: faker.helpers.arrayElement([
      'paid',
      'pending',
      'cancelled',
      'refunded',
    ] as const),
    amount: faker.helpers.arrayElement([120, 150, 180, 200, 250]),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }
})
