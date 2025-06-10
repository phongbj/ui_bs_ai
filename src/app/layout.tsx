import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Bác sĩ AI",
  description: "Next.js + Chakra + React Query + NextAuth",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) { 
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="custom-scroll">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
