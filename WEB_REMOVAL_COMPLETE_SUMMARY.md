# 웹 서비스 UI 완전 제거 - 최종 변경 사항 요약

## A) 삭제/수정한 파일 전체 경로 목록

1. **components/KeywordInputForm.tsx** - "플랫폼" 라벨과 배지 완전 제거, 작은 문구 추가
2. **app/(product)/app/page.tsx** - "📱 현재 기준: 모바일 앱" 배지 제거, 작은 문구로 대체
3. **app/(site)/history/[id]/page.tsx** - 배지 제거, 작은 문구로 대체
4. **app/(product)/history_off/[id]/page.tsx** - 배지 제거, 작은 문구로 대체
5. **app/(product)/history_off/page.tsx** - 배지 제거, 작은 문구로 대체
6. **app/(site)/page.tsx** - URL 파라미터에서 type 제거

## B) 변경된 파일 전체 코드

### 1. components/KeywordInputForm.tsx

**변경 내용:**
- "플랫폼" 라벨과 "📱 모바일 앱" 배지 완전 제거
- 대신 상단에 작은 문구 "모바일 앱 설계안 생성" 추가

```typescript
return (
  <form onSubmit={handleSubmit} className="space-y-8">
    <div>
      <p className="text-xs text-gray-500 mb-4">모바일 앱 설계안 생성</p>
    </div>

    <div>
      {/* 키워드 입력 필드 */}
      ...
    </div>
    ...
  </form>
);
```

### 2. app/(product)/app/page.tsx

**변경 내용:**
- "📱 현재 기준: 모바일 앱" 배지 제거
- 작은 문구 "모바일 앱 설계안 생성" 추가 (2곳)

**변경 전:**
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

**변경 후:**
```typescript
<h2 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">
  마인드맵 아이디어 생성
</h2>
<p className="text-xs text-gray-500 mb-1">모바일 앱 설계안 생성</p>
<p className="text-sm text-gray-700 mb-4">
  키워드: <span className="font-medium text-gray-900">{(session.keywords || []).join(", ")}</span>
</p>
```

최종 설계안 화면에서도 동일하게 변경:
```typescript
<h3 className="text-lg font-semibold text-gray-900 mb-1 tracking-tight">
  최종 설계안이 완성되었습니다!
</h3>
<p className="text-xs text-gray-500 mb-2">모바일 앱 설계안 생성</p>
<p className="text-sm text-gray-500">
  아래 설계안을 확인하세요.
</p>
```

### 3. app/(site)/history/[id]/page.tsx

**변경 내용:**
- 배지 제거, 작은 문구로 대체

**변경 전:**
```typescript
<div className="flex items-center gap-3">
  <p className="text-sm text-gray-700">
    키워드: <span className="font-medium text-gray-900">{(session.keywords || []).join(", ")}</span>
  </p>
  <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-900 border border-blue-200 rounded">
    📱 현재 기준: 모바일 앱
  </span>
</div>
```

**변경 후:**
```typescript
<p className="text-xs text-gray-500 mb-1">모바일 앱 설계안 생성</p>
<p className="text-sm text-gray-700">
  키워드: <span className="font-medium text-gray-900">{(session.keywords || []).join(", ")}</span>
</p>
```

### 4. app/(product)/history_off/[id]/page.tsx

**변경 내용:**
- 배지 제거, 작은 문구로 대체

**변경 전:**
```typescript
<p className="text-sm text-gray-400">
  키워드: <span className="font-medium text-gray-700">{(session.keywords || []).join(", ")}</span>
  <span className="ml-3 px-2 py-1 text-xs font-medium bg-blue-50 text-blue-900 border border-blue-200 rounded">
    📱 현재 기준: 모바일 앱
  </span>
</p>
```

**변경 후:**
```typescript
<p className="text-xs text-gray-500 mb-1">모바일 앱 설계안 생성</p>
<p className="text-sm text-gray-700 mb-2">
  키워드: <span className="font-medium text-gray-900">{(session.keywords || []).join(", ")}</span>
</p>
```

### 5. app/(product)/history_off/page.tsx

**변경 내용:**
- 배지 제거, 작은 문구로 대체

**변경 전:**
```typescript
<p className="text-base text-gray-500 mb-3">
  <span className="font-medium text-gray-700">키워드</span>: {(session.keywords || []).join(", ")}
  <span className="ml-3 px-2 py-1 text-xs font-medium bg-blue-50 text-blue-900 border border-blue-200 rounded">
    📱 모바일 앱
  </span>
</p>
```

**변경 후:**
```typescript
<p className="text-xs text-gray-500 mb-1">모바일 앱 설계안 생성</p>
<p className="text-base text-gray-700 mb-3">
  <span className="font-medium text-gray-900">키워드</span>: {(session.keywords || []).join(", ")}
</p>
```

### 6. app/(site)/page.tsx

**변경 내용:**
- URL 파라미터에서 type 제거 (항상 "app"이므로 불필요)

**변경 전:**
```typescript
const handleSubmit = async (keywords: string[], selectedType: AppType) => {
  const params = new URLSearchParams({
    keywords: keywords.join(","),
    type: selectedType,
  });
  router.push(`/app?${params.toString()}`);
};
```

**변경 후:**
```typescript
const handleSubmit = async (keywords: string[], selectedType: AppType) => {
  const params = new URLSearchParams({
    keywords: keywords.join(","),
  });
  router.push(`/app?${params.toString()}`);
};
```

## C) QA 체크리스트 8개

### UI 제거 확인
1. [ ] 첫 화면(KeywordInputForm)에서 "플랫폼" 라벨과 배지가 완전히 제거되었고, 대신 작은 문구 "모바일 앱 설계안 생성"만 표시됨
2. [ ] 아이디어 생성 화면에서 "📱 현재 기준: 모바일 앱" 배지가 제거되고 작은 문구로 대체됨
3. [ ] 최종 설계안 화면에서 배지가 제거되고 작은 문구로 대체됨
4. [ ] 히스토리 상세 페이지에서 배지가 제거되고 작은 문구로 대체됨

### 웹 흔적 0% 확인
5. [ ] 화면 어디에도 "웹 서비스" 문구가 표시되지 않음
6. [ ] 화면 어디에도 라디오 버튼이나 선택 UI가 없음
7. [ ] 생성된 아이디어나 설계안에 "웹 서비스" 관련 키워드가 포함되지 않음 (SSR, SEO, admin page, API routes 등)

### 문구 표시 확인
8. [ ] 모든 화면에서 작은 회색 문구("모바일 앱 설계안 생성")가 적절한 위치에 표시됨

