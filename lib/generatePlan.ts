import { PlanResult, AppType } from "./types";

export function generatePlan(
  keywords: string[],
  selectedType: AppType = "app",
  audienceHint?: string
): PlanResult {
  const keywordStr = keywords.join(" + ");
  // 모바일 앱만 지원

  // 생성될 앱의 최종 사용자 (키워드 기반)
  const appTargetUsers: string[] = [];
  
  if (keywords.some((k) => k.includes("학습") || k.includes("공부") || k.includes("교육"))) {
    appTargetUsers.push("학습 및 자기계발에 관심 있는 사용자");
    appTargetUsers.push("학생 및 교육 수요자");
  }
  if (keywords.some((k) => k.includes("소셜") || k.includes("커뮤니티") || k.includes("소통"))) {
    appTargetUsers.push("커뮤니티 활동을 즐기는 사용자");
    appTargetUsers.push("소셜 네트워킹을 원하는 사용자");
  }
  if (keywords.some((k) => k.includes("비즈니스") || k.includes("판매") || k.includes("상거래"))) {
    appTargetUsers.push("온라인 비즈니스를 운영하는 사용자");
    appTargetUsers.push("판매 및 마케팅에 관심 있는 사용자");
  }
  if (keywords.some((k) => k.includes("운동") || k.includes("건강") || k.includes("피트니스"))) {
    appTargetUsers.push("건강 및 운동 관리를 원하는 사용자");
    appTargetUsers.push("라이프스타일 개선을 추구하는 사용자");
  }
  if (keywords.some((k) => k.includes("영어") || k.includes("언어") || k.includes("외국어"))) {
    appTargetUsers.push("언어 학습에 관심 있는 사용자");
    appTargetUsers.push("국제 소통 능력 향상을 원하는 사용자");
  }
  
  // 키워드 기반 사용자가 없으면 기본 사용자 추가
  if (appTargetUsers.length === 0) {
    appTargetUsers.push(`${keywordStr} 관련 활동을 하는 사용자`);
    appTargetUsers.push(`${keywordStr}에 관심 있는 사용자`);
  }

  const targetUsers = appTargetUsers.slice(0, 7);

  // [사용자 관점] - 문제/상황
  const userProblems = [
    `${keywordStr} 관련 활동을 효율적으로 관리하고 싶지만 적절한 도구가 없음`,
    `${keywordStr} 관련 정보를 체계적으로 정리하고 추적하기 어려움`,
    `${keywordStr} 관련 목표를 달성하기 위한 명확한 가이드와 피드백 부족`,
  ];

  // [사용자 관점] - 핵심 행동 흐름 (5~8단계)
  const userActionFlow = [
    `[사용자] 앱을 실행하고 ${keywordStr} 관련 목표를 설정`,
    `[사용자] 개인 프로필 및 선호도를 입력하여 맞춤형 경험 구성`,
    `[사용자] 주요 기능을 탐색하고 필요한 도구를 선택`,
    `[사용자] ${keywordStr} 관련 활동을 기록하고 진행 상황 추적`,
    `[사용자] 결과를 확인하고 피드백을 받아 개선 방향 파악`,
    `[사용자] 성취도와 통계를 확인하여 지속적인 동기 부여`,
    `[사용자] 공유 기능을 통해 다른 사용자와 경험 교환`,
  ].slice(0, Math.min(8, Math.max(5, 7)));

  // [사용자 관점] - 핵심 기능
  const userCoreFeatures = [
    `[사용자] ${keywordStr} 관련 목표 설정 및 관리`,
    `[사용자] 활동 기록 및 진행 상황 추적`,
    `[사용자] 개인화된 추천 및 가이드 제공`,
    `[사용자] 성취도 시각화 및 통계 확인`,
    `[사용자] 커뮤니티 기능을 통한 경험 공유`,
  ];

  // [사용자 관점] - 화면 흐름
  const userScreenFlow = [
    `[사용자] 시작 화면: 목표 설정 및 온보딩`,
    `[사용자] 메인 대시보드: 현재 상태 및 주요 기능 접근`,
    `[사용자] 활동 기록 화면: ${keywordStr} 관련 데이터 입력`,
    `[사용자] 결과 확인 화면: 분석 및 피드백 제공`,
    `[사용자] 프로필 화면: 설정 및 통계 확인`,
  ];

  // [개발자 관점] - 수익화 (선택 옵션)
  const developerMonetization = [
    `[개발자] 프리미엄 구독 모델: 월간/연간 구독으로 고급 기능 제공`,
    `[개발자] 인앱 구매: 특정 기능 또는 콘텐츠의 개별 구매`,
    `[개발자] 광고 수익: 무료 사용자에게 광고 노출 (선택적)`,
    `[개발자] B2B 라이선스: 기업용 플랜 제공 (선택적)`,
  ];

  // [개발자 관점] - 저장 데이터 (최소/선택)
  const developerDataStored = [
    `[개발자] 최소 필수: 사용자 계정 정보 (이메일, 닉네임), 앱 사용 로그`,
    `[개발자] 선택적: 사용자 설정 및 선호도, 생성된 콘텐츠/결과물`,
    `[개발자] 선택적: 결제 정보 (암호화된 토큰), 앱 내 활동 통계`,
    `[개발자] 개인정보 보호: 최소한의 데이터만 수집하고 명시적 동의 필요`,
  ];

  // [개발자 관점] - 운영/관리
  const developerOperations = [
    `[개발자] 사용자 지원: FAQ, 고객 문의 채널 운영`,
    `[개발자] 콘텐츠 관리: 정기적인 업데이트 및 새로운 기능 추가`,
    `[개발자] 서버 관리: 안정적인 서비스 운영 및 확장성 확보`,
    `[개발자] 데이터 백업: 정기적인 데이터 백업 및 복구 시스템 구축`,
  ];

  // [개발자 관점] - 리스크
  const developerRisks = [
    `[개발자] 법적 책임: 서비스 이용약관 및 개인정보 처리방침 명확화`,
    `[개발자] 데이터 보안: 사용자 데이터 보안 및 개인정보 보호 체계 구축`,
    `[개발자] 경쟁 서비스: 차별화된 기능과 사용자 경험으로 경쟁력 유지`,
    `[개발자] 기술적 장애: 모니터링 시스템 구축 및 빠른 대응 체계 마련`,
  ];

  // [개발자 관점] - 지표 (숫자 말고 항목)
  const developerMetrics = [
    `[개발자] 사용자 참여도: 일일 활성 사용자(DAU), 주간 활성 사용자(WAU)`,
    `[개발자] 사용자 유지율: 신규 사용자 대비 재방문율, 장기 사용자 비율`,
    `[개발자] 기능 사용률: 주요 기능별 사용 빈도 및 인기 기능 파악`,
    `[개발자] 수익 지표: 구독 전환율, 인앱 구매율, ARPU(사용자당 평균 수익)`,
    `[개발자] 사용자 만족도: 앱 스토어 평점, 사용자 피드백 및 리뷰`,
  ];

  // 렌더링용 섹션 - [사용자 관점]과 [개발자 관점]으로 구분
  const sectionsForRendering = [
    // [사용자 관점] 섹션들
    {
      heading: "[사용자 관점] 타겟 사용자(최종 사용자)",
      bullets: targetUsers,
    },
    {
      heading: "[사용자 관점] 문제/상황",
      bullets: userProblems,
    },
    {
      heading: "[사용자 관점] 핵심 행동 흐름",
      bullets: userActionFlow,
    },
    {
      heading: "[사용자 관점] 핵심 기능",
      bullets: userCoreFeatures,
    },
    {
      heading: "[사용자 관점] 화면 흐름",
      bullets: userScreenFlow,
    },
    // [개발자 관점] 섹션들
    {
      heading: "[개발자 관점] 수익화(선택 옵션)",
      bullets: developerMonetization,
    },
    {
      heading: "[개발자 관점] 저장 데이터(최소/선택)",
      bullets: developerDataStored,
    },
    {
      heading: "[개발자 관점] 운영/관리",
      bullets: developerOperations,
    },
    {
      heading: "[개발자 관점] 리스크",
      bullets: developerRisks,
    },
    {
      heading: "[개발자 관점] 지표",
      bullets: developerMetrics,
    },
  ];

  // 하위 호환성을 위한 기존 필드 (사용하지 않지만 타입 호환성 유지)
  const coreAction = `${keywordStr} 관련 기능을 통해 사용자가 주요 목표를 달성하는 행동`;

  return {
    title: `${keywordStr} 모바일 앱 설계안`,
    tagline: `${keywordStr}를 중심으로 한 모바일 앱 기획서`,
    targetUsers,
    coreAction,
    monetization: {
      model: ["freemium", "subscription"] as ("freemium" | "subscription" | "b2b")[],
      revenueTriggers: [],
    },
    dataStored: developerDataStored,
    risks: developerRisks,
    metrics: {
      installsOrSignups: 0,
      dau: 0,
      mau: 0,
    },
    sectionsForRendering,
  };
}

