"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Session, Node } from "@/lib/types";
import { getSessionById, saveSession } from "@/lib/storage";
import { generateFirstLevelIdeas } from "@/lib/generateIdeas";
import KeywordInputForm from "@/components/KeywordInputForm";
import IdeaTree from "@/components/IdeaTree";
import SaveButton from "@/components/SaveButton";
import PaywallModal from "@/components/PaywallModal";

export default function AppPage() {
  const searchParams = useSearchParams();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [isPro] = useState(false); // MVP에서는 항상 false
  const [isFromHistory, setIsFromHistory] = useState(false);

  // URL 파라미터로 저장된 세션을 열었는지 확인
  useEffect(() => {
    const sessionId = searchParams.get("sessionId");
    if (sessionId) {
      const savedSession = getSessionById(sessionId);
      if (savedSession) {
        setSession(savedSession);
        setIsFromHistory(true);
      }
    }
  }, [searchParams]);

  // 세션 업데이트 및 저장
  const updateSession = (updatedSession: Session, autoSave: boolean = false) => {
    setSession(updatedSession);
    if (autoSave) {
      try {
        saveSession(updatedSession);
      } catch (error) {
        console.error("Failed to auto-save session:", error);
      }
    }
  };

  // 키워드 입력 후 1차 아이디어 생성
  const handleSubmit = async (keywords: string[], selectedType: "app" | "web") => {
    setIsLoading(true);
    setLoadingMessage("키워드를 분석 중입니다…");

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setLoadingMessage("1차 아이디어를 생성하고 있습니다…");

      // 최소 0.8초, 최대 1.2초 대기
      const minDelay = 800;
      const maxDelay = 1200;
      const delay = minDelay + Math.random() * (maxDelay - minDelay);
      await new Promise((resolve) => setTimeout(resolve, delay));

      // 1차 아이디어 생성
      const nodes = generateFirstLevelIdeas(keywords, selectedType, 7);

      const newSession: Session = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        keywords,
        tags: [], // 향후 확장 가능
        selectedType,
        nodes,
        selectedNodeIds: [],
      };

      setSession(newSession);
      setIsFromHistory(false);
    } catch (error) {
      console.error("Failed to generate ideas:", error);
      alert("아이디어 생성에 실패했습니다.");
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  // 노드 업데이트 (트리에서 변경 시)
  const handleNodesChange = (nodes: Node[]) => {
    if (!session) return;
    updateSession({ ...session, nodes }, true);
  };

  // 선택 상태 업데이트
  const handleSelectionChange = (selectedIds: string[]) => {
    if (!session) return;
    updateSession({ ...session, selectedNodeIds: selectedIds }, true);
  };

  // 세션 저장 완료
  const handleSaved = () => {
    // 저장 완료 후 처리 (선택사항)
  };

  // 최종 후보 선택 후 "이 안으로 만들기" 처리
  const handleFinalize = () => {
    if (!isPro) {
      setShowPaywall(true);
      return;
    }
    // Pro 사용자의 경우 다음 단계로 진행 (향후 구현)
    alert("최종 안으로 만들기 기능은 준비 중입니다.");
  };

  // 최종 후보 노드들 찾기 (최하위 레벨의 선택된 노드들)
  const getFinalCandidates = (): Node[] => {
    if (!session || session.selectedNodeIds.length === 0) return [];
    
    const selectedNodes = session.nodes.filter((n) =>
      session.selectedNodeIds.includes(n.id)
    );
    if (selectedNodes.length === 0) return [];

    const maxLevel = Math.max(...selectedNodes.map((n) => n.level));
    return selectedNodes.filter((n) => n.level === maxLevel);
  };

  const finalCandidates = getFinalCandidates();
  const hasFinalCandidates = finalCandidates.length > 0;

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
      {!session ? (
        <div className="bg-white rounded-lg border border-gray-100 p-8">
          <KeywordInputForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            loadingMessage={loadingMessage}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* 키워드 정보 표시 */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">
                  마인드맵 아이디어 생성
                </h2>
                <p className="text-sm text-gray-500">
                  키워드: <span className="font-medium text-gray-700">{session.keywords.join(", ")}</span>
                  {session.selectedType && (
                    <span className="ml-3">
                      유형: <span className="font-medium text-gray-700">
                        {session.selectedType === "app" ? "모바일 앱" : "웹 서비스"}
                      </span>
                    </span>
                  )}
                </p>
              </div>
              {!isFromHistory && (
                <SaveButton
                  session={session}
                  onSaved={handleSaved}
                />
              )}
            </div>
          </div>

          {/* 트리 UI */}
          <IdeaTree
            sessionId={session.id}
            initialNodes={session.nodes}
            initialSelectedIds={session.selectedNodeIds}
            keywords={session.keywords}
            selectedType={session.selectedType || "app"}
            onNodesChange={handleNodesChange}
            onSelectionChange={handleSelectionChange}
          />

          {/* 최종 후보 선택 후 액션 버튼 */}
          {hasFinalCandidates && (
            <div className="bg-white rounded-lg border-2 border-gray-900 p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 tracking-tight">
                최종 후보 선택 완료
              </h3>
              <div className="mb-6 space-y-2">
                {finalCandidates.map((node) => (
                  <div
                    key={node.id}
                    className="bg-gray-50 rounded-md p-4 border border-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-gray-900">
                            {node.label}
                          </span>
                        </div>
                        <h4 className="text-base font-semibold text-gray-900 mb-1">
                          {node.title}
                        </h4>
                        <p className="text-sm text-gray-600">{node.summary}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleFinalize}
                  className="flex-1 h-12 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                >
                  이 안으로 만들기
                </button>
                <button
                  onClick={() => {
                    // 선택 수정 후 다시 분기 생성 (현재 선택 상태 유지)
                    alert("다른 안 더 보기 기능은 준비 중입니다.");
                  }}
                  className="flex-1 h-12 bg-white text-gray-900 text-base font-medium rounded-md border-2 border-gray-900 hover:bg-gray-50 transition-colors tracking-tight focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                >
                  다른 안 더 보기
                </button>
              </div>
            </div>
          )}

          {/* 저장 버튼 (하단) */}
          {!isFromHistory && (
            <div className="bg-white rounded-lg border border-gray-100 p-6">
              <SaveButton
                session={session}
                onSaved={handleSaved}
              />
            </div>
          )}
        </div>
      )}

      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
    </div>
  );
}
