"use client";

import { useState, useMemo } from "react";
import { Node } from "@/lib/types";
import {
  EXAMPLE_KEYWORDS,
  FIRST_LEVEL_IDEAS,
  generateSecondLevel,
  generateThirdLevel,
} from "@/data/exampleFlow";

export default function ExampleFlowDemo() {
  const [nodes, setNodes] = useState<Node[]>(() => {
    // 초기 1차 아이디어 생성
    return FIRST_LEVEL_IDEAS.map((idea, idx) => ({
      ...idea,
      id: `level2-${idx + 1}`,
      parentId: null as string | null,
    } as unknown as Node));
  });

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedLevels, setExpandedLevels] = useState<Set<number>>(new Set([2])); // 1차는 기본으로 펼침
  const [showAllLevels, setShowAllLevels] = useState(false); // 처음에는 1차만 보기
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set()); // 모바일에서 카드 상세 펼침

  // 노드 선택 토글
  const toggleSelection = (nodeId: string) => {
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
    setSelectedIds(newSelected);
  };

  // 선택된 노드 기준으로 다음 레벨 생성
  const generateNextLevel = (parentId: string, regenerate: boolean = false) => {
    const parent = nodes.find((n) => n.id === parentId);
    if (!parent) return;

    const nextLevel = (parent.level as number) + 1;
    const existingChildren = nodes.filter((n) => (n.parentId as string | null) === parentId);
    
    // 재생성이 아니고 이미 자식이 있으면 생성하지 않음
    if (!regenerate && existingChildren.length > 0) return;

    // 재생성인 경우 기존 자식 노드 제거
    let updatedNodes = regenerate 
      ? nodes.filter((n) => (n.parentId as string | null) !== parentId)
      : [...nodes];

    let newNodes: Node[] = [];
    
    if (nextLevel === 3) {
      // 2차 생성
      const templates = generateSecondLevel(parent.label as string);
      newNodes = templates.map((template, idx) => ({
        ...template,
        id: regenerate 
          ? `level3-${parentId}-${idx}-${Date.now()}` 
          : `level3-${parentId}-${idx}`,
        parentId: parentId,
      } as unknown as Node));
    } else if (nextLevel === 4) {
      // 3차 생성
      const grandParent = nodes.find((n) => n.id === (parent.parentId as string | null));
      const templates = generateThirdLevel(
        parent.label as string,
        (grandParent?.label as string) || ""
      );
      newNodes = templates.map((template, idx) => ({
        ...template,
        id: regenerate 
          ? `level4-${parentId}-${idx}-${Date.now()}` 
          : `level4-${parentId}-${idx}`,
        parentId: parentId,
      } as unknown as Node));
    }

    setNodes([...updatedNodes, ...newNodes]);
    // Set을 펼치지 말고, Set 복사 후 add 사용
    const nextExpanded = new Set(expandedLevels);
    nextExpanded.add(nextLevel);
    setExpandedLevels(nextExpanded);
  };

  // 레벨별로 노드 그룹화
  const nodesByLevel = useMemo(() => {
    return nodes.reduce((acc, node) => {
      const level = node.level as number;
      if (!acc[level]) {
        acc[level] = [];
      }
      acc[level].push(node);
      return acc;
    }, {} as Record<number, Node[]>);
  }, [nodes]);

  // 최종 후보 찾기 (선택된 최말단 노드들)
  const finalCandidates = useMemo(() => {
    const selectedNodes = nodes.filter((n) => selectedIds.has(n.id));
    if (selectedNodes.length === 0) return [];

    const maxLevel = Math.max(...selectedNodes.map((n) => (n.level as number) ?? 0));
    const candidates = selectedNodes.filter((n) => (n.level as number) === maxLevel);

    // 각 후보의 경로 생성
    return candidates.map((candidate) => {
      const path: string[] = [candidate.label as string];
      let current = candidate;
      while (current.parentId) {
        const parent = nodes.find((n) => n.id === (current.parentId as string | null));
        if (parent) {
          path.unshift(parent.label as string);
          current = parent;
        } else {
          break;
        }
      }
      return {
        node: candidate,
        path: path.join(" > "),
      };
    });
  }, [nodes, selectedIds]);

  // 레벨별 렌더링
  const renderLevel = (level: number) => {
    const levelNodes = nodesByLevel[level] || [];
    if (levelNodes.length === 0) return null;

    const isExpanded = expandedLevels.has(level);
    const shouldShow = level === 2 || showAllLevels;

    return (
      <div key={level} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {level === 2 && "1차 아이디어"}
            {level === 3 && "2차 분기"}
            {level === 4 && "3차 분기"}
          </h3>
          {level > 2 && shouldShow && (
            <button
              onClick={() => {
                const newExpanded = new Set(expandedLevels);
                if (isExpanded) {
                  newExpanded.delete(level);
                } else {
                  newExpanded.add(level);
                }
                setExpandedLevels(newExpanded);
              }}
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              {isExpanded ? "접기" : "펼치기"}
            </button>
          )}
        </div>

        {shouldShow && isExpanded && (
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-w-max sm:min-w-0">
              {levelNodes.map((node) => {
                const isSelected = selectedIds.has(node.id);
                const hasChildren = nodes.some((n) => (n.parentId as string | null) === node.id);
                const canGenerateNext = isSelected && !hasChildren && level < 4;

                const isCardExpanded = expandedCards.has(node.id);
                const features = (node.meta?.features as string[] | undefined) || [];
                const hasDetails = features.length > 0;
                const showDetails = isCardExpanded || !hasDetails; // 상세 정보가 없으면 항상 표시

                return (
                  <div key={node.id} className="space-y-2 min-w-[200px] sm:min-w-0">
                    <div
                      className={`bg-white rounded-lg border-2 p-4 transition-all ${
                        isSelected
                          ? "border-blue-600 shadow-md"
                          : "border-gray-100 hover:border-gray-300"
                      }`}
                    >
                      <div 
                        className="cursor-pointer"
                        onClick={() => toggleSelection(node.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
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
                            <span className="text-sm font-semibold text-gray-900">
                              {(node.label as string) ?? ""}
                            </span>
                          </div>
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2 tracking-tight">
                          {node.title}
                        </h4>
                        {/* 한 줄 컨셉 */}
                        <p className="text-xs text-gray-600 leading-relaxed mb-3">
                          {(node.summary as string) ?? ""}
                        </p>
                      </div>

                      {/* 핵심 기능 및 가치 (2차 분기만 상세 표시) */}
                      {level === 3 && hasDetails && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          {showDetails ? (
                            <>
                              {/* 핵심 기능 */}
                              {hasDetails && (
                                <div className="mb-3">
                                  <p className="text-xs font-semibold text-gray-700 mb-1.5">
                                    핵심 기능
                                  </p>
                                  <ul className="space-y-1">
                                    {features.map((feature, idx) => (
                                      <li key={idx} className="text-xs text-gray-600 flex items-start">
                                        <span className="text-gray-400 mr-1.5 mt-0.5">•</span>
                                        <span>{feature}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {/* 사용자 가치/차별점 */}
                              {(node.meta?.value as string | undefined) && (
                                <div className="bg-gray-50 rounded p-2">
                                  <p className="text-xs font-semibold text-gray-700 mb-1">
                                    차별점
                                  </p>
                                  <p className="text-xs text-gray-600 leading-relaxed">
                                    {(node.meta?.value as string) ?? ""}
                                  </p>
                                </div>
                              )}
                              {/* 모바일에서 접기 버튼 */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newExpanded = new Set(expandedCards);
                                  newExpanded.delete(node.id);
                                  setExpandedCards(newExpanded);
                                }}
                                className="mt-2 text-xs text-gray-500 hover:text-gray-700 sm:hidden"
                              >
                                접기
                              </button>
                            </>
                          ) : (
                            /* 모바일에서 펼치기 버튼 */
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const newExpanded = new Set(expandedCards);
                                newExpanded.add(node.id);
                                setExpandedCards(newExpanded);
                              }}
                              className="w-full text-xs text-gray-500 hover:text-gray-700 sm:hidden text-center py-1"
                            >
                              자세히 보기
                            </button>
                          )}
                          {/* 데스크톱에서는 항상 표시 */}
                          <div className="hidden sm:block">
                            {hasDetails && (
                              <div className="mb-3">
                                <p className="text-xs font-semibold text-gray-700 mb-1.5">
                                  핵심 기능
                                </p>
                                <ul className="space-y-1">
                                  {features.map((feature, idx) => (
                                    <li key={idx} className="text-xs text-gray-600 flex items-start">
                                      <span className="text-gray-400 mr-1.5 mt-0.5">•</span>
                                      <span>{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {(node.meta?.value as string | undefined) && (
                              <div className="bg-gray-50 rounded p-2">
                                <p className="text-xs font-semibold text-gray-700 mb-1">
                                  차별점
                                </p>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                  {(node.meta?.value as string) ?? ""}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {canGenerateNext && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          generateNextLevel(node.id, false);
                          // 생성 후 자동으로 다음 레벨 펼치기
                          setShowAllLevels(true);
                        }}
                        className="w-full text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        선택한 안 기준으로 다음 안 생성
                      </button>
                    )}
                    {hasChildren && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          generateNextLevel(node.id, true);
                        }}
                        className="w-full text-xs px-3 py-1.5 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors border border-gray-200"
                      >
                        재생성
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 키워드 표시 */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">
          입력 <span className="font-medium text-gray-700">키워드</span>:
        </p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_KEYWORDS.map((keyword, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      {/* 레벨별 아이디어 표시 */}
      <div className="space-y-8">
        {renderLevel(2)}
        {!showAllLevels && nodesByLevel[2]?.some((n) => selectedIds.has(n.id)) && (
          <div className="text-center py-4">
            <button
              onClick={() => {
                setShowAllLevels(true);
                // Set을 펼치지 말고, Set 복사 후 add 사용
                const nextExpanded = new Set(expandedLevels);
                nextExpanded.add(3);
                nextExpanded.add(4);
                setExpandedLevels(nextExpanded);
                // 선택된 1차 아이디어들에 대해 2차 생성
                nodesByLevel[2]
                  ?.filter((n) => selectedIds.has(n.id))
                  .forEach((node) => {
                    if (!nodes.some((n) => (n.parentId as string | null) === node.id)) {
                      generateNextLevel(node.id);
                    }
                  });
              }}
              className="px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
            >
              다음 단계 보기 (2차/3차 분기)
            </button>
          </div>
        )}
        {showAllLevels && (
          <>
            {renderLevel(3)}
            {renderLevel(4)}
          </>
        )}
      </div>

      {/* 최종 후보 요약 */}
      {finalCandidates.length > 0 && (
        <div className="mt-8 bg-gray-50 rounded-lg border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4 tracking-tight">
            현재 최종 후보 (선택된 최말단 노드)
          </h3>
          <div className="space-y-3 mb-6">
            {finalCandidates.map((candidate, idx) => (
              <div
                key={idx}
                className="bg-white rounded-md p-4 border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {candidate.path}
                    </p>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      {candidate.node.title}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {(candidate.node.summary as string) ?? ""}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              className="flex-1 h-10 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              onClick={() => {
                // 선택된 최종 후보들을 키워드로 변환하여 실제 앱 페이지로 이동
                const keywords = EXAMPLE_KEYWORDS.join(",");
                const type = "app";
                window.location.href = `/app?keywords=${encodeURIComponent(keywords)}&type=${type}`;
              }}
            >
              이 안으로 만들기
            </button>
            <button
              className="flex-1 h-10 bg-white text-gray-900 text-sm font-medium rounded-md border-2 border-gray-900 hover:bg-gray-50 transition-colors tracking-tight focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              onClick={() => {
                // 선택된 최말단 노드들의 부모 노드들에 대해 재생성
                const selectedNodes = nodes.filter((n) => selectedIds.has(n.id));
                const maxLevel = Math.max(...selectedNodes.map((n) => (n.level as number) ?? 0));
                const leafNodes = selectedNodes.filter((n) => (n.level as number) === maxLevel);
                
                // 각 최말단 노드의 부모에 대해 재생성
                leafNodes.forEach((leafNode) => {
                  const parentId = leafNode.parentId as string | null;
                  if (parentId) {
                    generateNextLevel(parentId, true);
                  }
                });
                
                // 선택 해제 후 새로운 옵션 선택 가능하도록
                setSelectedIds(new Set());
              }}
            >
              다른 안 더 보기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

