"use client";

import { useState, useRef, useEffect } from "react";

export default function DifficultyDurationInfo() {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<"bottom" | "top">("bottom");
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 모바일: 외부 클릭 시 닫기
  useEffect(() => {
    if (!isMobile || !isTooltipVisible) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        buttonRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsTooltipVisible(false);
      }
    };

    // ESC 키로 닫기
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsTooltipVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMobile, isTooltipVisible]);

  // 툴팁 위치 조정 (화면 밖으로 나가지 않도록)
  useEffect(() => {
    if (isTooltipVisible && tooltipRef.current && buttonRef.current) {
      const tooltip = tooltipRef.current;
      const button = buttonRef.current;
      const buttonRect = button.getBoundingClientRect();
      
      // 툴팁이 렌더링된 후 크기를 확인하기 위해 강제로 레이아웃 계산
      const tooltipRect = tooltip.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // 아래로 넘치면 위로 표시
      if (buttonRect.bottom + tooltipRect.height + 8 > viewportHeight) {
        setTooltipPosition("top");
      } else {
        setTooltipPosition("bottom");
      }
    }
  }, [isTooltipVisible]);

  // 모바일: 클릭 시 토글
  const handleClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.stopPropagation();
      setIsTooltipVisible(!isTooltipVisible);
    }
  };

  // PC: hover 시 표시
  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsTooltipVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsTooltipVisible(false);
    }
  };

  // 키보드 접근성: Enter/Space로 토글
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsTooltipVisible(!isTooltipVisible);
    }
  };

  const tooltipText = "난이도는 포함된 기능의 복잡도를, 기간은 1명 개발자 풀타임 기준 예상 기간을 나타냅니다. 배지에 마우스를 올리면 자세한 기준을 알 수 있습니다.";

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded px-2 py-1 transition-colors"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        aria-label="난이도/기간 기준 안내"
        aria-describedby={isTooltipVisible ? "difficulty-duration-tooltip" : undefined}
        aria-expanded={isTooltipVisible}
      >
        <span className="text-blue-600 flex-shrink-0">ℹ</span>
        <span className="flex flex-col leading-tight text-left">
          <span>난이도/기간</span>
          <span>기준</span>
        </span>
      </button>
      
      {/* 툴팁 */}
      {isTooltipVisible && (
        <div
          id="difficulty-duration-tooltip"
          ref={tooltipRef}
          className={`absolute z-50 left-0 ${
            tooltipPosition === "bottom" ? "top-full mt-2" : "bottom-full mb-2"
          } bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl pointer-events-none ${
            isMobile ? "max-w-[80vw]" : "max-w-xs"
          }`}
          role="tooltip"
          aria-live="polite"
        >
          <div className="whitespace-pre-line leading-relaxed">{tooltipText}</div>
          {/* 화살표 */}
          <div
            className={`absolute left-4 w-0 h-0 border-l-4 border-r-4 border-transparent ${
              tooltipPosition === "bottom"
                ? "bottom-full border-b-4 border-b-gray-900"
                : "top-full border-t-4 border-t-gray-900"
            }`}
          />
        </div>
      )}
    </div>
  );
}

