"use client";

import { useParams } from "next/navigation";

export default function HistoryPage() {
  const params = useParams();
  const locale = params?.locale as string | undefined;
  const validLocale = locale === "en" ? "en" : "ko";

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">
        {validLocale === "en" ? "History" : "히스토리"}
      </h1>
      <p className="mt-3 text-base text-gray-600">
        {validLocale === "en"
          ? "Your generated plans will appear here."
          : "생성한 설계안 기록이 여기에 표시됩니다."}
      </p>
      {/* TODO: 기존 히스토리 컴포넌트가 있으면 여기서 불러오세요 */}
    </main>
  );
}

