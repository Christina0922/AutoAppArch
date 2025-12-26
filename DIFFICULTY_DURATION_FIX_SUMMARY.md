# 난이도/기간 설명 위치 고정 및 중복 제거 작업 요약

## 1. 수정된 파일 전체 경로 목록

### 추가/수정 파일
- `app/(product)/app/page.tsx` - "마인드맵 아이디어 생성" 섹션 헤더에 4줄 설명 추가
- `components/ArchitectureCard.tsx` - 난이도/기간 툴팁 제거, BadgeWithTooltip 제거
- `components/IdeaTree.tsx` - 난이도/기간 툴팁 함수 제거, 비교표 및 IdeaCard에서 BadgeWithTooltip 제거

### 미사용 파일 (확인만)
- `components/BadgeLegend.tsx` - 이미 사용되지 않음 (이전에 제거됨)
- `components/DifficultyDurationInfo.tsx` - 이미 사용되지 않음 (이전에 제거됨)
- `components/ArchitectureCard_FULL.tsx` - 사용되지 않는 백업 파일로 보임

## 2. 변경된 파일 전체 코드

### app/(product)/app/page.tsx

변경된 섹션:
```typescript
{/* 키워드 정보 표시 */}
<div className="bg-white rounded-lg border border-gray-100 p-6">
  <div>
    <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-4 mb-2">
      <h2 className="text-xl font-semibold text-gray-900 tracking-tight flex-shrink-0">
        마인드맵 아이디어 생성
      </h2>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-600 space-y-0.5 leading-tight">
          <div>초급: 핵심 기능 위주, 단일 흐름, 운영 요소 최소</div>
          <div>중급: 권한/데이터 확장/기본 자동화 일부 포함</div>
          <div>고급: 운영/보안/관측/자동화 포함, 구성요소 많아 복잡</div>
          <div>기간: 1인 개발 기준의 대략적 구현+기본 테스트 추정치(연동/운영 포함 시 증가)</div>
        </div>
      </div>
    </div>
    <p className="text-xs text-gray-500 mb-1">{tCommon("mobileAppArchitecture")}</p>
    <p className="text-sm text-gray-700 mb-4">
      키워드: <span className="font-medium text-gray-900">{(session.keywords || []).join(", ")}</span>
    </p>
    {/* ... */}
  </div>
</div>
```

### components/ArchitectureCard.tsx

제거된 함수:
```typescript
// 제거됨
const getDifficultyTooltip = (difficulty?: string) => { ... }
const getDurationTooltip = (duration?: string) => { ... }
```

변경된 부분:
```typescript
// 변경 전
<BadgeWithTooltip
  tooltipText={getDifficultyTooltip(spec.difficulty)}
  className={...}
  ariaLabel={...}
>
  {spec.difficulty}
</BadgeWithTooltip>

// 변경 후
<span className={`text-xs px-2 py-1 rounded font-medium ${getDifficultyColor(spec.difficulty)}`}>
  {spec.difficulty}
</span>
```

제거된 import:
```typescript
// 제거됨
import BadgeWithTooltip from "./BadgeWithTooltip";
```

### components/IdeaTree.tsx

제거된 함수 (2곳):
```typescript
// ComparisonTable 함수 내부에서 제거
const getDifficultyTooltip = (difficulty?: string) => { ... }
const getDurationTooltip = (duration?: string) => { ... }

// IdeaCard 함수 내부에서 제거
const getDifficultyTooltip = (difficulty?: string) => { ... }
const getDurationTooltip = (duration?: string) => { ... }
```

변경된 부분 (비교표):
```typescript
// 변경 전
<BadgeWithTooltip
  tooltipText={getDifficultyTooltip(spec.difficulty)}
  className={...}
  ariaLabel={...}
>
  {spec.difficulty}
</BadgeWithTooltip>

// 변경 후
<span className={`inline-block text-sm px-2 py-0.5 rounded font-medium ${
  spec.difficulty === "초급" ? "bg-green-100 text-green-800" :
  spec.difficulty === "중급" ? "bg-yellow-100 text-yellow-800" :
  "bg-red-100 text-red-800"
}`}>
  {spec.difficulty}
</span>
```

변경된 부분 (IdeaCard):
```typescript
// 변경 전
<BadgeWithTooltip
  tooltipText={getDifficultyTooltip(spec.difficulty)}
  className={...}
  ariaLabel={...}
>
  {spec.difficulty}
</BadgeWithTooltip>

// 변경 후
<span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(spec.difficulty)}`}>
  {spec.difficulty}
</span>
```

제거된 import:
```typescript
// 제거됨
import BadgeWithTooltip from "./BadgeWithTooltip";
```

## 3. 제거된(또는 수정된) 툴팁/팝오버 위치와 이유

### 제거된 툴팁 위치:

1. **components/ArchitectureCard.tsx**
   - 위치: 카드 내부 난이도/기간 배지
   - 제거 이유: "마인드맵 아이디어 생성" 섹션 헤더에만 표시하도록 요구사항 변경
   - 변경 내용: BadgeWithTooltip → 일반 span 요소로 변경, tooltipText 제거

2. **components/IdeaTree.tsx - ComparisonTable**
   - 위치: 비교표의 "난이도" 및 "예상 기간" 행
   - 제거 이유: 동일한 이유
   - 변경 내용: BadgeWithTooltip → 일반 span 요소로 변경, tooltipText 제거

3. **components/IdeaTree.tsx - IdeaCard**
   - 위치: 1차 아이디어 카드의 난이도/기간 배지
   - 제거 이유: 동일한 이유
   - 변경 내용: BadgeWithTooltip → 일반 span 요소로 변경, tooltipText 제거

4. **기존에 이미 제거된 컴포넌트 (확인만)**
   - `components/BadgeLegend.tsx` - 이미 사용되지 않음 (이전에 제거됨)
   - `components/DifficultyDurationInfo.tsx` - 이미 사용되지 않음 (이전에 제거됨)

## 4. QA 체크리스트 10개

### 설명 표시 위치 확인
1. ✅ "마인드맵 아이디어 생성" 제목 오른쪽에 4줄 설명이 항상 표시되는가?
2. ✅ 모바일에서도 설명이 표시되며 줄바꿈으로 레이아웃이 깨지지 않는가?
3. ✅ 설명이 툴팁/팝오버 없이 상시 노출 텍스트로만 표시되는가?

### 중복 제거 확인
4. ✅ ArchitectureCard 내부의 난이도/기간 배지에서 툴팁이 제거되었는가?
5. ✅ IdeaTree 비교표의 난이도/기간 행에서 툴팁이 제거되었는가?
6. ✅ IdeaCard(1차 아이디어 카드)의 난이도/기간 배지에서 툴팁이 제거되었는가?
7. ✅ 다른 컴포넌트/페이지에 "초급:", "중급:", "고급:", "기간:" 설명이 없는가?

### 설명 내용 확인
8. ✅ 4줄 설명이 정확히 아래 내용으로 표시되는가?
   - 초급: 핵심 기능 위주, 단일 흐름, 운영 요소 최소
   - 중급: 권한/데이터 확장/기본 자동화 일부 포함
   - 고급: 운영/보안/관측/자동화 포함, 구성요소 많아 복잡
   - 기간: 1인 개발 기준의 대략적 구현+기본 테스트 추정치(연동/운영 포함 시 증가)

### 기능 동작 확인
9. ✅ 난이도/기간 배지는 여전히 표시되지만 툴팁만 제거되었는가? (배지 자체는 유지)
10. ✅ 비교표와 카드에서 난이도/기간 값은 정상적으로 표시되는가?

