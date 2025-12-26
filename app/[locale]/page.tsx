import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LocaleIndex({ params }: Props) {
  const { locale } = await params;
  const validLocale = locale === "en" ? "en" : "ko";
  // 초기 진입은 항상 앱 만들기 화면으로 보냅니다.
  redirect(`/${validLocale}/app`);
}

