@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo AutoAppArch 레포지토리 되돌리기
echo ========================================
echo.

set GOOD_COMMIT=5f6d6e81c5f0c95f018bc2a335861557414ba412

echo [1/6] 현재 상태 확인
git remote -v
git branch -vv
echo.

echo [2/6] 백업 브랜치 생성
git switch main
if errorlevel 1 (
    echo main 브랜치로 전환 실패, master 브랜치 사용 시도...
    git checkout -b main origin/main 2>nul
    if errorlevel 1 (
        git checkout master
        git checkout -b main
    )
)
for /f "tokens=2 delims==" %%a in ('wmic os get localdatetime /value') do set datetime=%%a
set backup_branch=backup_before_reset_%datetime:~0,8%_%datetime:~8,6%
git branch %backup_branch%
echo 백업 브랜치 생성: %backup_branch%
echo.

echo [3/6] 원격 최신 상태 받아오기
git fetch --all --prune
echo.

echo [4/6] GOOD_COMMIT으로 강제 이동
echo GOOD_COMMIT: %GOOD_COMMIT%
git reset --hard %GOOD_COMMIT%
if errorlevel 1 (
    echo 오류: 커밋을 찾을 수 없습니다. 원격에서 가져오는 중...
    git fetch origin
    git reset --hard %GOOD_COMMIT%
)
echo.

echo [5/6] 추적 안 되는 파일 제거
git clean -fd
echo.

echo [6/6] 상태 확인
git status
git log --oneline -5
echo.

echo ========================================
echo 완료!
echo 다음 단계: git push origin main --force-with-lease
echo ========================================
pause

