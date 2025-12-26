# i18n 구현 요약 문서

## 1. 수정된 파일 전체 경로 목록

### 설정 파일
- `i18n.ts` - i18n 설정 및 locale 관리
- `middleware.ts` - next-intl 미들웨어 설정
- `next.config.js` - 변경 없음 (추가 설정 불필요)

### 번역 파일
- `messages/ko.json` - 한국어 번역 파일
- `messages/en.json` - 영어 번역 파일

### 컴포넌트 파일
- `app/layout.tsx` - NextIntlClientProvider 추가
- `components/LanguageToggle.tsx` - 언어 전환 토글 컴포넌트 (신규 생성)
- `components/Header.tsx` - 번역 적용 및 LanguageToggle 추가
- `components/Footer.tsx` - 번역 적용
- `components/KeywordInputForm.tsx` - 번역 적용
- `components/IdeaTree.tsx` - 번역 적용 (주요 텍스트)
- `app/(product)/app/page.tsx` - 번역 적용 (로딩 메시지 및 UI 텍스트)

### 미완료 컴포넌트 (추가 작업 필요)
- `components/ArchitectureCard.tsx`
- `components/PlanDetail.tsx`
- `components/AppNamingSection.tsx`
- `components/PaywallModal.tsx`
- `components/SaveButton.tsx`
- `app/(site)/page.tsx`
- `app/(site)/history/page.tsx`
- `app/(site)/history/[id]/page.tsx`
- `app/(site)/about/page.tsx`
- `app/(site)/pricing/page.tsx`

## 2. 번역 파일 전체 내용

