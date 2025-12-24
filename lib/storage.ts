import { SavedPlan, Session } from "./types";

const STORAGE_KEY = "autoapparch_plans";
const SESSION_STORAGE_KEY = "autoapparch_sessions";

// 새로운 Session 기반 저장/로드
export function saveSession(session: Session): void {
  try {
    const existing = getAllSessions();
    // 기존 세션이 있으면 업데이트, 없으면 추가
    const index = existing.findIndex((s) => s.id === session.id);
    if (index >= 0) {
      existing[index] = session;
    } else {
      existing.unshift(session);
    }
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(existing));
  } catch (error) {
    console.error("Failed to save session:", error);
    throw new Error("저장에 실패했습니다.");
  }
}

export function getAllSessions(): Session[] {
  try {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as Session[];
  } catch (error) {
    console.error("Failed to load sessions:", error);
    return [];
  }
}

export function getSessionById(id: string): Session | null {
  try {
    const sessions = getAllSessions();
    return sessions.find((s) => s.id === id) || null;
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}

export function deleteSession(id: string): void {
  try {
    const sessions = getAllSessions();
    const filtered = sessions.filter((s) => s.id !== id);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to delete session:", error);
    throw new Error("삭제에 실패했습니다.");
  }
}

// 하위 호환성을 위한 기존 함수들 (SavedPlan)
export function savePlan(plan: SavedPlan): void {
  try {
    const existing = getAllPlans();
    const updated = [plan, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save plan:", error);
    throw new Error("저장에 실패했습니다.");
  }
}

export function getAllPlans(): SavedPlan[] {
  try {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as SavedPlan[];
  } catch (error) {
    console.error("Failed to load plans:", error);
    return [];
  }
}

export function getPlanById(id: string): SavedPlan | null {
  try {
    const plans = getAllPlans();
    return plans.find((p) => p.id === id) || null;
  } catch (error) {
    console.error("Failed to get plan:", error);
    return null;
  }
}

export function deletePlan(id: string): void {
  try {
    const plans = getAllPlans();
    const filtered = plans.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to delete plan:", error);
    throw new Error("삭제에 실패했습니다.");
  }
}

