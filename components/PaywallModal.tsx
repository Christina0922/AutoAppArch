"use client";

import Link from "next/link";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-10 max-w-md w-full mx-4 border border-gray-100">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 tracking-tight">
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
                <span className="text-gray-900 mr-3 font-medium">✓</span>
                <span>상세 설계안 전체 보기</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-900 mr-3 font-medium">✓</span>
                <span>무제한 설계안 생성</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-900 mr-3 font-medium">✓</span>
                <span>PDF 내보내기</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-900 mr-3 font-medium">✓</span>
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
            onClick={onClose}
            className="px-6 h-12 text-base text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors tracking-tight"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
