"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import HistoryList from "@/components/HistoryList";
import type { SavedPlan, Session } from "@/lib/types";
import { getAllPlans, getAllSessions, deletePlan, deleteSession } from "@/lib/storage";
import { getLocaleFromPathname, withLocalePrefix } from "@/utils/localePath";
import { getRouteLocale } from "@/utils/getRouteLocale";

type LoadingState = "loading" | "success" | "empty" | "error";

function convertSessionToSavedPlan(session: Session): SavedPlan {
  return {
    id: session.id,
    title: session.keywords && session.keywords.length > 0
      ? `${session.keywords.join(" + ")} 모바일 앱 설계안`
      : "자동 생성된 앱 설계안",
    keywords: session.keywords || [],
    createdAt: session.createdAt ? new Date(session.createdAt).toLocaleString() : "방금 전",
  };
}

export default function HistoryPage() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const locale = getRouteLocale(pathname);
  const [items, setItems] = useState<SavedPlan[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoadingState("loading");
        setErrorMessage("");

        // SSR 환경에서 window가 없으면 대기
        if (typeof window === "undefined") {
          // 클라이언트에서만 실행되므로 이 경우는 거의 없지만 안전장치
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // storage.ts의 함수 사용 (로케일별로 분리된 키에서 로드)
        const loadedPlans = getAllPlans(locale);
        const loadedSessions = getAllSessions(locale);

        // Session을 SavedPlan 형식으로 변환
        const convertedSessions = loadedSessions.map(convertSessionToSavedPlan);

        // Plan과 Session을 합치고 중복 제거 (id 기준)
        const allItems = [...loadedPlans, ...convertedSessions];
        const uniqueItems = allItems.filter(
          (item, index, self) => index === self.findIndex((t) => t.id === item.id)
        );

        // 생성일 기준으로 최신순 정렬
        uniqueItems.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });

        setItems(uniqueItems);

        if (uniqueItems.length === 0) {
          setLoadingState("empty");
        } else {
          setLoadingState("success");
        }
      } catch (error) {
        console.error("히스토리 로딩 실패:", error);
        setLoadingState("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "저장된 설계안을 불러오는 중 오류가 발생했습니다."
        );
      }
    };

    loadHistory();
  }, []);

  const handleRetry = () => {
    const loadHistory = async () => {
      try {
        setLoadingState("loading");
        setErrorMessage("");

        const loadedPlans = getAllPlans(locale);
        const loadedSessions = getAllSessions(locale);
        const convertedSessions = loadedSessions.map(convertSessionToSavedPlan);
        const allItems = [...loadedPlans, ...convertedSessions];
        const uniqueItems = allItems.filter(
          (item, index, self) => index === self.findIndex((t) => t.id === item.id)
        );

        uniqueItems.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });

        setItems(uniqueItems);

        if (uniqueItems.length === 0) {
          setLoadingState("empty");
        } else {
          setLoadingState("success");
        }
      } catch (error) {
        console.error("히스토리 재시도 실패:", error);
        setLoadingState("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "저장된 설계안을 불러오는 중 오류가 발생했습니다."
        );
      }
    };

    loadHistory();
  };

  const handleDelete = (id: string) => {
    try {
      // Plan과 Session 모두에서 삭제 시도 (로케일별로 분리된 키에서 삭제)
      deletePlan(id, locale);
      deleteSession(id, locale);
      
      // 상태 업데이트
      setItems((prev) => prev.filter((item) => item.id !== id));
      
      // 삭제 후 빈 상태가 되면 상태 변경
      const remaining = items.filter((item) => item.id !== id);
      if (remaining.length === 0) {
        setLoadingState("empty");
      }
    } catch (error) {
      console.error("삭제 실패:", error);
      setErrorMessage("삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const isEmpty = items.length === 0;
  
  // 타입 강제: SavedPlan[]로 확정
  const plans = (items ?? []) as SavedPlan[];

  return (
    <div className="flex-1 flex flex-col">
      {/* 제목(위 고정) */}
      <div className="px-4 pt-10">
        <h1 className="text-center text-2xl font-bold">저장된 앱 설계안</h1>
      </div>

      {/* 내용 */}
      {loadingState === "loading" && (
        <div className="flex-1 flex items-center justify-center px-4 pb-12">
          <div className="w-full max-w-2xl rounded-xl border border-gray-200 bg-white p-10 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
              <p className="text-sm text-gray-600">로딩 중...</p>
            </div>
          </div>
        </div>
      )}

      {loadingState === "error" && (
        <div className="flex-1 flex items-center justify-center px-4 pb-12">
          <div className="w-full max-w-2xl rounded-xl border border-red-200 bg-red-50 p-10 text-center">
            <div className="space-y-4">
              <p className="text-sm font-medium text-red-900">오류가 발생했습니다</p>
              <p className="text-xs text-red-700">{errorMessage || "알 수 없는 오류가 발생했습니다."}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center justify-center rounded-md bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                >
                  다시 시도
                </button>
                <a
                  href={withLocalePrefix("/", locale, pathname)}
                  className="inline-flex items-center justify-center rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                >
                  홈으로 이동
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {loadingState === "empty" && (
        <div className="flex-1 flex items-center justify-center px-4 pb-12 relative z-10">
          <div className="w-full max-w-2xl rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm relative z-20">
            <p className="text-sm text-gray-600">아직 저장된 앱 설계안이 없습니다.</p>
            <p className="mt-2 text-sm text-gray-500">
              키워드 몇 개만 입력하면 바로 자동 생성할 수 있습니다.
            </p>

            <div className="mt-6">
              <a
                href={withLocalePrefix("/app", locale, pathname)}
                className="inline-flex items-center justify-center rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                설계안 만들기
              </a>
            </div>
          </div>
        </div>
      )}

      {loadingState === "success" && !isEmpty && (
        <div className="px-4 py-10">
          <div className="mx-auto w-full max-w-6xl">
            <HistoryList plans={plans} onDelete={handleDelete} />
          </div>
        </div>
      )}
    </div>
  );
}
