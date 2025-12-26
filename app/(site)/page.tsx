import { redirect } from "next/navigation";

// 루트 경로를 기본 locale로 리다이렉트
export default function HomePage() {
  redirect("/ko/app");
}
