import { AppNaming, AppNamingCandidate, AppNamingPreview, AppType } from "./types";
import { normalizeKey } from "./normalizeKey";

function cleanTitle(raw: string) {
  return (raw ?? "").trim();
}

function isBadTitle(title: string) {
  // 의미 없는/너무 짧은 제목 차단: "책." 같은 케이스 포함
  const t = title.trim();
  if (!t) return true;
  // 한글/영문/숫자만 남겼을 때 2글자 미만이면 제거
  const normalized = normalizeKey(t);
  if (normalized.length < 2) return true;
  return false;
}

function dedupeByTitle<T extends { name?: string; title?: string; label?: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];

  for (const it of items) {
    const title = cleanTitle((it.name ?? it.title ?? it.label ?? "") as string);
    if (isBadTitle(title)) continue;

    const key = normalizeKey(title);
    if (!key) continue;
    if (seen.has(key)) continue;

    seen.add(key);
    out.push(it);
  }

  return out;
}

export function generateAppNaming(
  keywords: string[],
  selectedType: AppType,
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

  // 직관형 이름 생성 함수
  const generateLiteralNames = (): AppNamingCandidate[] => {
    const baseNames: AppNamingCandidate[] = [
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
      {
        name: `${mainKeyword}마스터`,
        reason: `${mainKeyword}를 완벽하게 다루는 ${appTypeStr}`,
        tagline: `${mainKeyword}의 전문가가 되세요`,
      },
      {
        name: `${mainKeyword}파인더`,
        reason: `${mainKeyword}를 쉽게 찾을 수 있는 ${appTypeStr}`,
        tagline: `${mainKeyword}를 한눈에`,
      },
      {
        name: `${mainKeyword}노트`,
        reason: `${mainKeyword}를 기록하고 관리하는 ${appTypeStr}`,
        tagline: `${mainKeyword}의 모든 것을 기록`,
      },
      {
        name: `${mainKeyword}플러스`,
        reason: `${mainKeyword}에 더 많은 기능을 더한 ${appTypeStr}`,
        tagline: `${mainKeyword}의 업그레이드`,
      },
      {
        name: `${mainKeyword}스쿨`,
        reason: `${mainKeyword}를 배우고 성장하는 ${appTypeStr}`,
        tagline: `${mainKeyword} 학습의 시작`,
      },
    ];

    const TARGET_COUNT = 5;
    let merged = baseNames;
    
    // 최대 3회까지 재시도하여 목표 개수 채우기
    for (let i = 0; i < 3; i++) {
      const unique = dedupeByTitle(merged);
      if (unique.length >= TARGET_COUNT) {
        return unique.slice(0, TARGET_COUNT);
      }
      
      // 부족한 개수만큼 추가 생성
      const need = TARGET_COUNT - unique.length;
      const more: AppNamingCandidate[] = [];
      const suffixes = ["프로", "에이드", "키퍼", "센터", "스튜디오", "랩", "스페이스", "존"];
      
      for (let j = 0; j < need * 2; j++) {
        const suffix = suffixes[j % suffixes.length];
        more.push({
          name: `${mainKeyword}${suffix}`,
          reason: `${mainKeyword}를 위한 ${suffix} ${appTypeStr}`,
          tagline: `${mainKeyword}의 ${suffix}`,
        });
      }
      
      merged = [...merged, ...more];
    }
    
    const finalUnique = dedupeByTitle(merged);
    return finalUnique.slice(0, TARGET_COUNT);
  };

  const literalNames = generateLiteralNames();

  // 브랜딩형 이름 생성 함수
  const generateBrandNames = (): AppNamingCandidate[] => {
    const baseNames: AppNamingCandidate[] = [
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
      {
        name: `아크${mainKeyword}`,
        reason: `${mainKeyword}를 위한 독특한 브랜드 ${appTypeStr}`,
        tagline: `${mainKeyword}의 새로운 시작`,
      },
      {
        name: `루미${mainKeyword}`,
        reason: `${mainKeyword}를 밝게 만드는 ${appTypeStr}`,
        tagline: `${mainKeyword}의 빛`,
      },
      {
        name: `넥스트${mainKeyword}`,
        reason: `${mainKeyword}의 다음 단계를 제시하는 ${appTypeStr}`,
        tagline: `${mainKeyword}의 미래`,
      },
    ];

    const TARGET_COUNT = 5;
    let merged = baseNames;
    
    for (let i = 0; i < 3; i++) {
      const unique = dedupeByTitle(merged);
      if (unique.length >= TARGET_COUNT) {
        return unique.slice(0, TARGET_COUNT);
      }
      
      const need = TARGET_COUNT - unique.length;
      const more: AppNamingCandidate[] = [];
      const prefixes = ["프라임", "프로", "플러스", "에이스", "스타", "골드", "실버"];
      
      for (let j = 0; j < need * 2; j++) {
        const prefix = prefixes[j % prefixes.length];
        more.push({
          name: `${prefix}${mainKeyword}`,
          reason: `${mainKeyword}를 위한 ${prefix} ${appTypeStr}`,
          tagline: `${mainKeyword}의 ${prefix}`,
        });
      }
      
      merged = [...merged, ...more];
    }
    
    const finalUnique = dedupeByTitle(merged);
    return finalUnique.slice(0, TARGET_COUNT);
  };

  const brandNames = generateBrandNames();

  // 짧은형 이름 생성 함수
  const generateShortNames = (): AppNamingCandidate[] => {
    const baseNames: AppNamingCandidate[] = [
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
      {
        name: `더${mainKeyword.charAt(0)}`,
        reason: `${mainKeyword}의 첫 글자를 활용한 미니멀한 이름`,
        tagline: `${mainKeyword}의 더 나은 선택`,
      },
      {
        name: `${mainKeyword.charAt(0)}${mainKeyword.length >= 2 ? mainKeyword.charAt(1) : ""}${isApp ? "앱" : ""}`,
        reason: `${mainKeyword}의 핵심을 2~3글자로 압축`,
        tagline: `${mainKeyword}의 간결함`,
      },
    ];

    const TARGET_COUNT = 4;
    let merged = baseNames;
    
    for (let i = 0; i < 3; i++) {
      const unique = dedupeByTitle(merged);
      if (unique.length >= TARGET_COUNT) {
        return unique.slice(0, TARGET_COUNT);
      }
      
      const need = TARGET_COUNT - unique.length;
      const more: AppNamingCandidate[] = [];
      const patterns = ["더", "플러스", "프로", "에이스"];
      
      for (let j = 0; j < need * 2; j++) {
        const pattern = patterns[j % patterns.length];
        if (mainKeyword.length >= 1) {
          more.push({
            name: `${pattern}${mainKeyword.charAt(0)}`,
            reason: `${mainKeyword}의 첫 글자를 활용한 짧은 이름`,
            tagline: `${mainKeyword}의 ${pattern}`,
          });
        }
      }
      
      merged = [...merged, ...more];
    }
    
    const finalUnique = dedupeByTitle(merged);
    return finalUnique.slice(0, TARGET_COUNT);
  };

  const shortNames = generateShortNames();

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

