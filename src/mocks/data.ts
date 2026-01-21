import { faker } from '@faker-js/faker'

export type Role = 'ADMIN' | 'VIEWER'
export type User = {
  id: string
  name: string
  email: string
  role: Role
  active: boolean
  createdAt: string
}

// Create an in-memory DB
export const db = {
  users: Array.from({ length: 137 }, () => {
    const first = faker.person.firstName()
    const last = faker.person.lastName()
    const role: Role = faker.helpers.arrayElement(['ADMIN', 'VIEWER'])
    return {
      id: faker.string.uuid(),
      name: `${first} ${last}`,
      email: faker.internet.email({ firstName: first, lastName: last }).toLowerCase(),
      role,
      active: faker.datatype.boolean(),
      createdAt: faker.date.past({ years: 2 }).toISOString(),
    } satisfies User
  }),
}
