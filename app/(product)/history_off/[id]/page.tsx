"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SavedPlan, Session } from "@/lib/types";
import { getPlanById, getSessionById } from "@/lib/storage";
import { shouldBypassPaywall } from "@/lib/paywall";
import { normalizeAppType } from "@/lib/appType";
import IdeaTree from "@/components/IdeaTree";
import PaywallModal from "@/components/PaywallModal";
import Link from "next/link";

export default function HistoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [plan, setPlan] = useState<SavedPlan | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isPro] = useState(false); // MVP에서는 항상 false
  const [error, setError] = useState<string | null>(null);
  const [isLegacyPlan, setIsLegacyPlan] = useState(false);

  useEffect(() => {
    if (params.id && typeof params.id === "string") {
      // 먼저 Session으로 시도
      const foundSession = getSessionById(params.id);
      if (foundSession) {
        setSession(foundSession);
        setError(null);
        setIsLegacyPlan(false);
        return;
      }

      // Session이 없으면 기존 Plan으로 시도 (하위 호환성)
      const foundPlan = getPlanById(params.id);
      if (foundPlan) {
        setPlan(foundPlan);
        setError(null);
        setIsLegacyPlan(true);
      } else {
        setError("설계안을 찾을 수 없습니다.");
        setTimeout(() => {
          router.push("/history");
        }, 2000);
      }
    }
  }, [params.id, router]);

  // Session 업데이트 (트리에서 변경 시)
  const handleNodesChange = (nodes: any[]) => {
    if (!session) return;
    setSession({ ...session, nodes });
    // 자동 저장은 생략 (읽기 전용 모드)
  };

  const handleSelectionChange = (selectedIds: string[]) => {
    if (!session) return;
    setSession({ ...session, selectedNodeIds: selectedIds });
  };

  const handleContinue = () => {
    if (isPro) {
      // Pro 사용자는 세션 계속하기
      if (session) {
        router.push(`/app?sessionId=${session.id}`);
      } else if (plan) {
        router.push(`/app?planId=${plan.id}`);
      }
      return;
    }
    
    // 우회 모드가 활성화되어 있으면 바로 진행
    if (shouldBypassPaywall()) {
      if (session) {
        router.push(`/app?sessionId=${session.id}`);
      } else if (plan) {
        router.push(`/app?planId=${plan.id}`);
      }
      return;
    }
    
    // 일반 모드에서는 요금제 모달 표시
    setShowPaywall(true);
  };

  // PRO 보기 버튼 클릭 핸들러
  const handleShowPro = () => {
    setShowPaywall(true);
  };

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg border border-red-200 p-12 text-center">
          <p className="text-base text-red-600 mb-4" role="alert">
            {error}
          </p>
          <p className="text-sm text-gray-500">
            히스토리 페이지로 이동합니다...
          </p>
        </div>
      </div>
    );
  }

  // 로딩 중
  if (!session && !plan) {
    return (
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg border border-gray-100 p-12 text-center">
          <p className="text-base text-gray-500" aria-live="polite">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 기존 Plan 형태는 더 이상 지원하지 않음 (레거시 제거)
  // Plan이 발견되면 에러 표시
  if (plan && isLegacyPlan) {
    return (
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Link
            href="/history"
            className="text-base text-gray-500 hover:text-gray-900 font-medium mb-6 inline-block transition-colors"
          >
            ← 목록으로 돌아가기
          </Link>
        </div>
        <div className="bg-white rounded-lg border border-red-200 p-12 text-center">
          <p className="text-base text-red-600 mb-4" role="alert">
            이 설계안은 이전 버전 형식입니다.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            새로운 마인드맵 형식으로 다시 생성해주세요.
          </p>
          <Link
            href="/app"
            className="inline-block px-6 h-12 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            새로 만들기
          </Link>
        </div>
      </div>
    );
  }

  // 새로운 Session 형태 (트리 UI)
  if (session) {
    // 최종 후보 노드들 찾기
    const getFinalCandidates = (): any[] => {
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
        <div className="mb-8">
          <Link
            href="/history"
            className="text-base text-gray-500 hover:text-gray-900 font-medium mb-6 inline-block transition-colors"
          >
            ← 목록으로 돌아가기
          </Link>
          <div className="bg-white rounded-lg border border-gray-100 p-6 mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">
              마인드맵 아이디어 트리
            </h1>
            <p className="text-sm text-gray-400 mb-1">
              생성일: {new Date(session.createdAt).toLocaleString("ko-KR")}
            </p>
            <p className="text-xs text-gray-500 mb-1">모바일 앱 설계안 생성</p>
            <p className="text-sm text-gray-700 mb-2">
              키워드: <span className="font-medium text-gray-900">{(session.keywords || []).join(", ")}</span>
            </p>
          </div>
        </div>

        {/* 트리 UI */}
        <IdeaTree
          sessionId={session.id}
          initialNodes={session.nodes || []}
          initialSelectedIds={session.selectedNodeIds || []}
          keywords={session.keywords || []}
          selectedType={normalizeAppType(session.selectedType)}
          onNodesChange={handleNodesChange}
          onSelectionChange={handleSelectionChange}
        />

        {/* 최종 후보 표시 (있는 경우) */}
        {hasFinalCandidates && (
          <div className="mt-8 bg-white rounded-lg border-2 border-gray-900 p-8">
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
          </div>
        )}

        {/* 계속 진행하기 버튼 - 히스토리에서는 계속 진행만 가능 */}
        <div className="mt-8 bg-white rounded-lg border border-gray-100 p-8">
          <button
            onClick={handleContinue}
            className="w-full h-12 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            aria-label="이 세션으로 계속 진행하기"
          >
            이 세션으로 계속 진행하기
          </button>
        </div>

        <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
      </div>
    );
  }

  return null;
}