### messages/ko.json
```json
{
  "common": {
    "appName": "AutoAppArch",
    "mobileApp": "모바일 앱",
    "mobileAppArchitecture": "모바일 앱 설계안 생성",
    "loading": "로딩 중...",
    "error": "오류",
    "close": "닫기",
    "copy": "복사",
    "save": "저장",
    "cancel": "취소",
    "confirm": "확인",
    "delete": "삭제",
    "edit": "편집",
    "view": "보기"
  },
  "nav": {
    "createApp": "앱 만들기",
    "history": "히스토리",
    "pricing": "요금제",
    "about": "소개"
  },
  "keywordInput": {
    "title": "키워드 입력",
    "description": "앱에 포함하고 싶은 키워드를 입력하세요",
    "placeholder": "예: 영어, 공부 / 분실물, 지도 / 다이어트, 기록",
    "submitButton": "앱 설계안 자동 생성하기",
    "generating": "생성 중...",
    "errorMinKeywords": "최소 1개 이상의 키워드를 입력해주세요.",
    "warningSingleKeyword": "💡 2개 이상의 키워드를 권장합니다. 더 정확한 설계안이 생성됩니다.",
    "errorMaxKeywords": "키워드는 최대 6개까지 입력 가능합니다.",
    "errorKeywordLength": "키워드는 20자 이하로 입력해주세요.",
    "labelAria": "키워드 입력",
    "buttonAriaGenerating": "앱 설계안 생성 중",
    "buttonAria": "앱 설계안 자동 생성하기"
  },
  "ideaTree": {
    "currentSelection": "현재 선택",
    "level1": "1차",
    "level2": "2차",
    "levelN": "{level}차",
    "selected": "선택됨",
    "level1Ideas": "1차 아이디어",
    "levelNIdeas": "{level}차 분기 아이디어",
    "level1Description": "키워드를 기준으로 생성된 초기 아이디어입니다",
    "levelNDescription": "선택된 상위 안을 기준으로 생성된 분기 아이디어입니다",
    "childrenCount": "{count}개의 하위 안 생성됨",
    "regenerate": "재생성",
    "finalizeButton": "이 설계로 결정하기",
    "regenerateFirstLevel": "다른 1차 아이디어가 필요하신가요?",
    "regenerateFirstLevelDescription": "재생성하면 다른 7개의 안이 생성됩니다",
    "regenerateFirstLevelButton": "다른 안 생성",
    "noIdeasSelected": "선택된 아이디어가 없습니다",
    "selectToGenerate": "1차 아이디어를 선택하면 2차 분기 아이디어가 생성됩니다",
    "selectToFinalize": "2차 아이디어를 선택하면 최종 설계안을 생성할 수 있습니다",
    "comparing": "비교 중",
    "comparisonTitle": "선택된 안 비교"
  },
  "architectureCard": {
    "viewDetails": "상세 보기",
    "hideDetails": "상세 숨기기",
    "valueProposition": "가치 제안",
    "contextTags": "적합한 상황",
    "topFeatures": "포함 기능 Top 3",
    "warning": "주의/리스크",
    "coreScreens": "핵심 화면",
    "coreFeatures": "핵심 기능",
    "dataEntities": "데이터 엔티티",
    "apiEndpoints": "API 엔드포인트",
    "architectureComponents": "아키텍처 구성요소",
    "difficulty": "난이도",
    "duration": "예상 기간",
    "targetUser": "핵심 사용자"
  },
  "difficulty": {
    "beginner": "초급",
    "intermediate": "중급",
    "advanced": "상급",
    "beginnerDesc": "단일 구성 중심(기본 인증/기본 로그), 운영 자동화/분산 제외",
    "intermediateDesc": "캐시/권한/비동기 중 일부 포함, 설정/운영 포인트 증가",
    "advancedDesc": "고가용성/보안/관측성/운영 포함, 구성요소 증가로 운영 난이도 높음"
  },
  "duration": {
    "desc": "1인 기준 기본 구현+기본 테스트 추정치이며, 외부연동/운영요소 포함 시 증가 가능"
  },
  "planDetail": {
    "description": "이 페이지는 생성될 앱의 기획서입니다.",
    "title": "자동 생성된 <span>앱 설계안</span>",
    "inputKeywords": "입력 <span>키워드</span>",
    "userPerspective": "[사용자 관점]",
    "developerPerspective": "[개발자 관점]",
    "developerPerspectiveDesc": "앱 제작자(개발자)의 관점에서 작성된 내용입니다."
  },
  "appNaming": {
    "title": "앱 이름 추천(프리미엄)",
    "previewTitle": "추천 앱 이름",
    "viewAllButton": "전체 이름 후보 보기(프리미엄)",
    "trademarkNotice": "상표/도메인 중복 여부는 별도 확인이 필요합니다.",
    "types": {
      "intuitive": "직관형 (무엇 하는 앱인지 즉시 알 수 있는)",
      "emotional": "감성형 (동기/습관/성취)",
      "professional": "전문형 (신뢰/체계/관리)",
      "casual": "캐주얼형 (가볍고 친근)"
    }
  },
  "loading": {
    "analyzingKeywords": "키워드를 분석 중입니다…",
    "generatingIdeas": "1차 아이디어를 생성하고 있습니다…",
    "regeneratingIdeas": "1차 아이디어를 재생성하고 있습니다…",
    "generatingPlan": "설계안을 생성하고 있습니다…",
    "finalizing": "최종 설계안을 생성하고 있습니다…"
  },
  "history": {
    "title": "히스토리",
    "empty": "저장된 설계안이 없습니다",
    "noResults": "결과 없음",
    "createdAt": "생성일"
  },
  "footer": {
    "description": "키워드로 앱 설계안을 자동 생성하는 도구",
    "allRightsReserved": "© 2024 AutoAppArch. All rights reserved.",
    "services": "서비스",
    "information": "정보",
    "contact": "문의"
  },
  "errors": {
    "generationFailed": "아이디어 생성에 실패했습니다. 다시 시도해주세요.",
    "saveFailed": "저장에 실패했습니다.",
    "deleteFailed": "삭제에 실패했습니다."
  }
}
```

