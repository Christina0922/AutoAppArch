"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SavedPlan, Session } from "@/lib/types";
import { savePlan, saveSession } from "@/lib/storage";

interface SaveButtonProps {
  plan?: SavedPlan;
  session?: Session;
  onSaved?: () => void;
}

export default function SaveButton({ plan, session, onSaved }: SaveButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const handleSave = () => {
    setIsSaving(true);
    try {
      if (session) {
        saveSession(session);
      } else if (plan) {
        savePlan(plan);
      } else {
        throw new Error("plan 또는 session이 필요합니다.");
      }
      setSaved(true);
      if (onSaved) {
        onSaved();
      }
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장에 실패했습니다.");
      setIsSaving(false);
    }
  };

  const handleViewSaved = () => {
    const id = session?.id || plan?.id;
    if (id) {
      router.push(`/history/${id}`);
    }
  };

  const handleCreateNew = () => {
    router.push("/app");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  if (saved) {
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center">
          <p className="text-base font-medium text-gray-900 mb-1">
            설계안이 저장되었습니다. (히스토리에서 확인)
          </p>
        </div>
        <div className="space-y-3">
          <button
            onClick={handleViewSaved}
            className="w-full h-12 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            aria-label="저장된 설계안 보기"
          >
            내 설계안 바로 보기
          </button>
          <button
            onClick={handleCreateNew}
            className="w-full h-12 bg-white text-gray-900 text-base font-medium rounded-md border border-gray-200 hover:bg-gray-50 transition-colors tracking-tight focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            aria-label="새 설계안 만들기"
          >
            다른 키워드로 설계안 만들기
          </button>
        </div>
        <p className="text-sm text-gray-400 text-center leading-relaxed">
          저장한 설계안은 상단 메뉴 '히스토리'에서 언제든 확인할 수 있습니다.
        </p>
      </div>
    );
  }

  return (
    <button
      onClick={handleSave}
      disabled={isSaving}
      className="w-full h-12 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
      aria-label={isSaving ? "설계안 저장 중" : "설계안 저장하기"}
    >
      {isSaving ? "저장 중..." : "설계안 저장하기"}
    </button>
  );
}
