import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      {/* Hero Section */}
      <section className="pt-32 pb-24 text-center">
        <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-8 tracking-tight leading-tight">
          키워드만 입력하면
          <br />
          <span className="text-gray-600">앱 설계안이 자동으로 생성됩니다</span>
        </h1>
        <p className="text-lg text-gray-500 mb-12 leading-relaxed max-w-2xl mx-auto">
          아이디어는 있지만 요구사항 문서를 작성하기 어려우신가요?
          <br />
          AutoAppArch가 도와드립니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/app"
            className="h-12 px-8 bg-gray-900 text-white text-base font-medium rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center tracking-tight"
          >
            무료로 시작하기
          </Link>
          <Link
            href="/about"
            className="h-12 px-8 bg-white text-gray-900 text-base font-medium rounded-md border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center tracking-tight"
          >
            더 알아보기
          </Link>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 tracking-tight">
            왜 필요한가요?
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 tracking-tight">
              요구사항 문서 작성이 어려워요
            </h3>
            <p className="text-base text-gray-500 leading-relaxed">
              아이디어는 있지만 체계적인 기획 문서로 정리하기 어려운 분들을
              위해 설계안을 자동으로 생성합니다.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 tracking-tight">
              시간이 부족해요
            </h3>
            <p className="text-base text-gray-500 leading-relaxed">
              몇 시간 걸리던 기획 작업을 몇 분 안에 완료할 수 있습니다.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 tracking-tight">
              체계적인 구조가 필요해요
            </h3>
            <p className="text-base text-gray-500 leading-relaxed">
              타깃 사용자, 수익 모델, 리스크까지 포함한 완전한 설계안을
              제공합니다.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 border-t border-gray-100">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 tracking-tight">
            어떻게 동작하나요?
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-900 rounded-md flex items-center justify-center mx-auto mb-6">
              <span className="text-lg font-semibold text-white">1</span>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-3 tracking-tight">
              키워드 입력
            </h3>
            <p className="text-base text-gray-500 leading-relaxed">
              앱의 핵심 키워드 2~3개를 입력하세요.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-900 rounded-md flex items-center justify-center mx-auto mb-6">
              <span className="text-lg font-semibold text-white">2</span>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-3 tracking-tight">
              설계안 생성
            </h3>
            <p className="text-base text-gray-500 leading-relaxed">
              AI가 키워드를 분석하여 체계적인 설계안을 생성합니다.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-900 rounded-md flex items-center justify-center mx-auto mb-6">
              <span className="text-lg font-semibold text-white">3</span>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-3 tracking-tight">
              저장 및 활용
            </h3>
            <p className="text-base text-gray-500 leading-relaxed">
              생성된 설계안을 저장하고 언제든지 다시 확인할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 border-t border-gray-100">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 tracking-tight">
            다른 도구와의 차이
          </h2>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-12">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4 tracking-tight">
                AutoAppArch
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-gray-900 mr-2 font-medium">✓</span>
                  <span>키워드 기반 자동 설계</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-900 mr-2 font-medium">✓</span>
                  <span>완전한 기획 문서 생성</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-900 mr-2 font-medium">✓</span>
                  <span>1분 안에 결과 확인</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4 tracking-tight">
                Cursor/코딩 도구
              </h3>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>코드 생성에 특화</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>기획 단계 미지원</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>기술적 지식 필요</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4 tracking-tight">
                노코드 플랫폼
              </h3>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>구현 단계 도구</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>기획 문서 미제공</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>설계 단계 별도 필요</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Result Section */}
      <section className="py-24 border-t border-gray-100">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 tracking-tight">
            생성 결과 예시
          </h2>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-12">
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">
              AutoAppArch: 학습 + 영어 학습 설계 도우미
            </h3>
            <p className="text-sm text-gray-500">
              학습 + 영어를 중심으로 한 모바일 앱 설계안
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 tracking-tight uppercase text-xs">
                타깃 사용자
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 아이디어는 있으나 요구사항을 못 쓰는 사람</li>
                <li>• 스타트업 창업 초기 기획자</li>
                <li>• 학습 앱을 만들고 싶은 교육자</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 tracking-tight uppercase text-xs">
                핵심 행동
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                학습 + 영어 학습 관련 기능을 통해 사용자가 주요 목표를 달성하는
                행동
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
