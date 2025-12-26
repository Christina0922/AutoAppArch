import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AutoAppArch",
  description: "Generate mobile app architecture from a few keywords",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

