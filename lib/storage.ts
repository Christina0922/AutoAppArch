import { SavedPlan, Session } from "./types";

type Locale = "ko" | "en";

// 로케일별 저장 키 생성 함수
function getStorageKey(baseKey: string, locale: Locale): string {
  return `autoapparch:${baseKey}:${locale}`;
}

// 하위 호환을 위한 레거시 키 (마이그레이션 시 사용)
const LEGACY_STORAGE_KEY = "autoapparch_plans";
const LEGACY_SESSION_STORAGE_KEY = "autoapparch_sessions";

// 새로운 Session 기반 저장/로드 (로케일별로 분리)
export function saveSession(session: Session, locale: Locale = "ko"): void {
  try {
    const storageKey = getStorageKey("sessions", locale);
    const existing = getAllSessions(locale);
    // 기존 세션이 있으면 업데이트, 없으면 추가
    const index = existing.findIndex((s) => s.id === session.id);
    if (index >= 0) {
      existing[index] = session;
    } else {
      existing.unshift(session);
    }
    localStorage.setItem(storageKey, JSON.stringify(existing));
  } catch (error) {
    console.error("Failed to save session:", error);
    throw new Error("저장에 실패했습니다.");
  }
}

export function getAllSessions(locale: Locale = "ko"): Session[] {
  try {
    if (typeof window === "undefined") return [];
    const storageKey = getStorageKey("sessions", locale);
    const data = localStorage.getItem(storageKey);
    if (!data) return [];
    return JSON.parse(data) as Session[];
  } catch (error) {
    console.error("Failed to load sessions:", error);
    return [];
  }
}

export function getSessionById(id: string, locale: Locale = "ko"): Session | null {
  try {
    const sessions = getAllSessions(locale);
    return sessions.find((s) => s.id === id) || null;
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}

export function deleteSession(id: string, locale: Locale = "ko"): void {
  try {
    const storageKey = getStorageKey("sessions", locale);
    const sessions = getAllSessions(locale);
    const filtered = sessions.filter((s) => s.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to delete session:", error);
    throw new Error("삭제에 실패했습니다.");
  }
}

// 하위 호환성을 위한 기존 함수들 (SavedPlan, 로케일별로 분리)
export function savePlan(plan: SavedPlan, locale: Locale = "ko"): void {
  try {
    const storageKey = getStorageKey("plans", locale);
    const existing = getAllPlans(locale);
    const updated = [plan, ...existing];
    localStorage.setItem(storageKey, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save plan:", error);
    throw new Error("저장에 실패했습니다.");
  }
}

export function getAllPlans(locale: Locale = "ko"): SavedPlan[] {
  try {
    if (typeof window === "undefined") return [];
    const storageKey = getStorageKey("plans", locale);
    const data = localStorage.getItem(storageKey);
    if (!data) return [];
    return JSON.parse(data) as SavedPlan[];
  } catch (error) {
    console.error("Failed to load plans:", error);
    return [];
  }
}

export function getPlanById(id: string, locale: Locale = "ko"): SavedPlan | null {
  try {
    const plans = getAllPlans(locale);
    return plans.find((p) => p.id === id) || null;
  } catch (error) {
    console.error("Failed to get plan:", error);
    return null;
  }
}

export function deletePlan(id: string, locale: Locale = "ko"): void {
  try {
    const storageKey = getStorageKey("plans", locale);
    const plans = getAllPlans(locale);
    const filtered = plans.filter((p) => p.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to delete plan:", error);
    throw new Error("삭제에 실패했습니다.");
  }
}

