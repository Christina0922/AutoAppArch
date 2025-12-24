import { Node } from "./types";

/**
 * 1차 아이디어 여러 개 생성 (레벨 2)
 */
export function generateFirstLevelIdeas(
  keywords: string[],
  selectedType: "app" | "web" = "app",
  count: number = 7
): Node[] {
  const keywordStr = keywords.join(" + ");
  const isApp = selectedType === "app";
  const typeStr = isApp ? "앱" : "웹 서비스";

  // 다양한 아이디어 방향성
  const ideaTemplates = [
    {
      label: "1안",
      title: `기초 ${keywordStr} ${typeStr}`,
      summary: `${keywordStr}의 기본 기능에 집중한 ${typeStr}. 초보자 친화적이고 직관적인 인터페이스로 구성됩니다.`,
    },
    {
      label: "2안",
      title: `소셜 기반 ${keywordStr} 플랫폼`,
      summary: `사용자 간 연결과 공유 기능을 강화한 ${typeStr}. 커뮤니티 중심의 경험을 제공합니다.`,
    },
    {
      label: "3안",
      title: `프리미엄 ${keywordStr} 솔루션`,
      summary: `고급 기능과 맞춤형 서비스를 제공하는 ${typeStr}. 유료 구독 모델 기반입니다.`,
    },
    {
      label: "4안",
      title: `빠른 실행 ${keywordStr} 도구`,
      summary: `간결하고 효율적인 ${typeStr}. 핵심 기능만 포함하여 빠른 결과를 제공합니다.`,
    },
    {
      label: "5안",
      title: `교육 중심 ${keywordStr} 앱`,
      summary: `학습과 성장에 초점을 둔 ${typeStr}. 단계별 가이드와 피드백 시스템을 포함합니다.`,
    },
    {
      label: "6안",
      title: `데이터 기반 ${keywordStr} 분석 ${typeStr}`,
      summary: `인사이트와 분석을 제공하는 ${typeStr}. 데이터 시각화와 리포트 기능을 강조합니다.`,
    },
    {
      label: "7안",
      title: `모바일 최적화 ${keywordStr} ${typeStr}`,
      summary: `모바일 경험에 특화된 ${typeStr}. 터치 인터페이스와 오프라인 기능을 제공합니다.`,
    },
  ];

  return ideaTemplates.slice(0, count).map((template, index) => ({
    id: `node-${Date.now()}-${index}`,
    parentId: null,
    level: 2,
    label: template.label,
    title: template.title,
    summary: template.summary,
    meta: {
      prompt: `${keywordStr}를 기반으로 한 ${template.label}`,
    },
  }));
}

/**
 * 다음 레벨 아이디어 생성 (레벨 3, 4...)
 */
export function generateNextLevelIdeas(
  parentNode: Node,
  keywords: string[],
  selectedType: "app" | "web" = "app",
  count: number = 5
): Node[] {
  const keywordStr = keywords.join(" + ");
  const isApp = selectedType === "app";
  const typeStr = isApp ? "앱" : "웹 서비스";
  const level = parentNode.level + 1;

  // 레벨별 라벨 패턴
  const labelPatterns: { [key: number]: string[] } = {
    3: ["A안", "B안", "C안", "D안", "E안"],
    4: ["첫번째 안", "두번째 안", "세번째 안", "네번째 안", "다섯번째 안"],
    5: ["방안 1", "방안 2", "방안 3", "방안 4", "방안 5"],
  };

  const labels = labelPatterns[level] || ["안 1", "안 2", "안 3", "안 4", "안 5"];

  // 부모 노드의 특성을 반영한 하위 아이디어 생성
  const childIdeas = [
    {
      label: labels[0],
      title: `${parentNode.label}의 기본 구성`,
      summary: `${parentNode.title}의 핵심 기능을 구현하는 기본적인 접근 방식입니다.`,
    },
    {
      label: labels[1],
      title: `${parentNode.label}의 확장 버전`,
      summary: `${parentNode.title}에 추가 기능과 고급 옵션을 포함한 확장 구성입니다.`,
    },
    {
      label: labels[2],
      title: `${parentNode.label}의 최적화 버전`,
      summary: `${parentNode.title}을 성능과 효율성 측면에서 최적화한 구성입니다.`,
    },
    {
      label: labels[3],
      title: `${parentNode.label}의 혁신적 접근`,
      summary: `${parentNode.title}을 독창적이고 차별화된 방식으로 구현한 구성입니다.`,
    },
    {
      label: labels[4],
      title: `${parentNode.label}의 실용적 구현`,
      summary: `${parentNode.title}을 실제 사용 시나리오에 맞춰 실용적으로 구성한 버전입니다.`,
    },
  ];

  return childIdeas.slice(0, count).map((idea, index) => ({
    id: `node-${Date.now()}-${parentNode.id}-${index}`,
    parentId: parentNode.id,
    level,
    label: idea.label,
    title: idea.title,
    summary: idea.summary,
    meta: {
      prompt: `${parentNode.title}의 하위 아이디어: ${idea.label}`,
      parentTitle: parentNode.title,
    },
  }));
}

