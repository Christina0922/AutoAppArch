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

  // 선택된 노드들의 최하위 레벨 찾기
  const selectedNodes = nodes.filter((n) => selectedIds.has(n.id));
  const maxSelectedLevel = selectedNodes.length > 0
    ? Math.max(...selectedNodes.map((n) => n.level))
    : 0;

  // 다음 레벨 생성 가능 여부
  const canGenerateNext = selectedNodes.length > 0 && maxSelectedLevel === maxLevel;

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
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
                  {level === 2 ? "1차 아이디어" : `${level - 1}차 분기 아이디어`}
                </h3>
                {level > 2 && (
                  <p className="text-sm text-gray-500">
                    {levelNodes.length}개의 안이 생성되었습니다
                  </p>
                )}
              </div>

              {level === 2 ? (
                // 레벨 2: 그리드 레이아웃
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {levelNodes.map((node) => (
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
              ) : (
                // 레벨 3 이상: 부모별로 그룹화하여 트리 형태
                <div className="space-y-8">
                  {Array.from(
                    new Set(levelNodes.map((n) => n.parentId))
                  ).map((parentId) => {
                    const parent = nodes.find((p) => p.id === parentId);
                    const children = levelNodes.filter((n) => n.parentId === parentId);
                    if (!parent) return null;

                    return (
                      <div key={parentId} className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-medium">{parent.label}</span>
                          <span>→</span>
                          <span>{children.length}개의 하위 안</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-6">
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

      {/* 다음 레벨 생성 버튼 */}
      {canGenerateNext && (
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-medium text-gray-900 mb-1">
                선택된 아이디어를 기준으로 다음 분기를 생성하시겠습니까?
              </p>
              <p className="text-sm text-gray-500">
                {selectedNodes.length}개의 아이디어가 선택되었습니다
              </p>
            </div>
            <button
              onClick={generateNextLevel}
              className="px-6 h-12 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              다음 분기 생성하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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
  return (
    <div
      className={`bg-white rounded-lg border-2 p-6 cursor-pointer transition-all ${
        isSelected
          ? "border-gray-900 shadow-md"
          : "border-gray-100 hover:border-gray-300"
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
              isSelected
                ? "bg-gray-900 border-gray-900"
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
          <span className="text-sm font-semibold text-gray-900">
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

