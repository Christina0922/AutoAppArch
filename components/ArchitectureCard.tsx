"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const t = useTranslations("architectureCard");
  const tIdeaTree = useTranslations("ideaTree");
  const tDifficulty = useTranslations("difficulty");
  const [isExpanded, setIsExpanded] = useState(false);
  const spec = node.spec as ImplementationSpec | undefined;
  const hasSpec = !!spec;

  // 개발 모드에서 /en 경로일 때 한글 감지 가드
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && locale === "en" && pathname?.startsWith("/en")) {
      const checkKorean = () => {
        const cardElement = document.querySelector(`[data-card-id="${node.id}"]`);
        if (!cardElement) return;
        
        const textContent = cardElement.textContent || "";
        const koreanRegex = /[가-힣]/;
        if (koreanRegex.test(textContent)) {
          const koreanMatches = textContent.match(/[가-힣]+/g);
          console.error(
            `[한글 감지 가드] /en 경로에서 한글이 발견되었습니다!`,
            `카드 ID: ${node.id}`,
            `발견된 한글: ${koreanMatches?.slice(0, 5).join(", ")}`,
            `카드 요소:`,
            cardElement
          );
          // 개발 모드에서는 에러를 throw하지 않고 경고만 출력
        }
      };
      
      // 렌더링 후 한 번 체크
      const timeoutId = setTimeout(checkKorean, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [locale, pathname, node.id, isExpanded]);

  // 난이도 번역 (번역 키 사용)
  const getTranslatedDifficulty = (difficulty?: string): string => {
    if (!difficulty) return "";
    
    // 한글 난이도를 영어로 변환 후 번역 키 사용
    let difficultyKey: "beginner" | "intermediate" | "advanced" | null = null;
    if (difficulty === "초급" || difficulty === "Beginner") {
      difficultyKey = "beginner";
    } else if (difficulty === "중급" || difficulty === "Intermediate") {
      difficultyKey = "intermediate";
    } else if (difficulty === "상급" || difficulty === "Advanced") {
      difficultyKey = "advanced";
    }
    
    // 번역 키가 있으면 사용, 없으면 원본 반환
    if (difficultyKey) {
      return tDifficulty(difficultyKey);
    }
    
    return difficulty;
  };

  // 라벨 번역 (한글 라벨을 영어로 변환)
  const getTranslatedLabel = (label?: string): string => {
    if (!label) return "";
    if (locale === "en") {
      // A안, B안 등을 Option A, Option B로 변환
      if (label === "A안") return "Option A";
      if (label === "B안") return "Option B";
      if (label === "C안") return "Option C";
      if (label === "D안") return "Option D";
      if (label === "E안") return "Option E";
      if (label === "1안") return "Option 1";
      if (label === "2안") return "Option 2";
      if (label === "3안") return "Option 3";
      if (label === "4안") return "Option 4";
      if (label === "5안") return "Option 5";
      if (label === "6안") return "Option 6";
      if (label === "7안") return "Option 7";
      if (label.startsWith("첫번째 안")) return "1st Option";
      if (label.startsWith("두번째 안")) return "2nd Option";
      if (label.startsWith("세번째 안")) return "3rd Option";
      if (label.startsWith("네번째 안")) return "4th Option";
      if (label.startsWith("다섯번째 안")) return "5th Option";
      if (label.startsWith("방안 1")) return "Approach 1";
      if (label.startsWith("방안 2")) return "Approach 2";
      if (label.startsWith("방안 3")) return "Approach 3";
      if (label.startsWith("방안 4")) return "Approach 4";
      if (label.startsWith("방안 5")) return "Approach 5";
    }
    return label;
  };

  // 한글 텍스트를 영어로 변환하는 맵핑
  const translateText = (text: string): string => {
    if (locale !== "en") return text;
    
    // 한글이 포함되어 있지 않으면 그대로 반환
    if (!/[가-힣]/.test(text)) return text;
    
    // valueProposition 변환
    if (text === "빠른 시장 진입") return "Quick market entry";
    if (text === "확장 성장 버전") return "Scalable growth version";
    if (text === "운영 비용 절감") return "Operating cost reduction";
    if (text === "개인화 경험 제공") return "Personalized experience";
    if (text === "엔터프라이즈 운영 준비") return "Enterprise operations ready";
    
    // 제목 패턴 변환 (예: "Option 5 기본 MVP 버전" → "Option 5 Basic MVP Version")
    if (text.includes(" 기본 MVP 버전")) return text.replace(" 기본 MVP 버전", " Basic MVP Version");
    if (text.includes(" 확장 성장 버전")) return text.replace(" 확장 성장 버전", " Extended Growth Version");
    if (text.includes(" 최적화 고급 버전")) return text.replace(" 최적화 고급 버전", " Optimized Advanced Version");
    if (text.includes(" 차별화 고급 버전")) return text.replace(" 차별화 고급 버전", " Differentiated Advanced Version");
    if (text.includes(" 운영 고급 버전")) return text.replace(" 운영 고급 버전", " Operations Advanced Version");
    if (text.includes(" MVP 버전")) return text.replace(" MVP 버전", " MVP Version");
    if (text.includes(" 성장 버전")) return text.replace(" 성장 버전", " Growth Version");
    if (text.includes(" 고급 버전")) return text.replace(" 고급 버전", " Advanced Version");
    if (text.includes(" 기본 ")) return text.replace(" 기본 ", " Basic ");
    if (text.includes(" 확장 ")) return text.replace(" 확장 ", " Extended ");
    if (text.includes(" 최적화 ")) return text.replace(" 최적화 ", " Optimized ");
    if (text.includes(" 차별화 ")) return text.replace(" 차별화 ", " Differentiated ");
    if (text.includes(" 운영 ")) return text.replace(" 운영 ", " Operations ");
    if (text.endsWith(" 버전")) return text.replace(" 버전", " Version");
    
    // contextTags 변환
    if (text === "1인 창업자용") return "For solo founders";
    if (text === "MVP 단계") return "MVP stage";
    if (text === "초기 프로토타입") return "Initial prototype";
    if (text === "SaaS 초기모델") return "Early SaaS model";
    if (text === "사용자 유지율 중시") return "User retention focus";
    if (text === "기능 확장 준비") return "Feature expansion ready";
    if (text === "대용량 데이터") return "Large data volume";
    if (text === "성능 최적화") return "Performance optimization";
    if (text === "비용 효율") return "Cost efficiency";
    if (text === "전문가용") return "For experts";
    if (text === "AI/ML 활용") return "AI/ML utilization";
    if (text === "고급 기능") return "Advanced features";
    if (text === "팀 협업") return "Team collaboration";
    if (text === "조직 관리") return "Organization management";
    if (text === "보안 강화") return "Security enhanced";
    
    // architecture 변환
    if (text === "Redis (캐싱)") return "Redis (caching)";
    if (text === "CloudWatch (모니터링)") return "CloudWatch (monitoring)";
    if (text === "ML 모듈 (추천)") return "ML module (recommendations)";
    if (text === "규칙 엔진 서버") return "Rule engine server";
    if (text === "관리자 패널") return "Admin panel";
    if (text === "백업 스토리지 (S3)") return "Backup storage (S3)";
    if (text.includes("(캐싱)")) return text.replace("(캐싱)", "(caching)");
    if (text.includes("(모니터링)")) return text.replace("(모니터링)", "(monitoring)");
    if (text.includes("(추천)")) return text.replace("(추천)", "(recommendations)");
    
    // oneLineRisk 변환
    if (text === "초기 서버 비용 발생 가능") return "Initial server costs may occur";
    if (text === "데이터 증가 시 성능 최적화 필요") return "Performance optimization needed as data grows";
    if (text === "인프라 구축 초기 비용 증가") return "Initial infrastructure setup cost increase";
    if (text === "ML 모델 학습 및 유지보수 비용 발생") return "ML model training and maintenance costs";
    if (text === "복잡한 권한 시스템 구현 및 관리 부담") return "Complex permission system implementation and management burden";
    
    // 난이도 변환
    if (text === "초급") return "Beginner";
    if (text === "중급") return "Intermediate";
    if (text === "상급") return "Advanced";
    
    // 기간 변환
    if (text === "1~2주") return "1~2 weeks";
    if (text === "3~4주") return "3~4 weeks";
    if (text === "4~6주") return "4~6 weeks";
    if (text === "5~8주") return "5~8 weeks";
    if (text === "6~10주") return "6~10 weeks";
    
    // 키워드 기반 동적 텍스트 변환 (예: "영어 로그 추가" → "Add English log")
    if (text.includes("로그 추가")) {
      const keyword = text.replace(" 로그 추가", "").replace("로그 추가", "");
      return keyword ? `Add ${keyword} log` : "Add log";
    }
    if (text.includes("목록 조회")) {
      const keyword = text.replace(" 목록 조회", "").replace("목록 조회", "");
      return keyword ? `View ${keyword} list` : "View list";
    }
    if (text.includes("기본 통계")) {
      const keyword = text.replace(" 기본 통계", "").replace("기본 통계", "");
      return keyword ? `${keyword} basic statistics` : "Basic statistics";
    }
    if (text.includes("검색 및 필터")) {
      const keyword = text.replace(" 검색 및 필터", "").replace("검색 및 필터", "");
      return keyword ? `${keyword} search and filter` : "Search and filter";
    }
    if (text.includes("태그 관리")) {
      const keyword = text.replace(" 태그 관리", "").replace("태그 관리", "");
      return keyword ? `${keyword} tag management` : "Tag management";
    }
    if (text.includes("통계 (캐싱)")) {
      const keyword = text.replace(" 통계 (캐싱)", "").replace("통계 (캐싱)", "");
      return keyword ? `${keyword} statistics (cached)` : "Statistics (cached)";
    }
    if (text.includes("추천 알고리즘")) {
      const keyword = text.replace(" 추천 알고리즘", "").replace("추천 알고리즘", "");
      return keyword ? `${keyword} recommendation algorithm` : "Recommendation algorithm";
    }
    if (text.includes("알림 설정")) {
      const keyword = text.replace(" 알림 설정", "").replace("알림 설정", "");
      return keyword ? `${keyword} notification settings` : "Notification settings";
    }
    if (text.includes("목표 관리")) {
      const keyword = text.replace(" 목표 관리", "").replace("목표 관리", "");
      return keyword ? `${keyword} goal management` : "Goal management";
    }
    if (text.includes("개인화 설정")) {
      const keyword = text.replace(" 개인화 설정", "").replace("개인화 설정", "");
      return keyword ? `${keyword} personalization settings` : "Personalization settings";
    }
    if (text.includes("추천")) {
      const keyword = text.replace(" 추천", "").replace("추천", "");
      return keyword ? `${keyword} recommendations` : "Recommendations";
    }
    if (text === "목표 설정 및 추적") return "Goal setting and tracking";
    if (text === "배치 데이터 처리") return "Batch data processing";
    if (text === "성능 모니터링") return "Performance monitoring";
    if (text === "개인화 규칙 엔진") return "Personalization rule engine";
    if (text === "맞춤형 대시보드") return "Customized dashboard";
    if (text === "사용자 권한 관리") return "User permission management";
    if (text === "데이터 백업 및 복원") return "Data backup and recovery";
    if (text === "감사 로그") return "Audit logs";
    if (text === "관리자 대시보드") return "Admin dashboard";
    if (text === "권한 관리") return "Permission management";
    if (text.includes("를 처음 시작하는 초보 사용자")) {
      const keyword = text.replace("를 처음 시작하는 초보 사용자", "");
      return `Beginner users starting with ${keyword}`;
    }
    if (text.includes("를 꾸준히 관리하려는 활성 사용자")) {
      const keyword = text.replace("를 꾸준히 관리하려는 활성 사용자", "");
      return `Active users who consistently manage ${keyword}`;
    }
    if (text.includes("데이터가 많은 고급 사용자")) {
      const keyword = text.replace(" 데이터가 많은 고급 사용자", "").replace("데이터가 많은 고급 사용자", "");
      return `Advanced users with large amounts of ${keyword} data`;
    }
    if (text.includes("에 개인화된 경험을 원하는 사용자")) {
      const keyword = text.replace("에 개인화된 경험을 원하는 사용자", "");
      return `Users seeking personalized experience with ${keyword}`;
    }
    if (text.includes("를 팀/조직 단위로 관리하는 사용자")) {
      const keyword = text.replace("를 팀/조직 단위로 관리하는 사용자", "");
      return `Users managing ${keyword} at team/organization level`;
    }
    
    // 추가 패턴: "사용자 프로필", "기본 설정" 등
    if (text === "사용자 프로필") return "User profile";
    if (text === "기본 설정") return "Basic settings";
    if (text === "페이지네이션") return "Pagination";
    
    // 한글이 여전히 남아있으면 일반적인 변환 시도
    let translated = text;
    
    // 일반적인 한글 단어 변환
    const wordMap: Record<string, string> = {
      "사용자": "User",
      "프로필": "Profile",
      "기본": "Basic",
      "설정": "Settings",
      "관리": "Management",
      "대시보드": "Dashboard",
      "데이터": "Data",
      "백업": "Backup",
      "복원": "Recovery",
      "로그": "Log",
      "목록": "List",
      "조회": "View",
      "통계": "Statistics",
      "검색": "Search",
      "필터": "Filter",
      "태그": "Tag",
      "목표": "Goal",
      "추적": "Tracking",
      "알림": "Notification",
      "추천": "Recommendation",
      "알고리즘": "Algorithm",
      "개인화": "Personalization",
      "규칙": "Rule",
      "엔진": "Engine",
      "맞춤형": "Customized",
      "권한": "Permission",
      "감사": "Audit",
      "성능": "Performance",
      "모니터링": "Monitoring",
      "배치": "Batch",
      "처리": "Processing",
      "캐싱": "Caching",
      "캐시": "Cache",
    };
    
    // 단어별로 변환 시도
    for (const [ko, en] of Object.entries(wordMap)) {
      translated = translated.replace(new RegExp(ko, "g"), en);
    }
    
    // 여전히 한글이 남아있으면 경고 출력 (개발 모드)
    if (/[가-힣]/.test(translated)) {
      console.warn(`[translateText] 한글 텍스트가 남아있습니다: "${text}" → "${translated}"`);
    }
    
    return translated;
  };

  // 개발 모드에서 /en 경로일 때 한글 감지 가드
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && locale === "en" && pathname?.startsWith("/en")) {
      const checkKorean = () => {
        const cardElement = document.querySelector(`[data-card-id="${node.id}"]`);
        if (!cardElement) return;
        
        const textContent = cardElement.textContent || "";
        const koreanRegex = /[가-힣]/;
        if (koreanRegex.test(textContent)) {
          const koreanMatches = textContent.match(/[가-힣]+/g);
          console.error(
            `[한글 감지 가드] /en 경로에서 한글이 발견되었습니다!`,
            `카드 ID: ${node.id}`,
            `발견된 한글: ${koreanMatches?.slice(0, 5).join(", ")}`,
            `카드 요소:`,
            cardElement
          );
          // 개발 모드에서는 에러를 throw하지 않고 경고만 출력
        }
      };
      
      // 렌더링 후 한 번 체크
      const timeoutId = setTimeout(checkKorean, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [locale, pathname, node.id, isExpanded]);

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
      data-card-id={node.id}
      className={`${getBgClass()} rounded-lg border-2 p-6 cursor-pointer transition-all ${
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
              {getTranslatedLabel((node.label as string) ?? "")}
            </span>
          </div>
        </div>
        <h4 className="text-base font-semibold text-gray-900 mb-2 tracking-tight">
          {translateText(node.title)}
        </h4>
        <p className="text-sm text-gray-700 leading-relaxed">
          {translateText((node.summary as string) ?? "")}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`${getBgClass()} rounded-lg border-2 p-6 transition-all relative flex flex-col gap-3 h-full ${
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
            {getTranslatedLabel((node.label as string) ?? "")}
          </span>
          {/* 추천 배지 - 제목 옆에 배치 */}
          {isRecommended && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-white mr-2">
              {tIdeaTree("recommended")}
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
            aria-label={tIdeaTree("regenerateAria")}
          >
            {tIdeaTree("regenerate")}
          </button>
        )}
      </div>

      {/* 제목 */}
      <h4 className="text-base font-semibold text-gray-900 tracking-tight">
        {translateText(node.title)}
      </h4>

      {/* 요약 모드 (5줄 구조) */}
      <div className="flex flex-col gap-3">
        {/* 1. 한 줄 가치 요약 */}
        {spec.valueProposition && (
          <p className="text-sm text-gray-900 leading-relaxed">{translateText(spec.valueProposition)}</p>
        )}

        {/* 2. 적합한 상황 태그 2~3개 */}
        {spec.contextTags && spec.contextTags.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {spec.contextTags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full border border-gray-200 w-fit"
              >
                {translateText(tag)}
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
            {translateText(spec.estimatedDuration)}
          </span>
        </div>

        {/* 4. 포함 기능 Top3 */}
        {spec.topFeatures && spec.topFeatures.length > 0 && (
          <div>
            <ul className="space-y-1">
              {spec.topFeatures.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="flex items-start text-sm text-gray-700">
                  <span className="text-green-600 mr-1.5 font-bold">✓</span>
                  <span className="leading-relaxed">{translateText(feature)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 5. 주의/리스크 1개 */}
        {spec.oneLineRisk && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-2 min-h-[60px]">
            <p className="text-xs font-semibold text-amber-900 mb-0.5">⚠️ {t("warning")}</p>
            <p className="text-xs text-amber-800 leading-relaxed">{translateText(spec.oneLineRisk)}</p>
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
                  {t("targetUser")}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {translateText(spec.targetUser)}
                </p>
              </div>

              {/* 핵심 화면 */}
              <div>
                <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1.5">
                  {t("coreScreens")}
                </p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {spec.screens.map((screen, idx) => (
                    <li key={idx} className="flex items-start leading-relaxed">
                      <span className="text-gray-600 mr-2">•</span>
                      <span>{translateText(screen)}</span>
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
                      <span>{translateText(feature)}</span>
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
                          <span>{translateText(arch)}</span>
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

