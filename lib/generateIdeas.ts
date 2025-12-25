import { Node, AppType } from "./types";

/**
 * 1차 아이디어 여러 개 생성 (레벨 2)
 * 재생성을 위해 다양한 템플릿 풀에서 랜덤하게 선택
 */
export function generateFirstLevelIdeas(
  keywords: string[],
  selectedType: AppType = "app",
  count: number = 7,
  seed?: number // 재생성 시 다른 결과를 위해 시드 사용
): Node[] {
  const keywordStr = keywords.join(" + ");
  const isApp = selectedType === "app";
  const typeStr = isApp ? "앱" : "웹 서비스";

  // 다양한 아이디어 방향성 풀 (재생성 시 다른 안이 나오도록)
  const allIdeaTemplates = [
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
    // 추가 템플릿 (재생성 시 다른 안이 나오도록)
    {
      label: "1안",
      title: `실용적 ${keywordStr} ${typeStr}`,
      summary: `${keywordStr}의 실생활 활용에 중점을 둔 ${typeStr}. 일상적인 문제 해결에 최적화되어 있습니다.`,
    },
    {
      label: "2안",
      title: `혁신적 ${keywordStr} 플랫폼`,
      summary: `기존 방식을 혁신하는 ${typeStr}. 새로운 접근 방식과 기술을 활용합니다.`,
    },
    {
      label: "3안",
      title: `전문가용 ${keywordStr} 도구`,
      summary: `전문가와 고급 사용자를 위한 ${typeStr}. 고급 기능과 세밀한 커스터마이징을 제공합니다.`,
    },
    {
      label: "4안",
      title: `간편 ${keywordStr} 솔루션`,
      summary: `복잡함 없이 바로 사용할 수 있는 ${typeStr}. 최소한의 설정으로 최대 효과를 제공합니다.`,
    },
    {
      label: "5안",
      title: `협업 중심 ${keywordStr} ${typeStr}`,
      summary: `팀과 조직의 협업을 강화하는 ${typeStr}. 공유와 협업 기능이 핵심입니다.`,
    },
    {
      label: "6안",
      title: `자동화 ${keywordStr} 시스템`,
      summary: `반복 작업을 자동화하는 ${typeStr}. 효율성과 생산성 향상에 중점을 둡니다.`,
    },
    {
      label: "7안",
      title: `통합형 ${keywordStr} 플랫폼`,
      summary: `여러 기능을 통합한 ${typeStr}. 올인원 솔루션으로 편의성을 제공합니다.`,
    },
    // 더 많은 변형
    {
      label: "1안",
      title: `개인 맞춤 ${keywordStr} ${typeStr}`,
      summary: `개인의 선호와 패턴을 학습하여 맞춤형 경험을 제공하는 ${typeStr}.`,
    },
    {
      label: "2안",
      title: `게임화 ${keywordStr} 플랫폼`,
      summary: `게임 요소를 활용하여 재미와 동기부여를 제공하는 ${typeStr}.`,
    },
    {
      label: "3안",
      title: `AI 기반 ${keywordStr} ${typeStr}`,
      summary: `인공지능 기술을 활용하여 스마트한 기능을 제공하는 ${typeStr}.`,
    },
    {
      label: "4안",
      title: `오픈소스 ${keywordStr} 도구`,
      summary: `커뮤니티 기반으로 발전하는 ${typeStr}. 확장성과 커스터마이징이 자유롭습니다.`,
    },
    {
      label: "5안",
      title: `엔터프라이즈 ${keywordStr} 솔루션`,
      summary: `기업과 조직을 위한 ${typeStr}. 보안과 확장성에 중점을 둡니다.`,
    },
    {
      label: "6안",
      title: `크리에이티브 ${keywordStr} 스튜디오`,
      summary: `창의적 작업을 위한 ${typeStr}. 다양한 도구와 템플릿을 제공합니다.`,
    },
    {
      label: "7안",
      title: `미니멀 ${keywordStr} ${typeStr}`,
      summary: `단순하고 깔끔한 인터페이스의 ${typeStr}. 핵심 기능에만 집중합니다.`,
    },
  ];

  // 시드 기반으로 선택 (재생성 시 다른 안이 나오도록)
  const useSeed = seed !== undefined ? seed : Math.floor(Date.now() / 1000) % allIdeaTemplates.length;
  const shuffled = [...allIdeaTemplates];
  
  // 간단한 셔플 (시드 기반)
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = (useSeed + i) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // count만큼 선택하고 라벨 재할당
  const selected = shuffled.slice(0, count);

  return selected.map((template, index) => ({
    id: `node-${Date.now()}-${index}-${useSeed}`,
    parentId: null,
    level: 2,
    label: `${index + 1}안`,
    title: template.title,
    summary: template.summary,
    meta: {
      prompt: `${keywordStr}를 기반으로 한 ${index + 1}안`,
      seed: useSeed,
    },
  }));
}

/**
 * 다음 레벨 아이디어 생성 (레벨 3, 4...)
 */
export function generateNextLevelIdeas(
  parentNode: Node,
  keywords: string[],
  selectedType: AppType = "app",
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

