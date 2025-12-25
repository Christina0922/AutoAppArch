'use client';

import React from 'react';
import type { SavedPlan } from '@/lib/types';

export interface HistoryListProps {
  plans: SavedPlan[];
  onDelete: (id: string) => void;
}

export default function HistoryList({ plans, onDelete }: HistoryListProps) {
  if (!plans || plans.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
        저장된 설계안이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {plans.map((plan) => (
        <div
          key={String(plan.id)}
          className="flex items-start justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4"
        >
          <div className="min-w-0">
            <div className="font-semibold text-gray-900">
              {plan.title ? String(plan.title) : '제목 없음'}
            </div>

            {plan.summary ? (
              <div className="mt-1 text-sm text-gray-600">{String(plan.summary)}</div>
            ) : null}

            {plan.keywords ? (
              <div className="mt-2 text-xs text-gray-500">
                {Array.isArray(plan.keywords)
                  ? plan.keywords.map(String).join(', ')
                  : String(plan.keywords)}
              </div>
            ) : null}

            {plan.createdAt || plan.updatedAt ? (
              <div className="mt-2 text-xs text-gray-400">
                {plan.updatedAt ? `수정: ${String(plan.updatedAt)}` : null}
                {plan.updatedAt && plan.createdAt ? ' · ' : null}
                {plan.createdAt ? `생성: ${String(plan.createdAt)}` : null}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => onDelete(String(plan.id))}
            className="shrink-0 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            삭제
          </button>
        </div>
      ))}
    </div>
  );
}
