"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, withLocalePrefix, type Locale } from "@/utils/localePath";

export default function Footer() {
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPathname(pathname) ?? "ko";
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  return (
    <footer className="bg-white border-t border-gray-100 mt-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4 tracking-tight">
              AutoAppArch
            </h3>
            <p className="text-base text-gray-500 leading-relaxed">
              {t("description")}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              {t("services")}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href={withLocalePrefix("/app", locale as Locale, pathname)}
                  className="text-base text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {tNav("createApp")}
                </Link>
              </li>
              <li>
                <Link
                  href={withLocalePrefix("/history", locale as Locale, pathname)}
                  className="text-base text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {tNav("history")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              {t("information")}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href={withLocalePrefix("/about", locale as Locale, pathname)}
                  className="text-base text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {tNav("about")}
                </Link>
              </li>
              {/* 테스트 중: 요금제 링크 숨김 */}
              {/* <li>
                <Link
                  href="/pricing"
                  className="text-base text-gray-600 hover:text-gray-900 transition-colors"
                >
                  요금제
                </Link>
              </li> */}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              {t("contact")}
            </h4>
            <p className="text-base text-gray-600">
              support@autoapparch.com
            </p>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-400 text-center">
            {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}
