# 웹 서비스 옵션 제거 - 변경 사항 요약

## A) 수정된 파일 전체 경로 목록

1. **lib/types.ts** - AppType을 "app"만 허용하도록 변경
2. **lib/appType.ts** - normalizeAppType 함수가 항상 "app" 반환
3. **components/KeywordInputForm.tsx** - 웹 서비스 라디오 버튼 제거, 모바일 앱 고정 배지로 표시
4. **lib/generateIdeas.ts** - web 분기 제거, 모바일 앱만 지원
5. **lib/generatePlan.ts** - web 분기 제거, 모바일 앱만 지원
6. **lib/generateTopic.ts** - web 분기 제거, 모바일 앱만 지원
7. **app/(product)/app/page.tsx** - web 관련 UI 제거, "현재 기준: 모바일 앱" 표시 추가
8. **app/(site)/page.tsx** - web 관련 코드는 이미 "app"만 사용하고 있었음
9. **app/(site)/history/[id]/page.tsx** - web 관련 UI 제거, "현재 기준: 모바일 앱" 표시 추가
10. **app/(product)/history_off/[id]/page.tsx** - web 관련 UI 제거 (레거시 파일)
11. **app/(product)/history_off/page.tsx** - web 관련 UI 제거 (레거시 파일)

## B) 변경된 파일 핵심 코드

### 1. lib/types.ts
```typescript
export type AppType = "app"; // 모바일 앱만 지원
```

### 2. lib/appType.ts
```typescript
export function normalizeAppType(value: unknown): AppType {
  // 모바일 앱만 지원
  return "app";
}
```

### 3. components/KeywordInputForm.tsx
- 라디오 버튼 제거, 모바일 앱 고정 배지로 변경:
```typescript
<div className="w-full flex flex-col items-start gap-2">
  <label className="w-full text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
    플랫폼
  </label>
  <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-md">
    <span className="text-base font-medium text-blue-900">📱 모바일 앱</span>
  </div>
</div>
```
- onSubmit에서 항상 "app" 전달:
```typescript
onSubmit(normalized, "app"); // 모바일 앱만 지원
```

### 4. lib/generateIdeas.ts
- 모든 web 분기 제거:
```typescript
const typeStr = "앱"; // 모바일 앱만 지원
const baseScreens = generateBaseScreens(keywords, true); // 모바일 앱만
const baseArchitecture = ["React Native", "Node.js", "PostgreSQL", "Firebase Auth", "Vercel"];
```

### 5. lib/generatePlan.ts
- web 분기 제거:
```typescript
// isApp 변수 제거
const coreAction = `${keywordStr} 관련 기능을 통해 사용자가 주요 목표를 달성하는 행동`;
return {
  title: `${keywordStr} 모바일 앱 설계안`,
  tagline: `${keywordStr}를 중심으로 한 모바일 앱 기획서`,
  // ...
};
```

### 6. lib/generateTopic.ts
- web 분기 제거:
```typescript
const topicTitle = `${keywordStr} 기반 모바일 앱: ${selectedNodes[0]?.title || "통합 솔루션"}`;
const description = `${keywordStr}를 중심으로 한 모바일 앱입니다. ...`;
const uniqueValue = `${selectedNodes.length}개의 핵심 아이디어를 통합한 앱으로, ...`;
```

### 7. app/(product)/app/page.tsx
- "현재 기준: 모바일 앱" 배지 추가:
```typescript
<div className="flex items-center gap-3 mb-4">
  <p className="text-sm text-gray-700">
    키워드: <span className="font-medium text-gray-900">{(session.keywords || []).join(", ")}</span>
  </p>
  <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-900 border border-blue-200 rounded">
    📱 현재 기준: 모바일 앱
  </span>
</div>
```
- 최종 설계안 표시 화면에도 배지 추가
- URL 파라미터 처리에서 typeParam 관련 로직 단순화

### 8. app/(site)/history/[id]/page.tsx
- web 관련 조건부 표시 제거, 모바일 앱 배지로 고정

## C) QA 수동 테스트 체크리스트 (10개)

### 웹 서비스 옵션 제거 확인
1. [ ] 첫 화면(KeywordInputForm)에서 웹 서비스 라디오 버튼이 없고, "📱 모바일 앱" 배지만 표시됨
2. [ ] 키워드 입력 후 생성되는 모든 아이디어에 "앱" 문구만 사용되고 "웹 서비스" 문구가 없음
3. [ ] 생성된 설계안의 제목에 "모바일 앱 설계안"만 표시되고 "웹 서비스" 문구가 없음
4. [ ] 히스토리 페이지에서 모든 항목에 "모바일 앱"만 표시되고 "웹 서비스" 문구가 없음

### 모바일 앱 고정 표시 확인
5. [ ] 아이디어 생성 화면 상단에 "📱 현재 기준: 모바일 앱" 배지가 항상 표시됨
6. [ ] 최종 설계안 화면 상단에도 "📱 현재 기준: 모바일 앱" 배지가 표시됨
7. [ ] 히스토리 상세 페이지에도 "📱 현재 기준: 모바일 앱" 배지가 표시됨

### 코드 검증
8. [ ] 개발자 도구 콘솔에 web 관련 에러나 경고가 없음
9. [ ] localStorage에 저장된 selectedType이 "app"만 포함됨 (또는 저장 안 됨)
10. [ ] URL 파라미터에 type=web을 넣어도 정상적으로 "app"으로 처리됨

---

## 추가 확인 사항

- ✅ SSR/SEO/admin page/API routes 관련 키워드는 코드베이스에 없었음
- ✅ 모든 generate 함수에서 web 분기 완전 제거
- ✅ UI에서 web 관련 선택 옵션 완전 제거
- ✅ 타입 정의에서 web 옵션 제거 (AppType = "app"만 허용)
- ✅ localStorage 로직에서 web 저장/복원 관련 코드 없음 (이미 없었음)

