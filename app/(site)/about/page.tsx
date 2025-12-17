import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-24">
      <h1 className="text-4xl font-semibold text-gray-900 mb-16 text-center tracking-tight">
        AutoAppArch
      </h1>

      <div className="space-y-8">
        <section className="bg-white rounded-lg border border-gray-100 p-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 tracking-tight">무엇인가요?</h2>
          <p className="text-base text-gray-600 leading-relaxed">
            <span className="font-bold text-gray-900">키워드</span> 몇 개만 입력하면
            <br />
            <span className="font-bold text-gray-900">앱 설계안</span>을 <span className="font-bold text-gray-900">자동</span>으로 생성해주는 도구입니다.
          </p>
        </section>

        <section className="bg-white rounded-lg border border-gray-100 p-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 tracking-tight">어떻게 동작하나요?</h2>
          <div className="space-y-4 text-base text-gray-600">
            <div className="flex items-start">
              <span className="text-gray-900 mr-3 font-bold">1.</span>
              <span><span className="font-medium text-gray-900">키워드</span> 입력</span>
            </div>
            <div className="flex items-start">
              <span className="text-gray-900 mr-3 font-bold">2.</span>
              <span><span className="font-medium text-gray-900">앱 설계안</span> <span className="font-medium text-gray-900">자동</span> 생성</span>
            </div>
            <div className="flex items-start">
              <span className="text-gray-900 mr-3 font-bold">3.</span>
              <span>저장 및 활용</span>
            </div>
          </div>
        </section>

        <div className="text-center pt-8">
          <Link
            href="/app"
            className="inline-block h-12 px-8 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors tracking-tight"
          >
            지금 시작하기
          </Link>
        </div>
      </div>
    </div>
  );
}
