import { Node } from "@/lib/types";

// 예시 키워드
export const EXAMPLE_KEYWORDS = ["영어", "공부"];

// 1차 아이디어 (레벨 2)
export const FIRST_LEVEL_IDEAS: Omit<Node, "id" | "parentId">[] = [
  {
    level: 2,
    label: "1안",
    title: "일일 단어 학습 앱",
    summary: "매일 새로운 단어를 학습하고 복습할 수 있는 간단한 앱",
  },
  {
    level: 2,
    label: "2안",
    title: "대화형 영어 회화 앱",
    summary: "AI와 실시간 대화를 통해 회화 실력을 향상시키는 앱",
  },
  {
    level: 2,
    label: "3안",
    title: "영어 문법 마스터 앱",
    summary: "체계적인 문법 학습과 연습 문제를 제공하는 앱",
  },
  {
    level: 2,
    label: "4안",
    title: "영어 뉴스 리더 앱",
    summary: "실제 뉴스 기사를 읽으며 어휘와 독해력을 기르는 앱",
  },
  {
    level: 2,
    label: "5안",
    title: "영어 게임화 학습 앱",
    summary: "게임 요소를 활용해 재미있게 영어를 배우는 앱",
  },
  {
    level: 2,
    label: "6안",
    title: "영어 시험 준비 앱",
    summary: "토익, 토플 등 시험 대비를 위한 종합 학습 앱",
  },
  {
    level: 2,
    label: "7안",
    title: "영어 발음 교정 앱",
    summary: "음성 인식으로 발음을 분석하고 교정해주는 앱",
  },
];

