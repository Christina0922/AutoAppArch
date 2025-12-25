"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SavedPlan } from '@/lib/types';
import type { Session } from "@/lib/types";
import { getAllPlans, deletePlan, getAllSessions, deleteSession } from "@/lib/storage";
import HistoryList from "@/components/HistoryList";

type LoadingState = "loading" | "success" | "error" | "timeout";

export default function HistoryPage() {
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>("loading");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        // 타임아웃 설정 (6초)
        const timeoutId = setTimeout(() => {
          setLoadingState("timeout");
        }, 6000);

        // Session과 Plan 모두 로드
        const loadedPlans = getAllPlans();
        const loadedSessions = getAllSessions();
        
        clearTimeout(timeoutId);
        setPlans(loadedPlans);
        setSessions(loadedSessions);
        setLoadingState("success");
      } catch (error) {
        console.error("히스토리 로딩 실패:", error);
        setLoadingState("error");
      }
    };

    loadHistory();
  }, []);

  const handleRetry = () => {
    setLoadingState("loading");
    try {
      const loadedPlans = getAllPlans();
      const loadedSessions = getAllSessions();
      setPlans(loadedPlans);
      setSessions(loadedSessions);
      setLoadingState("success");
    } catch (error) {
      console.error("히스토리 재시도 실패:", error);
      setLoadingState("error");
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleDeletePlan = (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      try {
        deletePlan(id);
        setPlans(getAllPlans());
      } catch (error) {
        console.error("삭제 실패:", error);
        alert("삭제에 실패했습니다.");
      }
    }
  };

  const handleDeleteSession = (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      try {
        deleteSession(id);
        setSessions(getAllSessions());
      } catch (error) {
        console.error("삭제 실패:", error);
        alert("삭제에 실패했습니다.");
      }
    }
  };

  // 로딩 스켈레톤
  if (loadingState === "loading") {
    return (
      <div className="flex-1 flex flex-col">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16 w-full">
          <h1 className="text-3xl font-semibold text-gray-900 mb-12 text-center tracking-tight">
            저장된 <span className="font-bold">앱 설계안</span>
          </h1>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-100 p-8 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 타임아웃 상태
  if (loadingState === "timeout") {
    return (
      <div className="flex-1 flex flex-col">
        <section className="flex-1 flex items-center justify-center px-4 text-center">
          <div className="max-w-4xl w-full">
            <div className="bg-white rounded-lg border border-gray-100 p-16 flex flex-col items-center justify-center text-center">
              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-base text-gray-600">
                  히스토리를 불러오지 못했습니다.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleRetry}
                    className="h-12 px-6 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors"
                  >
                    다시 시도
                  </button>
                  <button
                    onClick={handleRefresh}
                    className="h-12 px-6 bg-white text-gray-900 text-base font-medium rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    새로고침
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // 에러 상태
  if (loadingState === "error") {
    return (
      <div className="flex-1 flex flex-col">
        <section className="flex-1 flex items-center justify-center px-4 text-center">
          <div className="max-w-4xl w-full">
            <div className="bg-white rounded-lg border border-gray-100 p-16 flex flex-col items-center justify-center text-center">
              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-base text-gray-600">
                  히스토리를 불러오지 못했습니다.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleRetry}
                    className="h-12 px-6 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors"
                  >
                    다시 시도
                  </button>
                  <button
                    onClick={handleRefresh}
                    className="h-12 px-6 bg-white text-gray-900 text-base font-medium rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    새로고침
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const totalCount = plans.length + sessions.length;

  // 타입 강제: SavedPlan[]로 확정
  const typedPlans = (plans ?? []) as SavedPlan[];

  // 성공 상태
  return (
    <div className="flex-1 flex flex-col">
      {/* 제목 영역: 위에 고정 */}
      <div className="px-4 pt-10">
        <h1 className="text-3xl font-semibold text-gray-900 text-center tracking-tight">
          저장된 <span className="font-bold">앱 설계안</span>
        </h1>
      </div>

      {/* 내용 영역: 남은 높이를 전부 먹고, 그 안에서 가운데 정렬 */}
      {totalCount === 0 ? (
        <div className="flex-1 flex items-center justify-center px-4 pb-10">
          <div className="bg-white rounded-lg border border-gray-100 p-16 flex flex-col items-center justify-center text-center max-w-2xl w-full">
            <div className="flex flex-col items-center justify-center gap-6">
              <p className="text-base text-gray-600 leading-relaxed">
                아직 저장된 <span className="font-bold">앱 설계안</span>이 없습니다.
              </p>
              <p className="text-base text-gray-500 leading-relaxed">
                <span className="font-bold">키워드</span> 몇 개만 입력하면 바로 <span className="font-bold">자동</span> 생성할 수 있습니다.
              </p>
              <Link
                href="/app"
                className="inline-block h-12 px-8 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight"
              >
                <span className="font-bold">설계안 만들기</span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 py-10">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
            {/* Session 목록 (새로운 마인드맵 형식) */}
            {sessions.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 tracking-tight">
                  마인드맵 세션 ({sessions.length})
                </h2>
                <div className="space-y-4">
                  {sessions
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((session) => (
                      <div
                        key={session.id}
                        className="bg-white rounded-lg border border-gray-100 p-8 hover:border-gray-200 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">
                              마인드맵 아이디어 트리
                            </h3>
                            <p className="text-base text-gray-500 mb-3">
                              <span className="font-medium text-gray-700">키워드</span>: {(session.keywords || []).join(", ")}
                              {session.selectedType && (
                                <span className="ml-3">
                                  유형: <span className="font-medium text-gray-700">
                                    {session.selectedType === "app" ? "모바일 앱" : "웹 서비스"}
                                  </span>
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-400 mb-2">
                              노드 {(session.nodes || []).length}개, 선택 {(session.selectedNodeIds || []).length}개
                            </p>
                            <p className="text-sm text-gray-400">
                              {new Date(session.createdAt).toLocaleString("ko-KR")}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteSession(session.id)}
                            className="ml-4 px-4 py-2 text-base text-gray-500 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 rounded-md"
                            aria-label={`세션 ${session.id} 삭제`}
                          >
                            삭제
                          </button>
                        </div>
                        <div className="flex gap-4">
                          <Link
                            href={`/history/${session.id}`}
                            className="text-base text-gray-600 hover:text-gray-900 font-medium transition-colors"
                          >
                            보기 →
                          </Link>
                          <Link
                            href={`/app?sessionId=${session.id}`}
                            className="text-base text-gray-600 hover:text-gray-900 font-medium transition-colors"
                          >
                            계속 진행하기 →
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Plan 목록 (기존 형식, 하위 호환성) */}
            {typedPlans.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 tracking-tight">
                  기존 설계안 ({typedPlans.length})
                </h2>
                <HistoryList plans={typedPlans} onDelete={handleDeletePlan} />
              </div>
            )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
