import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link 
            href="/" 
            className="text-lg font-semibold text-gray-900 tracking-tight hover:text-gray-700 transition-colors"
          >
            AutoAppArch
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/app"
              className="text-base font-medium text-gray-600 hover:text-gray-900 transition-colors tracking-tight"
            >
              앱 만들기
            </Link>
            <Link
              href="/history"
              className="text-base font-medium text-gray-600 hover:text-gray-900 transition-colors tracking-tight"
            >
              히스토리
            </Link>
            <Link
              href="/pricing"
              className="text-base font-medium text-gray-600 hover:text-gray-900 transition-colors tracking-tight"
            >
              요금제
            </Link>
            <Link
              href="/about"
              className="text-base font-medium text-gray-600 hover:text-gray-900 transition-colors tracking-tight"
            >
              소개
            </Link>
          </nav>
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
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
    </header>
  );
}
