"use client";

import { useState, useEffect } from "react";
import { Node, AppType, ImplementationSpec } from "@/lib/types";
import { generateNextLevelIdeas } from "@/lib/generateIdeas";
import ArchitectureCard from "./ArchitectureCard";
import BadgeWithTooltip from "./BadgeWithTooltip";

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
}: IdeaTreeProps) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(initialSelectedIds)
  );
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);

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

  // 노드 토글 선택
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
        5
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
    const newChildren = generateNextLevelIdeas(parent, keywords, selectedType, 5);
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
    let recommendedLabel = "B안";
    
    // 키워드 기반 추천 로직
    if (keywordStr.includes("빠른") || keywordStr.includes("심플") || keywordStr.includes("간단")) {
      recommendedLabel = "A안";
    } else if (keywordStr.includes("전문가") || keywordStr.includes("대용량") || keywordStr.includes("고급")) {
      // C 또는 D 중 선택 (랜덤하지 않고 일관성 있게)
      if (keywordStr.includes("성능") || keywordStr.includes("비용") || keywordStr.includes("최적화")) {
        recommendedLabel = "C안";
      } else {
        recommendedLabel = "D안";
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

  // 다음 레벨 생성 가능 여부 (최종 선택된 노드들이 최대 레벨에 있을 때)
  const canGenerateNext = finalCount > 0 && maxSelectedLevel === maxLevel;

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

  const selectionPath = getSelectionPath();
  const finalSelectedTitle = finalSelectedNodes.length > 0 ? finalSelectedNodes[0].title : null;

  return (
    <div className="space-y-8">
      {/* 상태 표시바 */}
      {selectionPath.length > 0 && (
        <div className="bg-white rounded-lg border-2 border-gray-200 p-4 sticky top-4 z-20 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="font-semibold">선택 경로:</span>
            {selectionPath.map((title, idx) => (
              <span key={idx} className="flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{title}</span>
                {idx < selectionPath.length - 1 && <span className="text-gray-400">→</span>}
              </span>
            ))}
            {finalCount > 0 && (
              <span className="ml-auto text-xs text-gray-500">
                {finalCount}개 선택됨
              </span>
            )}
          </div>
        </div>
      )}

      {/* 개발자 모드 토글 */}
      <div className="flex justify-end">
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-sm text-gray-700 font-medium">개발자 모드</span>
          <div className="relative">
            <input
              type="checkbox"
              checked={isDeveloperMode}
              onChange={(e) => setIsDeveloperMode(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-11 h-6 rounded-full transition-colors ${
                isDeveloperMode ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                  isDeveloperMode ? "translate-x-5" : "translate-x-0.5"
                } mt-0.5`}
              />
            </div>
          </div>
        </label>
      </div>

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
                  <div>
                    <h3 className={`text-lg font-semibold tracking-tight ${
                      level === 2 ? "text-blue-900" :
                      level === 3 ? "text-green-900" :
                      level === 4 ? "text-purple-900" :
                      level === 5 ? "text-orange-900" :
                      level === 6 ? "text-red-900" :
                      "text-gray-900"
                    }`}>
                      {level === 2 ? "1차 아이디어" : `${level - 1}차 분기 아이디어`}
                    </h3>
                    {level === 2 && (
                      <p className="text-sm text-gray-500 mt-1">
                        키워드를 기준으로 생성된 초기 아이디어입니다
                      </p>
                    )}
                    {level > 2 && (
                      <p className="text-sm text-gray-500 mt-1">
                        선택된 상위 안을 기준으로 생성된 분기 아이디어입니다
                      </p>
                    )}
                  </div>
                </div>
                {level > 2 && (
                  <p className="text-sm text-gray-500">
                    총 {levelNodes.length}개
                  </p>
                )}
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
                            {children.length}개의 하위 안 생성됨
                          </span>
                          {isParentSelected && (
                            <span className="ml-auto px-2 py-1 text-xs bg-blue-600 text-white rounded">
                              선택됨
                            </span>
                          )}
                        </div>
                        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 ml-8 border-l-2 pl-6 items-start ${
                          level === 3 ? "border-l-green-500" :
                          level === 4 ? "border-l-purple-500" :
                          level === 5 ? "border-l-orange-500" :
                          level === 6 ? "border-l-red-500" :
                          "border-l-gray-200"
                        }`}>
                          {(() => {
                            const recommendedId = getRecommendedNodeId(children);
                            return children.map((node) => (
                              <ArchitectureCard
                                key={node.id}
                                node={node}
                                isSelected={selectedIds.has(node.id)}
                                onToggle={() => toggleNodeSelection(node.id)}
                                hasChildren={nodes.some((n) => (n.parentId as string | null) === node.id)}
                                onRegenerate={() => regenerateChildren(node.id)}
                                isRecommended={node.id === recommendedId}
                                isDeveloperMode={isDeveloperMode}
                              />
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4 tracking-tight">
            선택된 안 비교
          </h3>
          <ComparisonTable nodes={finalSelectedNodes} />
        </div>
      )}

      {/* 선택 후 마무리/계속 진행 선택 */}
      {canGenerateNext && (
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <div className="mb-4">
            <p className="text-base font-medium text-gray-900 mb-1">
              최종 선택 {finalCount}개{finalStage !== "stage1" && " (마지막 단계 기준)"}
            </p>
            <p className="text-sm text-gray-500">
              여기서 마무리할까요, 아니면 계속 진행할까요?
            </p>
          </div>
          <div className="flex gap-3">
            {onFinalize && (
              <button
                onClick={onFinalize}
                className="flex-1 h-12 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                여기서 마무리하기
              </button>
            )}
            <button
              onClick={generateNextLevel}
              className="flex-1 h-12 bg-white text-gray-900 text-base font-medium rounded-md border-2 border-gray-900 hover:bg-gray-50 transition-colors tracking-tight focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              계속 진행하기 (다음 분기 생성)
            </button>
          </div>
        </div>
      )}

      {/* Floating CTA */}
      {finalCount > 0 && finalSelectedTitle && onFinalize && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
          <button
            onClick={onFinalize}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all text-base font-semibold flex items-center gap-2"
          >
            <span>{finalSelectedTitle}</span>
            <span>으로 설계 시작하기</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
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

  // 난이도 툴팁 텍스트
  const getDifficultyTooltip = (difficulty?: string) => {
    switch (difficulty) {
      case "초급":
        return "기본 CRUD 기능, 단순 화면 구성, 기본 인증만 포함\n예: 로그 추가/조회, 기본 통계, 사용자 프로필";
      case "중급":
        return "검색/필터, 태그, 알림, 목표 설정 등 확장 기능 포함\n예: 검색 및 필터링, 태그 관리, 알림 설정, 목표 추적";
      case "상급":
        return "성능 최적화(캐싱/배치), ML/추천 알고리즘, 복잡한 권한 시스템 등 포함\n예: 성능 모니터링, 추천 알고리즘, 권한 관리, 감사 로그";
      default:
        return "";
    }
  };

  // 기간 툴팁 텍스트
  const getDurationTooltip = (duration?: string) => {
    return `1명의 개발자가 풀타임으로 작업할 때의 예상 기간입니다.\n\n기간은 다음을 포함합니다:\n• 프론트엔드 개발\n• 백엔드 API 개발\n• 데이터베이스 설계\n• 기본 배포 및 테스트\n\n실제 기간은 팀 규모, 경험 수준, 요구사항 변경에 따라 달라질 수 있습니다.`;
  };

  return (
    <div className="space-y-3">
      {/* 난이도/기간 기준 안내 */}
      <div className="bg-gray-50 border border-gray-200 rounded-md p-2 text-xs">
        <p className="text-gray-700 font-medium mb-1">📊 난이도/기간 기준</p>
        <p className="text-gray-600 leading-relaxed">
          난이도는 포함된 기능의 복잡도를, 기간은 1명 개발자 풀타임 기준 예상 기간을 나타냅니다. 배지에 마우스를 올리면 자세한 기준을 확인할 수 있습니다.
        </p>
      </div>

      <div className="overflow-x-auto">
      <table className="w-full text-base border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="text-left py-1.5 px-2.5 font-semibold text-gray-900 bg-gray-50 sticky left-0 z-10">항목</th>
            {nodes.map((node, idx) => (
              <th key={node.id} className="text-center py-1.5 px-2.5 font-semibold text-gray-900 bg-gray-50 min-w-[100px]">
                {(node.label as string) ?? `${idx + 1}안`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* 난이도/기간 */}
          <tr className="border-b border-gray-200 bg-gray-50">
            <td className="py-1.5 px-2.5 font-medium text-gray-700 sticky left-0 z-10 bg-gray-50">난이도</td>
            {specs.map((spec, idx) => (
              <td key={idx} className="py-1.5 px-2.5 text-center">
                <BadgeWithTooltip
                  tooltipText={getDifficultyTooltip(spec.difficulty)}
                  className={`inline-block text-sm px-2 py-0.5 rounded font-medium cursor-help ${
                    spec.difficulty === "초급" ? "bg-green-100 text-green-800" :
                    spec.difficulty === "중급" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}
                  ariaLabel={`난이도: ${spec.difficulty}. 자세한 기준을 보려면 클릭하세요.`}
                >
                  {spec.difficulty}
                </BadgeWithTooltip>
              </td>
            ))}
          </tr>
          <tr className="border-b border-gray-200 bg-gray-50">
            <td className="py-1.5 px-2.5 font-medium text-gray-700 sticky left-0 z-10 bg-gray-50">예상 기간</td>
            {specs.map((spec, idx) => (
              <td key={idx} className="py-1.5 px-2.5 text-center">
                <BadgeWithTooltip
                  tooltipText={getDurationTooltip(spec.estimatedDuration)}
                  className="inline-block text-gray-700 font-medium cursor-help"
                  ariaLabel={`예상 기간: ${spec.estimatedDuration}. 자세한 기준을 보려면 클릭하세요.`}
                >
                  {spec.estimatedDuration}
                </BadgeWithTooltip>
              </td>
            ))}
          </tr>
          
          {/* 핵심 화면 */}
          <tr className="border-b-2 border-gray-300">
            <td colSpan={nodes.length + 1} className="py-1.5 px-2.5 font-semibold text-gray-900 bg-gray-200">
              핵심 화면
            </td>
          </tr>
          {allScreens.map((screen) => {
            const allSame = isAllSame("screens", screen);
            return (
              <tr 
                key={screen} 
                className={`border-b border-gray-100 ${
                  allSame ? "bg-green-50/30" : "bg-white"
                } hover:bg-gray-50 transition-colors`}
              >
                <td className={`py-1.5 px-2.5 text-gray-700 font-medium sticky left-0 z-10 ${
                  allSame ? "bg-green-50/30" : "bg-white"
                }`}>
                  {screen}
                </td>
                {specs.map((spec, idx) => {
                  const has = hasItem(spec, "screens", screen);
                  return (
                    <td key={idx} className="py-1.5 px-2.5 text-center align-middle">
                      <div className="flex items-center justify-center">
                        {has ? (
                          <span className="text-green-600 font-bold text-xl">✓</span>
                        ) : (
                          <span className="text-gray-300 font-bold text-xl">-</span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
          
          {/* 핵심 기능 */}
          <tr className="border-b-2 border-gray-300">
            <td colSpan={nodes.length + 1} className="py-1.5 px-2.5 font-semibold text-gray-900 bg-gray-200">
              핵심 기능
            </td>
          </tr>
          {allFeatures.map((feature) => {
            const allSame = isAllSame("features", feature);
            return (
              <tr 
                key={feature} 
                className={`border-b border-gray-100 ${
                  allSame ? "bg-green-50/30" : "bg-white"
                } hover:bg-gray-50 transition-colors`}
              >
                <td className={`py-1.5 px-2.5 text-gray-700 font-medium sticky left-0 z-10 ${
                  allSame ? "bg-green-50/30" : "bg-white"
                }`}>
                  {feature}
                </td>
                {specs.map((spec, idx) => {
                  const has = hasItem(spec, "features", feature);
                  return (
                    <td key={idx} className="py-1.5 px-2.5 text-center align-middle">
                      <div className="flex items-center justify-center">
                        {has ? (
                          <span className="text-green-600 font-bold text-xl">✓</span>
                        ) : (
                          <span className="text-gray-300 font-bold text-xl">-</span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
          
          {/* 데이터 엔티티 */}
          <tr className="border-b-2 border-gray-300">
            <td colSpan={nodes.length + 1} className="py-1.5 px-2.5 font-semibold text-gray-900 bg-gray-200">
              데이터 엔티티
            </td>
          </tr>
          {allEntities.map((entity) => {
            const allSame = isAllSame("entities", entity);
            return (
              <tr 
                key={entity} 
                className={`border-b border-gray-100 ${
                  allSame ? "bg-green-50/30" : "bg-white"
                } hover:bg-gray-50 transition-colors`}
              >
                <td className={`py-1.5 px-2.5 text-gray-700 font-mono text-sm font-medium sticky left-0 z-10 ${
                  allSame ? "bg-green-50/30" : "bg-white"
                }`}>
                  {entity}
                </td>
                {specs.map((spec, idx) => {
                  const has = hasItem(spec, "entities", entity);
                  return (
                    <td key={idx} className="py-1.5 px-2.5 text-center align-middle">
                      <div className="flex items-center justify-center">
                        {has ? (
                          <span className="text-green-600 font-bold text-xl">✓</span>
                        ) : (
                          <span className="text-gray-300 font-bold text-xl">-</span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
          
          {/* API */}
          <tr className="border-b-2 border-gray-300">
            <td colSpan={nodes.length + 1} className="py-1.5 px-2.5 font-semibold text-gray-900 bg-gray-200">
              API
            </td>
          </tr>
          {allApis.map((api) => {
            const allSame = isAllSame("apis", api);
            return (
              <tr 
                key={api} 
                className={`border-b border-gray-100 ${
                  allSame ? "bg-green-50/30" : "bg-white"
                } hover:bg-gray-50 transition-colors`}
              >
                <td className={`py-1.5 px-2.5 text-gray-700 font-mono text-sm font-medium sticky left-0 z-10 ${
                  allSame ? "bg-green-50/30" : "bg-white"
                }`}>
                  {api}
                </td>
                {specs.map((spec, idx) => {
                  const has = hasItem(spec, "apis", api);
                  return (
                    <td key={idx} className="py-1.5 px-2.5 text-center align-middle">
                      <div className="flex items-center justify-center">
                        {has ? (
                          <span className="text-green-600 font-bold text-xl">✓</span>
                        ) : (
                          <span className="text-gray-300 font-bold text-xl">-</span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
          
          {/* 아키텍처 */}
          <tr className="border-b-2 border-gray-300">
            <td colSpan={nodes.length + 1} className="py-1.5 px-2.5 font-semibold text-gray-900 bg-gray-200">
              아키텍처 구성요소
            </td>
          </tr>
          {allArchitecture.map((arch, archIdx) => {
            const allSame = isAllSame("architecture", arch);
            const isLast = archIdx === allArchitecture.length - 1;
            return (
              <tr 
                key={arch} 
                className={`${isLast ? "" : "border-b border-gray-100"} ${
                  allSame ? "bg-green-50/30" : "bg-white"
                } hover:bg-gray-50 transition-colors`}
              >
                <td className={`py-1.5 px-2.5 text-gray-700 font-medium sticky left-0 z-10 ${
                  allSame ? "bg-green-50/30" : "bg-white"
                }`}>
                  {arch}
                </td>
                {specs.map((spec, idx) => {
                  const has = hasItem(spec, "architecture", arch);
                  return (
                    <td key={idx} className="py-1.5 px-2.5 text-center align-middle">
                      <div className="flex items-center justify-center">
                        {has ? (
                          <span className="text-green-600 font-bold text-xl">✓</span>
                        ) : (
                          <span className="text-gray-300 font-bold text-xl">-</span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
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
  const spec = node.spec as ImplementationSpec | undefined;
  const hasSpec = !!spec;
  
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
    switch (difficulty) {
      case "초급": return "bg-green-100 text-green-800";
      case "중급": return "bg-yellow-100 text-yellow-800";
      case "상급": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // 난이도 툴팁 텍스트
  const getDifficultyTooltip = (difficulty?: string) => {
    switch (difficulty) {
      case "초급":
        return "기본 CRUD 기능, 단순 화면 구성, 기본 인증만 포함\n예: 로그 추가/조회, 기본 통계, 사용자 프로필";
      case "중급":
        return "검색/필터, 태그, 알림, 목표 설정 등 확장 기능 포함\n예: 검색 및 필터링, 태그 관리, 알림 설정, 목표 추적";
      case "상급":
        return "성능 최적화(캐싱/배치), ML/추천 알고리즘, 복잡한 권한 시스템 등 포함\n예: 성능 모니터링, 추천 알고리즘, 권한 관리, 감사 로그";
      default:
        return "";
    }
  };

  // 기간 툴팁 텍스트
  const getDurationTooltip = (duration?: string) => {
    return `1명의 개발자가 풀타임으로 작업할 때의 예상 기간입니다.\n\n기간은 다음을 포함합니다:\n• 프론트엔드 개발\n• 백엔드 API 개발\n• 데이터베이스 설계\n• 기본 배포 및 테스트\n\n실제 기간은 팀 규모, 경험 수준, 요구사항 변경에 따라 달라질 수 있습니다.`;
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
            {(node.label as string) ?? ""}
          </span>
        </div>
        {hasChildren && onRegenerate && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRegenerate();
            }}
            className="text-xs text-gray-700 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-50 font-normal antialiased opacity-100"
            aria-label="재생성"
          >
            재생성
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
            <BadgeWithTooltip
              tooltipText={getDifficultyTooltip(spec.difficulty)}
              className={`text-xs px-2 py-1 rounded cursor-help ${getDifficultyColor(spec.difficulty)}`}
              ariaLabel={`난이도: ${spec.difficulty}. 자세한 기준을 보려면 클릭하세요.`}
            >
              {spec.difficulty}
            </BadgeWithTooltip>
            <BadgeWithTooltip
              tooltipText={getDurationTooltip(spec.estimatedDuration)}
              className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800 cursor-help"
              ariaLabel={`예상 기간: ${spec.estimatedDuration}. 자세한 기준을 보려면 클릭하세요.`}
            >
              {spec.estimatedDuration}
            </BadgeWithTooltip>
          </div>
          
          {/* 핵심 사용자 */}
          <div>
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 antialiased opacity-100">
              핵심 사용자
            </p>
            <p className="text-xs text-gray-700 font-normal antialiased opacity-100 leading-relaxed">{spec.targetUser}</p>
          </div>
          
          {/* 핵심 화면 */}
          <div>
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 antialiased opacity-100">
              핵심 화면
            </p>
            <ul className="text-xs text-gray-700 font-normal antialiased opacity-100 space-y-0.5">
              {spec.screens.slice(0, 3).map((screen, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-gray-600 mr-1">•</span>
                  <span className="leading-relaxed">{screen}</span>
                </li>
              ))}
              {spec.screens.length > 3 && (
                <li className="text-gray-600">+{spec.screens.length - 3}개 더</li>
              )}
            </ul>
          </div>
          
          {/* 핵심 기능 */}
          <div>
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 antialiased opacity-100">
              핵심 기능
            </p>
            <ul className="text-xs text-gray-700 font-normal antialiased opacity-100 space-y-0.5">
              {spec.features.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-gray-600 mr-1">•</span>
                  <span className="leading-relaxed">{feature}</span>
                </li>
              ))}
              {spec.features.length > 3 && (
                <li className="text-gray-600">+{spec.features.length - 3}개 더</li>
              )}
            </ul>
          </div>
          
          {/* 데이터 엔티티 */}
          <div>
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 antialiased opacity-100">
              데이터 엔티티
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

