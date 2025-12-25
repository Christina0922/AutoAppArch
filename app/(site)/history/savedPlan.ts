export type SavedPlan = {
  id: string;
  title?: string;       // 페이지/데이터마다 없을 수 있으니 optional
  createdAt?: string;
  updatedAt?: string;
  payload?: unknown;    // 원본 데이터 보관용
};

export function safeJsonParse(raw: string | null): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function toStr(v: unknown): string | undefined {
  if (typeof v === "string" && v.trim().length > 0) return v;
  return undefined;
}

export function normalizePlans(value: unknown): SavedPlan[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map((x, idx) => {
      if (x && typeof x === "object") {
        const o = x as Record<string, unknown>;
        const id = String(o.id ?? o._id ?? `${Date.now()}_${idx}`);
        const title = toStr(o.title ?? o.name) ?? undefined;
        const createdAt =
          toStr(o.createdAt ?? o.created_at ?? o.time) ?? undefined;
        const updatedAt =
          toStr(o.updatedAt ?? o.updated_at) ?? undefined;

        return { id, title, createdAt, updatedAt, payload: o };
      }
      return { id: `${Date.now()}_${idx}`, payload: x };
    });
  }

  if (value && typeof value === "object") {
    const o = value as Record<string, unknown>;
    const arr =
      (o.plans as unknown) ??
      (o.items as unknown) ??
      (o.history as unknown) ??
      null;
    return normalizePlans(arr);
  }

  return [];
}
