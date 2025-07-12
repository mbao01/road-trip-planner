import { faker } from "@faker-js/faker";

export const createMockJwt = () => {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };
  const payload = {
    iat: faker.date.soon().valueOf(),
    exp: faker.date.soon().valueOf(),
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");

  const signature = faker.string.alphanumeric(64);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};
