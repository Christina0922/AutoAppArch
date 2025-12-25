"use client";

import React, { useEffect, useState } from "react";
import HistoryList, { type SavedDesign } from "@/components/HistoryList";

function safeJsonParse(raw: string | null) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const STORAGE_KEYS = [
  "autoapparch_history",
  "autoAppArch_history",
  "savedDesigns",
  "savedAppDesigns",
  "history",
];

function normalizeToArray(parsed: any): any[] {
  if (!parsed) return [];
  if (Array.isArray(parsed)) return parsed;

  const candidates = [
    parsed.items,
    parsed.data,
    parsed.designs,
    parsed.savedDesigns,
    parsed.history,
  ];
  for (const c of candidates) {
    if (Array.isArray(c)) return c;
  }
  return [];
}

function toKeywords(value: any): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  if (typeof value === "string") return value.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

function toDisplayDate(value: any): string {
  if (typeof value === "string") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d.toLocaleString();
    return value;
  }
  return "";
}

function normalizeSavedDesigns(items: any[]): SavedDesign[] {
  return items.map((it, idx) => {
    const id =
      (typeof it?.id === "string" && it.id) ||
      (typeof it?._id === "string" && it._id) ||
      `local-${idx}`;

    const keywords = toKeywords(
      it?.keywords ?? it?.keyword ?? it?.tags ?? it?.inputs ?? it?.inputKeywords
    );

    const title =
      (typeof it?.title === "string" && it.title.trim()) ||
      (keywords.length ? `${keywords.join(" + ")} 모바일 앱 설계안` : "자동 생성된 앱 설계안");

    const createdAt =
      toDisplayDate(it?.createdAt ?? it?.created_at ?? it?.date ?? it?.created) || "방금 전";

    return { id, title, keywords, createdAt, raw: it };
  });
}

export default function HistoryPage() {
  const [items, setItems] = useState<SavedDesign[]>([]);

  useEffect(() => {
    let found: any[] = [];
    for (const key of STORAGE_KEYS) {
      const parsed = safeJsonParse(localStorage.getItem(key));
      const arr = normalizeToArray(parsed);
      if (arr.length > 0) {
        found = arr;
        break;
      }
    }
    setItems(normalizeSavedDesigns(found));
  }, []);

  const isEmpty = items.length === 0;

  return (
    <div className="flex-1 flex flex-col">
      {/* 제목(위 고정) */}
      <div className="px-4 pt-10">
        <h1 className="text-center text-2xl font-bold">저장된 앱 설계안</h1>
      </div>

      {/* 내용 */}
      {isEmpty ? (
        // ✅ 중요: relative + z-index로 "위에 덮는 투명 레이어"를 이겨서 클릭 가능하게 함
        <div className="flex-1 flex items-center justify-center px-4 pb-12 relative z-10">
          <div className="w-full max-w-2xl rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm relative z-20">
            <p className="text-sm text-gray-600">아직 저장된 앱 설계안이 없습니다.</p>
            <p className="mt-2 text-sm text-gray-500">
              키워드 몇 개만 입력하면 바로 자동 생성할 수 있습니다.
            </p>

            <div className="mt-6">
              {/* ✅ Next Link 대신 순수 a 태그로: "무조건 이동" */}
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
              >
                설계안 만들기
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 py-10">
          <div className="mx-auto w-full max-w-6xl">
            <HistoryList items={items} />
          </div>
        </div>
      )}
    </div>
  );
}