// 2차 아이디어 생성 함수 (선택된 1차 아이디어에 대해)
export function generateSecondLevel(parentLabel: string): Omit<Node, "id" | "parentId">[] {
  const templates: Record<string, Omit<Node, "id" | "parentId">[]> = {
    "1안": [
      {
        level: 3,
        label: "A안",
        title: "스페이스 리피티션 기반 학습",
        summary: "과학적 반복 학습 알고리즘으로 장기 기억 강화",
        meta: {
          features: [
            "망각 곡선 기반 최적 복습 시점 자동 계산",
            "개인별 학습 패턴 분석 및 맞춤형 반복 주기",
            "장기 기억 전환율 실시간 추적 및 조정"
          ],
          value: "과학적 방법론으로 단어를 한 번에 오래 기억하여 학습 효율 극대화"
        },
      },
      {
        level: 3,
        label: "B안",
        title: "커스텀 단어장 생성",
        summary: "사용자가 직접 단어장을 만들고 관리할 수 있는 기능",
        meta: {
          features: [
            "드래그 앤 드롭으로 간편한 단어장 구성",
            "단어 카테고리별 분류 및 태그 시스템",
            "다른 사용자와 단어장 공유 및 가져오기"
          ],
          value: "개인 학습 목표에 맞춘 맞춤형 단어장으로 효율적인 학습 관리"
        },
      },
      {
        level: 3,
        label: "C안",
        title: "퀴즈 및 테스트 기능",
        summary: "학습한 단어를 퀴즈로 확인하고 실력을 측정",
        meta: {
          features: [
            "다양한 퀴즈 유형(객관식, 주관식, 스펠링)",
            "틀린 단어 자동 재학습 및 약점 집중 연습",
            "학습 진도 및 성취도 시각화 대시보드"
          ],
          value: "즉각적인 피드백으로 학습 효과를 확인하고 약점을 보완"
        },
      },
      {
        level: 3,
        label: "D안",
        title: "일일 목표 설정 및 달성",
        summary: "매일 학습 목표를 설정하고 달성률을 추적",
        meta: {
          features: [
            "일일 학습 단어 수 목표 설정",
            "실시간 달성률 표시 및 알림",
            "연속 학습 일수 스트릭 및 보상 시스템"
          ],
          value: "명확한 목표와 시각적 피드백으로 지속적인 학습 동기 유지"
        },
      },
      {
        level: 3,
        label: "E안",
        title: "오프라인 모드 지원",
        summary: "인터넷 없이도 언제 어디서나 학습 가능",
        meta: {
          features: [
            "학습 콘텐츠 전체 오프라인 다운로드",
            "오프라인 학습 데이터 자동 동기화",
            "제한된 데이터 환경에서도 원활한 학습"
          ],
          value: "인터넷 연결 없이도 언제 어디서나 학습하여 학습 기회 극대화"
        },
      },
    ],
    "2안": [
      {
        level: 3,
        label: "A안",
        title: "실시간 음성 인식 대화",
        summary: "AI가 사용자의 발음을 실시간으로 분석하고 피드백 제공",
        meta: {
          features: [
            "음성 인식 기반 실시간 발음 정확도 측정",
            "대화 중 즉시 문법 및 표현 교정",
            "자연스러운 대화 흐름 유지하며 학습"
          ],
          value: "실시간 피드백으로 즉각적인 교정이 가능하여 빠른 회화 실력 향상"
        },
      },
      {
        level: 3,
        label: "B안",
        title: "상황별 대화 시나리오",
        summary: "여행, 비즈니스 등 다양한 상황별 대화 연습",
        meta: {
          features: [
            "20개 이상의 실생활 상황별 대화 시나리오",
            "상황별 필수 표현 및 문장 패턴 학습",
            "시나리오 완료 후 실제 상황 적용 연습"
          ],
          value: "실제 상황에서 바로 쓸 수 있는 실용적인 영어 표현 습득"
        },
      },
      {
        level: 3,
        label: "C안",
        title: "원어민 발음 비교",
        summary: "사용자 발음과 원어민 발음을 비교 분석",
        meta: {
          features: [
            "음파 분석으로 발음 차이 시각화",
            "음소 단위 발음 비교 및 교정 가이드",
            "원어민 발음 듣기 및 따라하기 연습"
          ],
          value: "정확한 발음 비교로 원어민에 가까운 자연스러운 발음 구사"
        },
      },
      {
        level: 3,
        label: "D안",
        title: "대화 기록 및 분석",
        summary: "대화 내용을 저장하고 약점을 분석하여 개선점 제시",
        meta: {
          features: [
            "모든 대화 내용 자동 저장 및 검색",
            "AI 기반 약점 분석 및 개선 우선순위 제시",
            "시간대별 회화 실력 향상 그래프"
          ],
          value: "체계적인 학습 기록으로 지속적인 개선 및 성장 추적"
        },
      },
      {
        level: 3,
        label: "E안",
        title: "레벨별 맞춤 대화",
        summary: "초급부터 고급까지 레벨에 맞는 대화 제공",
        meta: {
          features: [
            "초기 레벨 테스트로 개인 수준 진단",
            "레벨별 맞춤 대화 난이도 자동 조절",
            "레벨 업 시 다음 단계 대화 자동 해제"
          ],
          value: "개인 수준에 맞춘 학습으로 부담 없이 단계적 실력 향상"
        },
      },
    ],
    "4안": [
      {
        level: 3,
        label: "A안",
        title: "실시간 뉴스 기사 읽기 및 어휘 학습",
        summary: "최신 뉴스 기사를 읽으며 모르는 단어를 즉시 학습하고 문맥을 이해하는 기능",
        meta: {
          features: [
            "뉴스 기사 실시간 업데이트 및 난이도별 필터링",
            "터치 한 번으로 단어 뜻, 발음, 예문 즉시 확인",
            "읽은 기사 기반 개인 어휘장 자동 생성"
          ],
          value: "실제 사용되는 영어를 배우며 최신 정보까지 습득하는 일석이조 효과"
        },
      },
      {
        level: 3,
        label: "B안",
        title: "주제별 뉴스 큐레이션 및 독해 훈련",
        summary: "관심 주제의 뉴스를 모아 제공하고 단계별 독해 연습을 진행하는 기능",
        meta: {
          features: [
            "사용자 관심사 기반 뉴스 주제 자동 추천",
            "초급/중급/고급별 맞춤 독해 문제 제공",
            "읽기 속도 및 이해도 측정 및 개선 추적"
          ],
          value: "개인 관심사와 레벨에 맞춘 맞춤형 학습으로 지속적인 동기부여"
        },
      },
      {
        level: 3,
        label: "C안",
        title: "뉴스 기사 오디오 및 듣기 훈련",
        summary: "뉴스 기사를 오디오로 들으며 듣기 실력을 향상시키는 기능",
        meta: {
          features: [
            "원어민 성우의 자연스러운 뉴스 낭독 제공",
            "속도 조절(0.5x~2.0x) 및 반복 재생 기능",
            "듣기 후 퀴즈로 이해도 확인 및 어휘 복습"
          ],
          value: "읽기와 듣기를 동시에 연습하여 종합적인 영어 실력 향상"
        },
      },
      {
        level: 3,
        label: "D안",
        title: "뉴스 기사 요약 및 작문 연습",
        summary: "읽은 뉴스 기사를 요약하고 자신의 의견을 영어로 작성하는 기능",
        meta: {
          features: [
            "AI 기반 요약 가이드 및 템플릿 제공",
            "작문 피드백 및 문법 교정 자동 제공",
            "주제별 작문 모음 및 학습 진도 관리"
          ],
          value: "읽기에서 쓰기로 확장하여 실제 영어 활용 능력 극대화"
        },
      },
      {
        level: 3,
        label: "E안",
        title: "뉴스 기사 기반 토론 및 회화 연습",
        summary: "뉴스 주제를 바탕으로 AI와 토론하거나 회화 연습을 진행하는 기능",
        meta: {
          features: [
            "뉴스 주제별 토론 질문 자동 생성",
            "AI와 실시간 대화 및 의견 교환",
            "토론 내용 녹음 및 발음/문법 피드백"
          ],
          value: "수동적 읽기를 능동적 말하기로 전환하여 실전 영어 실력 구축"
        },
      },
    ],
    "7안": [
      {
        level: 3,
        label: "A안",
        title: "실시간 발음 분석 및 즉시 피드백",
        summary: "사용자가 말하는 단어나 문장의 발음을 실시간으로 분석하고 즉시 교정 피드백을 제공하는 기능",
        meta: {
          features: [
            "음성 인식 기반 발음 정확도 실시간 측정",
            "원어민 발음과 비교 분석 및 차이점 시각화",
            "문제 있는 발음 부위별 구체적 교정 방법 제시"
          ],
          value: "즉각적인 피드백으로 발음 습관을 바로잡아 효율적인 학습"
        },
      },
      {
        level: 3,
        label: "B안",
        title: "단어별 발음 연습 및 마스터 시스템",
        summary: "개별 단어의 발음을 단계별로 연습하고 완벽하게 마스터할 때까지 반복 학습하는 기능",
        meta: {
          features: [
            "자주 틀리는 발음 단어 자동 추적 및 연습",
            "음소 단위 발음 분석(자음/모음/강세)",
            "발음 마스터 달성 시 다음 단어로 자동 진행"
          ],
          value: "체계적인 단계별 학습으로 근본적인 발음 실력 향상"
        },
      },
      {
        level: 3,
        label: "C안",
        title: "문장 및 대화 발음 연습",
        summary: "실제 대화 상황에서 사용하는 문장과 대화를 연습하며 자연스러운 발음을 익히는 기능",
        meta: {
          features: [
            "상황별 대화 시나리오 발음 연습(주문, 길 묻기 등)",
            "연속 발화 시 리듬과 억양 교정",
            "대화 녹음 및 전체 발음 점수 종합 평가"
          ],
          value: "실생활에서 바로 쓸 수 있는 자연스러운 발음 습득"
        },
      },
      {
        level: 3,
        label: "D안",
        title: "발음 게임화 및 챌린지",
        summary: "게임 요소를 활용해 발음 연습을 재미있게 만들고 지속적인 동기부여를 제공하는 기능",
        meta: {
          features: [
            "발음 정확도 기반 포인트 및 레벨 시스템",
            "일일/주간 발음 챌린지 및 친구와 경쟁",
            "발음 마스터 배지 및 성취 시스템"
          ],
          value: "재미있는 게임화로 지루한 발음 연습을 즐거운 경험으로 전환"
        },
      },
      {
        level: 3,
        label: "E안",
        title: "맞춤형 발음 커리큘럼 및 진도 관리",
        summary: "사용자의 발음 수준과 약점을 분석하여 개인별 맞춤 커리큘럼을 제공하고 진도를 관리하는 기능",
        meta: {
          features: [
            "초기 발음 평가로 개인별 약점 진단",
            "약점 기반 맞춤 학습 경로 자동 생성",
            "학습 진도 대시보드 및 발음 향상 그래프"
          ],
          value: "개인 맞춤형 학습으로 시간 낭비 없이 효율적으로 발음 실력 향상"
        },
      },
    ],
  };

  return templates[parentLabel] || [
    {
      level: 3,
      label: "A안",
      title: `${parentLabel}의 세부 방안 A`,
      summary: "세부 기능 및 접근 방식 A",
      meta: {
        features: [
          "핵심 기능 1",
          "핵심 기능 2",
          "핵심 기능 3"
        ],
        value: "사용자 가치 및 차별점 설명"
      },
    },
    {
      level: 3,
      label: "B안",
      title: `${parentLabel}의 세부 방안 B`,
      summary: "세부 기능 및 접근 방식 B",
      meta: {
        features: [
          "핵심 기능 1",
          "핵심 기능 2"
        ],
        value: "사용자 가치 및 차별점 설명"
      },
    },
    {
      level: 3,
      label: "C안",
      title: `${parentLabel}의 세부 방안 C`,
      summary: "세부 기능 및 접근 방식 C",
      meta: {
        features: [
          "핵심 기능 1",
          "핵심 기능 2",
          "핵심 기능 3"
        ],
        value: "사용자 가치 및 차별점 설명"
      },
    },
    {
      level: 3,
      label: "D안",
      title: `${parentLabel}의 세부 방안 D`,
      summary: "세부 기능 및 접근 방식 D",
      meta: {
        features: [
          "핵심 기능 1",
          "핵심 기능 2"
        ],
        value: "사용자 가치 및 차별점 설명"
      },
    },
    {
      level: 3,
      label: "E안",
      title: `${parentLabel}의 세부 방안 E`,
      summary: "세부 기능 및 접근 방식 E",
      meta: {
        features: [
          "핵심 기능 1",
          "핵심 기능 2",
          "핵심 기능 3"
        ],
        value: "사용자 가치 및 차별점 설명"
      },
    },
  ];
}

