"use client";

import React from "react";

export type SavedDesign = {
  id: string;
  title: string;
  keywords: string[];
  createdAt: string;
  raw?: any;
};

type Props = {
  items: SavedDesign[];
};

export default function HistoryList({ items }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {items.map((it) => (
        <div key={it.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-bold">{it.title}</h2>
              <p className="mt-1 text-xs text-gray-500">{it.createdAt}</p>
            </div>
            <div className="text-xs text-gray-400">#{it.id}</div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold text-gray-700">입력 키워드</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {it.keywords.length ? (
                it.keywords.map((k, idx) => (
                  <span
                    key={`${it.id}-${idx}`}
                    className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700"
                  >
                    {k}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-500">키워드 정보 없음</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
