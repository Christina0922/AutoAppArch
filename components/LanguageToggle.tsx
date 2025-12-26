"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { locales, defaultLocale, type Locale } from "@/i18n";

export default function LanguageToggle() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;
    
    // localePrefix: "always"이므로 항상 locale prefix 포함
    // pathname은 이미 locale이 포함된 경로 (예: /ko/about)
    const pathnameWithoutLocale = pathname.replace(/^\/(ko|en)/, '') || '/';
    const newPath = `/${newLocale}${pathnameWithoutLocale}`;
    
    router.push(newPath);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
            locale === loc
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
          aria-label={`Switch to ${loc === "ko" ? "Korean" : "English"}`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

