"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function LocaleTextGuard() {
  const pathname = usePathname();

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;

    const checkKorean = () => {
      const isEn = pathname?.startsWith("/en");
      if (!isEn) return;

      const text = document.body?.innerText ?? "";
      const koreanRegex = /[가-힣]/;
      
      if (koreanRegex.test(text)) {
        const koreanMatches = text.match(/[가-힣]+/g) || [];
        const uniqueMatches = Array.from(new Set(koreanMatches)).slice(0, 20);
        
        // 한글이 포함된 요소 찾기
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          null
        );
        
        const koreanElements: Array<{ text: string; parent?: string }> = [];
        let textNode: globalThis.Node | null;
        while ((textNode = walker.nextNode())) {
          if (textNode.textContent && koreanRegex.test(textNode.textContent)) {
            const parent = textNode.parentElement;
            if (parent && (parent.tagName === "SCRIPT" || parent.tagName === "STYLE")) {
              continue;
            }
            koreanElements.push({
              text: textNode.textContent.trim().substring(0, 100),
              parent: parent?.tagName || "unknown",
            });
            if (koreanElements.length >= 15) break;
          }
        }
        
        const errorMessage = 
          `[LocaleTextGuard] EN page contains Korean text!\n\n` +
          `Path: ${pathname}\n\n` +
          `Detected Korean words (first 20): ${uniqueMatches.join(", ")}\n\n` +
          `Korean text in elements:\n${koreanElements.map((e, i) => `  ${i + 1}. [${e.parent}] ${e.text}`).join("\n")}\n\n` +
          `→ EN pages must have 0% Korean text.`;
        
        console.error(errorMessage);
      }
    };

    // DOM이 로드된 후 체크 (여러 번 체크)
    const timeoutId1 = setTimeout(checkKorean, 500);
    const timeoutId2 = setTimeout(checkKorean, 1500);
    const timeoutId3 = setTimeout(checkKorean, 3000);
    const timeoutId4 = setTimeout(checkKorean, 5000);

    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
      clearTimeout(timeoutId4);
    };
  }, [pathname]);

  return null;
}

