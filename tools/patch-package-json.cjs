// D:\1000_b_project\AutoAppArch\tools\patch-package-json.cjs
// package.json의 scripts에 report 명령을 안전하게 추가합니다.
// - 기존 내용은 그대로 유지
// - scripts.report가 이미 있으면 값만 원하는 값으로 갱신

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const pkgPath = path.join(projectRoot, 'package.json');

if (!fs.existsSync(pkgPath)) {
  console.error('[ERROR] package.json을 찾을 수 없습니다:', pkgPath);
  process.exit(1);
}

let pkgRaw = fs.readFileSync(pkgPath, 'utf8');
let pkg;

try {
  pkg = JSON.parse(pkgRaw);
} catch (e) {
  console.error('[ERROR] package.json JSON 파싱 실패. 형식이 깨져있을 수 있습니다.');
  console.error(e.message);
  process.exit(1);
}

if (!pkg.scripts || typeof pkg.scripts !== 'object') {
  pkg.scripts = {};
}

// 누님 PC에서 성공한 포트 9410으로 고정
pkg.scripts.report = 'playwright show-report --host 127.0.0.1 --port 9410';

// 보기 편하게 2칸 들여쓰기, 마지막 줄 개행 포함
const out = JSON.stringify(pkg, null, 2) + '\n';
fs.writeFileSync(pkgPath, out, 'utf8');

console.log('[OK] package.json에 scripts.report가 설정되었습니다.');
console.log('     npm run report');
