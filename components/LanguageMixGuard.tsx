"use client";

/**
 * 언어 섞임 방지 가드 (개발 환경 전용)
 * 
 * EN 페이지: 한글 [가-힣] 검출 시 에러
 * KO 페이지: 영어 [A-Za-z] 검출 시 에러 (선택적, 0%를 원하는 경우)
 */
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function LanguageMixGuard() {
  const pathname = usePathname();
  
  useEffect(() => {
    // 프로덕션에서는 실행하지 않음
    if (process.env.NODE_ENV !== "development") {
      return;
    }
    
    const isEnglishPage = pathname?.startsWith("/en");
    
    const checkLanguageMix = () => {
      // DOM이 준비될 때까지 대기
      if (typeof document === "undefined" || !document.body) {
        return;
      }
      
      const bodyText = document.body.textContent || "";
      
      if (isEnglishPage) {
        // EN 페이지: 한글 금지
        const koreanRegex = /[가-힣]/;
        if (koreanRegex.test(bodyText)) {
          const koreanMatches = bodyText.match(/[가-힣]+/g);
          const uniqueKorean = Array.from(new Set(koreanMatches || [])).slice(0, 20);
          
          // 한글이 포함된 요소 찾기
          const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null
          );
          
          const koreanElements: Array<{ text: string }> = [];
          let textNode: globalThis.Node | null;
          while ((textNode = walker.nextNode())) {
            if (textNode.textContent && /[가-힣]/.test(textNode.textContent)) {
              const parent = textNode.parentElement;
              if (parent && (parent.tagName === "SCRIPT" || parent.tagName === "STYLE")) {
                continue;
              }
              koreanElements.push({
                text: textNode.textContent.trim().substring(0, 100),
              });
              if (koreanElements.length >= 10) break;
            }
          }
          
          const errorMessage = `[언어 섞임 방지 가드] EN 페이지(/en)에서 한글이 발견되었습니다!\n\n` +
            `발견된 한글 (최대 20개): ${uniqueKorean.join(", ")}\n\n` +
            `한글이 포함된 요소들:\n${koreanElements.map((e, i) => `  ${i + 1}. ${e.text}`).join("\n")}\n\n` +
            `→ EN 페이지에서는 한글이 0%여야 합니다.`;
          
          console.error(errorMessage);
          // 개발 환경에서만 에러로 표시 (throw하지 않음 - UX 방해 방지)
        }
      } else {
        // KO 페이지: 영어 금지 (0%를 원하는 경우)
        // 주의: 버튼 텍스트(EN/KO), 로고 등은 예외 처리 필요할 수 있음
        // 여기서는 일반적인 영어 단어 패턴만 검사 (예: "Option", "Continue" 등)
        const englishWords = ["Option", "Continue", "Generate", "Select", "View", "Delete", "Edit", "Save", "Cancel"];
        const foundEnglish = englishWords.filter(word => {
          const regex = new RegExp(`\\b${word}\\b`, "i");
          return regex.test(bodyText);
        });
        
        if (foundEnglish.length > 0) {
          const errorMessage = `[언어 섞임 방지 가드] KO 페이지에서 영어가 발견되었습니다!\n\n` +
            `발견된 영어 단어: ${foundEnglish.join(", ")}\n\n` +
            `→ KO 페이지에서는 영어가 0%여야 합니다. (로고/버튼 텍스트는 예외)`;
          
          console.warn(errorMessage);
        }
      }
    };
    
    // 여러 번 체크 (비동기 렌더링 대응)
    const timeouts = [
      setTimeout(checkLanguageMix, 500),
      setTimeout(checkLanguageMix, 1500),
      setTimeout(checkLanguageMix, 3000),
      setTimeout(checkLanguageMix, 5000),
    ];
    
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [pathname]);
  
  return null;
}

