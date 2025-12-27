"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import DifficultyDurationInfo from "./DifficultyDurationInfo";
import { Node, AppType, ImplementationSpec, Session } from "@/lib/types";
import { generateNextLevelIdeas } from "@/lib/generateIdeas";
import ArchitectureCard from "./ArchitectureCard";
import SaveButton from "./SaveButton";

interface IdeaTreeProps {
  sessionId: string;
  initialNodes: Node[];
  initialSelectedIds: string[];
  keywords: string[];
  selectedType: AppType;
  onNodesChange: (nodes: Node[]) => void;
  onSelectionChange: (selectedIds: string[]) => void;
  onRegenerate?: (parentId: string) => void;
  onFinalize?: () => void; // 최종 안으로 만들기 콜백
  session?: any; // Session 타입 (임시 저장용)
  showSaveButton?: boolean; // 저장 버튼 표시 여부
}

export default function IdeaTree({
  sessionId,
  initialNodes,
  initialSelectedIds,
  keywords,
  selectedType,
  onNodesChange,
  onSelectionChange,
  onRegenerate,
  onFinalize,
  session: externalSession,
  showSaveButton = false,
}: IdeaTreeProps) {
  const locale = useLocale() as "ko" | "en";
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(initialSelectedIds)
  );
  const [showComparisonTable, setShowComparisonTable] = useState(false);

  // initialNodes나 initialSelectedIds가 변경될 때 내부 상태 동기화
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes]);

  useEffect(() => {
    setSelectedIds(new Set(initialSelectedIds));
  }, [initialSelectedIds]);

  // 노드 업데이트
  const updateNodes = (newNodes: Node[]) => {
    setNodes(newNodes);
    onNodesChange(newNodes);
  };

  // 선택 상태 업데이트
  const updateSelection = (newSelectedIds: Set<string>) => {
    setSelectedIds(newSelectedIds);
    onSelectionChange(Array.from(newSelectedIds));
  };

  // 노드 토글 선택 (복수 선택 가능)
  const toggleNodeSelection = (nodeId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(nodeId)) {
      newSelected.delete(nodeId);
      // 하위 노드들도 모두 선택 해제
      const removeChildren = (id: string) => {
        nodes
          .filter((n) => (n.parentId as string | null) === id)
          .forEach((child) => {
            newSelected.delete(child.id);
            removeChildren(child.id);
          });
      };
      removeChildren(nodeId);
    } else {
      newSelected.add(nodeId);
    }
    updateSelection(newSelected);
  };

  // 선택된 노드들 기준으로 다음 레벨 생성
  const generateNextLevel = () => {
    // 레벨별 선택된 노드 ID 추출
    const stage1SelectedIds = nodes.filter((n) => selectedIds.has(n.id) && n.level === 2).map((n) => n.id);
    const stage2SelectedIds = nodes.filter((n) => selectedIds.has(n.id) && n.level === 3).map((n) => n.id);
    const stage3SelectedIds = nodes.filter((n) => selectedIds.has(n.id) && n.level === 4).map((n) => n.id);
    const stage4SelectedIds = nodes.filter((n) => selectedIds.has(n.id) && n.level === 5).map((n) => n.id);
    const stage5SelectedIds = nodes.filter((n) => selectedIds.has(n.id) && n.level === 6).map((n) => n.id);

    // 최종 선택된 노드들 찾기 (가장 마지막 단계의 선택된 노드들만)
    let finalSelectedIds: string[] = [];
    if (stage5SelectedIds.length > 0) {
      finalSelectedIds = stage5SelectedIds;
    } else if (stage4SelectedIds.length > 0) {
      finalSelectedIds = stage4SelectedIds;
    } else if (stage3SelectedIds.length > 0) {
      finalSelectedIds = stage3SelectedIds;
    } else if (stage2SelectedIds.length > 0) {
      finalSelectedIds = stage2SelectedIds;
    } else if (stage1SelectedIds.length > 0) {
      finalSelectedIds = stage1SelectedIds;
    }

    if (finalSelectedIds.length === 0) return;

    // 최종 선택된 노드들만 사용
    const finalSelectedNodes = nodes.filter((n) => finalSelectedIds.includes(n.id));
    if (finalSelectedNodes.length === 0) return;

    const newNodes: Node[] = [];

    finalSelectedNodes.forEach((parent) => {
      // 이미 자식이 있으면 생성하지 않음 (재생성은 별도 버튼으로)
      const hasChildren = nodes.some((n) => (n.parentId as string | null) === parent.id);
      if (hasChildren) return;

      const children = generateNextLevelIdeas(
        parent,
        keywords,
        selectedType,
        5,
        locale
      );
      newNodes.push(...children);
    });

    if (newNodes.length > 0) {
      updateNodes([...nodes, ...newNodes]);
    }
  };

  // 특정 부모의 자식들 재생성
  const regenerateChildren = (parentId: string) => {
    const parent = nodes.find((n) => n.id === parentId);
    if (!parent) return;

    // 기존 자식 노드들 제거 (자식의 자식들도 함께, parentId는 유지)
    const removeDescendants = (id: string): string[] => {
      const toRemove: string[] = [];
      nodes.forEach((n) => {
        if ((n.parentId as string | null) === id) {
          toRemove.push(n.id);
          toRemove.push(...removeDescendants(n.id));
        }
      });
      return toRemove;
    };

    const idsToRemove = removeDescendants(parentId);
    const filteredNodes = nodes.filter((n) => !idsToRemove.includes(n.id));
    const filteredSelected = new Set(
      Array.from(selectedIds).filter((id) => !idsToRemove.includes(id))
    );

    // 새 자식 생성
    const newChildren = generateNextLevelIdeas(parent, keywords, selectedType, 5, locale);
    updateNodes([...filteredNodes, ...newChildren]);
    updateSelection(filteredSelected);

    if (onRegenerate) {
      onRegenerate(parentId);
    }
  };

  // 레벨별로 노드 그룹화
  const nodesByLevel = nodes.reduce((acc, node) => {
    const level = node.level as number;
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(node);
    return acc;
  }, {} as Record<number, Node[]>);

  // 최대 레벨 찾기
  const maxLevel = Math.max(...Object.keys(nodesByLevel).map(Number), 0);

  // 추천 시스템: 키워드 기반으로 추천 안 결정
  const getRecommendedNodeId = (levelNodes: Node[]): string | null => {
    if (levelNodes.length === 0) return null;
    
    const keywordStr = keywords.join(" ").toLowerCase();
    
    // 기본값: B안 (확장 성장 버전)
    let recommendedLabel = locale === "en" ? "Option B" : "B안";
    
    // 키워드 기반 추천 로직
    if (keywordStr.includes("빠른") || keywordStr.includes("심플") || keywordStr.includes("간단") || 
        keywordStr.includes("quick") || keywordStr.includes("simple")) {
      recommendedLabel = locale === "en" ? "Option A" : "A안";
    } else if (keywordStr.includes("전문가") || keywordStr.includes("대용량") || keywordStr.includes("고급") ||
               keywordStr.includes("expert") || keywordStr.includes("advanced")) {
      // C 또는 D 중 선택 (랜덤하지 않고 일관성 있게)
      if (keywordStr.includes("성능") || keywordStr.includes("비용") || keywordStr.includes("최적화") ||
          keywordStr.includes("performance") || keywordStr.includes("cost") || keywordStr.includes("optim")) {
        recommendedLabel = locale === "en" ? "Option C" : "C안";
      } else {
        recommendedLabel = locale === "en" ? "Option D" : "D안";
      }
    }
    
    // 레벨 3 이상에서만 추천 적용
    const recommendedNode = levelNodes.find(n => {
      const label = (n.label as string) ?? "";
      return label === recommendedLabel;
    });
    
    return recommendedNode ? recommendedNode.id : null;
  };

  // 최종 선택된 노드들 찾기 (가장 마지막 단계의 선택된 노드들만)
  type StageKey = "stage1" | "stage2" | "stage3" | "stage4" | "stage5";
  
  function getFinalSelectedIds(params: {
    stage1SelectedIds: string[];
    stage2SelectedIds: string[];
    stage3SelectedIds: string[];
    stage4SelectedIds?: string[];
    stage5SelectedIds?: string[];
  }) {
    const { stage1SelectedIds, stage2SelectedIds, stage3SelectedIds, stage4SelectedIds, stage5SelectedIds } = params;

    // 가장 마지막 단계에 선택이 있으면 그게 최종
    if (stage5SelectedIds && stage5SelectedIds.length > 0) return { finalStage: "stage5" as StageKey, finalIds: stage5SelectedIds };
    if (stage4SelectedIds && stage4SelectedIds.length > 0) return { finalStage: "stage4" as StageKey, finalIds: stage4SelectedIds };
    if (stage3SelectedIds.length > 0) return { finalStage: "stage3" as StageKey, finalIds: stage3SelectedIds };
    if (stage2SelectedIds.length > 0) return { finalStage: "stage2" as StageKey, finalIds: stage2SelectedIds };
    return { finalStage: "stage1" as StageKey, finalIds: stage1SelectedIds };
  }

  // 레벨별 선택된 노드 ID 추출
  const stage1SelectedIds = nodes.filter((n) => selectedIds.has(n.id) && n.level === 2).map((n) => n.id);
  const stage2SelectedIds = nodes.filter((n) => selectedIds.has(n.id) && n.level === 3).map((n) => n.id);
  const stage3SelectedIds = nodes.filter((n) => selectedIds.has(n.id) && n.level === 4).map((n) => n.id);
  const stage4SelectedIds = nodes.filter((n) => selectedIds.has(n.id) && n.level === 5).map((n) => n.id);
  const stage5SelectedIds = nodes.filter((n) => selectedIds.has(n.id) && n.level === 6).map((n) => n.id);

  const { finalStage, finalIds } = getFinalSelectedIds({
    stage1SelectedIds,
    stage2SelectedIds,
    stage3SelectedIds,
    stage4SelectedIds,
    stage5SelectedIds,
  });

  const finalCount = finalIds.length;
  const finalSelectedNodes = nodes.filter((n) => finalIds.includes(n.id));
    const maxSelectedLevel = finalSelectedNodes.length > 0
      ? Math.max(...finalSelectedNodes.map((n) => (n.level as number) ?? 0))
      : 0;

  // 다음 레벨 생성 가능 여부 (선택된 노드들이 있고, 그 노드들에 자식이 없을 때)
  const canGenerateNext = finalCount > 0 && finalSelectedNodes.every((node) => {
    // 이미 자식이 있는지 확인
    return !nodes.some((n) => (n.parentId as string | null) === node.id);
  });

  // 선택 경로 추적 (상태 표시바용)
  const getSelectionPath = (): string[] => {
    const path: string[] = [];
    if (stage1SelectedIds.length > 0) {
      const node = nodes.find(n => n.id === stage1SelectedIds[0]);
      if (node) path.push(node.title);
    }
    if (stage2SelectedIds.length > 0) {
      const node = nodes.find(n => n.id === stage2SelectedIds[0]);
      if (node) path.push(node.title);
    }
    if (stage3SelectedIds.length > 0) {
      const node = nodes.find(n => n.id === stage3SelectedIds[0]);
      if (node) path.push(node.title);
    }
    if (stage4SelectedIds.length > 0) {
      const node = nodes.find(n => n.id === stage4SelectedIds[0]);
      if (node) path.push(node.title);
    }
    if (stage5SelectedIds.length > 0) {
      const node = nodes.find(n => n.id === stage5SelectedIds[0]);
      if (node) path.push(node.title);
    }
    return path;
  };

  const t = useTranslations("ideaTree");
  const tDifficulty = useTranslations("difficulty");
  const tDuration = useTranslations("duration");
  const selectionPath = getSelectionPath();
  const finalSelectedTitle = finalSelectedNodes.length > 0 ? finalSelectedNodes[0].title : null;

  // 한글 텍스트를 영어로 변환하는 함수 (ArchitectureCard와 동일한 로직)
  const translateText = (text: string): string => {
    if (locale !== "en") return text;
    
    // valueProposition 변환
    if (text === "빠른 시장 진입") return "Quick market entry";
    if (text === "확장 성장 버전") return "Scalable growth version";
    if (text === "운영 비용 절감") return "Operating cost reduction";
    if (text === "개인화 경험 제공") return "Personalized experience";
    if (text === "엔터프라이즈 운영 준비") return "Enterprise operations ready";
    
    // 제목 패턴 변환 (예: "Option 5 기본 MVP 버전" → "Option 5 Basic MVP Version")
    if (text.includes(" 기본 MVP 버전")) return text.replace(" 기본 MVP 버전", " Basic MVP Version");
    if (text.includes(" 확장 성장 버전")) return text.replace(" 확장 성장 버전", " Extended Growth Version");
    if (text.includes(" 최적화 고급 버전")) return text.replace(" 최적화 고급 버전", " Optimized Advanced Version");
    if (text.includes(" 차별화 고급 버전")) return text.replace(" 차별화 고급 버전", " Differentiated Advanced Version");
    if (text.includes(" 운영 고급 버전")) return text.replace(" 운영 고급 버전", " Operations Advanced Version");
    if (text.includes(" MVP 버전")) return text.replace(" MVP 버전", " MVP Version");
    if (text.includes(" 성장 버전")) return text.replace(" 성장 버전", " Growth Version");
    if (text.includes(" 고급 버전")) return text.replace(" 고급 버전", " Advanced Version");
    if (text.includes(" 기본 ")) return text.replace(" 기본 ", " Basic ");
    if (text.includes(" 확장 ")) return text.replace(" 확장 ", " Extended ");
    if (text.includes(" 최적화 ")) return text.replace(" 최적화 ", " Optimized ");
    if (text.includes(" 차별화 ")) return text.replace(" 차별화 ", " Differentiated ");
    if (text.includes(" 운영 ")) return text.replace(" 운영 ", " Operations ");
    if (text.endsWith(" 버전")) return text.replace(" 버전", " Version");
    
    // contextTags 변환
    if (text === "1인 창업자용") return "For solo founders";
    if (text === "MVP 단계") return "MVP stage";
    if (text === "초기 프로토타입") return "Initial prototype";
    if (text === "SaaS 초기모델") return "Early SaaS model";
    if (text === "사용자 유지율 중시") return "User retention focus";
    if (text === "기능 확장 준비") return "Feature expansion ready";
    if (text === "대용량 데이터") return "Large data volume";
    if (text === "성능 최적화") return "Performance optimization";
    if (text === "비용 효율") return "Cost efficiency";
    if (text === "전문가용") return "For experts";
    if (text === "AI/ML 활용") return "AI/ML utilization";
    if (text === "고급 기능") return "Advanced features";
    if (text === "팀 협업") return "Team collaboration";
    if (text === "조직 관리") return "Organization management";
    if (text === "보안 강화") return "Security enhanced";
    
    // oneLineRisk 변환
    if (text === "초기 서버 비용 발생 가능") return "Initial server costs may occur";
    if (text === "데이터 증가 시 성능 최적화 필요") return "Performance optimization needed as data grows";
    if (text === "인프라 구축 초기 비용 증가") return "Initial infrastructure setup cost increase";
    if (text === "ML 모델 학습 및 유지보수 비용 발생") return "ML model training and maintenance costs";
    if (text === "복잡한 권한 시스템 구현 및 관리 부담") return "Complex permission system implementation and management burden";
    
    // 기간 변환
    if (text === "1~2주") return "1~2 weeks";
    if (text === "3~4주") return "3~4 weeks";
    if (text === "4~6주") return "4~6 weeks";
    if (text === "5~8주") return "5~8 weeks";
    if (text === "6~10주") return "6~10 weeks";
    
    // 키워드 기반 동적 텍스트 변환
    if (text.includes("로그 추가")) {
      const keyword = text.replace(" 로그 추가", "").replace("로그 추가", "");
      return keyword ? `Add ${keyword} log` : "Add log";
    }
    if (text.includes("목록 조회")) {
      const keyword = text.replace(" 목록 조회", "").replace("목록 조회", "");
      return keyword ? `View ${keyword} list` : "View list";
    }
    if (text.includes("기본 통계")) {
      const keyword = text.replace(" 기본 통계", "").replace("기본 통계", "");
      return keyword ? `${keyword} basic statistics` : "Basic statistics";
    }
    if (text.includes("검색 및 필터")) {
      const keyword = text.replace(" 검색 및 필터", "").replace("검색 및 필터", "");
      return keyword ? `${keyword} search and filter` : "Search and filter";
    }
    if (text.includes("태그 관리")) {
      const keyword = text.replace(" 태그 관리", "").replace("태그 관리", "");
      return keyword ? `${keyword} tag management` : "Tag management";
    }
    if (text.includes("통계 (캐싱)")) {
      const keyword = text.replace(" 통계 (캐싱)", "").replace("통계 (캐싱)", "");
      return keyword ? `${keyword} statistics (cached)` : "Statistics (cached)";
    }
    if (text.includes("추천 알고리즘")) {
      const keyword = text.replace(" 추천 알고리즘", "").replace("추천 알고리즘", "");
      return keyword ? `${keyword} recommendation algorithm` : "Recommendation algorithm";
    }
    if (text.includes("알림 설정")) {
      const keyword = text.replace(" 알림 설정", "").replace("알림 설정", "");
      return keyword ? `${keyword} notification settings` : "Notification settings";
    }
    if (text.includes("목표 관리")) {
      const keyword = text.replace(" 목표 관리", "").replace("목표 관리", "");
      return keyword ? `${keyword} goal management` : "Goal management";
    }
    if (text.includes("개인화 설정")) {
      const keyword = text.replace(" 개인화 설정", "").replace("개인화 설정", "");
      return keyword ? `${keyword} personalization settings` : "Personalization settings";
    }
    if (text === "목표 설정 및 추적") return "Goal setting and tracking";
    if (text === "배치 데이터 처리") return "Batch data processing";
    if (text === "성능 모니터링") return "Performance monitoring";
    if (text === "개인화 규칙 엔진") return "Personalization rule engine";
    if (text === "맞춤형 대시보드") return "Customized dashboard";
    if (text === "사용자 권한 관리") return "User permission management";
    if (text === "데이터 백업 및 복원") return "Data backup and recovery";
    if (text === "감사 로그") return "Audit logs";
    if (text === "관리자 대시보드") return "Admin dashboard";
    if (text === "권한 관리") return "Permission management";
    if (text.includes("를 처음 시작하는 초보 사용자")) {
      const keyword = text.replace("를 처음 시작하는 초보 사용자", "");
      return `Beginner users starting with ${keyword}`;
    }
    if (text.includes("를 꾸준히 관리하려는 활성 사용자")) {
      const keyword = text.replace("를 꾸준히 관리하려는 활성 사용자", "");
      return `Active users who consistently manage ${keyword}`;
    }
    if (text.includes("데이터가 많은 고급 사용자")) {
      const keyword = text.replace(" 데이터가 많은 고급 사용자", "").replace("데이터가 많은 고급 사용자", "");
      return `Advanced users with large amounts of ${keyword} data`;
    }
    if (text.includes("에 개인화된 경험을 원하는 사용자")) {
      const keyword = text.replace("에 개인화된 경험을 원하는 사용자", "");
      return `Users seeking personalized experience with ${keyword}`;
    }
    if (text.includes("를 팀/조직 단위로 관리하는 사용자")) {
      const keyword = text.replace("를 팀/조직 단위로 관리하는 사용자", "");
      return `Users managing ${keyword} at team/organization level`;
    }
    
    // 추가 패턴: "사용자 프로필", "기본 설정" 등
    if (text === "사용자 프로필") return "User profile";
    if (text === "기본 설정") return "Basic settings";
    if (text === "페이지네이션") return "Pagination";
    
    // 한글이 여전히 남아있으면 일반적인 변환 시도
    let translated = text;
    
    // 일반적인 한글 단어 변환
    const wordMap: Record<string, string> = {
      "사용자": "User",
      "프로필": "Profile",
      "기본": "Basic",
      "설정": "Settings",
      "관리": "Management",
      "대시보드": "Dashboard",
      "데이터": "Data",
      "백업": "Backup",
      "복원": "Recovery",
      "로그": "Log",
      "목록": "List",
      "조회": "View",
      "통계": "Statistics",
      "검색": "Search",
      "필터": "Filter",
      "태그": "Tag",
      "목표": "Goal",
      "추적": "Tracking",
      "알림": "Notification",
      "추천": "Recommendation",
      "알고리즘": "Algorithm",
      "개인화": "Personalization",
      "규칙": "Rule",
      "엔진": "Engine",
      "맞춤형": "Customized",
      "권한": "Permission",
      "감사": "Audit",
      "성능": "Performance",
      "모니터링": "Monitoring",
      "배치": "Batch",
      "처리": "Processing",
      "캐싱": "Caching",
      "캐시": "Cache",
    };
    
    // 단어별로 변환 시도
    for (const [ko, en] of Object.entries(wordMap)) {
      translated = translated.replace(new RegExp(ko, "g"), en);
    }
    
    // 여전히 한글이 남아있으면 경고 출력 (개발 모드)
    if (/[가-힣]/.test(translated)) {
      console.warn(`[translateText] 한글 텍스트가 남아있습니다: "${text}" → "${translated}"`);
    }
    
    return translated;
  };

  // 라벨 번역 (한글 라벨을 영어로 변환)
  const getTranslatedLabel = (label?: string): string => {
    if (!label) return "";
    if (locale === "en") {
      // A안, B안 등을 Option A, Option B로 변환
      if (label === "A안") return "Option A";
      if (label === "B안") return "Option B";
      if (label === "C안") return "Option C";
      if (label === "D안") return "Option D";
      if (label === "E안") return "Option E";
      if (label === "1안") return "Option 1";
      if (label === "2안") return "Option 2";
      if (label === "3안") return "Option 3";
      if (label === "4안") return "Option 4";
      if (label === "5안") return "Option 5";
      if (label === "6안") return "Option 6";
      if (label === "7안") return "Option 7";
      if (label.startsWith("첫번째 안")) return "1st Option";
      if (label.startsWith("두번째 안")) return "2nd Option";
      if (label.startsWith("세번째 안")) return "3rd Option";
      if (label.startsWith("네번째 안")) return "4th Option";
      if (label.startsWith("다섯번째 안")) return "5th Option";
      if (label.startsWith("방안 1")) return "Approach 1";
      if (label.startsWith("방안 2")) return "Approach 2";
      if (label.startsWith("방안 3")) return "Approach 3";
      if (label.startsWith("방안 4")) return "Approach 4";
      if (label.startsWith("방안 5")) return "Approach 5";
    }
    return label;
  };

  // 현재 선택된 레벨의 색상 클래스 결정
  const getCurrentLevelColorClass = () => {
    if (finalStage === "stage1") return "bg-blue-100 text-blue-800";
    if (finalStage === "stage2") return "bg-green-100 text-green-800";
    if (finalStage === "stage3") return "bg-purple-100 text-purple-800";
    if (finalStage === "stage4") return "bg-orange-100 text-orange-800";
    if (finalStage === "stage5") return "bg-red-100 text-red-800";
    return "bg-blue-100 text-blue-800";
  };

  // Ordinal 표기 변환 (2nd, 3rd, 4th 등)
  const getOrdinalSuffix = (level: number): string => {
    if (locale === "en") {
      if (level === 1) return "st";
      if (level === 2) return "nd";
      if (level === 3) return "rd";
      if (level >= 4 && level <= 20) return "th";
      const lastDigit = level % 10;
      if (lastDigit === 1) return "st";
      if (lastDigit === 2) return "nd";
      if (lastDigit === 3) return "rd";
      return "th";
    }
    return "차";
  };

  const getCurrentLevelLabel = () => {
    if (finalStage === "stage1") return t("level1");
    if (finalStage === "stage2") return t("level2");
    if (finalStage === "stage3") {
      if (locale === "en") return `3${getOrdinalSuffix(3)}`;
      return t("levelN", { level: 3 });
    }
    if (finalStage === "stage4") {
      if (locale === "en") return `4${getOrdinalSuffix(4)}`;
      return t("levelN", { level: 4 });
    }
    if (finalStage === "stage5") {
      if (locale === "en") return `5${getOrdinalSuffix(5)}`;
      return t("levelN", { level: 5 });
    }
    return t("level1");
  };

  return (
    <div className="space-y-8">
      {/* 상태 표시바 - 개선된 형식 */}
      {finalSelectedNodes.length > 0 && (
        <div className="bg-white rounded-lg border-2 border-gray-200 p-4 sticky top-20 z-20 shadow-sm mb-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap text-sm text-gray-900">
            <span className="font-semibold">{t("currentSelection")}:</span>
              {finalSelectedNodes.map((node, index) => (
                <span
                  key={node.id}
                  className={`px-2 py-1 ${getCurrentLevelColorClass()} rounded font-medium`}
                >
                  {getCurrentLevelLabel()} {node.title}
              </span>
              ))}
            </div>
            <DifficultyDurationInfo />
          </div>
        </div>
      )}

      {/* 레벨별로 렌더링 */}
      {Object.keys(nodesByLevel)
        .map(Number)
        .sort((a, b) => a - b)
        .map((level) => {
          const levelNodes = nodesByLevel[level];
          const parentNodes = level === 2 ? [] : levelNodes.map((n) => {
            const parent = nodes.find((p) => p.id === (n.parentId as string | null));
            return parent ? { node: n, parent } : null;
          }).filter((item): item is { node: Node; parent: Node } => item !== null);


          return (
            <div key={level} className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white ${
                    level === 2 ? "bg-blue-600" :
                    level === 3 ? "bg-green-600" :
                    level === 4 ? "bg-purple-600" :
                    level === 5 ? "bg-orange-600" :
                    level === 6 ? "bg-red-600" :
                    "bg-gray-600"
                  }`}>
                    {level === 2 ? "1" : level - 1}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                    <h3 className={`text-lg font-semibold tracking-tight ${
                      level === 2 ? "text-blue-900" :
                      level === 3 ? "text-green-900" :
                      level === 4 ? "text-purple-900" :
                      level === 5 ? "text-orange-900" :
                      level === 6 ? "text-red-900" :
                      "text-gray-900"
                    }`}>
                        {level === 2 
                          ? t("level1Ideas") 
                          : locale === "en" 
                            ? `${level - 1}${getOrdinalSuffix(level - 1)} Level Branch Ideas`
                            : t("levelNIdeas", { level: level - 1 })
                        }
                    </h3>
                      <DifficultyDurationInfo />
                  </div>
                </div>
                </div>
              </div>

              {level === 2 ? (
                // 레벨 2: 그리드 레이아웃 (기존 IdeaCard 사용)
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                  {levelNodes.map((node) => {
                    const levelColor = getLevelColor(node.level as number);
                    return (
                      <IdeaCard
                        key={node.id}
                        node={node}
                        isSelected={selectedIds.has(node.id)}
                        onToggle={() => toggleNodeSelection(node.id)}
                        hasChildren={nodes.some((n) => (n.parentId as string | null) === node.id)}
                        onRegenerate={() => regenerateChildren(node.id)}
                      />
                    );
                  })}
                </div>
              ) : (
                // 레벨 3 이상: 부모별로 그룹화하여 트리 형태
                <div className="space-y-8">
                  {Array.from(
                    new Set(levelNodes.map((n) => n.parentId as string | null).filter((id): id is string => id !== null))
                  ).map((parentId) => {
                    const parent = nodes.find((p) => p.id === parentId);
                    const children = levelNodes.filter((n) => (n.parentId as string | null) === parentId);
                    if (!parent) return null;

                    const isParentSelected = selectedIds.has(parent.id);
                    
                    return (
                      <div key={parentId} className="space-y-4">
                        <div className={`flex items-center gap-3 p-3 rounded-lg border-2 ${
                          isParentSelected 
                            ? "bg-gray-50 border-gray-300" 
                            : "bg-white border-gray-100"
                        }`}>
                          <div className={`flex items-center gap-2 ${
                            isParentSelected ? "text-gray-900 font-semibold" : "text-gray-600"
                          }`}>
                            <span className="text-base">{(parent.label as string) ?? ""}</span>
                            <span className="text-gray-400">({parent.title})</span>
                          </div>
                          <span className="text-gray-400">→</span>
                          <span className="text-sm text-gray-500">
                            {t("childrenCount", { count: children.length })}
                          </span>
                          {isParentSelected && (
                            <div className="ml-auto flex items-center gap-2">
                              <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded whitespace-nowrap">
                                {t("selected")}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-stretch">
                          {(() => {
                            const recommendedId = getRecommendedNodeId(children);
                            return children.map((node) => (
                              <div key={node.id} className="flex flex-col">
                              <ArchitectureCard
                                node={node}
                                isSelected={selectedIds.has(node.id)}
                                onToggle={() => toggleNodeSelection(node.id)}
                                hasChildren={nodes.some((n) => (n.parentId as string | null) === node.id)}
                                onRegenerate={() => regenerateChildren(node.id)}
                                isRecommended={node.id === recommendedId}
                                isDeveloperMode={false}
                              />
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

      {/* 선택된 안들 비교 테이블 */}
      {finalCount > 1 && finalSelectedNodes.every(n => n.spec) && (
        <div className="bg-white rounded-lg border-2 border-gray-200 pt-6 px-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
            {t("comparisonTitle")}
          </h3>
            <button
              onClick={() => setShowComparisonTable(!showComparisonTable)}
              className="text-sm text-gray-600 hover:text-gray-900 underline transition-colors"
            >
              {showComparisonTable ? t("hideDetails") : t("viewDetails")}
            </button>
          </div>
          {showComparisonTable && (
          <ComparisonTable nodes={finalSelectedNodes} />
          )}
        </div>
      )}


      {/* 선택 후 계속 진행 버튼 */}
      {canGenerateNext && (
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <div className="mb-4">
            <p className="text-base font-medium text-gray-900 mb-1">
              {finalStage !== "stage1" 
                ? t("finalSelectionCountWithStage", { count: finalCount })
                : t("finalSelectionCount", { count: finalCount })}
            </p>
            <p className="text-sm text-gray-700">
              {t("canContinueNext")}
            </p>
          </div>
          <button
            onClick={generateNextLevel}
            className="w-full h-12 bg-white text-gray-900 text-base font-medium rounded-md border-2 border-gray-900 hover:bg-gray-50 transition-colors tracking-tight focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            {t("continueNext")}
          </button>
        </div>
      )}

      {/* 임시 저장 버튼 */}
      {showSaveButton && externalSession && (() => {
        // 최신 노드와 선택 상태를 반영한 세션 생성
        const currentSession: Session = {
          ...externalSession,
          nodes,
          selectedNodeIds: Array.from(selectedIds),
          updatedAt: new Date().toISOString(),
        };
        return (
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
            <SaveButton session={currentSession} />
          </div>
        );
      })()}

      {/* 최종 확정 CTA - 하단 고정 버튼 하나로 통일 */}
      {finalCount > 0 && finalSelectedTitle && onFinalize && (
        <div className="sticky bottom-6 z-30 mt-8">
          <div className="bg-white rounded-lg border-2 border-gray-900 shadow-lg p-4">
            <button
              onClick={onFinalize}
              className="w-full h-12 bg-gray-900 text-white text-base font-semibold rounded-md hover:bg-gray-800 transition-colors tracking-tight focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              {t("finalizeButton")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 비교 테이블 컴포넌트
interface ComparisonTableProps {
  nodes: Node[];
}

function ComparisonTable({ nodes }: ComparisonTableProps) {
  const t = useTranslations("comparisonTable");
  const tArchitecture = useTranslations("architectureCard");
  const specs = nodes.map(n => n.spec as ImplementationSpec).filter(Boolean);
  if (specs.length === 0) return null;

  // 모든 항목 수집 (합집합)
  const allScreens = Array.from(new Set(specs.flatMap(s => s.screens)));
  const allFeatures = Array.from(new Set(specs.flatMap(s => s.features)));
  const allEntities = Array.from(new Set(specs.flatMap(s => s.entities)));
  const allApis = Array.from(new Set(specs.flatMap(s => s.apis)));
  const allArchitecture = Array.from(new Set(specs.flatMap(s => s.architecture)));

  const hasItem = (spec: ImplementationSpec, category: string, item: string) => {
    switch (category) {
      case "screens": return spec.screens.includes(item);
      case "features": return spec.features.includes(item);
      case "entities": return spec.entities.includes(item);
      case "apis": return spec.apis.includes(item);
      case "architecture": return spec.architecture.includes(item);
      default: return false;
    }
  };

  // 모든 안이 같은 항목을 가지고 있는지 확인
  const isAllSame = (category: string, item: string) => {
    const results = specs.map(spec => hasItem(spec, category, item));
    return results.every(r => r === results[0]);
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {nodes.map((node, nodeIdx) => {
        const spec = specs[nodeIdx];
        if (!spec) return null;

        return (
          <div key={node.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
            <div className="mb-4">
              <h4 className="text-base font-semibold text-gray-900">
                {getTranslatedLabel((node.label as string) ?? `${nodeIdx + 1}${t("option")}`)}: {node.title}
              </h4>
            </div>
            
            <div className="space-y-4 min-h-[400px]">
          {/* 난이도/기간 */}
              <div className="flex gap-3 items-center">
                <span className="text-sm font-medium text-gray-700">{t("difficulty")}:</span>
                <span className={`inline-block text-sm px-2 py-1 rounded font-medium ${
                  spec.difficulty === "초급" || spec.difficulty === "Beginner" ? "bg-green-100 text-green-800" :
                  spec.difficulty === "중급" || spec.difficulty === "Intermediate" ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {(() => {
                    if (locale === "en") {
                      if (spec.difficulty === "초급") return "Beginner";
                      if (spec.difficulty === "중급") return "Intermediate";
                      if (spec.difficulty === "상급") return "Advanced";
                    }
                    return spec.difficulty;
                  })()}
                </span>
                <span className="text-sm font-medium text-gray-700">{t("estimatedDuration")}:</span>
                <span className="text-sm text-gray-700 font-medium">
                  {locale === "en" && spec.estimatedDuration.includes("주") 
                    ? spec.estimatedDuration.replace("주", " weeks")
                    : spec.estimatedDuration}
                </span>
              </div>
          
          {/* 핵심 화면 */}
              {spec.screens.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 mb-2">{tArchitecture("coreScreens")}</h5>
                  <ul className="space-y-1">
                    {spec.screens.map((screen) => (
                      <li key={screen} className="text-sm text-gray-700 flex items-start">
                        <span className="text-gray-400 mr-2">•</span>
                        <span>{translateText(screen)}</span>
                      </li>
                    ))}
                  </ul>
                      </div>
              )}
          
          {/* 핵심 기능 */}
              {spec.features.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 mb-2">{tArchitecture("coreFeatures")}</h5>
                  <ul className="space-y-1">
                    {spec.features.map((feature) => (
                      <li key={feature} className="text-sm text-gray-700 flex items-start">
                        <span className="text-gray-400 mr-2">•</span>
                        <span>{translateText(feature)}</span>
                      </li>
                    ))}
                  </ul>
                      </div>
              )}
          
          {/* 데이터 엔티티 */}
              {spec.entities.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 mb-2">{tArchitecture("dataEntities")}</h5>
                  <ul className="space-y-1">
                    {spec.entities.map((entity) => (
                      <li key={entity} className="text-sm text-gray-700 flex items-start">
                        <span className="text-gray-400 mr-2">•</span>
                        <span className="font-mono">{entity}</span>
                      </li>
                    ))}
                  </ul>
                      </div>
              )}
          
          {/* API */}
              {spec.apis.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 mb-2">{tArchitecture("apiEndpoints")}</h5>
                  <ul className="space-y-1">
                    {spec.apis.map((api) => (
                      <li key={api} className="text-sm text-gray-700 flex items-start">
                        <span className="text-gray-400 mr-2">•</span>
                        <span className="font-mono">{api}</span>
                      </li>
                    ))}
                  </ul>
                      </div>
              )}
          
          {/* 아키텍처 */}
              {spec.architecture.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 mb-2">{tArchitecture("architectureComponents")}</h5>
                  <ul className="space-y-1">
                    {spec.architecture.map((arch) => (
                      <li key={arch} className="text-sm text-gray-700 flex items-start">
                        <span className="text-gray-400 mr-2">•</span>
                        <span>{arch}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                        )}
                      </div>
          </div>
                  );
                })}
    </div>
  );
}

