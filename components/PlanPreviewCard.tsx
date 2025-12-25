"use client";

import { PlanResult } from "@/lib/types";

interface PlanPreviewCardProps {
  result: PlanResult;
  keywords?: string[];
  onViewDetail?: () => void;
  isPro?: boolean;
  showContinueButton?: boolean; // 저장된 설계안을 다시 열었을 때만 true
}

export default function PlanPreviewCard({
  result,
  keywords = [],
  onViewDetail,
  isPro = false,
  showContinueButton = false,
}: PlanPreviewCardProps) {
  // 첫 생성 시에는 "계속 진행하기" 버튼을 숨김
  if (!showContinueButton) {
    return (
      <div className="h-full flex flex-col bg-white rounded-lg border border-gray-100 p-8">
        {/* 자동 생성된 앱 설계안 헤더 */}
        <div className="mb-6 pb-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
            자동 생성된 <span className="text-gray-600">앱 설계안</span>
          </h2>
          {keywords.length > 0 && (
            <p className="text-sm text-gray-500">
              입력 <span className="font-medium text-gray-700">키워드</span>: {keywords.join(", ")}
            </p>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">{(result.title as string) ?? ""}</h3>
          <p className="text-base text-gray-500 leading-relaxed">{(result.tagline as string) ?? ""}</p>
        </div>

        <div className="flex-1 flex flex-col space-y-6">
          {/* [사용자 관점] 섹션만 미리보기로 표시 */}
          {((result.sectionsForRendering as Array<{ heading: string; bullets: string[] }>) || [])
            .filter((s) => s.heading.startsWith("[사용자 관점]"))
            .slice(0, 2)
            .map((section, idx) => {
              const cleanHeading = section.heading.replace("[사용자 관점] ", "");
              return (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-md p-6 border border-gray-200 min-h-[120px] md:min-h-[140px]"
                >
                  <h3 className="text-base font-bold text-gray-900 mb-3 tracking-tight">
                    {cleanHeading}
                  </h3>
                  {section.bullets.length > 0 && (
                    <ul className="space-y-2 text-base text-gray-600">
                      {section.bullets.slice(0, 3).map((bullet, bulletIdx) => (
                        <li key={bulletIdx} className="flex items-start">
                          <span className="text-gray-400 mr-2">•</span>
                          <span className="break-words">{bullet}</span>
                        </li>
                      ))}
                      {section.bullets.length > 3 && (
                        <li className="text-gray-400 text-sm">
                          외 {section.bullets.length - 3}개...
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    );
  }

  // 저장된 설계안을 다시 열었을 때만 "계속 진행하기" 버튼 표시
  return (
    <div className="h-full flex flex-col bg-white rounded-lg border border-gray-100 p-8">
      <div className="mb-6">
         <h2 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tight">{(result.title as string) ?? ""}</h2>
         <p className="text-base text-gray-500 leading-relaxed">{(result.tagline as string) ?? ""}</p>
      </div>

      <div className="flex-1 flex flex-col space-y-6 mb-8">
        {/* [사용자 관점] 섹션만 미리보기로 표시 */}
        {((result.sectionsForRendering as Array<{ heading: string; bullets: string[] }>) || [])
          .filter((s) => s.heading.startsWith("[사용자 관점]"))
          .slice(0, 2)
          .map((section, idx) => {
            const cleanHeading = section.heading.replace("[사용자 관점] ", "");
            return (
              <div key={idx} className="min-h-[100px] md:min-h-[120px]">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
                  {cleanHeading}
                </h3>
                {section.bullets.length > 0 && (
                  <ul className="space-y-2 text-base text-gray-600">
                    {section.bullets.slice(0, 3).map((bullet, bulletIdx) => (
                      <li key={bulletIdx} className="flex items-start">
                        <span className="text-gray-400 mr-2">•</span>
                        <span className="break-words">{bullet}</span>
                      </li>
                    ))}
                    {section.bullets.length > 3 && (
                      <li className="text-gray-400 text-sm">
                        외 {section.bullets.length - 3}개...
                      </li>
                    )}
                  </ul>
                )}
              </div>
            );
          })}
      </div>

      {onViewDetail && (
        <button
          onClick={onViewDetail}
          className="w-full h-12 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 mt-auto"
          aria-label="이 설계안으로 계속 진행하기"
        >
          이 설계안으로 계속 진행하기
        </button>
      )}
    </div>
  );
}