// 3차 아이디어 생성 함수 (선택된 2차 아이디어에 대해)
export function generateThirdLevel(parentLabel: string, grandParentLabel: string): Omit<Node, "id" | "parentId">[] {
  const templates: Record<string, Omit<Node, "id" | "parentId">[]> = {
    "1안-A안": [
      {
        level: 4,
        label: "첫번째 안",
        title: "간격 반복 알고리즘 최적화",
        summary: "개인별 학습 패턴에 맞춘 맞춤형 반복 주기 설정",
      },
      {
        level: 4,
        label: "두번째 안",
        title: "시각적 학습 보조 도구",
        summary: "이미지, 플래시카드 등 시각적 요소로 기억력 향상",
      },
      {
        level: 4,
        label: "세번째 안",
        title: "소셜 학습 기능",
        summary: "친구와 함께 학습하고 경쟁하며 동기부여",
      },
      {
        level: 4,
        label: "네번째 안",
        title: "통계 및 분석 대시보드",
        summary: "학습 진행 상황을 한눈에 볼 수 있는 상세 통계",
      },
    ],
    "2안-A안": [
      {
        level: 4,
        label: "첫번째 안",
        title: "실시간 발음 점수 제공",
        summary: "대화 중 실시간으로 발음 정확도를 점수로 표시",
      },
      {
        level: 4,
        label: "두번째 안",
        title: "대화 주제 자동 추천",
        summary: "사용자 관심사와 레벨에 맞는 대화 주제 제안",
      },
      {
        level: 4,
        label: "세번째 안",
        title: "대화 녹음 및 재생",
        summary: "대화 내용을 녹음하고 나중에 다시 들어보며 복습",
      },
      {
        level: 4,
        label: "네번째 안",
        title: "맞춤형 피드백 시스템",
        summary: "AI가 대화 내용을 분석해 구체적인 개선 사항 제시",
      },
    ],
  };

  const key = `${grandParentLabel}-${parentLabel}`;
  return templates[key] || [
    {
      level: 4,
      label: "첫번째 안",
      title: `${parentLabel}의 구체적 실행 방안 1`,
      summary: "세부 구현 방법 및 특징 1",
    },
    {
      level: 4,
      label: "두번째 안",
      title: `${parentLabel}의 구체적 실행 방안 2`,
      summary: "세부 구현 방법 및 특징 2",
    },
    {
      level: 4,
      label: "세번째 안",
      title: `${parentLabel}의 구체적 실행 방안 3`,
      summary: "세부 구현 방법 및 특징 3",
    },
    {
      level: 4,
      label: "네번째 안",
      title: `${parentLabel}의 구체적 실행 방안 4`,
      summary: "세부 구현 방법 및 특징 4",
    },
  ];
}