### messages/en.json
```json
{
  "common": {
    "appName": "AutoAppArch",
    "mobileApp": "Mobile App",
    "mobileAppArchitecture": "Mobile app architecture",
    "loading": "Loading...",
    "error": "Error",
    "close": "Close",
    "copy": "Copy",
    "save": "Save",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "delete": "Delete",
    "edit": "Edit",
    "view": "View"
  },
  "nav": {
    "createApp": "Create App",
    "history": "History",
    "pricing": "Pricing",
    "about": "About"
  },
  "keywordInput": {
    "title": "Enter Keywords",
    "description": "Enter keywords you want to include in your app",
    "placeholder": "e.g., English, Study / Lost Items, Map / Diet, Record",
    "submitButton": "Generate App Architecture",
    "generating": "Generating...",
    "errorMinKeywords": "Please enter at least 1 keyword.",
    "warningSingleKeyword": "💡 We recommend 2 or more keywords for more accurate architecture.",
    "errorMaxKeywords": "You can enter up to 6 keywords.",
    "errorKeywordLength": "Keywords must be 20 characters or less.",
    "labelAria": "Keyword input",
    "buttonAriaGenerating": "Generating app architecture",
    "buttonAria": "Generate app architecture automatically"
  },
  "ideaTree": {
    "currentSelection": "Current Selection",
    "level1": "1st",
    "level2": "2nd",
    "levelN": "{level}th",
    "selected": "Selected",
    "level1Ideas": "1st Level Ideas",
    "levelNIdeas": "{level}th Level Branch Ideas",
    "level1Description": "Initial ideas generated based on keywords",
    "levelNDescription": "Branch ideas generated based on selected parent options",
    "childrenCount": "{count} sub-options generated",
    "regenerate": "Regenerate",
    "finalizeButton": "Decide with this design",
    "regenerateFirstLevel": "Need different 1st level ideas?",
    "regenerateFirstLevelDescription": "Regenerating will create 7 different options",
    "regenerateFirstLevelButton": "Generate Other Ideas",
    "noIdeasSelected": "No ideas selected",
    "selectToGenerate": "Select a 1st level idea to generate 2nd level branch ideas",
    "selectToFinalize": "Select a 2nd level idea to generate the final architecture",
    "comparing": "Comparing",
    "comparisonTitle": "Comparing Selected Options"
  },
  "architectureCard": {
    "viewDetails": "View Details",
    "hideDetails": "Hide Details",
    "valueProposition": "Value Proposition",
    "contextTags": "Suitable Context",
    "topFeatures": "Top 3 Features",
    "warning": "Warning/Risk",
    "coreScreens": "Core Screens",
    "coreFeatures": "Core Features",
    "dataEntities": "Data Entities",
    "apiEndpoints": "API Endpoints",
    "architectureComponents": "Architecture Components",
    "difficulty": "Difficulty",
    "duration": "Estimated Duration",
    "targetUser": "Target User"
  },
  "difficulty": {
    "beginner": "Beginner",
    "intermediate": "Intermediate",
    "advanced": "Advanced",
    "beginnerDesc": "Single component focus (basic auth/basic logs), excludes automation/distribution",
    "intermediateDesc": "Includes some of cache/permissions/async, increased setup/operation points",
    "advancedDesc": "Includes high availability/security/observability/operations, increased operational difficulty due to more components"
  },
  "duration": {
    "desc": "Estimated for 1 developer full-time, includes 'basic implementation + basic testing'; may increase with external integrations/operational elements"
  },
  "planDetail": {
    "description": "This page is the specification document for the app to be created.",
    "title": "Auto-generated <span>App Architecture</span>",
    "inputKeywords": "Input <span>Keywords</span>",
    "userPerspective": "[User Perspective]",
    "developerPerspective": "[Developer Perspective]",
    "developerPerspectiveDesc": "Content written from the app creator (developer) perspective."
  },
  "appNaming": {
    "title": "App Name Recommendations (Premium)",
    "previewTitle": "Recommended App Name",
    "viewAllButton": "View All Name Candidates (Premium)",
    "trademarkNotice": "Trademark/domain duplication needs separate verification.",
    "types": {
      "intuitive": "Intuitive (Immediately clear what the app does)",
      "emotional": "Emotional (Motivation/Habit/Achievement)",
      "professional": "Professional (Trust/System/Management)",
      "casual": "Casual (Light and friendly)"
    }
  },
  "loading": {
    "analyzingKeywords": "Analyzing keywords…",
    "generatingIdeas": "Generating 1st level ideas…",
    "regeneratingIdeas": "Regenerating 1st level ideas…",
    "generatingPlan": "Generating architecture…",
    "finalizing": "Generating final architecture…"
  },
  "history": {
    "title": "History",
    "empty": "No saved architectures",
    "noResults": "No results",
    "createdAt": "Created at"
  },
  "footer": {
    "description": "A tool that automatically generates app architectures from keywords",
    "allRightsReserved": "© 2024 AutoAppArch. All rights reserved.",
    "services": "Services",
    "information": "Information",
    "contact": "Contact"
  },
  "errors": {
    "generationFailed": "Failed to generate ideas. Please try again.",
    "saveFailed": "Failed to save.",
    "deleteFailed": "Failed to delete."
  }
}
```

