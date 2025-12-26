"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Node, ImplementationSpec } from "@/lib/types";
import BadgeWithTooltip from "./BadgeWithTooltip";

interface ArchitectureCardProps {
  node: Node;
  isSelected: boolean;
  onToggle: () => void;
  hasChildren: boolean;
  onRegenerate?: () => void;
  isRecommended?: boolean;
  isDeveloperMode?: boolean;
}

export default function ArchitectureCard({
  node,
  isSelected,
  onToggle,
  hasChildren,
  onRegenerate,
  isRecommended = false,
  isDeveloperMode = false,
}: ArchitectureCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const spec = node.spec as ImplementationSpec | undefined;
  const hasSpec = !!spec;

  // 레벨별 색상 클래스
  const nodeLevel = (node.level as number) ?? 2;
  const getLevelColor = () => {
    if (nodeLevel === 2) return { border: "border-blue-300", bg: "bg-blue-50", text: "text-blue-700" };
    if (nodeLevel === 3) return { border: "border-green-300", bg: "bg-green-50", text: "text-green-700" };
    if (nodeLevel === 4) return { border: "border-purple-300", bg: "bg-purple-50", text: "text-purple-700" };
    if (nodeLevel === 5) return { border: "border-orange-300", bg: "bg-orange-50", text: "text-orange-700" };
    if (nodeLevel === 6) return { border: "border-red-300", bg: "bg-red-50", text: "text-red-700" };
    return { border: "border-gray-300", bg: "bg-gray-50", text: "text-gray-700" };
  };

  const levelColor = getLevelColor();

  const getBorderClass = () => {
    if (isSelected) {
      if (nodeLevel === 2) return "border-blue-600";
      if (nodeLevel === 3) return "border-green-600";
      if (nodeLevel === 4) return "border-purple-600";
      if (nodeLevel === 5) return "border-orange-600";
      if (nodeLevel === 6) return "border-red-600";
      return "border-blue-600";
    }
    return levelColor.border;
  };

  const getBgClass = () => {
    if (!isSelected) return "bg-white";
    return levelColor.bg;
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "초급": return "bg-green-100 text-green-800";
      case "중급": return "bg-yellow-100 text-yellow-800";
      case "상급": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // 난이도 툴팁 텍스트
  const getDifficultyTooltip = (difficulty?: string) => {
    switch (difficulty) {
      case "초급":
        return "기본 CRUD 기능, 단순 화면 구성, 기본 인증만 포함\n예: 로그 추가/조회, 기본 통계, 사용자 프로필";
      case "중급":
        return "검색/필터, 태그, 알림, 목표 설정 등 확장 기능 포함\n예: 검색 및 필터링, 태그 관리, 알림 설정, 목표 추적";
      case "상급":
        return "성능 최적화(캐싱/배치), ML/추천 알고리즘, 복잡한 권한 시스템 등 포함\n예: 성능 모니터링, 추천 알고리즘, 권한 관리, 감사 로그";
      default:
        return "";
    }
  };

  // 기간 툴팁 텍스트
  const getDurationTooltip = (duration?: string) => {
    return `1명의 개발자가 풀타임으로 작업할 때의 예상 기간입니다.\n\n기간은 다음을 포함합니다:\n• 프론트엔드 개발\n• 백엔드 API 개발\n• 데이터베이스 설계\n• 기본 배포 및 테스트\n\n실제 기간은 팀 규모, 경험 수준, 요구사항 변경에 따라 달라질 수 있습니다.`;
  };

  if (!hasSpec) {
    // 스펙이 없으면 기존 방식으로 표시
    return (
      <div
        className={`${getBgClass()} rounded-lg border-2 p-5 cursor-pointer transition-all ${
          isSelected
            ? `${getBorderClass()} shadow-md`
            : `${getBorderClass()} hover:bg-gray-50`
        }`}
        onClick={onToggle}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                isSelected
                  ? "bg-blue-600 border-blue-600"
                  : "border-gray-300 bg-white"
              }`}
            >
              {isSelected && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {(node.label as string) ?? ""}
            </span>
          </div>
        </div>
        <h4 className="text-base font-semibold text-gray-900 mb-2 tracking-tight">
          {node.title}
        </h4>
        <p className="text-sm text-gray-700 font-normal antialiased opacity-100 leading-relaxed">
          {(node.summary as string) ?? ""}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`${getBgClass()} rounded-lg border-2 p-5 cursor-pointer transition-all relative ${
        isSelected
          ? `${getBorderClass()} shadow-md`
          : `${getBorderClass()} hover:bg-gray-50`
      }`}
      onClick={onToggle}
    >
      {/* 추천 뱃지 */}
      {isRecommended && (
        <div className="absolute -top-2 -right-2 z-10">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
            ⭐ 추천
          </span>
        </div>
      )}

      {/* 헤더 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
              isSelected
                ? "bg-blue-600 border-blue-600"
                : "border-gray-300 bg-white"
            }`}
          >
            {isSelected && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
          <span className="text-sm font-semibold text-gray-900">
            {(node.label as string) ?? ""}
          </span>
        </div>
        {hasChildren && onRegenerate && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRegenerate();
            }}
            className="text-xs text-gray-700 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-50 font-normal antialiased opacity-100"
            aria-label="재생성"
          >
            재생성
          </button>
        )}
      </div>

      {/* 제목 */}
      <h4 className="text-base font-semibold text-gray-900 mb-3 tracking-tight">
        {node.title}
      </h4>

      {/* 요약 모드 */}
      <div className="space-y-3">
        {/* 난이도/기간 기준 안내 */}
        <div className="bg-gray-50 border border-gray-200 rounded-md p-2 text-xs">
          <p className="text-gray-700 font-medium mb-1">📊 난이도/기간 기준</p>
          <p className="text-gray-600 leading-relaxed">
            난이도는 포함된 기능의 복잡도를, 기간은 1명 개발자 풀타임 기준 예상 기간을 나타냅니다. 배지에 마우스를 올리면 자세한 기준을 확인할 수 있습니다.
          </p>
        </div>

        {/* Status Badges */}
        <div className="flex gap-2 flex-wrap">
          <BadgeWithTooltip
            tooltipText={getDifficultyTooltip(spec.difficulty)}
            className={`text-xs px-2 py-1 rounded font-medium cursor-help ${getDifficultyColor(spec.difficulty)}`}
            ariaLabel={`난이도: ${spec.difficulty}. 자세한 기준을 보려면 클릭하세요.`}
          >
            {spec.difficulty}
          </BadgeWithTooltip>
          <BadgeWithTooltip
            tooltipText={getDurationTooltip(spec.estimatedDuration)}
            className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800 font-medium cursor-help"
            ariaLabel={`예상 기간: ${spec.estimatedDuration}. 자세한 기준을 보려면 클릭하세요.`}
          >
            {spec.estimatedDuration}
          </BadgeWithTooltip>
        </div>

        {/* Value Proposition */}
        {spec.valueProposition && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-2.5">
            <p className="text-xs font-semibold text-blue-900 mb-1">핵심 가치</p>
            <p className="text-sm font-medium text-blue-800">{spec.valueProposition}</p>
          </div>
        )}

        {/* Context Tags */}
        {spec.contextTags && spec.contextTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {spec.contextTags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full border border-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Top 3 Features */}
        {spec.topFeatures && spec.topFeatures.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              핵심 기능
            </p>
            <ul className="space-y-1">
              {spec.topFeatures.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="flex items-start text-sm text-gray-700">
                  <span className="text-green-600 mr-1.5 font-bold">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* One-line Risk */}
        {spec.oneLineRisk && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-2">
            <p className="text-xs font-semibold text-amber-900 mb-0.5">⚠️ 제약 사항</p>
            <p className="text-xs text-amber-800">{spec.oneLineRisk}</p>
          </div>
        )}

        {/* 상세 보기 토글 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="w-full text-xs text-gray-600 hover:text-gray-900 py-1.5 flex items-center justify-center gap-1 transition-colors"
        >
          <span>{isExpanded ? "간략히 보기" : "상세 보기"}</span>
          <svg
            className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* 상세 모드 (AnimatePresence) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
              {/* 핵심 사용자 */}
              <div>
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  핵심 사용자
                </p>
                <p className="text-xs text-gray-700 font-normal leading-relaxed">
                  {spec.targetUser}
                </p>
              </div>

              {/* 핵심 화면 */}
              <div>
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  핵심 화면
                </p>
                <ul className="text-xs text-gray-700 space-y-0.5">
                  {spec.screens.map((screen, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-gray-600 mr-1">•</span>
                      <span>{screen}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 핵심 기능 (전체) */}
              <div>
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  전체 기능
                </p>
                <ul className="text-xs text-gray-700 space-y-0.5">
                  {spec.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-gray-600 mr-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 개발자 모드에서만 표시 */}
              {isDeveloperMode && (
                <>
                  {/* 데이터 엔티티 */}
                  <div>
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      데이터 엔티티
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {spec.entities.map((entity, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded font-mono"
                        >
                          {entity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* API */}
                  <div>
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      API 엔드포인트
                    </p>
                    <ul className="text-xs text-gray-700 space-y-0.5 font-mono">
                      {spec.apis.map((api, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-gray-400 mr-1">→</span>
                          <span>{api}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 아키텍처 구성요소 */}
                  <div>
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      아키텍처 구성요소
                    </p>
                    <ul className="text-xs text-gray-700 space-y-0.5">
                      {spec.architecture.map((arch, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-gray-600 mr-1">•</span>
                          <span>{arch}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

