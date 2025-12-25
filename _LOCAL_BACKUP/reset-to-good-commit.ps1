# AutoAppArch 레포지토리를 GOOD_COMMIT으로 되돌리는 스크립트
$GOOD_COMMIT = "5f6d6e81c5f0c95f018bc2a335861557414ba412"

Write-Host "=== 1. 현재 상태 확인 ===" -ForegroundColor Cyan
git remote -v
git branch -vv
Write-Host ""

Write-Host "=== 2. 백업 브랜치 생성 ===" -ForegroundColor Cyan
git switch main
git branch backup_before_reset_$(Get-Date -Format "yyyyMMdd_HHmmss")
Write-Host ""

Write-Host "=== 3. 원격 최신 상태 받아오기 ===" -ForegroundColor Cyan
git fetch --all --prune
Write-Host ""

Write-Host "=== 4. GOOD_COMMIT으로 강제 이동 ===" -ForegroundColor Cyan
Write-Host "GOOD_COMMIT: $GOOD_COMMIT"
git reset --hard $GOOD_COMMIT
Write-Host ""

Write-Host "=== 5. 추적 안 되는 파일 제거 ===" -ForegroundColor Cyan
git clean -fd
Write-Host ""

Write-Host "=== 6. 상태 확인 ===" -ForegroundColor Cyan
git status
git log --oneline -5
Write-Host ""

Write-Host "=== 완료! 다음 단계: git push origin main --force-with-lease ===" -ForegroundColor Green

