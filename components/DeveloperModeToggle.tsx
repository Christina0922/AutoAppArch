"use client";

import { useState, useEffect } from "react";

interface DeveloperModeToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function DeveloperModeToggle({ value, onChange }: DeveloperModeToggleProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // localStorage에서 초기값 로드 (한 번만)
    const saved = localStorage.getItem("developerMode");
    if (saved !== null && saved !== value.toString()) {
      onChange(saved === "true");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggle = (checked: boolean) => {
    onChange(checked);
    if (isMounted) {
      localStorage.setItem("developerMode", checked.toString());
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex justify-end mb-4">
      <label className="flex items-center gap-2 cursor-pointer">
        <span className="text-sm text-gray-700 font-medium">개발자 보기</span>
        <div className="relative">
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => handleToggle(e.target.checked)}
            className="sr-only"
            aria-label="개발자 보기 토글"
          />
          <div
            className={`w-11 h-6 rounded-full transition-colors ${
              value ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                value ? "translate-x-5" : "translate-x-0.5"
              } mt-0.5`}
            />
          </div>
        </div>
      </label>
    </div>
  );
}

