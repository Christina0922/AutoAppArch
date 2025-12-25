// W:\AutoAppArch\lib\appType.ts
import type { AppType } from "@/lib/types";

export function normalizeAppType(value: unknown): AppType {
  return value === "web" ? "web" : "app";
}

export type { AppType };
