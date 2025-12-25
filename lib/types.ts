// W:\AutoAppArch\lib\types.ts

export type AppType = "app" | "web";

export type Node = {
  id: string;
  title: string;
  content?: string;
  type?: string;
  children?: Node[];
  meta?: Record<string, unknown>;
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
