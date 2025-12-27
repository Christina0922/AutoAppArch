import { Node, AppType, ImplementationSpec } from "./types";

type Locale = "ko" | "en";

/**
 * 1차 아이디어 여러 개 생성 (레벨 2)
 * 재생성을 위해 다양한 템플릿 풀에서 랜덤하게 선택
 */
export function generateFirstLevelIdeas(
  keywords: string[],
  selectedType: AppType = "app",
  count: number = 7,
  seed?: number, // 재생성 시 다른 결과를 위해 시드 사용
  locale: Locale = "ko"
): Node[] {
  const keywordStr = keywords.join(" + ");
  const typeStr = locale === "en" ? "App" : "앱";

  // 로케일별 템플릿 정의
  const templates = locale === "en" ? {
    basic: "Basic",
    social: "Social",
    premium: "Premium",
    quick: "Quick Launch",
    education: "Educational",
    analytics: "Analytics",
    mobile: "Mobile",
    daily: "Daily",
    community: "Community",
    expert: "Expert",
    simple: "Simple",
    collaboration: "Collaboration",
    automation: "Automation",
    integrated: "Integrated",
    customized: "Customized",
    gamified: "Gamified",
    ai: "AI",
    openSource: "Open Source",
    enterprise: "Enterprise",
    creative: "Creative",
    minimal: "Minimal",
    summaryLog: (kw: string) => `${kw} log addition, list view, basic statistics included`,
    summaryShare: "User sharing, comments, likes included",
    summaryPremium: "Paid subscription, advanced analytics, data export included",
    summaryQuick: "Minimal screens, fast input, simple view included",
    summaryEducation: "Step-by-step guides, progress tracking, feedback system included",
    summaryAnalytics: "Chart visualization, report generation, data comparison included",
    summaryMobile: "Offline sync, push notifications, location-based features included",
    summaryDaily: "Daily records, weekly summary, notification settings included",
    summaryCommunity: "Bulletin board, group management, real-time chat included",
    summaryExpert: "Advanced filters, custom reports, API integration included",
    summarySimple: "One-click input, auto classification, quick search included",
    summaryCollaboration: "Team sharing, permission management, task assignment included",
    summaryAutomation: "Schedule execution, rule-based processing, push notification integration included",
    summaryIntegrated: "Multiple data sources, integrated dashboard, batch processing included",
    summaryCustomized: "User pattern learning, personalized recommendations, custom notifications included",
    summaryGamified: "Point system, badge collection, leaderboard included",
    summaryAI: "Auto classification, predictive analytics, smart recommendations included",
    summaryOpenSource: "Plugin system, API extensions, custom themes included",
    summaryEnterprise: "SSO authentication, audit logs, backup and recovery included",
    summaryCreative: "Template library, media editing, shared gallery included",
    summaryMinimal: "3 screens, essential features only, fast loading included",
  } : {
    basic: "기본",
    social: "소셜",
    premium: "프리미엄",
    quick: "빠른 실행",
    education: "교육",
    analytics: "분석",
    mobile: "모바일",
    daily: "일상",
    community: "커뮤니티",
    expert: "전문가",
    simple: "간편",
    collaboration: "협업",
    automation: "자동화",
    integrated: "통합",
    customized: "맞춤형",
    gamified: "게임화",
    ai: "AI",
    openSource: "오픈소스",
    enterprise: "엔터프라이즈",
    creative: "크리에이티브",
    minimal: "미니멀",
    summaryLog: (kw: string) => `${kw} 로그 추가, 목록 조회, 기본 통계 기능 포함`,
    summaryShare: "사용자 간 공유, 댓글, 좋아요 기능 포함",
    summaryPremium: "유료 구독, 고급 분석, 데이터 내보내기 기능 포함",
    summaryQuick: "최소 화면 구성, 빠른 입력, 간단한 조회 기능 포함",
    summaryEducation: "단계별 가이드, 진행률 추적, 피드백 시스템 포함",
    summaryAnalytics: "차트 시각화, 리포트 생성, 데이터 비교 기능 포함",
    summaryMobile: "오프라인 동기화, 푸시 알림, 위치 기반 기능 포함",
    summaryDaily: "일일 기록, 주간 요약, 알림 설정 기능 포함",
    summaryCommunity: "게시판, 그룹 관리, 실시간 채팅 기능 포함",
    summaryExpert: "고급 필터, 커스텀 리포트, API 연동 기능 포함",
    summarySimple: "원클릭 입력, 자동 분류, 빠른 검색 기능 포함",
    summaryCollaboration: "팀 공유, 권한 관리, 작업 할당 기능 포함",
    summaryAutomation: "스케줄 실행, 규칙 기반 처리, 푸시 알림 연동 기능 포함",
    summaryIntegrated: "다중 데이터 소스, 통합 대시보드, 일괄 처리 기능 포함",
    summaryCustomized: "사용자 패턴 학습, 개인화 추천, 맞춤 알림 기능 포함",
    summaryGamified: "포인트 시스템, 배지 수집, 리더보드 기능 포함",
    summaryAI: "자동 분류, 예측 분석, 스마트 추천 기능 포함",
    summaryOpenSource: "플러그인 시스템, API 확장, 커스텀 테마 기능 포함",
    summaryEnterprise: "SSO 인증, 감사 로그, 백업 복원 기능 포함",
    summaryCreative: "템플릿 라이브러리, 미디어 편집, 공유 갤러리 기능 포함",
    summaryMinimal: "3개 화면, 필수 기능만, 빠른 로딩 기능 포함",
  };

  // 다양한 아이디어 방향성 풀 (재생성 시 다른 안이 나오도록)
  const allIdeaTemplates = [
    {
      label: locale === "en" ? "Option 1" : "1안",
      title: `${templates.basic} ${keywordStr} ${typeStr}`,
      summary: templates.summaryLog(keywordStr),
    },
    {
      label: locale === "en" ? "Option 2" : "2안",
      title: `${templates.social} ${keywordStr} ${typeStr}`,
      summary: templates.summaryShare,
    },
    {
      label: locale === "en" ? "Option 3" : "3안",
      title: `${templates.premium} ${keywordStr} ${typeStr}`,
      summary: templates.summaryPremium,
    },
    {
      label: locale === "en" ? "Option 4" : "4안",
      title: `${templates.quick} ${keywordStr} ${typeStr}`,
      summary: templates.summaryQuick,
    },
    {
      label: locale === "en" ? "Option 5" : "5안",
      title: `${templates.education} ${keywordStr} ${typeStr}`,
      summary: templates.summaryEducation,
    },
    {
      label: locale === "en" ? "Option 6" : "6안",
      title: `${templates.analytics} ${keywordStr} ${typeStr}`,
      summary: templates.summaryAnalytics,
    },
    {
      label: locale === "en" ? "Option 7" : "7안",
      title: `${templates.mobile} ${keywordStr} ${typeStr}`,
      summary: templates.summaryMobile,
    },
    // 추가 템플릿 (재생성 시 다른 안이 나오도록)
    {
      label: locale === "en" ? "Option 1" : "1안",
      title: `${templates.daily} ${keywordStr} ${typeStr}`,
      summary: templates.summaryDaily,
    },
    {
      label: locale === "en" ? "Option 2" : "2안",
      title: `${templates.community} ${keywordStr} ${typeStr}`,
      summary: templates.summaryCommunity,
    },
    {
      label: locale === "en" ? "Option 3" : "3안",
      title: `${templates.expert} ${keywordStr} ${typeStr}`,
      summary: templates.summaryExpert,
    },
    {
      label: locale === "en" ? "Option 4" : "4안",
      title: `${templates.simple} ${keywordStr} ${typeStr}`,
      summary: templates.summarySimple,
    },
    {
      label: locale === "en" ? "Option 5" : "5안",
      title: `${templates.collaboration} ${keywordStr} ${typeStr}`,
      summary: templates.summaryCollaboration,
    },
    {
      label: locale === "en" ? "Option 6" : "6안",
      title: `${templates.automation} ${keywordStr} ${typeStr}`,
      summary: templates.summaryAutomation,
    },
    {
      label: locale === "en" ? "Option 7" : "7안",
      title: `${templates.integrated} ${keywordStr} ${typeStr}`,
      summary: templates.summaryIntegrated,
    },
    // 더 많은 변형
    {
      label: locale === "en" ? "Option 1" : "1안",
      title: `${templates.customized} ${keywordStr} ${typeStr}`,
      summary: templates.summaryCustomized,
    },
    {
      label: locale === "en" ? "Option 2" : "2안",
      title: `${templates.gamified} ${keywordStr} ${typeStr}`,
      summary: templates.summaryGamified,
    },
    {
      label: locale === "en" ? "Option 3" : "3안",
      title: `${templates.ai} ${keywordStr} ${typeStr}`,
      summary: templates.summaryAI,
    },
    {
      label: locale === "en" ? "Option 4" : "4안",
      title: `${templates.openSource} ${keywordStr} ${typeStr}`,
      summary: templates.summaryOpenSource,
    },
    {
      label: locale === "en" ? "Option 5" : "5안",
      title: `${templates.enterprise} ${keywordStr} ${typeStr}`,
      summary: templates.summaryEnterprise,
    },
    {
      label: locale === "en" ? "Option 6" : "6안",
      title: `${templates.creative} ${keywordStr} ${typeStr}`,
      summary: templates.summaryCreative,
    },
    {
      label: locale === "en" ? "Option 7" : "7안",
      title: `${templates.minimal} ${keywordStr} ${typeStr}`,
      summary: templates.summaryMinimal,
    },
  ];

  // 시드 기반으로 선택 (재생성 시 다른 안이 나오도록)
  const useSeed = seed !== undefined ? seed : Math.floor(Date.now() / 1000);
  
  // 시드 기반 간단한 PRNG (선형 합동 생성기)
  let randomSeed = useSeed;
  const nextRandom = () => {
    randomSeed = (randomSeed * 1103515245 + 12345) & 0x7fffffff;
    return randomSeed / 0x7fffffff;
  };
  
  // Fisher-Yates 셔플 (시드 기반)
  const shuffled = [...allIdeaTemplates];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(nextRandom() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // count만큼 선택하고 라벨 재할당
  const selected = shuffled.slice(0, count);

  return selected.map((template, index) => ({
    id: `node-${Date.now()}-${index}-${useSeed}`,
    parentId: null,
    level: 2,
    label: locale === "en" ? `Option ${index + 1}` : `${index + 1}안`,
    title: template.title,
    summary: template.summary,
    meta: {
      prompt: locale === "en" 
        ? `${keywordStr} based ${index + 1} option`
        : `${keywordStr}를 기반으로 한 ${index + 1}안`,
      seed: useSeed,
    },
  }));
}

/**
 * 다음 레벨 아이디어 생성 (레벨 3, 4...)
 * A~E 안이 각각 다른 구현 스펙을 가지도록 차별화
 */
export function generateNextLevelIdeas(
  parentNode: Node,
  keywords: string[],
  selectedType: AppType = "app",
  count: number = 5,
  locale: Locale = "ko"
): Node[] {
  const keywordStr = keywords.join(" + ");
  const typeStr = locale === "en" ? "App" : "앱";
  const level = (parentNode.level as number) + 1;

  // 레벨별 라벨 패턴
  const labelPatterns: { [key: number]: { ko: string[]; en: string[] } } = {
    3: {
      ko: ["A안", "B안", "C안", "D안", "E안"],
      en: ["Option A", "Option B", "Option C", "Option D", "Option E"],
    },
    4: {
      ko: ["첫번째 안", "두번째 안", "세번째 안", "네번째 안", "다섯번째 안"],
      en: ["1st Option", "2nd Option", "3rd Option", "4th Option", "5th Option"],
    },
    5: {
      ko: ["방안 1", "방안 2", "방안 3", "방안 4", "방안 5"],
      en: ["Approach 1", "Approach 2", "Approach 3", "Approach 4", "Approach 5"],
    },
  };

  const patterns = labelPatterns[level] || {
    ko: ["안 1", "안 2", "안 3", "안 4", "안 5"],
    en: ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"],
  };
  const labels = locale === "en" ? patterns.en : patterns.ko;

  // 키워드 기반으로 기본 화면/기능/엔티티 생성
  const baseScreens = generateBaseScreens(keywords, true, locale); // 모바일 앱만
  const baseFeatures = generateBaseFeatures(keywords, locale);
  const baseEntities = generateBaseEntities(keywords);
  const baseApis = generateBaseApis(keywords);
  const baseArchitecture = ["React Native", "Node.js", "PostgreSQL", "Firebase Auth", "Vercel"];

  // A~E 안별 스펙 생성 (로케일별로 다른 텍스트 사용)
  const specs: ImplementationSpec[] = locale === "en" ? [
    // Option A: Minimal Feature MVP
    {
      targetUser: `Beginner users starting with ${keywordStr}`,
      screens: baseScreens.slice(0, 5),
      features: [
        `Add ${keywordStr} log`,
        `View ${keywordStr} list`,
        `${keywordStr} basic statistics`,
        `User profile`,
        `Basic settings`
      ],
      entities: baseEntities.slice(0, 5),
      apis: [
        `POST /${keywords[0]}/logs`,
        `GET /${keywords[0]}/logs`,
        `GET /${keywords[0]}/stats/basic`,
        `GET /users/me`,
        `PUT /users/me`
      ],
      architecture: baseArchitecture,
      difficulty: "Beginner",
      estimatedDuration: "1~2 weeks",
      valueProposition: "Quick market entry",
      contextTags: ["For solo founders", "MVP stage", "Initial prototype"],
      topFeatures: [
        `Add ${keywordStr} log`,
        `View ${keywordStr} list`,
        `${keywordStr} basic statistics`
      ],
      oneLineRisk: "Initial server costs may occur"
    },
    // Option B: Growth features
    {
      targetUser: `Active users who consistently manage ${keywordStr}`,
      screens: [
        ...baseScreens.slice(0, 3),
        `${keywordStr} notification settings`,
        `${keywordStr} goal management`
      ],
      features: [
        `Add ${keywordStr} log`,
        `View ${keywordStr} list`,
        `${keywordStr} search and filter`,
        `${keywordStr} tag management`,
        `Goal setting and tracking`
      ],
      entities: [
        ...baseEntities.slice(0, 3),
        `goal`,
        `notification`
      ],
      apis: [
        `POST /${keywords[0]}/logs`,
        `GET /${keywords[0]}/logs?search=`,
        `GET /${keywords[0]}/tags`,
        `POST /goals`,
        `GET /notifications`
      ],
      architecture: baseArchitecture,
      difficulty: "Intermediate",
      estimatedDuration: "3~4 weeks",
      valueProposition: "Scalable growth version",
      contextTags: ["Early SaaS model", "User retention focus", "Feature expansion ready"],
      topFeatures: [
        `${keywordStr} search and filter`,
        `${keywordStr} tag management`,
        `Goal setting and tracking`
      ],
      oneLineRisk: "Performance optimization needed as data grows"
    },
    // Option C: Performance/cost optimization
    {
      targetUser: `Advanced users with large amounts of ${keywordStr} data`,
      screens: baseScreens.slice(0, 5),
      features: [
        `Add ${keywordStr} log`,
        `View ${keywordStr} list (pagination)`,
        `${keywordStr} statistics (cached)`,
        `Batch data processing`,
        `Performance monitoring`
      ],
      entities: baseEntities.slice(0, 5),
      apis: [
        `POST /${keywords[0]}/logs`,
        `GET /${keywords[0]}/logs?page=`,
        `GET /${keywords[0]}/stats/cached`,
        `POST /batch/process`,
        `GET /metrics/performance`
      ],
      architecture: [
        ...baseArchitecture.slice(0, 3),
        "Redis (caching)",
        "CloudWatch (monitoring)"
      ],
      difficulty: "Advanced",
      estimatedDuration: "4~6 weeks",
      valueProposition: "Operating cost reduction",
      contextTags: ["Large data volume", "Performance optimization", "Cost efficiency"],
      topFeatures: [
        `${keywordStr} statistics (cached)`,
        `Batch data processing`,
        `Performance monitoring`
      ],
      oneLineRisk: "Initial infrastructure setup cost increase"
    },
    // Option D: Differentiation features
    {
      targetUser: `Users seeking personalized experience with ${keywordStr}`,
      screens: [
        ...baseScreens.slice(0, 3),
        `${keywordStr} recommendations`,
        `${keywordStr} personalization settings`
      ],
      features: [
        `Add ${keywordStr} log`,
        `View ${keywordStr} list`,
        `${keywordStr} recommendation algorithm`,
        `Personalization rule engine`,
        `Customized dashboard`
      ],
      entities: [
        ...baseEntities.slice(0, 3),
        `recommendation`,
        `user_preference`
      ],
      apis: [
        `POST /${keywords[0]}/logs`,
        `GET /${keywords[0]}/logs`,
        `GET /${keywords[0]}/recommendations`,
        `POST /rules/engine`,
        `GET /dashboard/personalized`
      ],
      architecture: [
        ...baseArchitecture.slice(0, 3),
        "ML module (recommendations)",
        "Rule engine server"
      ],
      difficulty: "Advanced",
      estimatedDuration: "5~8 weeks",
      valueProposition: "Personalized experience",
      contextTags: ["For experts", "AI/ML utilization", "Advanced features"],
      topFeatures: [
        `${keywordStr} recommendation algorithm`,
        `Personalization rule engine`,
        `Customized dashboard`
      ],
      oneLineRisk: "ML model training and maintenance costs"
    },
    // Option E: Operations/expansion
    {
      targetUser: `Users managing ${keywordStr} at team/organization level`,
      screens: [
        ...baseScreens.slice(0, 3),
        `Admin dashboard`,
        `Permission management`
      ],
      features: [
        `Add ${keywordStr} log`,
        `View ${keywordStr} list`,
        `User permission management`,
        `Data backup and recovery`,
        `Audit logs`
      ],
      entities: [
        ...baseEntities.slice(0, 3),
        `role`,
        `audit_log`
      ],
      apis: [
        `POST /${keywords[0]}/logs`,
        `GET /${keywords[0]}/logs`,
        `POST /admin/users/roles`,
        `POST /admin/backup`,
        `GET /admin/audit-logs`
      ],
      architecture: [
        ...baseArchitecture.slice(0, 3),
        "Admin panel",
        "Backup storage (S3)"
      ],
      difficulty: "Advanced",
      estimatedDuration: "6~10 weeks",
      valueProposition: "Enterprise operations ready",
      contextTags: ["Team collaboration", "Organization management", "Security enhanced"],
      topFeatures: [
        `User permission management`,
        `Data backup and recovery`,
        `Audit logs`
      ],
      oneLineRisk: "Complex permission system implementation and management burden"
    }
  ] : [
    // A안: 최소 기능 MVP
    {
      targetUser: `${keywordStr}를 처음 시작하는 초보 사용자`,
      screens: baseScreens.slice(0, 5),
      features: [
        `${keywordStr} 로그 추가`,
        `${keywordStr} 목록 조회`,
        `${keywordStr} 기본 통계`,
        `사용자 프로필`,
        `기본 설정`
      ],
      entities: baseEntities.slice(0, 5),
      apis: [
        `POST /${keywords[0]}/logs`,
        `GET /${keywords[0]}/logs`,
        `GET /${keywords[0]}/stats/basic`,
        `GET /users/me`,
        `PUT /users/me`
      ],
      architecture: baseArchitecture,
      difficulty: "초급",
      estimatedDuration: "1~2주",
      valueProposition: "빠른 시장 진입",
      contextTags: ["1인 창업자용", "MVP 단계", "초기 프로토타입"],
      topFeatures: [
        `${keywordStr} 로그 추가`,
        `${keywordStr} 목록 조회`,
        `${keywordStr} 기본 통계`
      ],
      oneLineRisk: "초기 서버 비용 발생 가능"
    },
    // B안: 성장 기능
    {
      targetUser: `${keywordStr}를 꾸준히 관리하려는 활성 사용자`,
      screens: [
        ...baseScreens.slice(0, 3),
        `${keywordStr} 알림 설정`,
        `${keywordStr} 목표 관리`
      ],
      features: [
        `${keywordStr} 로그 추가`,
        `${keywordStr} 목록 조회`,
        `${keywordStr} 검색 및 필터`,
        `${keywordStr} 태그 관리`,
        `목표 설정 및 추적`
      ],
      entities: [
        ...baseEntities.slice(0, 3),
        `goal`,
        `notification`
      ],
      apis: [
        `POST /${keywords[0]}/logs`,
        `GET /${keywords[0]}/logs?search=`,
        `GET /${keywords[0]}/tags`,
        `POST /goals`,
        `GET /notifications`
      ],
      architecture: baseArchitecture,
      difficulty: "중급",
      estimatedDuration: "3~4주",
      valueProposition: "확장 성장 버전",
      contextTags: ["SaaS 초기모델", "사용자 유지율 중시", "기능 확장 준비"],
      topFeatures: [
        `${keywordStr} 검색 및 필터`,
        `${keywordStr} 태그 관리`,
        `목표 설정 및 추적`
      ],
      oneLineRisk: "데이터 증가 시 성능 최적화 필요"
    },
    // C안: 성능/비용 최적화 (기술 항목)
    {
      targetUser: `${keywordStr} 데이터가 많은 고급 사용자`,
      screens: baseScreens.slice(0, 5),
      features: [
        `${keywordStr} 로그 추가`,
        `${keywordStr} 목록 조회 (페이지네이션)`,
        `${keywordStr} 통계 (캐싱)`,
        `배치 데이터 처리`,
        `성능 모니터링`
      ],
      entities: baseEntities.slice(0, 5),
      apis: [
        `POST /${keywords[0]}/logs`,
        `GET /${keywords[0]}/logs?page=`,
        `GET /${keywords[0]}/stats/cached`,
        `POST /batch/process`,
        `GET /metrics/performance`
      ],
      architecture: [
        ...baseArchitecture.slice(0, 3),
        "Redis (캐싱)",
        "CloudWatch (모니터링)"
      ],
      difficulty: "상급",
      estimatedDuration: "4~6주",
      valueProposition: "운영 비용 절감",
      contextTags: ["대용량 데이터", "성능 최적화", "비용 효율"],
      topFeatures: [
        `${keywordStr} 통계 (캐싱)`,
        `배치 데이터 처리`,
        `성능 모니터링`
      ],
      oneLineRisk: "인프라 구축 초기 비용 증가"
    },
    // D안: 차별 기능 (구현 모듈)
    {
      targetUser: `${keywordStr}에 개인화된 경험을 원하는 사용자`,
      screens: [
        ...baseScreens.slice(0, 3),
        `${keywordStr} 추천`,
        `${keywordStr} 개인화 설정`
      ],
      features: [
        `${keywordStr} 로그 추가`,
        `${keywordStr} 목록 조회`,
        `${keywordStr} 추천 알고리즘`,
        `개인화 규칙 엔진`,
        `맞춤형 대시보드`
      ],
      entities: [
        ...baseEntities.slice(0, 3),
        `recommendation`,
        `user_preference`
      ],
      apis: [
        `POST /${keywords[0]}/logs`,
        `GET /${keywords[0]}/logs`,
        `GET /${keywords[0]}/recommendations`,
        `POST /rules/engine`,
        `GET /dashboard/personalized`
      ],
      architecture: [
        ...baseArchitecture.slice(0, 3),
        "ML 모듈 (추천)",
        "규칙 엔진 서버"
      ],
      difficulty: "상급",
      estimatedDuration: "5~8주",
      valueProposition: "개인화 경험 제공",
      contextTags: ["전문가용", "AI/ML 활용", "고급 기능"],
      topFeatures: [
        `${keywordStr} 추천 알고리즘`,
        `개인화 규칙 엔진`,
        `맞춤형 대시보드`
      ],
      oneLineRisk: "ML 모델 학습 및 유지보수 비용 발생"
    },
    // E안: 운영/확장 (운영 기능)
    {
      targetUser: `${keywordStr}를 팀/조직 단위로 관리하는 사용자`,
      screens: [
        ...baseScreens.slice(0, 3),
        `관리자 대시보드`,
        `권한 관리`
      ],
      features: [
        `${keywordStr} 로그 추가`,
        `${keywordStr} 목록 조회`,
        `사용자 권한 관리`,
        `데이터 백업 및 복원`,
        `감사 로그`
      ],
      entities: [
        ...baseEntities.slice(0, 3),
        `role`,
        `audit_log`
      ],
      apis: [
        `POST /${keywords[0]}/logs`,
        `GET /${keywords[0]}/logs`,
        `POST /admin/users/roles`,
        `POST /admin/backup`,
        `GET /admin/audit-logs`
      ],
      architecture: [
        ...baseArchitecture.slice(0, 3),
        "관리자 패널",
        "백업 스토리지 (S3)"
      ],
      difficulty: "상급",
      estimatedDuration: "6~10주",
      valueProposition: "엔터프라이즈 운영 준비",
      contextTags: ["팀 협업", "조직 관리", "보안 강화"],
      topFeatures: [
        `사용자 권한 관리`,
        `데이터 백업 및 복원`,
        `감사 로그`
      ],
      oneLineRisk: "복잡한 권한 시스템 구현 및 관리 부담"
    }
  ];

  return specs.slice(0, count).map((spec, index) => {
    const label = labels[index];
    const title = generateTitleFromSpec(label, spec, parentNode, locale);
    
    return {
      id: `node-${Date.now()}-${parentNode.id}-${index}`,
      parentId: parentNode.id,
      level,
      label,
      title,
      summary: locale === "en"
        ? `${spec.difficulty} difficulty, Estimated: ${spec.estimatedDuration}`
        : `${spec.difficulty} 난이도, 예상 기간: ${spec.estimatedDuration}`,
      spec,
      meta: {
        prompt: locale === "en"
          ? `Sub-idea of ${parentNode.title}: ${label}`
          : `${parentNode.title}의 하위 아이디어: ${label}`,
        parentTitle: parentNode.title as string,
      },
    };
  });
}

// 키워드 기반 기본 화면 생성 (모바일 앱만 지원)
function generateBaseScreens(keywords: string[], isApp: boolean, locale: Locale = "ko"): string[] {
  // 모바일 앱 전용 화면
  if (locale === "en") {
    return ["Home", `${keywords[0]} List`, `Add ${keywords[0]}`, "Statistics", "Settings"];
  }
  return ["홈", `${keywords[0]} 목록`, `${keywords[0]} 추가`, "통계", "설정"];
}

// 키워드 기반 기본 기능 생성
function generateBaseFeatures(keywords: string[], locale: Locale = "ko"): string[] {
  if (locale === "en") {
    return [
      `Add ${keywords[0]}`,
      `View ${keywords[0]}`,
      `Edit ${keywords[0]}`,
      `Delete ${keywords[0]}`,
      `Search ${keywords[0]}`
    ];
  }
  return [
    `${keywords[0]} 추가`,
    `${keywords[0]} 조회`,
    `${keywords[0]} 수정`,
    `${keywords[0]} 삭제`,
    `${keywords[0]} 검색`
  ];
}

// 키워드 기반 기본 엔티티 생성
function generateBaseEntities(keywords: string[]): string[] {
  const keyword = keywords[0].toLowerCase().replace(/\s+/g, "_");
  return [
    "user",
    `${keyword}_log`,
    `${keyword}_category`,
    "session",
    "preference"
  ];
}

// 키워드 기반 기본 API 생성
function generateBaseApis(keywords: string[]): string[] {
  const keyword = keywords[0].toLowerCase().replace(/\s+/g, "");
  return [
    `POST /${keyword}/logs`,
    `GET /${keyword}/logs`,
    `PUT /${keyword}/logs/:id`,
    `DELETE /${keyword}/logs/:id`,
    `GET /${keyword}/stats`
  ];
}

// 스펙 기반 제목 생성
function generateTitleFromSpec(label: string, spec: ImplementationSpec, parentNode: Node, locale: Locale = "ko"): string {
  if (locale === "en") {
    const difficultyMap: Record<string, string> = {
      "Beginner": "MVP",
      "Intermediate": "Growth",
      "Advanced": "Advanced"
    };
    
    const typeMap: Record<string, string> = {
      "Beginner": "Basic",
      "Intermediate": "Extended",
      "Advanced": spec.features.some(f => f.includes("recommendation") || f.includes("personalization")) 
        ? "Differentiated" 
        : spec.features.some(f => f.includes("admin") || f.includes("permission"))
        ? "Operations"
        : "Optimized"
    };
    
    return `${(parentNode.label as string) ?? ""} ${typeMap[spec.difficulty]} ${difficultyMap[spec.difficulty]} Version`;
  }

  const difficultyMap: Record<string, string> = {
    "초급": "MVP",
    "중급": "성장",
    "상급": "고급"
  };
  
  const typeMap: Record<string, string> = {
    "초급": "기본",
    "중급": "확장",
    "상급": spec.features.some(f => f.includes("추천") || f.includes("개인화")) 
      ? "차별화" 
      : spec.features.some(f => f.includes("관리자") || f.includes("권한"))
      ? "운영"
      : "최적화"
  };
  
  return `${(parentNode.label as string) ?? ""} ${typeMap[spec.difficulty]} ${difficultyMap[spec.difficulty]} 버전`;
}
