// D:\1000_b_project\AutoAppArch\tools\patch-report-to-file.cjs
// package.json의 scripts.report를 "리포트 파일 열기"로 고정합니다.
// - 기존 package.json 내용은 유지
// - scripts.report만 안전하게 추가/수정

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
  console.error('[ERROR] package.json JSON 파싱 실패. 파일이 깨져있을 수 있습니다.');
  console.error(e.message);
  process.exit(1);
}

if (!pkg.scripts || typeof pkg.scripts !== 'object') {
  pkg.scripts = {};
}

// 윈도우 CMD에서 파일을 기본 브라우저로 여는 방식(포트 사용 안 함)
pkg.scripts.report = 'start "" "playwright-report\\\\index.html"';

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');

console.log('[OK] scripts.report를 "파일로 리포트 열기"로 설정했습니다.');
console.log('     실행: npm run report');
