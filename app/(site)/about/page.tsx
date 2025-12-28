"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, withLocalePrefix } from "@/utils/localePath";

export default function AboutPage() {
  const pathname = usePathname() || "/";
  const locale = getLocaleFromPathname(pathname) ?? "ko";
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 lg:px-8">
      <section className="w-full max-w-3xl text-center">
        <h1 className="text-4xl font-semibold text-gray-900 mb-16 tracking-tight">
          AutoAppArch
        </h1>

        <div className="space-y-8">
          <section className="bg-white rounded-lg border border-gray-100 p-10 flex flex-col items-center justify-center text-center min-h-[260px]">
            <div className="flex flex-col items-center justify-center gap-6">
              <h2 className="text-lg font-semibold text-gray-900 tracking-tight">무엇인가요?</h2>
              <p className="text-base text-gray-600 leading-relaxed max-w-2xl">
                <span className="font-bold text-gray-900">키워드</span> 몇 개만 입력하면
                <br />
                <span className="font-bold text-gray-900">앱 설계안</span>을 <span className="font-bold text-gray-900">자동</span>으로 생성해주는 도구입니다.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-lg border border-gray-100 p-10 flex flex-col items-center justify-center text-center min-h-[260px]">
            <div className="flex flex-col items-center justify-center gap-6">
              <h2 className="text-lg font-semibold text-gray-900 tracking-tight">어떻게 동작하나요?</h2>
              <div className="space-y-4 text-base text-gray-600 max-w-2xl">
                <div className="flex items-start justify-center">
                  <span className="text-gray-900 mr-3 font-bold">1.</span>
                  <span><span className="font-medium text-gray-900">키워드</span> 입력</span>
                </div>
                <div className="flex items-start justify-center">
                  <span className="text-gray-900 mr-3 font-bold">2.</span>
                  <span><span className="font-medium text-gray-900">앱 설계안</span> <span className="font-medium text-gray-900">자동</span> 생성</span>
                </div>
                <div className="flex items-start justify-center">
                  <span className="text-gray-900 mr-3 font-bold">3.</span>
                  <span>저장 및 활용</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg border border-gray-100 p-10 flex flex-col items-center justify-center text-center min-h-[260px]">
            <div className="flex flex-col items-center justify-center gap-6">
              <h2 className="text-lg font-semibold text-gray-900 tracking-tight">누가 쓰나요?</h2>
              <p className="text-base text-gray-600 leading-relaxed max-w-2xl">
                기획자, 교육자, 1인 개발자 등 아이디어는 있지만 체계적인 설계 문서를 작성하기 어려운 분들이 사용합니다.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-lg border border-gray-100 p-10 flex flex-col items-center justify-center text-center min-h-[260px]">
            <div className="flex flex-col items-center justify-center gap-6">
              <h2 className="text-lg font-semibold text-gray-900 tracking-tight">무엇이 나오나요?</h2>
              <p className="text-base text-gray-600 leading-relaxed max-w-2xl">
                타깃 사용자, 핵심 행동, 수익 모델, 데이터 저장, 리스크 요소를 포함한 완전한 <span className="font-bold text-gray-900">앱 설계안</span>이 생성됩니다.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-lg border border-gray-100 p-10 flex flex-col items-center justify-center text-center min-h-[260px]">
            <div className="flex flex-col items-center justify-center gap-6">
              <h2 className="text-lg font-semibold text-gray-900 tracking-tight">어디에 쓰나요?</h2>
              <p className="text-base text-gray-600 leading-relaxed max-w-2xl">
                개발자에게 전달하거나, 외주 의뢰 시, 또는 내부 기획 문서로 활용할 수 있습니다.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-8">
          <section className="bg-white rounded-lg border border-gray-100 p-10 flex flex-col items-center justify-center text-center">
            <div className="flex justify-center w-full">
              <Link
                href={withLocalePrefix("/app", locale, pathname)}
                className="inline-flex items-center justify-center h-12 px-8 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                aria-label="앱 설계안 만들기 시작하기"
              >
                지금 시작하기
              </Link>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
