"use client";

import { useState, useRef, useEffect } from "react";

interface BadgeWithTooltipProps {
  children: React.ReactNode;
  tooltipText: string;
  className?: string;
  ariaLabel?: string;
}

export default function BadgeWithTooltip({
  children,
  tooltipText,
  className = "",
  ariaLabel,
}: BadgeWithTooltipProps) {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 모바일: 외부 클릭 및 ESC 키로 닫기
  useEffect(() => {
    if (!isMobile || !isTooltipVisible) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        badgeRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !badgeRef.current.contains(event.target as Node)
      ) {
        setIsTooltipVisible(false);
      }
    };

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

  useEffect(() => {
    if (isTooltipVisible && tooltipRef.current && badgeRef.current) {
      const tooltip = tooltipRef.current;
      const badge = badgeRef.current;
      const rect = badge.getBoundingClientRect();
      
      // 툴팁 위치 조정 (화면 밖으로 나가지 않도록)
      const tooltipRect = tooltip.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      if (rect.left + tooltipRect.width > viewportWidth) {
        tooltip.style.left = "auto";
        tooltip.style.right = "0";
      }
      
      if (rect.top + tooltipRect.height > viewportHeight) {
        tooltip.style.top = "auto";
        tooltip.style.bottom = "100%";
        tooltip.style.marginBottom = "4px";
      }
    }
  }, [isTooltipVisible]);

  // 모바일: 클릭 시 토글, PC: 키보드 접근성
  const handleClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.stopPropagation();
      setIsTooltipVisible(!isTooltipVisible);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
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

  return (
    <div
      ref={badgeRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div 
        className={className} 
        aria-label={ariaLabel}
        tabIndex={0}
        role="button"
        aria-expanded={isTooltipVisible}
      >
        {children}
      </div>
      
      {/* 툴팁 */}
      {isTooltipVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 ${
            isMobile ? "bottom-full mb-2" : "top-full mt-2"
          } left-0 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg ${
            isMobile ? "max-w-[80vw]" : "max-w-xs"
          } ${isMobile ? "" : "pointer-events-none"}`}
          role="tooltip"
          aria-live="polite"
        >
          <div className="whitespace-pre-line leading-relaxed">{tooltipText}</div>
          {/* 화살표 */}
          <div
            className={`absolute ${
              isMobile ? "top-full left-4" : "bottom-full left-4"
            } w-0 h-0 border-l-4 border-r-4 ${
              isMobile
                ? "border-t-4 border-t-gray-900"
                : "border-b-4 border-b-gray-900"
            } border-transparent`}
          />
        </div>
      )}
    </div>
  );
}

