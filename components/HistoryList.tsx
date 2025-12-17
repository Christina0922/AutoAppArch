"use client";

import { SavedPlan } from "@/lib/types";
import Link from "next/link";

interface HistoryListProps {
  plans: SavedPlan[];
  onDelete?: (id: string) => void;
}

export default function HistoryList({ plans, onDelete }: HistoryListProps) {
  if (plans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-base text-gray-500 mb-4">
          저장된 설계안이 없습니다.
        </p>
        <Link
          href="/app"
          className="text-base text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          새 설계안 만들기 →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className="bg-white rounded-lg border border-gray-100 p-8 hover:border-gray-200 transition-colors"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">
                {plan.result.title}
              </h3>
              <p className="text-base text-gray-500 mb-3">
                키워드: {plan.keywords.join(", ")}
              </p>
              <p className="text-sm text-gray-400">
                {new Date(plan.createdAt).toLocaleString("ko-KR")}
              </p>
            </div>
            {onDelete && (
              <button
                onClick={() => onDelete(plan.id)}
                className="ml-4 px-4 py-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                삭제
              </button>
            )}
          </div>
          <div className="flex gap-4">
            <Link
              href={`/history/${plan.id}`}
              className="text-base text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              상세 보기 →
            </Link>
            <Link
              href={`/app?planId=${plan.id}`}
              className="text-base text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              계속 진행하기 →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
