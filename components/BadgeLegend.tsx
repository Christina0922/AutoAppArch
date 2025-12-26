"use client";

export default function BadgeLegend() {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
      <p className="text-xs font-semibold text-gray-900 mb-2">📊 난이도/기간 산정 기준</p>
      <div className="space-y-1.5 text-xs text-gray-700 leading-relaxed">
        <p>
          <span className="font-medium">난이도:</span>{" "}
          <span className="text-green-700 font-medium">초급</span> 단일 구성 중심(기본 인증/기본 로그), 운영 자동화/분산 제외 |{" "}
          <span className="text-yellow-700 font-medium">중급</span> 캐시/권한/비동기 중 일부 포함, 설정/운영 포인트 증가 |{" "}
          <span className="text-red-700 font-medium">상급</span> 고가용성/보안/관측성/운영 포함, 구성요소 증가로 운영 난이도 높음
        </p>
        <p>
          <span className="font-medium">기간:</span> 1인 기준 기본 구현+기본 테스트 추정치이며, 외부연동/운영요소 포함 시 증가 가능
        </p>
      </div>
    </div>
  );
}

