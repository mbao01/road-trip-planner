import * as Sentry from "@sentry/nextjs";

export const handleErrors = (error: unknown) => {
  Sentry.captureException(error, {
    captureContext: {
      tags: {
        graphql: "true",
      },
    },
  });
  return error;
};
