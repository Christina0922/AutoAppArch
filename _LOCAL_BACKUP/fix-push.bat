@echo off
chcp 65001 >nul
cd /d "D:\1000억 프로젝트\AutoAppArch"

echo ========================================
echo 1. 안전한 디렉토리 등록 확인
echo ========================================
git config --global --get-all safe.directory
echo.

echo ========================================
echo 2. 현재 상태 확인
echo ========================================
git remote -v
git branch -vv
git status
echo.

echo ========================================
echo 3. 강제 푸시 실행
echo ========================================
git push origin main --force-with-lease
echo.

echo ========================================
echo 4. 최종 상태 확인
echo ========================================
git status
git log --oneline -3
echo.

pause

