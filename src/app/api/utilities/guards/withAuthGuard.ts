import { AppRouteHandlerFn } from "next/dist/server/route-modules/app-route/module";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { authGuard } from "./authGuard";

export function withAuthGuard(
  handler: (...args: Parameters<AppRouteHandlerFn>) => Promise<NextResponse>
) {
  return auth(async function withAuthGuard(...args) {
    await authGuard(args[0]);

    return handler(...args);
  });
}
