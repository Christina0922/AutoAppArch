"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { getLocaleFromPathname, withLocalePrefix, type Locale } from "@/utils/localePath";
import { getRouteLocale } from "@/utils/getRouteLocale";
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

function AppPageContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  // ===== 단일 진실원: 라우트(pathname)가 언어를 결정 =====
  // /en이면 무조건 en, 그 외는 무조건 ko
  // 브라우저/쿠키/localStorage 감지는 절대 사용하지 않음
  const locale: Locale = getRouteLocale(pathname);
  
  // 개발 모드에서 locale 확인 로그
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[AppPage] locale: ${locale}, pathname: ${pathname}`);
    }
  }, [locale, pathname]);
  
  const tCommon = useTranslations("common");
  const tLoading = useTranslations("loading");
  const tIdeaTree = useTranslations("ideaTree");
  const tApp = useTranslations("app");
  const tErrors = useTranslations("errors");
  const tKeywordInput = useTranslations("keywordInput");
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
  const previousPathnameRef = useRef<string>(pathname || "");
  const isInitialMountRef = useRef<boolean>(true);

  // 언어 섞임 방지는 LanguageMixGuard에서 처리됨 (app/[locale]/layout.tsx)

  // pathname 변경 감지: /app으로 직접 이동 시에만 초기화면으로 리셋
  useEffect(() => {
    const currentPath = pathname || "";
    const previousPath = previousPathnameRef.current;
    const sessionId = searchParams.get("sessionId");
    const keywordsParam = searchParams.get("keywords");
    
    // 초기 마운트 시에는 리셋하지 않음
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      previousPathnameRef.current = currentPath;
      return;
    }
    
    // pathname이 변경되었고, /app 경로로 이동했으며, 파라미터가 없을 때만 리셋
    // (다른 페이지에서 /app으로 이동한 경우)
    if (currentPath !== previousPath && 
        (currentPath === `/en/app` || currentPath === `/ko/app` || currentPath === `/app`) &&
        !sessionId && 
        !keywordsParam &&
        previousPath && 
        !previousPath.includes("/app")) {
      
      if (session && !showFinalPlan && !isLoading) {
        setSession(null);
        setIsFromHistory(false);
        setFinalPlanResult(null);
        setShowFinalPlan(false);
        setFinalSelected(false);
        setIsFinalized(false);
        setFinalizationProgress(0);
        setFinalizationStep("");
        setGeneratedTopic(null);
        setShowTopicConfirmation(false);
        processedKeywordsRef.current = "";
        if (process.env.NODE_ENV === "development") {
          console.log(`[AppPage] Resetting to initial screen - pathname changed to /app from ${previousPath}`);
        }
      }
    }
    
    previousPathnameRef.current = currentPath;
  }, [pathname, searchParams, session, showFinalPlan, isLoading]);

  // URL 파라미터로 저장된 세션을 열었는지 확인 (로케일별로 분리된 키에서 로드)
  useEffect(() => {
    const sessionId = searchParams.get("sessionId");
    const keywordsParam = searchParams.get("keywords");
    
    // sessionId가 있으면 저장된 세션 로드
    if (sessionId) {
      const savedSession = getSessionById(sessionId, locale);
      if (savedSession) {
        if (process.env.NODE_ENV === "development") {
          console.log(`[AppPage] Loaded session ${sessionId} for locale ${locale}`);
        }
        setSession(savedSession);
        setIsFromHistory(true);
        processedKeywordsRef.current = "";
        return;
      }
    }
    
    // URL 파라미터로 키워드가 전달된 경우 자동으로 처리
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

            // 1차 아이디어 생성 (locale 파라미터 전달)
            if (process.env.NODE_ENV === "development") {
              console.log(`[AppPage] Generating first level ideas with locale: ${locale}`);
            }
            const nodes = generateFirstLevelIdeas(keywords, selectedType, 7, undefined, locale);

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
                : tApp("generationFailed")
            );
          } finally {
            setIsLoading(false);
            setLoadingMessage("");
          }
        };

        processKeywords();
      }
    }
  }, [searchParams, locale, session, isLoading, tLoading, tApp]);

  const updateSession = (newSession: Session, saveToStorage: boolean = false) => {
    setSession(newSession);
    if (saveToStorage) {
      saveSession(newSession, locale);
    }
  };

  // 키워드 입력 후 1차 아이디어 생성
  const handleKeywordsSubmit = async (keywords: string[]) => {
    if (keywords.length === 0) {
      setError(tKeywordInput("emptyKeywords"));
      return;
    }

    setIsLoading(true);
    setError(null);
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
      if (process.env.NODE_ENV === "development") {
        console.log(`[AppPage] Generating first level ideas with locale: ${locale}`);
      }
      const nodes = generateFirstLevelIdeas(keywords, selectedType, 7, regenerationSeed, locale);

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
          : tApp("generationFailed")
      );
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const selectedType: AppType = "app";

  // 1차 아이디어 재생성
  const handleRegenerateFirstLevel = () => {
    if (!session) return;
    setRegenerationSeed(regenerationSeed + 1);
    handleKeywordsSubmit(session.keywords || []);
  };

  // 노드 변경 핸들러
  const handleNodesChange = (newNodes: Node[]) => {
    if (!session) return;
    const updatedSession: Session = {
      ...session,
      nodes: newNodes,
      updatedAt: new Date().toISOString(),
    };
    updateSession(updatedSession, true);
  };

  // 선택 변경 핸들러
  const handleSelectionChange = (selectedIds: string[]) => {
    if (!session) return;
    const updatedSession: Session = {
      ...session,
      selectedNodeIds: selectedIds,
      updatedAt: new Date().toISOString(),
    };
    updateSession(updatedSession, true);
  };

  // 최종 확정 처리
  const handleFinalize = async () => {
    if (!session) return;

    setIsFinalized(true);
    setFinalizationProgress(0);
    setFinalizationStep(tIdeaTree("generatingPlan"));

    try {
      // 진행률 시뮬레이션
      const progressInterval = setInterval(() => {
        setFinalizationProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await new Promise((resolve) => setTimeout(resolve, 400));

      // 선택된 노드 개수에 따라 추천 개수 결정
      const selectedCount = session.selectedNodeIds?.length || 0;
      const finalCandidates = selectedCount > 0 
        ? Array(selectedCount).fill(null).map((_, i) => ({ title: `Option ${i + 1}`, summary: "" }))
        : [];
      const appNaming = generateAppNaming(session.keywords || [], session.selectedType || "app", finalCandidates, locale);

      // 최종 플랜 생성
      setFinalizationStep(tIdeaTree("generatingNaming"));
      setFinalizationProgress(95);

      await new Promise((resolve) => setTimeout(resolve, 400));

      const finalPlan = generatePlan(
        session.keywords || [],
        session.selectedType || "app",
        undefined,
        locale
      );

      clearInterval(progressInterval);
      setFinalizationProgress(100);

      setFinalPlanResult({
        ...finalPlan,
        appNaming,
      });
      setShowFinalPlan(true);
      setFinalSelected(true);
    } catch (error) {
      console.error("Failed to finalize:", error);
      setError(tIdeaTree("planGenerationFailed"));
      setIsFinalized(false);
      setFinalizationProgress(0);
      setFinalizationStep("");
    }
  };

  // 토픽 확인 후 처리
  const handleTopicConfirm = async () => {
    if (!session || !generatedTopic) return;

    setShowTopicConfirmation(false);
    setFinalizationStep(tIdeaTree("generatingPlan"));

    try {
      await new Promise((resolve) => setTimeout(resolve, 400));

      // 선택된 노드 개수에 따라 추천 개수 결정
      const selectedCount = session.selectedNodeIds?.length || 0;
      const finalCandidates = selectedCount > 0 
        ? Array(selectedCount).fill(null).map((_, i) => ({ title: `Option ${i + 1}`, summary: "" }))
        : [];
      const appNaming = generateAppNaming(session.keywords || [], session.selectedType || "app", finalCandidates, locale);

      setFinalizationStep(tIdeaTree("generatingNaming"));
      await new Promise((resolve) => setTimeout(resolve, 400));

      const finalPlan = generatePlan(
        session.keywords || [],
        session.selectedType || "app",
        undefined,
        locale
      );

      setFinalPlanResult({
        ...finalPlan,
        appNaming,
      });
      setShowFinalPlan(true);
      setFinalSelected(true);
      setIsFinalized(true);
      setFinalizationProgress(100);
    } catch (error) {
      console.error("Failed to generate plan:", error);
      setError(tIdeaTree("planGenerationFailed"));
      setIsFinalized(false);
      setFinalizationProgress(0);
      setFinalizationStep("");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  if (showFinalPlan && finalPlanResult) {
    return (
      <PlanDetail
        result={finalPlanResult}
        keywords={session?.keywords || []}
        onBack={() => {
          setShowFinalPlan(false);
          setFinalSelected(false);
          setIsFinalized(false);
          setFinalizationProgress(0);
          setFinalizationStep("");
        }}
      />
    );
  }

  if (showPaywall && !isPro) {
    return (
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onUpgrade={() => {
          setShowPaywall(false);
        }}
      />
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto">
          <KeywordInputForm 
            onSubmit={handleKeywordsSubmit} 
            isLoading={isLoading}
            loadingMessage={loadingMessage}
          />
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
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
        showSaveButton={true}
      />
    </div>
  );
}

export default function AppPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    }>
      <AppPageContent />
    </Suspense>
  );
}
