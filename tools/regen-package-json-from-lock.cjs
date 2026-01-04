// D:\1000_b_project\AutoAppArch\tools\regen-package-json-from-lock.cjs
// package-lock.json을 기반으로 정상 package.json을 재생성합니다.
// - 기존 package.json은 package.json.corrupt.<timestamp>.bak 으로 백업
// - lock의 루트 dependencies/devDependencies를 그대로 복구
// - report는 "파일로 열기"로 고정 (포트 충돌/권한 문제 회피)

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const pkgPath = path.join(projectRoot, 'package.json');
const lockPath = path.join(projectRoot, 'package-lock.json');

if (!fs.existsSync(lockPath)) {
  console.error('[ERROR] package-lock.json이 없습니다:', lockPath);
  process.exit(1);
}

// 기존 package.json 백업 (있으면)
if (fs.existsSync(pkgPath)) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backup = path.join(projectRoot, `package.json.corrupt.${stamp}.bak`);
  try {
    fs.copyFileSync(pkgPath, backup);
    console.log('[INFO] 기존 package.json 백업:', backup);
  } catch (e) {
    console.log('[WARN] 기존 package.json 백업 실패(무시 가능):', e.message);
  }
}

let lock;
try {
  lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
} catch (e) {
  console.error('[ERROR] package-lock.json JSON 파싱 실패:', e.message);
  process.exit(1);
}

// npm v7+ lockfile에는 packages[""]에 루트 정보가 있습니다.
const root = (lock.packages && lock.packages['']) ? lock.packages[''] : {};

// root가 비어있을 때를 대비한 fallback
const deps = root.dependencies || lock.dependencies || {};
const devDeps = root.devDependencies || {};

// @playwright/test가 devDependencies에 없으면 추가(Playwright 쓰는 프로젝트이므로)
if (!devDeps['@playwright/test']) {
  devDeps['@playwright/test'] = '^1.45.0';
}

const pkg = {
  name: root.name || 'autoapparch',
  version: root.version || '0.1.0',
  private: true,
  scripts: {
    // 누님 PC 환경에서 가장 안정적인 리포트 열기(포트 불필요)
    report: 'start "" "playwright-report\\\\index.html"',

    // Playwright 실행 편의
    test: 'playwright test',
    'test:ui': 'playwright test --ui',
    'test:headed': 'playwright test --headed'
  },
  dependencies: deps,
  devDependencies: devDeps
};

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');

console.log('[OK] package.json 재생성 완료:', pkgPath);
console.log('다음 실행: npm install');
console.log('리포트 열기: npm run report');
