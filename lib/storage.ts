import { SavedPlan } from "./types";

const STORAGE_KEY = "autoapparch_plans";

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

