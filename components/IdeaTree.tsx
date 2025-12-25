"use client";

import { useState, useEffect } from "react";
import { Node } from "@/lib/types";
import { generateNextLevelIdeas } from "@/lib/generateIdeas";

interface IdeaTreeProps {
  sessionId: string;
  initialNodes: Node[];
  initialSelectedIds: string[];
  keywords: string[];
  selectedType: "app" | "web";
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
          .filter((n) => n.parentId === id)
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
    const selectedNodes = nodes.filter((n) => selectedIds.has(n.id));
    if (selectedNodes.length === 0) return;

    const newNodes: Node[] = [];

    selectedNodes.forEach((parent) => {
      // 이미 자식이 있으면 생성하지 않음 (재생성은 별도 버튼으로)
      const hasChildren = nodes.some((n) => n.parentId === parent.id);
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
        if (n.parentId === id) {
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
    if (!acc[node.level]) {
      acc[node.level] = [];
    }
    acc[node.level].push(node);
    return acc;
  }, {} as Record<number, Node[]>);

  // 최대 레벨 찾기
  const maxLevel = Math.max(...Object.keys(nodesByLevel).map(Number), 0);

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
    ? Math.max(...finalSelectedNodes.map((n) => n.level))
    : 0;

  // 다음 레벨 생성 가능 여부 (최종 선택된 노드들이 최대 레벨에 있을 때)
  const canGenerateNext = finalCount > 0 && maxSelectedLevel === maxLevel;

  return (
    <div className="space-y-8">
      {/* 레벨별로 렌더링 */}
      {Object.keys(nodesByLevel)
        .map(Number)
        .sort((a, b) => a - b)
        .map((level) => {
          const levelNodes = nodesByLevel[level];
          const parentNodes = level === 2 ? [] : levelNodes.map((n) => {
            const parent = nodes.find((p) => p.id === n.parentId);
            return parent ? { node: n, parent } : null;
          }).filter((item): item is { node: Node; parent: Node } => item !== null);

          return (
            <div key={level} className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold bg-gray-600 text-white">
                    {level === 2 ? "1" : level - 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
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
                // 레벨 2: 그리드 레이아웃
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {levelNodes.map((node) => {
                    const levelColor = getLevelColor(node.level);
                    return (
                      <IdeaCard
                        key={node.id}
                        node={node}
                        isSelected={selectedIds.has(node.id)}
                        onToggle={() => toggleNodeSelection(node.id)}
                        hasChildren={nodes.some((n) => n.parentId === node.id)}
                        onRegenerate={() => regenerateChildren(node.id)}
                      />
                    );
                  })}
                </div>
              ) : (
                // 레벨 3 이상: 부모별로 그룹화하여 트리 형태
                <div className="space-y-8">
                  {Array.from(
                    new Set(levelNodes.map((n) => n.parentId))
                  ).map((parentId) => {
                    const parent = nodes.find((p) => p.id === parentId);
                    const children = levelNodes.filter((n) => n.parentId === parentId);
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
                            <span className="text-base">{parent.label}</span>
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
                        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 ml-8 border-l-2 pl-6 ${
                          level === 3 ? "border-l-green-300" :
                          level === 4 ? "border-l-purple-300" :
                          level === 5 ? "border-l-orange-300" :
                          "border-l-gray-200"
                        }`}>
                          {children.map((node) => (
                            <IdeaCard
                              key={node.id}
                              node={node}
                              isSelected={selectedIds.has(node.id)}
                              onToggle={() => toggleNodeSelection(node.id)}
                              hasChildren={nodes.some((n) => n.parentId === node.id)}
                              onRegenerate={() => regenerateChildren(node.id)}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

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
    </div>
  );
}

// 레벨별 색상 매핑 (모두 gray로 통일)
const getLevelColor = (level: number) => {
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
  // 레벨별 색상 클래스 (선택 시 Primary 컬러 사용)
  const getBorderClass = () => {
    if (isSelected) {
      return "border-blue-600";
    }
    return "border-gray-300";
  };
  
  const getBgClass = () => {
    if (!isSelected) return "bg-white";
    return "bg-gray-50";
  };
  
  const getTextClass = () => {
    if (!isSelected) return "text-gray-900";
    return "text-gray-700";
  };
  
  return (
    <div
      className={`${getBgClass()} rounded-lg border-2 p-6 cursor-pointer transition-all ${
        isSelected
          ? `${getBorderClass()} shadow-md`
          : `${getBorderClass()} hover:opacity-80 opacity-60`
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
            {node.label}
          </span>
        </div>
        {hasChildren && onRegenerate && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRegenerate();
            }}
            className="text-xs text-gray-500 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-50"
            aria-label="재생성"
          >
            재생성
          </button>
        )}
      </div>
      <h4 className="text-base font-semibold text-gray-900 mb-2 tracking-tight">
        {node.title}
      </h4>
      <p className="text-sm text-gray-600 leading-relaxed">{node.summary}</p>
    </div>
  );
}

