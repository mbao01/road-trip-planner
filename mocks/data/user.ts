import { faker } from "@faker-js/faker";
import { createMockJwt } from "../helpers";

export const createMockUser = (email?: string) => {
  return {
    email: (email || faker.internet.email()) as `${string}@${string}`,
    user_id: faker.string.uuid(),
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    phone_number: faker.phone.number(),
    token: createMockJwt(),
    picture: faker.image.avatar() as `https://${string}`,
    location: faker.location.city(),
  };
};
