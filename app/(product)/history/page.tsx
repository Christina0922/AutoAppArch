"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SavedPlan } from "@/lib/types";
import { getAllPlans, deletePlan } from "@/lib/storage";
import HistoryList from "@/components/HistoryList";

export default function HistoryPage() {
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedPlans = getAllPlans();
    setPlans(loadedPlans);
    setIsLoading(false);
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      try {
        deletePlan(id);
        setPlans(getAllPlans());
      } catch (error) {
        alert("삭제에 실패했습니다.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg border border-gray-100 p-12 text-center">
          <p className="text-base text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-semibold text-gray-900 mb-12 text-center tracking-tight">
        저장된 설계안
      </h1>
      {plans.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-100 p-16 text-center">
          <p className="text-base text-gray-600 mb-2 leading-relaxed">
            아직 저장된 설계안이 없습니다.
          </p>
          <p className="text-base text-gray-500 mb-8 leading-relaxed">
            첫 설계안을 만들어보세요.
          </p>
          <Link
            href="/app"
            className="inline-block h-12 px-8 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight"
          >
            설계안 만들기
          </Link>
        </div>
      ) : (
        <HistoryList plans={plans} onDelete={handleDelete} />
      )}
    </div>
  );
}
