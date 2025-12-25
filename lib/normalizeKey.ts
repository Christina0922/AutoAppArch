export function normalizeKey(input: string): string {
  const s = (input ?? "").toLowerCase().trim();
  // 공백 제거 → 특수문자/구두점 제거 → 문자/숫자만 남김
  return s
    .replace(/\s+/g, "")
    .replace(/[.,\-_/·|\\:;!?'"()[\]{}<>]+/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "");
}

