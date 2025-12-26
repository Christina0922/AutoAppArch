"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

function getLocaleFromPath(pathname: string) {
  const first = pathname.split("/").filter(Boolean)[0];
  return first === "en" ? "en" : "ko";
}

function replaceLocale(pathname: string, nextLocale: "ko" | "en") {
  const parts = pathname.split("/").filter(Boolean);

  if (parts.length === 0) {
    return `/${nextLocale}`;
  }

  if (parts[0] === "ko" || parts[0] === "en") {
    parts[0] = nextLocale;
  } else {
    parts.unshift(nextLocale);
  }

  return `/${parts.join("/")}`;
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPath(pathname);
  const t = useTranslations("nav");

  const navLinks = [
    { href: `/${locale}/app`, label: t("createApp") },
    { href: `/${locale}/history`, label: t("history") },
    { href: `/${locale}/about`, label: t("about") },
  ];

  const onSwitch = (to: "ko" | "en") => {
    const nextPath = replaceLocale(pathname, to);
    router.push(nextPath);
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-[100] relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link
            href={`/${locale}/app`}
            className="text-lg font-semibold text-gray-900 tracking-tight hover:text-gray-700 transition-colors relative z-10"
          >
            AutoAppArch
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center space-x-8 relative z-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-base font-medium transition-colors tracking-tight relative z-10 pb-1 border-b-2 ${
                    pathname === link.href
                      ? "text-blue-600 font-semibold border-blue-600"
                      : "text-gray-600 hover:text-gray-900 border-transparent"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center rounded-md border border-gray-200 bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => onSwitch("ko")}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  locale === "ko"
                    ? "bg-white text-gray-900 shadow-sm font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                aria-label="Switch to Korean"
              >
                KO
              </button>
              <button
                type="button"
                onClick={() => onSwitch("en")}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  locale === "en"
                    ? "bg-white text-gray-900 shadow-sm font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                aria-label="Switch to English"
              >
                EN
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="text-gray-600 hover:text-gray-900 transition-colors p-2"
                aria-label="Open menu"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
