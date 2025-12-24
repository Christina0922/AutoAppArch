export type AppType = "app" | "web";

// 앱 이름 추천 데이터 구조
export interface AppNamingPreview {
  name: string;
  tagline: string;
  reason: string;
}

export interface AppNamingCandidate {
  name: string;
  reason: string;
  tagline: string;
}

export interface AppNamingGroups {
  literal: AppNamingCandidate[]; // 직관형
  brand: AppNamingCandidate[]; // 브랜딩형
  short: AppNamingCandidate[]; // 짧은형
}

export interface AppNaming {
  preview: AppNamingPreview;
  premium: AppNamingGroups;
}

// 기존 PlanResult (하위 호환성을 위해 유지, 향후 제거 가능)
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
  appNaming?: AppNaming; // 앱 이름 추천 (최종 확정 후에만 생성)
}

// 새로운 마인드맵 구조
export interface Node {
  id: string;
  parentId: string | null;
  level: number; // 2, 3, 4...
  label: string; // "1안", "C안", "두번째 안"
  title: string;
  summary: string;
  meta?: {
    prompt?: string;
    score?: number;
    features?: string[]; // 핵심 기능 목록
    value?: string; // 사용자 가치/차별점
    [key: string]: any;
  };
}

export interface Session {
  id: string;
  createdAt: string;
  keywords: string[];
  tags: string[]; // 선택축, 없으면 빈 배열
  selectedType?: AppType; // 하위 호환성
  nodes: Node[];
  selectedNodeIds: string[];
}

// 하위 호환성을 위한 SavedPlan (기존 데이터 구조)
export interface SavedPlan {
  id: string;
  createdAt: string;
  keywords: string[];
  selectedType: AppType;
  result: PlanResult;
}

