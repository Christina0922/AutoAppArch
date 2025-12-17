"use client";

import { PlanResult } from "@/lib/types";

interface PlanDetailProps {
  result: PlanResult;
  keywords?: string[];
  showProgress?: boolean; // 진척 단계 표시 여부
}

export default function PlanDetail({ result, keywords = [], showProgress = false }: PlanDetailProps) {
  return (
    <div className="space-y-6">
      {/* 자동 생성된 앱 설계안 헤더 - 고정 요소 */}
      <div className="bg-white rounded-lg border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
          자동 생성된 <span className="text-gray-600">앱 설계안</span>
        </h1>
        {keywords.length > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            입력 <span className="font-medium text-gray-700">키워드</span>: {keywords.join(", ")}
          </p>
        )}
      </div>

      {/* 진척 단계 표시 */}
      {showProgress && (
        <div className="bg-white rounded-lg border border-gray-100 p-8">
          <p className="text-base text-gray-600 mb-6 leading-relaxed">
            현재 이 설계안은 <strong className="text-gray-900 font-medium">'기본 구조 단계'</strong>에 있습니다.
          </p>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              설계 진행 단계
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-gray-900 mr-4 text-base font-medium">✓</span>
                <span className="text-base text-gray-600">① 아이디어 구조화</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-900 mr-4 text-base font-medium">✓</span>
                <span className="text-base text-gray-600">② 핵심 기능 정리</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-300 mr-4 text-base">◻</span>
                <span className="text-base text-gray-400">③ 화면 흐름 설계</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-300 mr-4 text-base">◻</span>
                <span className="text-base text-gray-400">④ 구현 준비 단계</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-100 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">{result.title}</h2>
        <p className="text-base text-gray-500 leading-relaxed">{result.tagline}</p>
      </div>

      {result.sectionsForRendering.map((section, idx) => (
        <div
          key={idx}
          className="bg-gray-50 rounded-md p-8 border border-gray-100"
        >
          <h2 className="text-base font-bold text-gray-900 mb-6 tracking-tight">
            [ {section.heading} ]
          </h2>
          <ul className="space-y-3">
            {section.bullets.map((bullet, bulletIdx) => (
              <li
                key={bulletIdx}
                className="text-base text-gray-600 leading-relaxed flex items-start"
              >
                <span className="text-gray-400 mr-3">•</span>
                <span className="flex-1 break-words">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
