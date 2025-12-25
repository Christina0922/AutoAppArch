# CMD에서 AutoAppArch 레포지토리 되돌리기

## 정상 배포 커밋 해시
**GOOD_COMMIT**: `5f6d6e81c5f0c95f018bc2a335861557414ba412`

## 방법 1: 배치 파일 실행 (가장 간단)

1. **파일 탐색기**에서 `D:\1000억 프로젝트\AutoAppArch` 폴더로 이동
2. `reset-to-good-commit.bat` 파일을 **더블클릭**하여 실행
3. 완료 후 다음 명령 실행:
   ```cmd
   git push origin main --force-with-lease
   ```

## 방법 2: CMD에서 직접 실행

### 1. CMD 열기
- `Win + R` → `cmd` 입력 → Enter
- 또는 시작 메뉴에서 "명령 프롬프트" 검색

### 2. AutoAppArch 폴더로 이동
```cmd
cd /d "D:\1000억 프로젝트\AutoAppArch"
```

### 3. 현재 상태 확인
```cmd
git remote -v
git branch -vv
git log --oneline -5
```

### 4. 백업 브랜치 생성
```cmd
git switch main
git branch backup_before_reset_%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%
```

### 5. 원격 최신 상태 받아오기
```cmd
git fetch --all --prune
```

### 6. GOOD_COMMIT으로 강제 이동
```cmd
set GOOD_COMMIT=5f6d6e81c5f0c95f018bc2a335861557414ba412
git reset --hard %GOOD_COMMIT%
```

### 7. 추적 안 되는 파일 제거
```cmd
git clean -fd
```

### 8. 상태 확인
```cmd
git status
git log --oneline -5
```

### 9. GitHub에 강제 푸시
```cmd
git push origin main --force-with-lease
```

### 10. Vercel 확인
- Vercel 대시보드에서 새 배포가 시작되었는지 확인
- 배포 상세에서 커밋 해시가 `5f6d6e8`로 시작하는지 확인

### 11. 빌드 테스트
```cmd
npm install
npm run build
```

## 주의사항

⚠️ **강제 푸시는 GitHub 히스토리를 변경합니다!**
- `--force-with-lease`는 안전하게 강제 푸시하는 방법입니다
- 다른 사람이 동시에 푸시한 경우 실패하므로, 혼자 작업 중일 때 사용하세요

## 문제 해결

### "main 브랜치를 찾을 수 없습니다" 오류
```cmd
git checkout -b main origin/main
```

### "커밋을 찾을 수 없습니다" 오류
```cmd
git fetch origin
git reset --hard 5f6d6e81c5f0c95f018bc2a335861557414ba412
```

### "원격이 없습니다" 오류
```cmd
git remote add origin https://github.com/Christina0922/AutoAppArch.git
```

