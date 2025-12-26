// W:\AutoAppArch\lib\types.ts

export type AppType = "app" | "web";

// 구현 스펙 타입
export type ImplementationSpec = {
  // 핵심 사용자 (1문장)
  targetUser: string;
  // 핵심 화면 5개
  screens: string[];
  // 핵심 기능 5개 (동사로 시작)
  features: string[];
  // 데이터 엔티티 5개
  entities: string[];
  // API 5개
  apis: string[];
  // 아키텍처 구성요소 5개
  architecture: string[];
  // 난이도
  difficulty: "초급" | "중급" | "상급";
  // 예상 기간
  estimatedDuration: string;
  // Value Proposition (사용자 중심 가치)
  valueProposition?: string;
  // Context Tags (적합한 상황 태그)
  contextTags?: string[];
  // Top 3 Features (사용자 눈에 보이는 핵심 기능)
  topFeatures?: string[];
  // One-line Risk (투명한 제약 사항)
  oneLineRisk?: string;
};

export type Node = {
  id: string;
  title: string;
  content?: string;
  type?: string;
  children?: Node[];
  meta?: Record<string, unknown>;
  // 구현 스펙 추가
  spec?: ImplementationSpec;
  [key: string]: unknown;
};

export interface SavedPlan {
  id: string;
  title?: string;

  createdAt?: string;
  updatedAt?: string;

  keywords?: string[];
  tags?: string[];

  selectedType?: AppType;

  key?: string;
  data?: unknown;
  payload?: unknown;

  [key: string]: unknown;
}

export type Session = {
  id: string;
  createdAt: string;
  updatedAt?: string;

  selectedType?: AppType;

  keywords?: string[];
  tags?: string[];

  nodes?: Node[];
  selectedNodeIds?: string[];

  plans?: SavedPlan[];

  state?: Record<string, unknown>;
  meta?: Record<string, unknown>;

  // 확장 필드 허용(앞으로 "필드 없어요" 류 폭발 방지)
  [key: string]: unknown;
};

export type PlanResult = {
  sessionId?: string;
  plan?: SavedPlan;
  plans?: SavedPlan[];
  nodes?: Node[];
  raw?: unknown;
  [key: string]: unknown;
};

export type AppNamingCandidate = {
  name: string;
  reason: string;
  tagline: string;
};

export type AppNamingPreview = {
  name: string;
  tagline: string;
  reason: string;
};

export type AppNaming = {
  preview: AppNamingPreview;
  premium: {
    literal: AppNamingCandidate[];
    brand: AppNamingCandidate[];
    short: AppNamingCandidate[];
  };
};