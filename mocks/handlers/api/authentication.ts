import { http, HttpResponse } from "msw";
import { createMockUser } from "../../data";

export const authenticationHandlers = [
  http.post("/api/authentication/sign-in", () => {
    return HttpResponse.json({
      data: {
        user: createMockUser("test@email.com"),
      },
    });
  }),
];
