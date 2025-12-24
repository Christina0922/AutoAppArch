import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4 tracking-tight">
              AutoAppArch
            </h3>
            <p className="text-base text-gray-500 leading-relaxed">
              키워드만 입력하면 앱 설계안을 자동으로 생성해주는 도구
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              서비스
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/app"
                  className="text-base text-gray-600 hover:text-gray-900 transition-colors"
                >
                  앱 만들기
                </Link>
              </li>
              <li>
                <Link
                  href="/history"
                  className="text-base text-gray-600 hover:text-gray-900 transition-colors"
                >
                  히스토리
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              정보
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-base text-gray-600 hover:text-gray-900 transition-colors"
                >
                  소개
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
              문의
            </h4>
            <p className="text-base text-gray-600">
              support@autoapparch.com
            </p>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-400 text-center">
            © 2026 AutoAppArch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
