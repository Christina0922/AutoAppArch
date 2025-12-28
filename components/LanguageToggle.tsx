"use client";

import { usePathname, useRouter } from "next/navigation";
import { swapLocaleInPathname, type Locale } from "@/utils/localePath";
import { locales } from "@/i18n";

export default function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();

  const goKo = () => router.push(swapLocaleInPathname(pathname || "/", "ko"));
  const goEn = () => router.push(swapLocaleInPathname(pathname || "/", "en"));

  // 현재 locale 추출
  const currentLocale = pathname?.startsWith("/en") ? "en" : "ko";

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      <button
        onClick={goKo}
        className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
          currentLocale === "ko"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
        aria-label="Switch to Korean"
      >
        KO
      </button>
      <button
        onClick={goEn}
        className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
          currentLocale === "en"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
}

