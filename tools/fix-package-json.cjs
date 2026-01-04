// D:\1000_b_project\AutoAppArch\tools\fix-package-json.cjs
// 깨진 package.json에서 "// ..." 형태의 주석 줄을 제거해 JSON 파싱 가능 상태로 복구합니다.
// 원본은 package.json.broken.<timestamp>.bak 으로 자동 백업합니다.

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const pkgPath = path.join(projectRoot, 'package.json');

if (!fs.existsSync(pkgPath)) {
  console.error('[ERROR] package.json을 찾을 수 없습니다:', pkgPath);
  process.exit(1);
}

const raw = fs.readFileSync(pkgPath, 'utf8');

// 원본 백업(타임스탬프)
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupPath = path.join(projectRoot, `package.json.broken.${stamp}.bak`);
fs.writeFileSync(backupPath, raw, 'utf8');

// 줄 단위로 "//" 주석 제거
const lines = raw.split(/\r?\n/);
const cleanedLines = lines.filter((line) => {
  const t = line.trim();
  // JSON에 존재하면 안 되는 // 주석 라인 제거
  if (t.startsWith('//')) return false;
  return true;
});

const cleaned = cleanedLines.join('\n');

// 파싱 확인
let obj;
try {
  obj = JSON.parse(cleaned);
} catch (e) {
  console.error('[ERROR] 주석 줄 제거 후에도 JSON 파싱 실패입니다.');
  console.error('원본 백업:', backupPath);
  console.error(e.message);
  process.exit(1);
}

// 표준 포맷으로 다시 저장
fs.writeFileSync(pkgPath, JSON.stringify(obj, null, 2) + '\n', 'utf8');

console.log('[OK] package.json 복구 완료');
console.log('원본 백업:', backupPath);
