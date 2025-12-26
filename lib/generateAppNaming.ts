import { AppNaming, AppNamingCandidate, AppNamingPreview, AppType } from "./types";
import { normalizeKey } from "./normalizeKey";

// 키워드 의미 매핑: 키워드 → 의미 있는 대체어/관련어
const KEYWORD_SEMANTIC_MAP: Record<string, string[]> = {
  "수학": ["연산", "문제", "풀이", "계산", "문제집", "수학책"],
  "지도": ["로드맵", "코스", "가이드", "커리큘럼", "경로", "길잡이", "학습경로"],
  "학습": ["공부", "교육", "배움", "습득", "이해", "공부법"],
  "공부": ["학습", "교육", "복습", "예습", "공부법", "스터디"],
  "영어": ["언어", "외국어", "회화", "어학", "영어회화"],
  "운동": ["피트니스", "건강", "트레이닝", "웰니스", "헬스"],
  "다이어트": ["건강", "체중", "관리", "웰빙", "헬스"],
  "기록": ["메모", "노트", "일기", "저장", "저장소"],
  "일기": ["기록", "일지", "메모", "추억", "다이어리"],
  "할일": ["일정", "태스크", "업무", "계획", "스케줄"],
  "아이디어": ["발상", "창의", "기획", "컨셉", "아이디어북"],
  "분실물": ["잃어버린", "찾기", "등록", "관리", "보관"],
};

// 키워드로부터 의미 있는 단어들 추출
function getSemanticWords(keyword: string): string[] {
  const normalized = keyword.trim();
  const mapped = KEYWORD_SEMANTIC_MAP[normalized];
  if (mapped) return mapped;
  
  // 매핑이 없으면 원본 키워드 반환
  return [keyword];
}

// 제목 품질 검사
function isBadTitle(title: string): boolean {
  const t = title.trim();
  if (!t) return true;
  
  // 1~2글자 차단
  if (t.length <= 2) return true;
  
  // 자음만 있는 패턴 차단 (예: "ㅇㅇ앱", "ㄱㄴㄷ")
  const hasOnlyConsonants = /^[ㄱ-ㅎ]+$/.test(t);
  if (hasOnlyConsonants) return true;
  
  // 첫글자만 따서 만든 패턴 차단
  // - 단일 글자 + "앱" (예: "영앱")
  // - "더" + 단일 글자 (예: "더영")
  // - 단일 글자 + "프로" (예: "영프로")
  const simpleFirstCharPattern = /^[가-힣]앱$|^더[가-힣]$|^[가-힣]프로?$/;
  if (simpleFirstCharPattern.test(t)) return true;
  
  return false;
}

// 제목 중복/유사도 체크
function isSimilarTitle(title1: string, title2: string): boolean {
  const t1 = normalizeKey(title1);
  const t2 = normalizeKey(title2);
  
  // 정확히 동일
  if (t1 === t2) return true;
  
  return false;
}

// 전역 중복 제거 (모든 타입을 합쳐서 중복 체크)
function dedupeGlobal(allCandidates: AppNamingCandidate[]): AppNamingCandidate[] {
  const seen: string[] = [];
  const out: AppNamingCandidate[] = [];
  
  for (const item of allCandidates) {
    const title = (item.name ?? "").trim();
    if (!title || isBadTitle(title)) continue;
    
    const normalized = normalizeKey(title);
    if (!normalized) continue;
    
    // 정확히 동일한 이름 체크
    const isDuplicate = seen.some(seenTitle => normalizeKey(seenTitle) === normalized);
    if (isDuplicate) continue;
    
    seen.push(title);
    out.push(item);
  }
  
  return out;
}

// 음절 수 계산 (한글 기준, 대략적)
function countSyllables(text: string): number {
  // 한글 음절 수: 한글이 아닌 문자는 무시하고 한글만 카운트
  const hangul = text.match(/[가-힣]/g);
  return hangul ? hangul.length : text.length;
}

