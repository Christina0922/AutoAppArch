"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Session, Node, PlanResult, AppType } from "@/lib/types";
import { getSessionById, saveSession } from "@/lib/storage";
import { generateFirstLevelIdeas } from "@/lib/generateIdeas";
import { generatePlan } from "@/lib/generatePlan";
import { generateTopic, GeneratedTopic } from "@/lib/generateTopic";
import { generateAppNaming } from "@/lib/generateAppNaming";
import { shouldBypassPaywall } from "@/lib/paywall";
import { normalizeAppType } from "@/lib/appType";
import KeywordInputForm from "@/components/KeywordInputForm";
import IdeaTree from "@/components/IdeaTree";
import SaveButton from "@/components/SaveButton";
import PaywallModal from "@/components/PaywallModal";
import PlanDetail from "@/components/PlanDetail";

export default function AppPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [isPro] = useState(false); // MVP에서는 항상 false
  const [isFromHistory, setIsFromHistory] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);
  const [finalizationProgress, setFinalizationProgress] = useState(0);
  const [finalizationStep, setFinalizationStep] = useState("");
  const [generatedTopic, setGeneratedTopic] = useState<GeneratedTopic | null>(null);
  const [showTopicConfirmation, setShowTopicConfirmation] = useState(false);
  const [finalPlanResult, setFinalPlanResult] = useState<PlanResult | null>(null);
  const [showFinalPlan, setShowFinalPlan] = useState(false);
  const [finalSelected, setFinalSelected] = useState(false); // 최종 확정 여부
  const [regenerationSeed, setRegenerationSeed] = useState(0);
  const processedKeywordsRef = useRef<string>("");

  // URL 파라미터로 저장된 세션을 열었는지 확인
  useEffect(() => {
    const sessionId = searchParams.get("sessionId");
    if (sessionId) {
      const savedSession = getSessionById(sessionId);
      if (savedSession) {
        setSession(savedSession);
        setIsFromHistory(true);
        processedKeywordsRef.current = "";
        return;
      }
    }
    
    // URL 파라미터로 키워드가 전달된 경우 자동으로 처리
    const keywordsParam = searchParams.get("keywords");
    const typeParam = searchParams.get("type") as AppType | null;
    
    if (keywordsParam && !session && !isLoading && processedKeywordsRef.current !== keywordsParam) {
      const keywords = keywordsParam.split(",").filter(k => k.trim().length > 0);
      const selectedType = typeParam === "web" ? "web" : "app";
      
      if (keywords.length > 0) {
        processedKeywordsRef.current = keywordsParam;
        
        // 직접 처리 로직 실행
        const processKeywords = async () => {
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
              tags: [],
              selectedType,
              nodes,
              selectedNodeIds: [],
            };

            setSession(newSession);
            setIsFromHistory(false);
          } catch (error) {
            console.error("Failed to generate ideas:", error);
            alert("아이디어 생성에 실패했습니다.");
            processedKeywordsRef.current = "";
          } finally {
            setIsLoading(false);
            setLoadingMessage("");
          }
        };
        
        processKeywords();
      }
    }
  }, [searchParams, session, isLoading]);

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
  const handleSubmit = async (keywords: string[], selectedType: AppType) => {
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

      // 1차 아이디어 생성 (재생성 시 다른 안이 나오도록 시드 사용)
      const nodes = generateFirstLevelIdeas(keywords, selectedType, 7, regenerationSeed);

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

  // 1차 아이디어 재생성
  const handleRegenerateFirstLevel = () => {
    if (!session) return;
    
    setIsLoading(true);
    setLoadingMessage("1차 아이디어를 재생성하고 있습니다…");
    
    // 시드 증가하여 다른 안이 나오도록
    const newSeed = regenerationSeed + 1;
    setRegenerationSeed(newSeed);
    
    setTimeout(() => {
      // 모든 노드 제거하고 새로운 1차 아이디어만 생성 (하위 노드 모두 제거)
      const selectedType: "app" | "web" =
        session.selectedType === "web" ? "web" : "app";
      
      const newNodes = generateFirstLevelIdeas(
        session.keywords ?? [],
        selectedType,
        7,
        newSeed
      );
      
      const updatedSession: Session = {
        ...session,
        nodes: newNodes,
        selectedNodeIds: [], // 선택 초기화
      };
      
      updateSession(updatedSession, true);
      setIsLoading(false);
      setLoadingMessage("");
    }, 800);
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

  // 최종 후보 선택 후 주제 생성
  const handleGenerateTopic = async () => {
    if (!session || !session.nodes || !session.selectedNodeIds) return;
    
    setIsFinalized(true);
    setFinalizationProgress(0);
    setFinalizationStep("선택된 아이디어 분석 중...");
    
    // 선택된 최말단 노드들 찾기
    const selectedNodes = session.nodes.filter((n) => 
      session.selectedNodeIds!.includes(n.id)
    );
    const maxLevel = selectedNodes.length > 0 
      ? Math.max(...selectedNodes.map((n) => (n.level as number) ?? 0))
      : 0;
    const finalCandidates = selectedNodes.filter((n) => (n.level as number) === maxLevel);
    
    // 진행률 업데이트 (30%)
    setFinalizationProgress(30);
    setFinalizationStep("주제 생성 중...");
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    // 주제 생성
    setFinalizationProgress(60);
    setFinalizationStep("핵심 기능 정리 중...");
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    const topic = generateTopic(
      session.keywords ?? [],
      normalizeAppType(session.selectedType),
      finalCandidates
    );
    
    setFinalizationProgress(100);
    setFinalizationStep("완료!");
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    setGeneratedTopic(topic);
    setShowTopicConfirmation(true);
    setIsFinalized(false);
    setFinalizationProgress(0);
    setFinalizationStep("");
  };

  // 주제 확인 후 최종 설계안 생성 및 저장
  const handleConfirmTopic = async () => {
    if (!session || !generatedTopic || !session.nodes || !session.selectedNodeIds) return;
    
    setIsFinalized(true);
    setFinalizationProgress(0);
    setFinalizationStep("최종 설계안 생성 중...");
    
    // 선택된 최말단 노드들 찾기
    const selectedNodes = session.nodes.filter((n) => 
      session.selectedNodeIds!.includes(n.id)
    );
    const maxLevel = selectedNodes.length > 0 
      ? Math.max(...selectedNodes.map((n) => (n.level as number) ?? 0))
      : 0;
    const finalCandidates = selectedNodes.filter((n) => (n.level as number) === maxLevel);
    
    // 진행률 업데이트 (30%)
    setFinalizationProgress(30);
    setFinalizationStep("설계안 구조 생성 중...");
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    // 최종 설계안 생성
    setFinalizationProgress(50);
    setFinalizationStep("타깃 사용자 및 핵심 기능 정리 중...");
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    // 선택된 노드들의 정보를 종합하여 설계안 생성
    const selectedTitles = finalCandidates.map((n) => n.title).join(", ");
    const planResult: PlanResult = generatePlan(
      session.keywords ?? [],
      normalizeAppType(session.selectedType),
      selectedTitles
    );
    
    setFinalizationProgress(70);
    setFinalizationStep("수익 모델 및 리스크 분석 중...");
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    setFinalizationProgress(85);
    setFinalizationStep("앱 이름 추천 생성 중...");
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // 앱 이름 추천 생성 (최종 확정 후에만)
    const appNaming = generateAppNaming(
      session.keywords ?? [],
      normalizeAppType(session.selectedType),
      finalCandidates.map((n) => ({ title: n.title, summary: (n.summary as string) ?? "" }))
    );
    planResult.appNaming = appNaming;
    
    setFinalizationProgress(90);
    setFinalizationStep("설계안 저장 중...");
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Session만 저장 (Plan 형식은 사용하지 않음)
    try {
      saveSession(session);
    } catch (error) {
      console.error("저장 실패:", error);
    }
    
    setFinalizationProgress(100);
    setFinalizationStep("완료!");
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // 최종 설계안 표시 및 최종 확정 상태 설정
    setFinalPlanResult(planResult);
    setFinalSelected(true); // 최종 확정 완료
    setShowFinalPlan(true);
    setShowTopicConfirmation(false);
    setIsFinalized(false);
    setFinalizationProgress(0);
    setFinalizationStep("");
  };

  // 주제 다시 생성
  const handleRegenerateTopic = () => {
    setShowTopicConfirmation(false);
    setGeneratedTopic(null);
    handleGenerateTopic();
  };

  // PRO 보기 버튼 클릭 핸들러
  const handleShowPro = () => {
    setShowPaywall(true);
  };

  // 최종 후보 노드들 찾기 (최하위 레벨의 선택된 노드들)
  const getFinalCandidates = (): Node[] => {
    if (!session || !session.nodes || !session.selectedNodeIds || session.selectedNodeIds.length === 0) return [];
    
    const selectedNodes = session.nodes.filter((n) =>
      session.selectedNodeIds!.includes(n.id)
    );
    if (selectedNodes.length === 0) return [];

    const maxLevel = Math.max(...selectedNodes.map((n) => (n.level as number) ?? 0));
    return selectedNodes.filter((n) => (n.level as number) === maxLevel);
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
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">
                마인드맵 아이디어 생성
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                키워드: <span className="font-medium text-gray-700">{(session.keywords || []).join(", ")}</span>
                {session.selectedType && (
                  <span className="ml-3">
                    유형: <span className="font-medium text-gray-700">
                      {session.selectedType === "app" ? "모바일 앱" : "웹 서비스"}
                    </span>
                  </span>
                )}
              </p>
              {!isFromHistory && (
                <SaveButton
                  session={session}
                  onSaved={handleSaved}
                />
              )}
            </div>
          </div>

          {/* 1차 아이디어 재생성 버튼 */}
          {session.nodes && session.nodes.some((n) => (n.level as number) === 2) && (
            <div className="bg-white rounded-lg border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    다른 1차 아이디어가 필요하신가요?
                  </p>
                  <p className="text-xs text-gray-500">
                    재생성하면 다른 7개의 안이 생성됩니다
                  </p>
                </div>
                <button
                  onClick={handleRegenerateFirstLevel}
                  disabled={isLoading}
                  className="px-4 h-10 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "생성 중..." : "1차 아이디어 재생성"}
                </button>
              </div>
            </div>
          )}

          {/* 트리 UI - 최종 설계안이 표시되지 않을 때만 표시 */}
          {!showFinalPlan && (
            <IdeaTree
              sessionId={session.id}
              initialNodes={session.nodes || []}
              initialSelectedIds={session.selectedNodeIds || []}
              keywords={session.keywords || []}
              selectedType={normalizeAppType(session.selectedType)}
              onNodesChange={handleNodesChange}
              onSelectionChange={handleSelectionChange}
              onFinalize={handleGenerateTopic}
            />
          )}

          {/* 최종 후보 선택 후 액션 버튼 */}
          {hasFinalCandidates && !showTopicConfirmation && !showFinalPlan && (
            <div className="bg-white rounded-lg border-2 border-gray-900 p-8">
              {isFinalized ? (
                <div className="text-center py-8">
                  {finalizationProgress < 100 ? (
                    <>
                      <div className="mb-6">
                        <div className="w-16 h-16 mx-auto mb-4 relative">
                          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="4"
                              className="text-gray-200"
                            />
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="4"
                              strokeDasharray={`${2 * Math.PI * 28}`}
                              strokeDashoffset={`${2 * Math.PI * 28 * (1 - finalizationProgress / 100)}`}
                              className="text-gray-900 transition-all duration-300"
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-semibold text-gray-900">
                              {finalizationProgress}%
                            </span>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {finalizationStep}
                        </p>
                      </div>
                      {/* 진행바 */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div
                          className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${finalizationProgress}%` }}
                        />
                      </div>
                    </>
                  ) : null}
                </div>
              ) : (
                <>
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
                                {(node.label as string) ?? ""}
                              </span>
                            </div>
                            <h4 className="text-base font-semibold text-gray-900 mb-1">
                              {node.title}
                            </h4>
                            <p className="text-sm text-gray-600">{(node.summary as string) ?? ""}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={handleGenerateTopic}
                      className="flex-1 h-12 bg-blue-600 text-white text-base font-medium rounded-md hover:bg-blue-700 transition-colors tracking-tight focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                    >
                      이 안으로 만들기
                    </button>
                    <button
                      onClick={() => {
                        // 테스트 중: 선택된 노드들의 하위 분기 재생성
                        if (!session || !session.nodes || !session.selectedNodeIds) return;
                        
                        const selectedNodes = session.nodes.filter((n) => 
                          session.selectedNodeIds!.includes(n.id)
                        );
                        if (selectedNodes.length === 0) return;
                        
                        const maxLevel = Math.max(...selectedNodes.map((n) => (n.level as number) ?? 0));
                        const leafNodes = selectedNodes.filter((n) => (n.level as number) === maxLevel);
                        
                        // 각 최말단 노드의 부모에 대해 재생성
                        leafNodes.forEach((leafNode) => {
                          if (leafNode.parentId) {
                            // 재생성 로직은 IdeaTree 컴포넌트에서 처리되므로
                            // 여기서는 선택을 해제하여 다시 선택할 수 있도록 함
                            const newSelectedIds = (session.selectedNodeIds || []).filter(
                              (id) => id !== leafNode.id
                            );
                            updateSession(
                              { ...session, selectedNodeIds: newSelectedIds },
                              true
                            );
                          }
                        });
                      }}
                      className="flex-1 h-12 bg-white text-gray-900 text-base font-medium rounded-md border-2 border-gray-900 hover:bg-gray-50 transition-colors tracking-tight focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                    >
                      다른 안 더 보기
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* 생성된 주제 확인 화면 */}
          {showTopicConfirmation && generatedTopic && !showFinalPlan && (
            <div className="bg-white rounded-lg border-2 border-gray-900 p-8">
              {isFinalized ? (
                <div className="text-center py-8">
                  {finalizationProgress < 100 ? (
                    <>
                      <div className="mb-6">
                        <div className="w-16 h-16 mx-auto mb-4 relative">
                          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="4"
                              className="text-gray-200"
                            />
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="4"
                              strokeDasharray={`${2 * Math.PI * 28}`}
                              strokeDashoffset={`${2 * Math.PI * 28 * (1 - finalizationProgress / 100)}`}
                              className="text-gray-900 transition-all duration-300"
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-semibold text-gray-900">
                              {finalizationProgress}%
                            </span>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {finalizationStep}
                        </p>
                      </div>
                      {/* 진행바 */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div
                          className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${finalizationProgress}%` }}
                        />
                      </div>
                    </>
                  ) : null}
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 tracking-tight">
                    생성된 주제
                  </h3>
                  
                  <div className="mb-6 space-y-4">
                    <div>
                      <h4 className="text-base font-semibold text-gray-900 mb-2">
                        {generatedTopic.title}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {generatedTopic.description}
                      </p>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-2">
                        핵심 기능
                      </h5>
                      <ul className="space-y-1">
                        {generatedTopic.keyFeatures.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-2">
                        타겟 사용자
                      </h5>
                      <p className="text-sm text-gray-600">
                        {generatedTopic.targetAudience}
                      </p>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-2">
                        차별화 포인트
                      </h5>
                      <p className="text-sm text-gray-600">
                        {generatedTopic.uniqueValue}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={handleConfirmTopic}
                      className="flex-1 h-12 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                    >
                      이 주제로 진행하기
                    </button>
                    <button
                      onClick={handleRegenerateTopic}
                      className="flex-1 h-12 bg-white text-gray-900 text-base font-medium rounded-md border-2 border-gray-900 hover:bg-gray-50 transition-colors tracking-tight focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                    >
                      다시 만들기
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* 최종 설계안 표시 */}
          {showFinalPlan && finalPlanResult && session && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border-2 border-gray-900 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">
                  최종 설계안이 완성되었습니다!
                </h3>
                <p className="text-sm text-gray-500">
                  아래 설계안을 확인하세요.
                </p>
              </div>
              <PlanDetail 
                result={finalPlanResult} 
                keywords={session.keywords || []}
                showProgress={true}
                isPremium={isPro || shouldBypassPaywall()}
                onShowPaywall={() => setShowPaywall(true)}
                finalSelected={finalSelected}
              />
              <div className="bg-white rounded-lg border border-gray-100 p-6">
                <div className="flex gap-4">
                  <button
                    onClick={() => router.push(`/history/${session.id}`)}
                    className="flex-1 h-12 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                  >
                    히스토리에서 보기
                  </button>
                  <button
                    onClick={() => {
                      setShowFinalPlan(false);
                      setFinalPlanResult(null);
                      setShowTopicConfirmation(false);
                      setGeneratedTopic(null);
                    }}
                    className="flex-1 h-12 bg-white text-gray-900 text-base font-medium rounded-md border-2 border-gray-900 hover:bg-gray-50 transition-colors tracking-tight focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                  >
                    다시 시작하기
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 저장 버튼 (하단) - 최종 설계안이 표시되지 않을 때만 표시 */}
          {!isFromHistory && !showFinalPlan && (
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
