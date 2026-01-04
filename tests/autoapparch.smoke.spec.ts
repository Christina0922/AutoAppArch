import { test, expect } from '@playwright/test';

test('AutoAppArch 홈 접속 및 런타임 에러 없음', async ({ page }) => {
  // KO 앱 만들기 페이지로 고정 진입
  await page.goto('/ko/app', { waitUntil: 'domcontentloaded' });

  // Next/React 렌더 안정화 대기: "1차 아이디어"가 뜨면 정상 화면으로 판단
  const stepTitle = page.locator('text=1차 아이디어').first();
  await expect(stepTitle).toBeVisible({ timeout: 60_000 });

  // 런타임 에러(Next 에러 오버레이) 흔적이 화면에 보이면 실패 처리
  // (에러 오버레이는 보통 "Server Error" 또는 "Unhandled Runtime Error" 문구를 포함)
  await expect(page.locator('text=Server Error')).toHaveCount(0);
  await expect(page.locator('text=Unhandled Runtime Error')).toHaveCount(0);

  // 옵션 카드 중 하나가 렌더링되었는지 확인 (data-testid 기반)
  // 1안~7안 중 하나는 반드시 존재해야 함
  const optionCard = page.locator('[data-testid^="option-card-"]').first();
  await expect(optionCard).toBeVisible({ timeout: 60_000 });
});
