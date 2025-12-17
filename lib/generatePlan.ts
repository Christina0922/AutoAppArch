import { PlanResult, AppType } from "./types";

export function generatePlan(
  keywords: string[],
  selectedType: AppType = "app",
  audienceHint?: string
): PlanResult {
  const keywordStr = keywords.join(" + ");
  const isApp = selectedType === "app";

  // 기본 타겟 사용자 (항상 포함)
  const baseTargetUsers = [
    "아이디어는 있으나 요구사항을 못 쓰는 사람",
    "스타트업 창업 초기 기획자",
    "개발자이지만 기획 문서 작성이 어려운 사람",
    "비개발자이지만 앱/웹 서비스를 만들고 싶은 사람",
    "기존 서비스를 개선하고 싶은 PM/PO",
  ];

  // 키워드 기반 추가 타겟 사용자
  const keywordBasedUsers: string[] = [];
  if (keywords.some((k) => k.includes("학습") || k.includes("공부"))) {
    keywordBasedUsers.push("학습 앱을 만들고 싶은 교육자");
  }
  if (keywords.some((k) => k.includes("소셜") || k.includes("커뮤니티"))) {
    keywordBasedUsers.push("커뮤니티 플랫폼을 기획하는 사람");
  }
  if (keywords.some((k) => k.includes("비즈니스") || k.includes("판매"))) {
    keywordBasedUsers.push("온라인 비즈니스를 시작하려는 사람");
  }

  const targetUsers = [
    ...baseTargetUsers,
    ...keywordBasedUsers.slice(0, 2),
  ].slice(0, 7);

  // 핵심 행동
  const coreAction = isApp
    ? `${keywordStr} 관련 기능을 통해 사용자가 주요 목표를 달성하는 행동`
    : `${keywordStr} 웹 서비스를 통해 사용자가 핵심 가치를 얻는 행동`;

  // 수익 모델
  const monetization = {
    model: ["freemium", "subscription"] as ("freemium" | "subscription" | "b2b")[],
    revenueTriggers: [
      "프리미엄 기능 사용 시도",
      "월간 구독 플랜 확인",
      "무료 사용량 한도 도달",
      "팀/비즈니스 플랜 문의",
    ],
  };

  // 저장 데이터
  const dataStored = [
    "사용자 계정 정보 (이메일, 닉네임)",
    "앱 사용 로그 (기능 사용 이력)",
    "사용자 설정 및 선호도",
    "생성된 콘텐츠/결과물",
    "결제 정보 (암호화된 토큰)",
    "앱 내 활동 통계",
  ];

  // 리스크 요소
  const risks = [
    "법적 책임 범위(추천 결과의 한계 고지)",
    "사용자 데이터 보안 및 개인정보 보호",
    "경쟁 서비스 출현으로 인한 시장 점유율 감소",
    "기술적 장애로 인한 서비스 중단",
  ];

  // 메트릭 (MVP 가정치)
  const metrics = {
    installsOrSignups: 5000,
    dau: 350,
    mau: 2500,
  };

  // 렌더링용 섹션
  const sectionsForRendering = [
    {
      heading: "타깃 사용자",
      bullets: targetUsers,
    },
    {
      heading: "핵심 행동",
      bullets: [coreAction],
    },
    {
      heading: "수익 발생 지점",
      bullets: [
        `수익 모델: ${monetization.model.join(", ")}`,
        ...monetization.revenueTriggers,
      ],
    },
    {
      heading: "저장 데이터 종류",
      bullets: dataStored,
    },
    {
      heading: "리스크 요소",
      bullets: risks,
    },
    {
      heading: "예상 지표 (MVP 가정치)",
      bullets: [
        `가입/설치: ${metrics.installsOrSignups.toLocaleString()}명`,
        `일간 활성 사용자(DAU): ${metrics.dau.toLocaleString()}명`,
        `월간 활성 사용자(MAU): ${metrics.mau.toLocaleString()}명`,
      ],
    },
  ];

  return {
    title: `AutoAppArch: ${keywordStr} ${isApp ? "앱" : "웹"} 설계 도우미`,
    tagline: `${keywordStr}를 중심으로 한 ${isApp ? "모바일 앱" : "웹 서비스"} 설계안`,
    targetUsers,
    coreAction,
    monetization,
    dataStored,
    risks,
    metrics,
    sectionsForRendering,
  };
}