## 3. 언어 토글 구현 코드 전체

### components/LanguageToggle.tsx
```typescript
"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n";

export default function LanguageToggle() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;
    
    // 쿠키 설정 및 페이지 새로고침
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
            locale === loc
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
          aria-label={`Switch to ${loc === "ko" ? "Korean" : "English"}`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
```

## 4. QA 체크리스트 12개

### 언어 전환 관련
1. ✅ 헤더 우측의 언어 토글(KO/EN) 버튼이 정상적으로 표시되는가?
2. ✅ 언어 토글을 클릭하면 즉시 언어가 전환되는가?
3. ✅ 언어 전환 후 페이지 새로고침 시 선택한 언어가 유지되는가? (쿠키 저장 확인)
4. ✅ 브라우저를 완전히 종료 후 재접속 시에도 선택한 언어가 유지되는가?

### 번역 적용 관련
5. ✅ 한국어(KO) 모드에서 모든 텍스트가 한국어로 표시되는가?
6. ✅ 영어(EN) 모드에서 모든 텍스트가 영어로 표시되는가?
7. ✅ 번역되지 않은 하드코딩 텍스트가 없는가? (콘솔 에러 확인)

### 모바일 앱 고정 확인
8. ✅ 한국어/영어 모두에서 "모바일 앱 설계안 생성" 또는 "Mobile app architecture" 문구만 표시되는가?
9. ✅ "웹 서비스", "Web Service", "앱 유형 선택" 등의 웹 관련 문구가 전혀 없는가?
10. ✅ 라디오 버튼이나 선택 UI가 없는가?

### 레이아웃 및 가독성
11. ✅ 영어 버전에서 긴 문장이 레이아웃을 깨뜨리지 않는가? (버튼, 카드, 칩 등)
12. ✅ 영어 버전에서 텍스트 오버플로우가 발생하지 않는가? (word-break, overflow 처리 확인)

## 5. 추가 작업 필요 사항

다음 컴포넌트들에도 번역을 적용해야 합니다:

1. `components/ArchitectureCard.tsx` - 카드 내부 텍스트
2. `components/PlanDetail.tsx` - 설계안 상세 페이지
3. `components/AppNamingSection.tsx` - 앱 이름 추천 섹션
4. `components/PaywallModal.tsx` - 결제 모달
5. `components/SaveButton.tsx` - 저장 버튼
6. `app/(site)/page.tsx` - 랜딩 페이지
7. `app/(site)/history/page.tsx` - 히스토리 목록
8. `app/(site)/history/[id]/page.tsx` - 히스토리 상세
9. `app/(site)/about/page.tsx` - 소개 페이지
10. `app/(site)/pricing/page.tsx` - 요금제 페이지

각 컴포넌트에 `useTranslations` hook을 추가하고 하드코딩된 텍스트를 번역 키로 교체하면 됩니다.

