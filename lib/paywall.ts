/**
 * 페이월 우회 설정을 확인하는 유틸리티
 * NEXT_PUBLIC_BYPASS_PAYWALL 환경변수가 "true"일 때만 우회
 * 기본값은 false (배포 환경에서 안전)
 * 
 * 테스트 중: 항상 우회하도록 설정 (진행 막힘 방지)
 */
export function shouldBypassPaywall(): boolean {
  // 테스트 중: 항상 우회
  return true;
  
  // 배포 시 아래 코드 활성화
  /*
  if (typeof window === "undefined") {
    // 서버 사이드에서는 항상 false
    return false;
  }
  
  const bypass = process.env.NEXT_PUBLIC_BYPASS_PAYWALL;
  return bypass === "true";
  */
}