export function generateAppNaming(
  keywords: string[],
  selectedType: AppType,
  finalCandidates: Array<{ title: string; summary: string }>
): AppNaming {
  const keywordStr = keywords.join(" ");
  const mainKeyword = keywords[0] || "";
  const secondKeyword = keywords[1] || "";
  
  // 키워드 의미 확장
  const mainSemantic = getSemanticWords(mainKeyword);
  const secondSemantic = secondKeyword ? getSemanticWords(secondKeyword) : [];
  
  // 의미 단어 풀 (주요 키워드 + 의미 확장)
  const semanticPool = [mainKeyword, ...mainSemantic.slice(0, 3), secondKeyword, ...secondSemantic.slice(0, 2)]
    .filter((w, i, arr) => w && arr.indexOf(w) === i); // 중복 제거
  
  // 모든 후보 생성 (전역 중복 체크를 위해)
  const allGenerated: AppNamingCandidate[] = [];
  
  // 직관형 이름 생성 (무엇 하는 앱인지 즉시 알 수 있는)
  const generateIntuitiveNames = (): AppNamingCandidate[] => {
    const candidates: AppNamingCandidate[] = [];
    
    // 패턴 1: 키워드 + 도구/매니저 (다양한 도구 사용)
    const tools = [
      { suffix: "매니저", tagline: `${mainKeyword}를 효율적으로 관리하는 앱`, reason: "관리 기능을 직관적으로 표현", tags: ["관리", "효율"] },
      { suffix: "트래커", tagline: `${mainKeyword}를 추적하고 기록하는 앱`, reason: "추적 기능이 이름에서 바로 드러남", tags: ["추적", "기록"] },
      { suffix: "가이드", tagline: `${mainKeyword} 관련 가이드와 정보를 제공하는 앱`, reason: "안내와 가이드 기능을 강조", tags: ["가이드", "안내"] },
      { suffix: "플래너", tagline: `${mainKeyword} 계획과 일정을 관리하는 앱`, reason: "계획 기능을 명확히 표현", tags: ["계획", "일정"] },
      { suffix: "노트", tagline: `${mainKeyword}를 기록하고 정리하는 앱`, reason: "기록과 정리 기능을 직관적으로 전달", tags: ["기록", "정리"] },
      { suffix: "헬퍼", tagline: `${mainKeyword} 관련 작업을 도와주는 앱`, reason: "도움과 지원 기능을 강조", tags: ["도움", "지원"] },
    ];
    
    for (const tool of tools.slice(0, 5)) {
      const name = `${mainKeyword}${tool.suffix}`;
      if (!isBadTitle(name)) {
        candidates.push({
          name,
          tagline: tool.tagline,
          reason: tool.reason,
          tags: tool.tags,
        });
      }
    }
    
    // 패턴 2: 의미 단어 + 앱 기능 (다양한 표현)
    if (semanticPool.length > 1) {
      const semanticTools = [
        { suffix: "노트", taglineFunc: (s: string) => `${s}를 기록하는 앱`, reason: "기록 기능을 의미 단어로 표현", tags: ["기록", "의미전달"] },
        { suffix: "북", taglineFunc: (s: string) => `${s} 관련 정보를 모은 앱`, reason: "정보 수집 기능을 강조", tags: ["정보", "수집"] },
        { suffix: "랩", taglineFunc: (s: string) => `${s}를 탐구하고 실험하는 앱`, reason: "탐구와 실험의 의미를 담음", tags: ["탐구", "실험"] },
      ];
      
      for (const semantic of semanticPool.slice(1, 3)) {
        if (semantic && semantic !== mainKeyword) {
          for (const semanticTool of semanticTools.slice(0, 2)) {
            const name = `${semantic}${semanticTool.suffix}`;
            if (!isBadTitle(name) && !candidates.some(c => normalizeKey(c.name) === normalizeKey(name))) {
              candidates.push({
                name,
                tagline: semanticTool.taglineFunc(semantic),
                reason: semanticTool.reason,
                tags: semanticTool.tags,
              });
            }
          }
        }
      }
    }
    
    return candidates.filter(c => !isBadTitle(c.name));
  };
  
  // 감성형 이름 생성 (동기/습관/성취)
  const generateEmotionalNames = (): AppNamingCandidate[] => {
    const candidates: AppNamingCandidate[] = [];
    
    // 패턴 1: 성취/동기 관련 (앞에 붙이기)
    const achievementWords = [
      { prefix: "성장", tagline: `${mainKeyword}를 통해 성장하는 앱`, reason: "성장 동기를 자극하는 이름", tags: ["성장", "동기부여"] },
      { prefix: "도전", tagline: `${mainKeyword}에 도전하는 앱`, reason: "도전 정신을 강조", tags: ["도전", "의지"] },
      { prefix: "목표", tagline: `${mainKeyword} 목표를 달성하는 앱`, reason: "목표 달성을 강조", tags: ["목표", "달성"] },
      { prefix: "성취", tagline: `${mainKeyword}를 통해 성취감을 얻는 앱`, reason: "성취감을 자극하는 이름", tags: ["성취", "만족"] },
    ];
    
    for (const word of achievementWords) {
      const name = `${word.prefix}${mainKeyword}`;
      if (!isBadTitle(name) && countSyllables(name) >= 2 && countSyllables(name) <= 4) {
        candidates.push({
          name,
          tagline: word.tagline,
          reason: word.reason,
          tags: word.tags,
        });
      }
    }
    
    // 패턴 2: 습관/일상 관련 (뒤에 붙이기)
    const habitWords = [
      { suffix: "루틴", tagline: `${mainKeyword}를 일상 루틴으로 만드는 앱`, reason: "일상적인 습관 형성 강조", tags: ["루틴", "습관"] },
      { suffix: "일상", tagline: `${mainKeyword}를 일상의 일부로 만드는 앱`, reason: "일상화를 강조하는 이름", tags: ["일상", "생활화"] },
      { suffix: "다이어리", tagline: `${mainKeyword}를 기록하는 일기형 앱`, reason: "일기처럼 기록하는 느낌", tags: ["기록", "일상"] },
    ];
    
    for (const word of habitWords) {
      const name = `${mainKeyword}${word.suffix}`;
      if (!isBadTitle(name) && countSyllables(name) >= 2 && countSyllables(name) <= 4) {
        if (!candidates.some(c => normalizeKey(c.name) === normalizeKey(name))) {
          candidates.push({
            name,
            tagline: word.tagline,
            reason: word.reason,
            tags: word.tags,
          });
        }
      }
    }
    
    return candidates.filter(c => !isBadTitle(c.name));
  };
  
  // 전문형 이름 생성 (신뢰/체계/관리)
  const generateProfessionalNames = (): AppNamingCandidate[] => {
    const candidates: AppNamingCandidate[] = [];
    
    // 패턴 1: 전문성 강조
    const professionalWords = [
      { suffix: "프로", tagline: `${mainKeyword}를 전문적으로 다루는 앱`, reason: "전문성을 강조하는 이름", tags: ["전문성", "신뢰"] },
      { suffix: "마스터", tagline: `${mainKeyword}를 완벽하게 마스터하는 앱`, reason: "완벽한 숙련을 강조", tags: ["숙련", "완벽"] },
      { suffix: "센터", tagline: `${mainKeyword} 관련 모든 것을 모은 허브 앱`, reason: "종합 센터의 느낌", tags: ["종합", "허브"] },
      { suffix: "랩", tagline: `${mainKeyword}를 연구하고 개발하는 앱`, reason: "연구와 개발의 의미", tags: ["연구", "개발"] },
      { suffix: "스튜디오", tagline: `${mainKeyword}를 창작하고 표현하는 앱`, reason: "창작과 표현 기능 강조", tags: ["창작", "표현"] },
    ];
    
    for (const word of professionalWords) {
      const name = `${mainKeyword}${word.suffix}`;
      if (!isBadTitle(name) && countSyllables(name) >= 2 && countSyllables(name) <= 4) {
        candidates.push({
          name,
          tagline: word.tagline,
          reason: word.reason,
          tags: word.tags,
        });
      }
    }
    
    // 패턴 2: 체계/관리 강조
    const systemWords = [
      { suffix: "시스템", tagline: `${mainKeyword}를 체계적으로 관리하는 앱`, reason: "체계적인 관리 시스템 강조", tags: ["체계", "관리"] },
      { suffix: "플랫폼", tagline: `${mainKeyword} 관련 모든 기능을 제공하는 플랫폼 앱`, reason: "플랫폼의 종합성 강조", tags: ["플랫폼", "종합"] },
    ];
    
    for (const word of systemWords) {
      const name = `${mainKeyword}${word.suffix}`;
      if (!isBadTitle(name)) {
        if (!candidates.some(c => normalizeKey(c.name) === normalizeKey(name))) {
          candidates.push({
            name,
            tagline: word.tagline,
            reason: word.reason,
            tags: word.tags,
          });
        }
      }
    }
    
    return candidates.filter(c => !isBadTitle(c.name));
  };
  
  // 캐주얼형 이름 생성 (가볍고 친근)
  const generateCasualNames = (): AppNamingCandidate[] => {
    const candidates: AppNamingCandidate[] = [];
    
    // 패턴 1: 친근한 접미사
    const friendlyWords = [
      { suffix: "친구", tagline: `${mainKeyword}를 함께하는 친구 같은 앱`, reason: "친구처럼 친근한 느낌", tags: ["친근", "편안"] },
      { suffix: "파트너", tagline: `${mainKeyword}를 함께하는 파트너 앱`, reason: "파트너십을 강조", tags: ["협력", "파트너"] },
      { suffix: "버디", tagline: `${mainKeyword}를 함께하는 버디 앱`, reason: "가볍고 친근한 동반자 느낌", tags: ["동반", "친근"] },
    ];
    
    for (const word of friendlyWords) {
      const name = `${mainKeyword}${word.suffix}`;
      if (!isBadTitle(name) && countSyllables(name) >= 2 && countSyllables(name) <= 4) {
        candidates.push({
          name,
          tagline: word.tagline,
          reason: word.reason,
          tags: word.tags,
        });
      }
    }
    
    // 패턴 2: 의미 단어 + 캐주얼 표현
    if (semanticPool.length > 1) {
      const casualExpressions = [
        { suffix: "다이어리", taglineFunc: (s: string) => `${s}를 기록하는 편안한 다이어리 앱`, reason: "일상 기록의 편안함", tags: ["일상", "기록"] },
        { suffix: "박스", taglineFunc: (s: string) => `${s}를 모아두는 박스 앱`, reason: "간단하게 모으는 느낌", tags: ["수집", "간단"] },
      ];
      
      for (const semantic of semanticPool.slice(1, 3)) {
        if (semantic && semantic !== mainKeyword) {
          for (const expr of casualExpressions) {
            const name = `${semantic}${expr.suffix}`;
            if (!isBadTitle(name) && !candidates.some(c => normalizeKey(c.name) === normalizeKey(name))) {
              candidates.push({
                name,
                tagline: expr.taglineFunc(semantic),
                reason: expr.reason,
                tags: expr.tags,
              });
            }
          }
        }
      }
    }
    
    // 패턴 3: 키워드 합성 (자연스러운 합성)
    if (secondKeyword && countSyllables(mainKeyword + secondKeyword) >= 2 && countSyllables(mainKeyword + secondKeyword) <= 4) {
      const name = `${mainKeyword}${secondKeyword}`;
      if (!isBadTitle(name)) {
        if (!candidates.some(c => normalizeKey(c.name) === normalizeKey(name))) {
          candidates.push({
            name,
            tagline: `${mainKeyword}와 ${secondKeyword}를 함께하는 앱`,
            reason: "키워드를 자연스럽게 결합한 간단한 이름",
            tags: ["간결", "자연스러움"],
          });
        }
      }
    }
    
    return candidates.filter(c => !isBadTitle(c.name));
  };
  
  // 각 타입별로 후보 생성
  const intuitiveCandidates = generateIntuitiveNames();
  const emotionalCandidates = generateEmotionalNames();
  const professionalCandidates = generateProfessionalNames();
  const casualCandidates = generateCasualNames();
  
  // 전역 중복 제거 (전체 후보에서 중복 제거)
  const allCandidates = [
    ...intuitiveCandidates,
    ...emotionalCandidates,
    ...professionalCandidates,
    ...casualCandidates,
  ];
  
  const allUnique = dedupeGlobal(allCandidates);
  
  // 전역 사용된 이름 추적 (모든 타입에서 중복 방지)
  const usedNames = new Set<string>();
  
  // 타입별로 고유한 이름 할당
  const assignUnique = (
    typeCandidates: AppNamingCandidate[],
    minCount: number = 3
  ): AppNamingCandidate[] => {
    const assigned: AppNamingCandidate[] = [];
    
    // 먼저 해당 타입의 원본 후보 중 사용되지 않은 것 할당
    for (const candidate of typeCandidates) {
      if (assigned.length >= minCount) break;
      const normalized = normalizeKey(candidate.name);
      if (!usedNames.has(normalized)) {
        // allUnique에 있는지 확인
        const found = allUnique.find(c => normalizeKey(c.name) === normalized);
        if (found) {
          usedNames.add(normalized);
          assigned.push(found);
        }
      }
    }
    
    // 부족하면 다른 타입 후보에서도 가져오기 (하지만 전역 중복 체크)
    if (assigned.length < minCount) {
      for (const candidate of allUnique) {
        if (assigned.length >= minCount) break;
        const normalized = normalizeKey(candidate.name);
        if (!usedNames.has(normalized)) {
          usedNames.add(normalized);
          assigned.push(candidate);
        }
      }
    }
    
    return assigned.slice(0, minCount);
  };
  
  const finalIntuitive = assignUnique(intuitiveCandidates, 3);
  const finalEmotional = assignUnique(emotionalCandidates, 3);
  const finalProfessional = assignUnique(professionalCandidates, 3);
  const finalCasual = assignUnique(casualCandidates, 3);
  
  // 미리보기용 (직관형 첫 번째)
  const preview: AppNamingPreview = {
    name: finalIntuitive[0]?.name || `${mainKeyword}매니저`,
    tagline: finalIntuitive[0]?.tagline || `${mainKeyword}를 관리하는 앱`,
    reason: finalIntuitive[0]?.reason || "앱의 기능이 이름에서 바로 드러남",
    tags: finalIntuitive[0]?.tags || ["관리", "직관적"],
  };
  
  return {
    preview,
    premium: {
      intuitive: finalIntuitive.slice(0, 3),
      emotional: finalEmotional.slice(0, 3),
      professional: finalProfessional.slice(0, 3),
      casual: finalCasual.slice(0, 3),
    },
  };
}
