"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // 배경 스크롤 잠금
  useEffect(() => {
    if (isOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      
      // 이전 포커스 요소 저장
      previousActiveElement.current = document.activeElement as HTMLElement;

      return () => {
        // 스크롤 복원
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
        
        // 포커스 복귀
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [isOpen]);

  // 모달이 열릴 때 첫 번째 포커스 가능한 요소에 포커스
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      // 약간의 지연을 두어 모달이 완전히 렌더링된 후 포커스
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // 포커스 트랩: Tab 키로 모달 내부에서만 포커스 이동
  useEffect(() => {
    if (!isOpen) return;

    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    modal.addEventListener("keydown", handleTabKey);
    return () => modal.removeEventListener("keydown", handleTabKey);
  }, [isOpen]);

  // 바깥 클릭으로 닫기
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="paywall-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg p-10 max-w-md w-full mx-4 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-8">
          <h2
            id="paywall-modal-title"
            className="text-xl font-semibold text-gray-900 mb-4 tracking-tight"
          >
            이 설계안으로 계속 진행하기
          </h2>
          <p className="text-base text-gray-500 leading-relaxed mb-4">
            AutoAppArch는 무료로도 충분히 사용하실 수 있습니다.
            <br />
            다만, 이 설계안을 실제 구현 단계까지 가져가려면
            <br />
            아래 기능이 필요합니다.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-gray-50 p-6 rounded-md border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Pro 플랜 기능
            </h3>
            <ul className="space-y-3 text-base text-gray-600">
              <li className="flex items-start">
                <span className="text-gray-900 mr-3 font-medium" aria-hidden="true">✓</span>
                <span>상세 설계안 전체 보기</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-900 mr-3 font-medium" aria-hidden="true">✓</span>
                <span>무제한 설계안 생성</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-900 mr-3 font-medium" aria-hidden="true">✓</span>
                <span>PDF 내보내기</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-900 mr-3 font-medium" aria-hidden="true">✓</span>
                <span>우선 지원</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/pricing"
            className="flex-1 h-12 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight flex items-center justify-center"
          >
            요금제 보기
          </Link>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="px-6 h-12 text-base text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors tracking-tight"
            aria-label="모달 닫기"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
