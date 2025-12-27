"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params?.locale as string | undefined;
  const tCommon = useTranslations("common");
  const tLoading = useTranslations("loading");
  const tIdeaTree = useTranslations("ideaTree");
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
  const [finalSelected, setFinalSelected] = useState(false);
  const [regenerationSeed, setRegenerationSeed] = useState(0);
  const [error, setError] = useState<string | null>(null);
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
    
    if (keywordsParam && !session && !isLoading && processedKeywordsRef.current !== keywordsParam) {
      const keywords = keywordsParam.split(",").filter(k => k.trim().length > 0);
      const selectedType: AppType = "app"; // 모바일 앱만 지원
      
      if (keywords.length > 0) {
        processedKeywordsRef.current = keywordsParam;
        
        // 직접 처리 로직 실행
        const processKeywords = async () => {
          setIsLoading(true);
          setLoadingMessage(tLoading("analyzingKeywords"));

          try {
            await new Promise((resolve) => setTimeout(resolve, 600));
            setLoadingMessage(tLoading("generatingIdeas"));

            // 최소 0.8초, 최대 1.2초 대기
            const minDelay = 800;
            const maxDelay = 1200;
            const delay = minDelay + Math.random() * (maxDelay - minDelay);
            await new Promise((resolve) => setTimeout(resolve, delay));

            // 1차 아이디어 생성
            const currentLocale = (locale === "en" ? "en" : "ko") as "ko" | "en";
            const nodes = generateFirstLevelIdeas(keywords, selectedType, 7, undefined, currentLocale);

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
            setError(
              error instanceof Error
                ? error.message
                : "아이디어 생성에 실패했습니다. 다시 시도해주세요."
            );
          } finally {
            setIsLoading(false);
            setLoadingMessage("");
          }
        };

        processKeywords();
      }
    }
  }, [searchParams, session, isLoading, tLoading]);

  const updateSession = (newSession: Session, saveToStorage: boolean = false) => {
    setSession(newSession);
    if (saveToStorage) {
      saveSession(newSession);
    }
  };

  // 키워드 입력 후 1차 아이디어 생성
  const handleSubmit = async (keywords: string[], selectedType: AppType) => {
    setIsLoading(true);
    setLoadingMessage(tLoading("analyzingKeywords"));

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setLoadingMessage(tLoading("generatingIdeas"));

      // 최소 0.8초, 최대 1.2초 대기
      const minDelay = 800;
      const maxDelay = 1200;
      const delay = minDelay + Math.random() * (maxDelay - minDelay);
      await new Promise((resolve) => setTimeout(resolve, delay));

      // 1차 아이디어 생성 (재생성 시 다른 안이 나오도록 시드 사용)
      const currentLocale = (locale === "en" ? "en" : "ko") as "ko" | "en";
      const nodes = generateFirstLevelIdeas(keywords, selectedType, 7, regenerationSeed, currentLocale);

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
      setError(null);
    } catch (error) {
      console.error("Failed to generate ideas:", error);
      setError(
        error instanceof Error
          ? error.message
          : "아이디어 생성에 실패했습니다. 다시 시도해주세요."
      );
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
  const handleRegenerateFirstLevel = async () => {
    if (!session) return;
    
    setRegenerationSeed(Date.now());
    setIsLoading(true);
    setLoadingMessage(tLoading("regeneratingIdeas"));

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const currentLocale = (locale === "en" ? "en" : "ko") as "ko" | "en";
      const newNodes = generateFirstLevelIdeas(
        session.keywords || [],
        session.selectedType || "app",
        7,
        Date.now(),
        currentLocale
      );

      updateSession({ ...session, nodes: newNodes, selectedNodeIds: [] }, true);
      setError(null);
    } catch (error) {
      console.error("Failed to regenerate ideas:", error);
      setError("재생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  // 선택 변경
  const handleSelectionChange = (selectedIds: string[]) => {
    if (!session) return;
    updateSession({ ...session, selectedNodeIds: selectedIds }, true);
  };

  // 최종 확정 - 바로 최종 설계안 생성
  const handleFinalize = async () => {
    if (!session) return;

    const selectedIds = session.selectedNodeIds || [];
    if (selectedIds.length === 0) {
      setError(tIdeaTree("noIdeasSelected") || "최소 1개 이상의 아이디어를 선택해주세요.");
      return;
    }

    setIsFinalized(true);
    setFinalizationProgress(0);
    setFinalizationStep(tIdeaTree("generatingPlan") || "최종 설계안 생성 중...");

    try {
      // 선택된 최말단 노드들 찾기
      const selectedNodes = (session.nodes || []).filter((n) => 
        selectedIds.includes(n.id)
      );
      const maxLevel = selectedNodes.length > 0 
        ? Math.max(...selectedNodes.map((n) => (n.level as number) ?? 0))
        : 0;
      const finalCandidates = selectedNodes.filter((n) => (n.level as number) === maxLevel);

      // 진행률 업데이트 (30%)
      setFinalizationProgress(30);
      setFinalizationStep(tIdeaTree("generatingPlan") || "설계안 구조 생성 중...");
      await new Promise((resolve) => setTimeout(resolve, 400));

      // 최종 설계안 생성
      setFinalizationProgress(50);
      setFinalizationStep(tIdeaTree("generatingNaming") || "타깃 사용자 및 핵심 기능 정리 중...");
      await new Promise((resolve) => setTimeout(resolve, 400));

      // 선택된 노드들의 정보를 종합하여 설계안 생성
      const selectedTitles = finalCandidates.map((n) => n.title).join(", ");
      const planResult = generatePlan(
        session.keywords || [],
        session.selectedType || "app",
        selectedTitles
      );

      setFinalizationProgress(70);
      setFinalizationStep(tIdeaTree("generatingNaming") || "수익 모델 및 리스크 분석 중...");
      await new Promise((resolve) => setTimeout(resolve, 400));

      setFinalizationProgress(85);
      setFinalizationStep(tIdeaTree("generatingNaming") || "앱 이름 추천 생성 중...");
      await new Promise((resolve) => setTimeout(resolve, 300));

      // 앱 이름 추천 생성
      const appNaming = generateAppNaming(
        session.keywords || [],
        session.selectedType || "app",
        finalCandidates.map((n) => ({ title: n.title, summary: (n.summary as string) ?? "" }))
      );
      planResult.appNaming = appNaming;

      setFinalizationProgress(90);
      setFinalizationStep("설계안 저장 중...");
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Session 저장
      try {
        updateSession(session, true);
      } catch (error) {
        console.error("저장 실패:", error);
      }

      setFinalizationProgress(100);
      setFinalizationStep("");
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 최종 설계안 표시
      setFinalPlanResult(planResult);
      setShowFinalPlan(true);
      setIsFinalized(false);
      setFinalizationProgress(0);
      setFinalizationStep("");

      // 자동 스크롤
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Failed to generate plan:", error);
      setError(tIdeaTree("planGenerationFailed") || "플랜 생성에 실패했습니다.");
      setIsFinalized(false);
    }
  };

  // 토픽 확인 후 최종 플랜 생성 (현재 사용되지 않음)
  const handleTopicConfirm = async () => {
    if (!session || !generatedTopic) return;

    setShowTopicConfirmation(false);
    setFinalizationProgress(50);
    setFinalizationStep(tIdeaTree("generatingPlan"));

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setFinalizationProgress(70);

      // 앱 네이밍 생성
      setFinalizationStep(tIdeaTree("generatingNaming"));
      await new Promise((resolve) => setTimeout(resolve, 400));

      const appNaming = generateAppNaming(session.keywords || [], session.selectedType || "app", []);

      // 최종 플랜 생성
      const planResult = generatePlan(
        session.keywords || [],
        session.selectedType || "app",
        generatedTopic.title
      );

      const finalResult: PlanResult = {
        ...planResult,
        appNaming,
      };

      setFinalPlanResult(finalResult);
      setFinalizationProgress(100);
      setFinalizationStep("");
      setShowFinalPlan(true);

      // 자동 스크롤
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Failed to generate plan:", error);
      setError("플랜 생성에 실패했습니다.");
      setIsFinalized(false);
    }
  };

  // 저장 완료 처리
  const handleSaved = () => {
    // 저장 성공 시 필요한 처리
  };

  const validLocale = locale === "en" ? "en" : "ko";

  // 세션이 있고 최종 플랜이 표시되는 경우
  if (showFinalPlan && finalPlanResult) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <PlanDetail
          result={finalPlanResult}
          keywords={session?.keywords || []}
          showProgress={true}
          isPremium={isPro || shouldBypassPaywall()}
          onShowPaywall={() => setShowPaywall(true)}
          finalSelected={true}
        />
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => {
              setShowFinalPlan(false);
              setFinalPlanResult(null);
              setSession(null);
              setIsFinalized(false);
              router.push(`/${locale}/app`);
            }}
            className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            {validLocale === "en" ? "Create New" : "새로 만들기"}
          </button>
        </div>
      </div>
    );
  }

  // 키워드 입력 폼 또는 아이디어 트리 표시
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      {!session ? (
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-4">
              {tCommon("mobileAppArchitecture")}
            </h1>
            <p className="text-base text-gray-600">
              {validLocale === "en"
                ? "Enter a few keywords to generate a mobile app architecture."
                : "키워드를 입력하면 모바일 앱 설계안을 생성합니다."}
            </p>
          </div>
          <KeywordInputForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            loadingMessage={loadingMessage}
          />
        </div>
      ) : (
        <div>
          {isFinalized && !showFinalPlan && (
            <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-blue-900">
                  {tIdeaTree("finalizing")}
                </h2>
                <span className="text-sm text-blue-700">{finalizationProgress}%</span>
              </div>
              {finalizationStep && (
                <p className="text-sm text-blue-700 mb-2">{finalizationStep}</p>
              )}
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${finalizationProgress}%` }}
                />
              </div>
            </div>
          )}

          {showTopicConfirmation && generatedTopic && (
            <div className="mb-8 p-6 bg-white border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">{tIdeaTree("topicPreview")}</h3>
              <div className="space-y-2 mb-4">
                <p><strong>{tIdeaTree("title")}:</strong> {generatedTopic.title}</p>
                <p><strong>{tIdeaTree("description")}:</strong> {generatedTopic.description}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleTopicConfirm}
                  className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
                >
                  {tIdeaTree("confirm")}
                </button>
                <button
                  onClick={() => {
                    setShowTopicConfirmation(false);
                    setIsFinalized(false);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300"
                >
                  {tIdeaTree("cancel")}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                {validLocale === "en" ? "Dismiss" : "닫기"}
              </button>
            </div>
          )}

          <IdeaTree
            sessionId={session.id}
            initialNodes={session.nodes || []}
            initialSelectedIds={session.selectedNodeIds || []}
            keywords={session.keywords || []}
            selectedType={session.selectedType || "app"}
            onNodesChange={handleNodesChange}
            onSelectionChange={handleSelectionChange}
            onRegenerate={handleRegenerateFirstLevel}
            onFinalize={handleFinalize}
            session={session}
            showSaveButton={!isFinalized}
          />
        </div>
      )}

      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
    </div>
  );
}
