"use client";

import { PlanResult } from "@/lib/types";

interface PlanPreviewCardProps {
  result: PlanResult;
  onViewDetail?: () => void;
  isPro?: boolean;
  showContinueButton?: boolean; // 저장된 설계안을 다시 열었을 때만 true
}

export default function PlanPreviewCard({
  result,
  onViewDetail,
  isPro = false,
  showContinueButton = false,
}: PlanPreviewCardProps) {
  // 첫 생성 시에는 "계속 진행하기" 버튼을 숨김
  if (!showContinueButton) {
    return (
      <div className="bg-white rounded-lg border border-gray-100 p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tight">{result.title}</h2>
          <p className="text-base text-gray-500 leading-relaxed">{result.tagline}</p>
        </div>

        <div className="space-y-6 mb-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              타깃 사용자
            </h3>
            <ul className="space-y-2 text-base text-gray-600">
              {result.targetUsers.slice(0, 3).map((user, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>{user}</span>
                </li>
              ))}
              {result.targetUsers.length > 3 && (
                <li className="text-gray-400 text-sm">
                  외 {result.targetUsers.length - 3}개...
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              핵심 행동
            </h3>
            <p className="text-base text-gray-600 leading-relaxed">
              {result.coreAction}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 저장된 설계안을 다시 열었을 때만 "계속 진행하기" 버튼 표시
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tight">{result.title}</h2>
        <p className="text-base text-gray-500 leading-relaxed">{result.tagline}</p>
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            타깃 사용자
          </h3>
          <ul className="space-y-2 text-base text-gray-600">
            {result.targetUsers.slice(0, 3).map((user, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>{user}</span>
              </li>
            ))}
            {result.targetUsers.length > 3 && (
              <li className="text-gray-400 text-sm">
                외 {result.targetUsers.length - 3}개...
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            핵심 행동
          </h3>
          <p className="text-base text-gray-600 leading-relaxed">
            {result.coreAction}
          </p>
        </div>
      </div>

      {onViewDetail && (
        <button
          onClick={onViewDetail}
          className="w-full h-12 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight"
        >
          이 설계안으로 계속 진행하기
        </button>
      )}
    </div>
  );
}
