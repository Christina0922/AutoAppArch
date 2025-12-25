# AutoAppArch 레포지토리 되돌리기 지시사항

## 정상 배포 커밋 해시
**GOOD_COMMIT**: `5f6d6e81c5f0c95f018bc2a335861557414ba412`

## 실행 순서

### 1. AutoAppArch 폴더로 이동
```powershell
cd "D:\1000억 프로젝트\AutoAppArch"
```

### 2. 현재 상태 확인
```powershell
git remote -v
git branch -vv
git log --oneline -5
```

### 3. 백업 브랜치 생성
```powershell
git switch main
git branch backup_before_reset_$(Get-Date -Format "yyyyMMdd_HHmmss")
```

### 4. 원격 최신 상태 받아오기
```powershell
git fetch --all --prune
```

### 5. GOOD_COMMIT으로 강제 이동
```powershell
$GOOD_COMMIT = "5f6d6e81c5f0c95f018bc2a335861557414ba412"
git reset --hard $GOOD_COMMIT
```

### 6. 추적 안 되는 파일 제거
```powershell
git clean -fd
```

### 7. 상태 확인
```powershell
git status
git log --oneline -5
```

### 8. GitHub에 강제 푸시
```powershell
git push origin main --force-with-lease
```

### 9. Vercel 확인
- Vercel 대시보드에서 새 배포가 시작되었는지 확인
- 배포 상세에서 커밋 해시가 `5f6d6e8`로 시작하는지 확인

### 10. 빌드 테스트
```powershell
npm install
npm run build
```

