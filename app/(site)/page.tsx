import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      {/* Hero Section */}
      <section className="pt-32 pb-24 text-center">
        <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-12 tracking-tight leading-tight">
          <span className="font-bold text-gray-900">키워드</span>만 입력하면
          <br />
          <span className="font-bold text-gray-900">앱 설계안</span>이 <span className="font-bold text-gray-900">자동</span>으로 생성됩니다
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Link
            href="/app"
            className="h-14 px-10 bg-gray-900 text-white text-lg font-medium rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center tracking-tight"
          >
            지금 시작하기
          </Link>
        </div>

        {/* 인라인 데모 */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-100 p-8 mb-6">
            <div className="text-left mb-6">
              <p className="text-base font-medium text-gray-700 mb-4">
                단어(<span className="font-bold text-gray-900">키워드</span>) 몇 개만 입력하세요
              </p>
              <div className="flex gap-3 mb-4">
                <div className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-base text-gray-400">
                  예: 영어, 공부
                </div>
              </div>
              <button className="w-full h-12 bg-gray-900 text-white text-base font-medium rounded-md">
                앱 설계안 자동 생성하기
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-100 p-8">
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                자동 생성된 <span className="text-gray-600">앱 설계안</span>
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                입력 <span className="font-medium text-gray-700">키워드</span>: 영어, 공부
              </p>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-md p-4 border border-gray-100">
                  <h4 className="text-sm font-bold text-gray-900 mb-2">[ 타깃 사용자 ]</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 아이디어는 있으나 요구사항을 못 쓰는 사람</li>
                    <li>• 스타트업 창업 초기 기획자</li>
                    <li>• 학습 앱을 만들고 싶은 교육자</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-md p-4 border border-gray-100">
                  <h4 className="text-sm font-bold text-gray-900 mb-2">[ 핵심 행동 ]</h4>
                  <p className="text-sm text-gray-600">
                    영어 학습 관련 기능을 통해 사용자가 주요 목표를 달성하는 행동
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
