"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SavedPlan } from "@/lib/types";
import { getAllPlans, deletePlan } from "@/lib/storage";
import HistoryList from "@/components/HistoryList";

type LoadingState = "loading" | "success" | "error" | "timeout";

export default function HistoryPage() {
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>("loading");

  useEffect(() => {
    const loadPlans = async () => {
      try {
        // 타임아웃 설정 (6초)
        const timeoutId = setTimeout(() => {
          setLoadingState("timeout");
        }, 6000);

        // localStorage는 동기이지만, 에러 처리를 위해 try-catch 사용
        const loadedPlans = getAllPlans();
        
        clearTimeout(timeoutId);
        setPlans(loadedPlans);
        setLoadingState("success");
      } catch (error) {
        console.error("히스토리 로딩 실패:", error);
        setLoadingState("error");
      }
    };

    loadPlans();
  }, []);

  const handleRetry = () => {
    setLoadingState("loading");
    try {
      const loadedPlans = getAllPlans();
      setPlans(loadedPlans);
      setLoadingState("success");
    } catch (error) {
      console.error("히스토리 재시도 실패:", error);
      setLoadingState("error");
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleDelete = (id: string) => {
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

  // 로딩 스켈레톤
  if (loadingState === "loading") {
    return (
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
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
    );
  }

  // 타임아웃 상태
  if (loadingState === "timeout") {
    return (
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-semibold text-gray-900 mb-12 text-center tracking-tight">
          저장된 <span className="font-bold">앱 설계안</span>
        </h1>
        <div className="bg-white rounded-lg border border-gray-100 p-16 flex flex-col items-center justify-center text-center min-h-[400px]">
          <div className="flex flex-col items-center justify-center">
            <p className="text-base text-gray-600 mb-4">
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
    );
  }

  // 에러 상태
  if (loadingState === "error") {
    return (
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-semibold text-gray-900 mb-12 text-center tracking-tight">
          저장된 <span className="font-bold">앱 설계안</span>
        </h1>
        <div className="bg-white rounded-lg border border-gray-100 p-16 flex flex-col items-center justify-center text-center min-h-[400px]">
          <div className="flex flex-col items-center justify-center">
            <p className="text-base text-gray-600 mb-4">
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
    );
  }

  // 성공 상태
  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-semibold text-gray-900 mb-12 text-center tracking-tight">
        저장된 <span className="font-bold">앱 설계안</span>
      </h1>
      {plans.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-100 p-16 flex flex-col items-center justify-center text-center min-h-[400px]">
          <div className="flex flex-col items-center justify-center">
            <p className="text-base text-gray-600 mb-2 leading-relaxed">
              아직 저장된 <span className="font-bold">앱 설계안</span>이 없습니다.
            </p>
            <p className="text-base text-gray-500 mb-8 leading-relaxed">
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
      ) : (
        <HistoryList plans={plans} onDelete={handleDelete} />
      )}
    </div>
  );
}
