import { test, expect } from '@playwright/test';

test.describe('AutoAppArch App Flow', () => {
  test('KO: 옵션 선택 -> 하단 버튼 활성 -> 클릭', async ({ page }) => {
    await page.goto('/ko/app', { waitUntil: 'domcontentloaded' });

    // 1) 화면 렌더 확인
    await expect(page.locator('text=1차 아이디어').first()).toBeVisible({ timeout: 60_000 });

    // 2) 옵션 카드가 뜰 때까지 대기 (data-testid 기반)
    const anyOptionCard = page.locator('[data-testid^="option-card-"]').first();
    await expect(anyOptionCard).toBeVisible({ timeout: 60_000 });

    // 3) 5안 카드를 우선 찾고, 없으면 첫 번째 카드 클릭 (data-testid 기반)
    const preferCard = page.locator('[data-testid="option-card-5안"]').or(page.locator('[data-testid="option-card-Option 5"]'));
    const targetCard = (await preferCard.count()) > 0 ? preferCard.first() : anyOptionCard;

    await targetCard.scrollIntoViewIfNeeded();
    await targetCard.click({ force: true });

    // 4) 하단 메인 버튼(검정/파랑) 텍스트는 상황에 따라 다를 수 있으니 정규식으로 잡음
    const primaryBtn = page.getByRole('button', {
      name: /이 설계로 결정하기|설계안 저장하기|앱 설계안 자동 생성하기|계속 진행하기/,
    });

    await expect(primaryBtn).toBeVisible({ timeout: 60_000 });
    await primaryBtn.scrollIntoViewIfNeeded();
    await primaryBtn.click({ force: true });

    // 5) 다음 화면(설계안/기획서 화면)으로 넘어갔는지 확인
    //   - 실제 화면에 있는 문구 중 하나만 확인하면 안정적입니다.
    const planHint = page.locator('text=이 페이지는 생성될 앱의 기획서입니다.').first();
    const planTitle = page.locator('text=/모바일 앱 설계안/').first();

    await expect(planHint.or(planTitle)).toBeVisible({ timeout: 60_000 });
  });
});
