// W:\AutoAppArch\lib\appType.ts
import type { AppType } from "@/lib/types";

export function normalizeAppType(value: unknown): AppType {
  // 모바일 앱만 지원
  return "app";
}

export type { AppType };
