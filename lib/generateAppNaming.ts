import { AppNaming, AppNamingCandidate, AppNamingPreview } from "./types";

export function generateAppNaming(
  keywords: string[],
  selectedType: "app" | "web",
  finalCandidates: Array<{ title: string; summary: string }>
): AppNaming {
  const keywordStr = keywords.join(" ");
  const isApp = selectedType === "app";
  const appTypeStr = isApp ? "앱" : "서비스";
  
  // 최종 선택된 안의 컨셉 추출
  const concept = finalCandidates[0]?.title || keywordStr;
  const summary = finalCandidates[0]?.summary || "";
  
  // 컨셉에서 핵심 키워드 추출 (예: "영어 학습 앱" -> "영어", "학습")
  const conceptKeywords = concept.split(/[\s,]+/).filter(k => k.length > 0);
  const mainKeyword = keywords[0] || conceptKeywords[0] || "";

  // 직관형 이름 (기능이 바로 보이는 이름)
  const literalNames: AppNamingCandidate[] = [
    {
      name: `${mainKeyword}${isApp ? "앱" : ""}`,
      reason: `${mainKeyword}를 중심으로 한 ${appTypeStr}의 기능을 직관적으로 표현`,
      tagline: `${mainKeyword}를 쉽고 빠르게`,
    },
    {
      name: `${mainKeyword}헬퍼`,
      reason: `${mainKeyword} 관련 활동을 도와주는 ${appTypeStr}`,
      tagline: `${mainKeyword}의 든든한 파트너`,
    },
    {
      name: `${mainKeyword}매니저`,
      reason: `${mainKeyword}를 체계적으로 관리하는 ${appTypeStr}`,
      tagline: `${mainKeyword} 관리의 시작`,
    },
    {
      name: `${mainKeyword}트래커`,
      reason: `${mainKeyword} 관련 활동을 추적하고 기록하는 ${appTypeStr}`,
      tagline: `${mainKeyword}의 모든 순간을 기록`,
    },
    {
      name: `${mainKeyword}가이드`,
      reason: `${mainKeyword}에 대한 가이드와 추천을 제공하는 ${appTypeStr}`,
      tagline: `${mainKeyword}를 위한 맞춤 가이드`,
    },
  ];

  // 브랜딩형 이름 (브랜드 느낌)
  const brandNames: AppNamingCandidate[] = [
    {
      name: `${mainKeyword.charAt(0).toUpperCase()}${mainKeyword.slice(1)}Hub`,
      reason: `${mainKeyword} 관련 모든 것을 모은 허브 ${appTypeStr}`,
      tagline: `${mainKeyword}의 중심`,
    },
    {
      name: `${mainKeyword.charAt(0).toUpperCase()}${mainKeyword.slice(1)}Space`,
      reason: `${mainKeyword}를 위한 전용 공간을 제공하는 ${appTypeStr}`,
      tagline: `${mainKeyword}만의 특별한 공간`,
    },
    {
      name: `${mainKeyword.charAt(0).toUpperCase()}${mainKeyword.slice(1)}Lab`,
      reason: `${mainKeyword}를 실험하고 탐구하는 ${appTypeStr}`,
      tagline: `${mainKeyword}의 실험실`,
    },
    {
      name: `${mainKeyword.charAt(0).toUpperCase()}${mainKeyword.slice(1)}Studio`,
      reason: `${mainKeyword}를 창작하고 표현하는 ${appTypeStr}`,
      tagline: `${mainKeyword}를 만드는 스튜디오`,
    },
    {
      name: `${mainKeyword.charAt(0).toUpperCase()}${mainKeyword.slice(1)}Zone`,
      reason: `${mainKeyword}에 집중할 수 있는 영역을 제공하는 ${appTypeStr}`,
      tagline: `${mainKeyword}에 집중하는 공간`,
    },
  ];

  // 짧은형 이름 (2~4글자 중심)
  const shortNames: AppNamingCandidate[] = [
    {
      name: mainKeyword.length >= 2 ? `${mainKeyword.slice(0, 2)}${isApp ? "앱" : ""}` : `${mainKeyword}${isApp ? "앱" : ""}`,
      reason: `${mainKeyword}의 핵심을 간결하게 표현`,
      tagline: `${mainKeyword}를 간단하게`,
    },
    {
      name: mainKeyword.length >= 2 ? `${mainKeyword.charAt(0)}${mainKeyword.charAt(1)}${isApp ? "앱" : ""}` : `${mainKeyword}${isApp ? "앱" : ""}`,
      reason: `${mainKeyword}의 첫 글자를 활용한 짧고 기억하기 쉬운 이름`,
      tagline: `${mainKeyword}의 첫걸음`,
    },
    {
      name: mainKeyword.length >= 3 ? `${mainKeyword.slice(0, 3)}` : mainKeyword,
      reason: `${mainKeyword}의 핵심을 3글자로 압축`,
      tagline: `${mainKeyword}의 본질`,
    },
    {
      name: `${mainKeyword.charAt(0)}${isApp ? "앱" : "서비스"}`,
      reason: `${mainKeyword}의 첫 글자와 ${appTypeStr}을 결합한 간결한 이름`,
      tagline: `${mainKeyword}의 시작`,
    },
  ];

  // 미리보기용 (무료 사용자에게 보여줄 1개)
  const preview: AppNamingPreview = {
    name: literalNames[0].name,
    tagline: literalNames[0].tagline,
    reason: literalNames[0].reason,
  };

  return {
    preview,
    premium: {
      literal: literalNames,
      brand: brandNames,
      short: shortNames,
    },
  };
}

