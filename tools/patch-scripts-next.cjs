// D:\1000_b_project\AutoAppArch\tools\patch-scripts-next.cjs
// Next.js 프로젝트용 scripts(dev/build/start)와 report/playwright 스크립트를 안전하게 추가/복구합니다.

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const pkgPath = path.join(projectRoot, 'package.json');

if (!fs.existsSync(pkgPath)) {
  console.error('[ERROR] package.json을 찾을 수 없습니다:', pkgPath);
  process.exit(1);
}

let pkg;
try {
  pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
} catch (e) {
  console.error('[ERROR] package.json JSON 파싱 실패:', e.message);
  process.exit(1);
}

pkg.private = true;
pkg.scripts = pkg.scripts && typeof pkg.scripts === 'object' ? pkg.scripts : {};

// Next.js 표준 스크립트 복구
pkg.scripts.dev = pkg.scripts.dev || 'next dev';
pkg.scripts.build = pkg.scripts.build || 'next build';
pkg.scripts.start = pkg.scripts.start || 'next start';

// Playwright 편의 스크립트(기존 있으면 유지)
pkg.scripts.test = pkg.scripts.test || 'playwright test';
pkg.scripts['test:ui'] = pkg.scripts['test:ui'] || 'playwright test --ui';
pkg.scripts['test:headed'] = pkg.scripts['test:headed'] || 'playwright test --headed';

// report는 포트 없이 파일로 열기(누님 PC 최적)
pkg.scripts.report = 'start "" "playwright-report\\\\index.html"';

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');

console.log('[OK] scripts 복구 완료');
console.log(' - npm run dev');
console.log(' - npm run report');
