import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n";
import { RouteLocaleGuard } from "@/components/RouteLocaleGuard";
import { LanguageMixGuard } from "@/components/LanguageMixGuard";
import { LocaleTextGuard } from "@/components/LocaleTextGuard";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  // ===== 단일 진실원: 라우트(pathname)가 언어를 결정 =====
  // /en이면 무조건 en, 그 외는 무조건 ko
  const finalLocale: "ko" | "en" = locale === "en" ? "en" : "ko";
  const messages = await getMessages({ locale: finalLocale });
  const metadataMessages = (messages.metadata || {}) as { title?: string; description?: string };
  
  return {
    title: metadataMessages.title || "AutoAppArch",
    description: metadataMessages.description || "",
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Props) {
  let { locale } = await params;
  
  // ===== 단일 진실원: 라우트(pathname)가 언어를 결정 =====
  // /en이면 무조건 en, 그 외는 무조건 ko
  // 브라우저/쿠키/localStorage 감지는 절대 사용하지 않음
  const finalLocale: "ko" | "en" = locale === "en" ? "en" : "ko";
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(finalLocale as any)) {
    notFound();
  }

  const messages = await getMessages({ locale: finalLocale });

  return (
    <html lang={finalLocale}>
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <RouteLocaleGuard />
          <LanguageMixGuard />
          <LocaleTextGuard />
          <Header />
          <main className="flex-1 flex flex-col">
            <div className="max-w-7xl mx-auto w-full px-8 md:px-12 lg:px-16">
              {children}
            </div>
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

