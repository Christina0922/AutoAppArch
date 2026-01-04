// D:\1000_b_project\AutoAppArch\tools\rebuild-package-json-from-lock.cjs
const fs = require("fs");
const path = require("path");

function readJson(p) {
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw);
}

function writeJson(p, obj) {
  const text = JSON.stringify(obj, null, 2) + "\n";
  fs.writeFileSync(p, text, "utf8");
}

function main() {
  const root = process.cwd();
  const lockPath = path.join(root, "package-lock.json");
  const pkgPath = path.join(root, "package.json");

  if (!fs.existsSync(lockPath)) {
    console.error("[ERROR] package-lock.json 을 찾을 수 없습니다:", lockPath);
    process.exit(1);
  }

  const lock = readJson(lockPath);

  // npm v7+ lockfile: lock.packages[""] 에 루트 deps가 들어있는 경우가 많습니다.
  const rootPkg = lock?.packages?.[""] || {};

  const dependencies = rootPkg.dependencies || {};
  const devDependencies = rootPkg.devDependencies || {};

  // name/version은 lock에 없을 수 있으니 기본값
  const name = "autoapparch";
  const version = "0.1.0";

  const pkg = {
    name,
    version,
    private: true,
    scripts: {
      dev: "next dev",
      build: "next build",
      start: "next start",
      test: "playwright test",
      "test:chromium": "playwright test --project=chromium --reporter=html",
      // report는 “파일로 여는 방식” (포트 충돌/권한 문제 회피)
      report: "start \"\" \"playwright-report\\index.html\"",
      // show-report는 서버를 띄우므로, IPv6(::1) 문제를 피하게 127.0.0.1로 고정
      "show-report": "set PLAYWRIGHT_HTML_HOST=127.0.0.1&& npx playwright show-report"
    },
    dependencies,
    devDependencies
  };

  writeJson(pkgPath, pkg);

  console.log("[OK] package-lock.json 기반으로 package.json 재생성 완료");
  console.log("- 다음 명령을 실행하세요:");
  console.log("  npm install");
}

main();
