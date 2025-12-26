import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const validLocale = locale === "en" ? "en" : "ko";

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">
        {validLocale === "en" ? "About" : "소개"}
      </h1>
      <p className="mt-3 text-base text-gray-600">
        {validLocale === "en"
          ? "AutoAppArch generates a mobile app architecture from a few keywords."
          : "AutoAppArch는 몇 개의 키워드로 모바일 앱 아키텍처 설계안을 생성합니다."}
      </p>
    </main>
  );
}

