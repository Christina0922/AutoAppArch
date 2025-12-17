export type AppType = "app" | "web";

export interface PlanResult {
  title: string;
  tagline: string;
  targetUsers: string[];
  coreAction: string;
  monetization: {
    model: ("freemium" | "subscription" | "b2b")[];
    revenueTriggers: string[];
  };
  dataStored: string[];
  risks: string[];
  metrics: {
    installsOrSignups: number;
    dau: number;
    mau: number;
  };
  sectionsForRendering: {
    heading: string;
    bullets: string[];
  }[];
}

export interface SavedPlan {
  id: string;
  createdAt: string;
  keywords: string[];
  selectedType: AppType;
  result: PlanResult;
}

