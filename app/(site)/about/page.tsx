export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-24">
      <h1 className="text-4xl font-semibold text-gray-900 mb-16 text-center tracking-tight">
        AutoAppArch 소개
      </h1>

      <div className="space-y-8">
        <section className="bg-white rounded-lg border border-gray-100 p-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 tracking-tight">서비스 목적</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            AutoAppArch는 앱이나 웹 서비스를 만들고 싶지만 체계적인 기획 문서를
            작성하기 어려운 분들을 위해 설계안을 자동으로 생성해주는 도구입니다.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            키워드만 입력하면 타깃 사용자, 핵심 기능, 수익 모델, 리스크 요소까지
            포함한 완전한 설계안을 제공합니다.
          </p>
        </section>

        <section className="bg-white rounded-lg border border-gray-100 p-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 tracking-tight">주요 기능</h2>
          <ul className="space-y-4 text-base text-gray-600">
            <li className="flex items-start">
              <span className="text-gray-400 mr-3">•</span>
              <span>
                <strong className="text-gray-900 font-medium">키워드 기반 설계안 생성:</strong> 2~3개의 키워드만으로
                체계적인 앱 설계안을 자동 생성합니다.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-3">•</span>
              <span>
                <strong className="text-gray-900 font-medium">완전한 기획 문서:</strong> 타깃 사용자, 핵심 행동, 수익
                모델, 데이터 저장, 리스크 요소, 예상 지표를 모두 포함합니다.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-3">•</span>
              <span>
                <strong className="text-gray-900 font-medium">히스토리 관리:</strong> 생성한 설계안을 저장하고
                언제든지 다시 확인할 수 있습니다.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-3">•</span>
              <span>
                <strong className="text-gray-900 font-medium">빠른 결과 확인:</strong> 1분 안에 설계안을 생성하고
                확인할 수 있습니다.
              </span>
            </li>
          </ul>
        </section>

        <section className="bg-white rounded-lg border border-gray-100 p-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 tracking-tight">사용 대상</h2>
          <ul className="space-y-3 text-base text-gray-600">
            <li className="flex items-start">
              <span className="text-gray-400 mr-3">•</span>
              <span>아이디어는 있으나 요구사항을 못 쓰는 사람</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-3">•</span>
              <span>스타트업 창업 초기 기획자</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-3">•</span>
              <span>개발자이지만 기획 문서 작성이 어려운 사람</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-3">•</span>
              <span>비개발자이지만 앱/웹 서비스를 만들고 싶은 사람</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-3">•</span>
              <span>기존 서비스를 개선하고 싶은 PM/PO</span>
            </li>
          </ul>
        </section>

        <section className="bg-white rounded-lg border border-gray-100 p-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 tracking-tight">주의사항</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            AutoAppArch는 설계안을 자동으로 생성하는 도구입니다. 생성된 결과는
            참고용이며, 실제 서비스 개발 시에는 전문가의 검토와 추가 기획이
            필요할 수 있습니다.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            생성된 설계안의 법적 책임 범위는 사용자에게 있으며, 추천 결과의
            한계를 고지합니다.
          </p>
        </section>
      </div>
    </div>
  );
}
