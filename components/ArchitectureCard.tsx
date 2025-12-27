"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Node, ImplementationSpec } from "@/lib/types";

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
  const locale = useLocale() as "ko" | "en";
  const t = useTranslations("architectureCard");
  const tDifficulty = useTranslations("difficulty");
  const [isExpanded, setIsExpanded] = useState(false);
  const spec = node.spec as ImplementationSpec | undefined;
  const hasSpec = !!spec;

  // 난이도 번역 (한글 difficulty를 영어로 변환)
  const getTranslatedDifficulty = (difficulty?: string): string => {
    if (!difficulty) return "";
    if (locale === "en") {
      if (difficulty === "초급") return "Beginner";
      if (difficulty === "중급") return "Intermediate";
      if (difficulty === "상급") return "Advanced";
    }
    return difficulty;
  };

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
    if (!difficulty) return "bg-gray-100 text-gray-800";
    // 한국어와 영어 모두 지원
    if (difficulty === "초급" || difficulty === "Beginner") return "bg-green-100 text-green-800";
    if (difficulty === "중급" || difficulty === "Intermediate") return "bg-yellow-100 text-yellow-800";
    if (difficulty === "상급" || difficulty === "Advanced") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
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
        <p className="text-sm text-gray-700 leading-relaxed">
          {(node.summary as string) ?? ""}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`${getBgClass()} rounded-lg border-2 p-5 transition-all relative flex flex-col gap-3 h-full ${
        isSelected
          ? `${getBorderClass()} shadow-md`
          : `${getBorderClass()} hover:border-gray-300`
      }`}
      onClick={onToggle}
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {/* 체크박스 */}
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
              isSelected
                ? "bg-green-600 border-green-600"
                : "border-gray-300 bg-white"
            }`}
            role="checkbox"
            aria-checked={isSelected}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onToggle();
              }
            }}
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
          {/* 추천 배지 - 제목 옆에 배치 */}
          {isRecommended && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
              ⭐ 추천
            </span>
          )}
        </div>
        {hasChildren && onRegenerate && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRegenerate();
            }}
            className="text-xs text-gray-700 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-50"
            aria-label="재생성"
          >
            재생성
          </button>
        )}
      </div>

      {/* 제목 */}
      <h4 className="text-base font-semibold text-gray-900 tracking-tight">
        {node.title}
      </h4>

      {/* 요약 모드 (5줄 구조) */}
      <div className="flex flex-col gap-3">
        {/* 1. 한 줄 가치 요약 */}
        {spec.valueProposition && (
          <p className="text-sm text-gray-900 leading-relaxed">{spec.valueProposition}</p>
        )}

        {/* 2. 적합한 상황 태그 2~3개 */}
        {spec.contextTags && spec.contextTags.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {spec.contextTags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full border border-gray-200 w-fit"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 3. 난이도/기간 배지 */}
        <div className="flex gap-2 flex-wrap">
          <span className={`text-xs px-2 py-1 rounded font-medium ${getDifficultyColor(spec.difficulty)}`}>
            {getTranslatedDifficulty(spec.difficulty)}
          </span>
          <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800 font-medium">
            {spec.estimatedDuration}
          </span>
        </div>

        {/* 4. 포함 기능 Top3 */}
        {spec.topFeatures && spec.topFeatures.length > 0 && (
          <div>
            <ul className="space-y-1">
              {spec.topFeatures.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="flex items-start text-sm text-gray-700">
                  <span className="text-green-600 mr-1.5 font-bold">✓</span>
                  <span className="leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 5. 주의/리스크 1개 */}
        {spec.oneLineRisk && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-2 min-h-[60px]">
            <p className="text-xs font-semibold text-amber-900 mb-0.5">⚠️ {t("warning")}</p>
            <p className="text-xs text-amber-800 leading-relaxed">{spec.oneLineRisk}</p>
          </div>
        )}

        {/* 자세히 보기 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="w-full text-xs text-gray-700 hover:text-gray-900 py-2 flex items-center justify-center gap-1 transition-colors border-t border-gray-200 mt-auto"
        >
          <span>{isExpanded ? t("hideDetails") : t("viewDetails")}</span>
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
            <div className="pt-3 space-y-3 border-t border-gray-200">
              {/* 핵심 사용자 */}
              <div>
                <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1.5">
                  핵심 사용자
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {spec.targetUser}
                </p>
              </div>

              {/* 핵심 화면 */}
              <div>
                <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1.5">
                  핵심 화면
                </p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {spec.screens.map((screen, idx) => (
                    <li key={idx} className="flex items-start leading-relaxed">
                      <span className="text-gray-600 mr-2">•</span>
                      <span>{screen}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 핵심 기능 (전체) */}
              <div>
                <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1.5">
                  {t("allFeatures")}
                </p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {spec.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start leading-relaxed">
                      <span className="text-gray-600 mr-2">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 개발자 모드에서만 표시: 데이터 엔티티/API/아키텍처 */}
              {isDeveloperMode && (
                <>
                  {/* 데이터 엔티티 */}
                  <div>
                    <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1.5">
                      {t("dataEntities")}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {spec.entities.map((entity, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded font-mono"
                        >
                          {entity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* API */}
                  <div>
                    <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1.5">
                      {t("apiEndpoints")}
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1 font-mono">
                      {spec.apis.map((api, idx) => (
                        <li key={idx} className="flex items-start leading-relaxed">
                          <span className="text-gray-600 mr-2">→</span>
                          <span>{api}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 아키텍처 구성요소 */}
                  <div>
                    <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1.5">
                      {t("architectureComponents")}
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {spec.architecture.map((arch, idx) => (
                        <li key={idx} className="flex items-start leading-relaxed">
                          <span className="text-gray-600 mr-2">•</span>
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