// 레벨별 색상 매핑
const getLevelColor = (level: number) => {
  if (level === 2) {
    return { border: "border-blue-300", bg: "bg-blue-50", text: "text-blue-700" };
  } else if (level === 3) {
    return { border: "border-green-300", bg: "bg-green-50", text: "text-green-700" };
  } else if (level === 4) {
    return { border: "border-purple-300", bg: "bg-purple-50", text: "text-purple-700" };
  } else if (level === 5) {
    return { border: "border-orange-300", bg: "bg-orange-50", text: "text-orange-700" };
  } else if (level === 6) {
    return { border: "border-red-300", bg: "bg-red-50", text: "text-red-700" };
  }
  return { border: "border-gray-300", bg: "bg-gray-50", text: "text-gray-700" };
};

// 아이디어 카드 컴포넌트
interface IdeaCardProps {
  node: Node;
  isSelected: boolean;
  onToggle: () => void;
  hasChildren: boolean;
  onRegenerate?: () => void;
}

function IdeaCard({
  node,
  isSelected,
  onToggle,
  hasChildren,
  onRegenerate,
}: IdeaCardProps) {
  const locale = useLocale() as "ko" | "en";
  const t = useTranslations("ideaTree");
  const tArchitecture = useTranslations("architectureCard");
  const spec = node.spec as ImplementationSpec | undefined;
  const hasSpec = !!spec;
  
  // 라벨 번역 (한글 라벨을 영어로 변환)
  const getTranslatedLabel = (label?: string): string => {
    if (!label) return "";
    if (locale === "en") {
      // A안, B안 등을 Option A, Option B로 변환
      if (label === "A안") return "Option A";
      if (label === "B안") return "Option B";
      if (label === "C안") return "Option C";
      if (label === "D안") return "Option D";
      if (label === "E안") return "Option E";
      if (label === "1안") return "Option 1";
      if (label === "2안") return "Option 2";
      if (label === "3안") return "Option 3";
      if (label === "4안") return "Option 4";
      if (label === "5안") return "Option 5";
      if (label === "6안") return "Option 6";
      if (label === "7안") return "Option 7";
      if (label.startsWith("첫번째 안")) return "1st Option";
      if (label.startsWith("두번째 안")) return "2nd Option";
      if (label.startsWith("세번째 안")) return "3rd Option";
      if (label.startsWith("네번째 안")) return "4th Option";
      if (label.startsWith("다섯번째 안")) return "5th Option";
      if (label.startsWith("방안 1")) return "Approach 1";
      if (label.startsWith("방안 2")) return "Approach 2";
      if (label.startsWith("방안 3")) return "Approach 3";
      if (label.startsWith("방안 4")) return "Approach 4";
      if (label.startsWith("방안 5")) return "Approach 5";
    }
    return label;
  };
  
  // 레벨별 색상 클래스
  const nodeLevel = (node.level as number) ?? 2;
  const levelColor = getLevelColor(nodeLevel);
  
  const getBorderClass = () => {
    if (isSelected) {
      if (nodeLevel === 2) return "border-blue-600";
      if (nodeLevel === 3) return "border-green-600";
      if (nodeLevel === 4) return "border-purple-600";
      if (nodeLevel === 5) return "border-orange-600";
      if (nodeLevel === 6) return "border-red-600";
      return "border-blue-600";
    }
    return levelColor.border;
  };
  
  const getBgClass = () => {
    if (!isSelected) return "bg-white";
    return levelColor.bg;
  };
  
  const getTextClass = () => {
    if (!isSelected) return "text-gray-900";
    return levelColor.text;
  };
  
  // 난이도별 배지 색상
  const getDifficultyColor = (difficulty?: string) => {
    if (!difficulty) return "bg-gray-100 text-gray-800";
    // 한국어와 영어 모두 지원
    if (difficulty === "초급" || difficulty === "Beginner") return "bg-green-100 text-green-800";
    if (difficulty === "중급" || difficulty === "Intermediate") return "bg-yellow-100 text-yellow-800";
    if (difficulty === "상급" || difficulty === "Advanced") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };
  
  return (
    <div
      className={`${getBgClass()} rounded-lg border-2 p-5 cursor-pointer transition-all ${
        isSelected
          ? `${getBorderClass()} shadow-md`
          : `${getBorderClass()} hover:bg-gray-50`
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
              isSelected
                ? "bg-blue-600 border-blue-600"
                : "border-gray-300 bg-white"
            }`}
          >
            {isSelected && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
          <span className={`text-sm font-semibold ${getTextClass()}`}>
            {getTranslatedLabel((node.label as string) ?? "")}
          </span>
        </div>
        {hasChildren && onRegenerate && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRegenerate();
            }}
            className="text-xs text-gray-700 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-50 font-normal antialiased opacity-100"
            aria-label={t("regenerate")}
          >
            {t("regenerate")}
          </button>
        )}
      </div>
      
      <h4 className="text-base font-semibold text-gray-900 mb-2 tracking-tight">
        {node.title}
      </h4>
      
      {hasSpec ? (
        <div className="space-y-3">
          {/* 난이도/기간 배지 */}
          <div className="flex gap-2 flex-wrap">
            <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(spec.difficulty)}`}>
              {(() => {
                if (locale === "en") {
                  if (spec.difficulty === "초급") return "Beginner";
                  if (spec.difficulty === "중급") return "Intermediate";
                  if (spec.difficulty === "상급") return "Advanced";
                }
                return spec.difficulty;
              })()}
            </span>
            <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800">
              {spec.estimatedDuration}
            </span>
          </div>
          
          {/* 핵심 사용자 */}
          <div>
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 antialiased opacity-100">
              {tArchitecture("targetUser")}
            </p>
            <p className="text-xs text-gray-700 font-normal antialiased opacity-100 leading-relaxed">{spec.targetUser}</p>
          </div>
          
          {/* 핵심 화면 */}
          <div>
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 antialiased opacity-100">
              {tArchitecture("coreScreens")}
            </p>
            <ul className="text-xs text-gray-700 font-normal antialiased opacity-100 space-y-0.5">
              {spec.screens.slice(0, 3).map((screen, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-gray-600 mr-1">•</span>
                  <span className="leading-relaxed">{screen}</span>
                </li>
              ))}
              {spec.screens.length > 3 && (
                <li className="text-gray-600">{t("moreItems", { count: spec.screens.length - 3 })}</li>
              )}
            </ul>
          </div>
          
          {/* 핵심 기능 */}
          <div>
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 antialiased opacity-100">
              {tArchitecture("coreFeatures")}
            </p>
            <ul className="text-xs text-gray-700 font-normal antialiased opacity-100 space-y-0.5">
              {spec.features.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-gray-600 mr-1">•</span>
                  <span className="leading-relaxed">{feature}</span>
                </li>
              ))}
              {spec.features.length > 3 && (
                <li className="text-gray-600">{t("moreItems", { count: spec.features.length - 3 })}</li>
              )}
            </ul>
          </div>
          
          {/* 데이터 엔티티 */}
          <div>
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 antialiased opacity-100">
              {tArchitecture("dataEntities")}
            </p>
            <div className="flex flex-wrap gap-1">
              {spec.entities.slice(0, 3).map((entity, idx) => (
                <span key={idx} className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded font-normal antialiased opacity-100">
                  {entity}
                </span>
              ))}
              {spec.entities.length > 3 && (
                <span className="text-xs text-gray-600 font-normal antialiased opacity-100">+{spec.entities.length - 3}</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-700 font-normal antialiased opacity-100 leading-relaxed">{(node.summary as string) ?? ""}</p>
      )}
    </div>
  );
}

