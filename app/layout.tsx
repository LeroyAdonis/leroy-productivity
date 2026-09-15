import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RegisterSW from "./register-sw";
import PremiumNav from "@/components/premium-nav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flow",
  description: "Personal productivity app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#020617" />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--color-bg)] text-[var(--color-foreground)]">
        <RegisterSW />
        <PremiumNav />
        <main className="pt-20 pb-10 px-4 max-w-2xl mx-auto font-sans">{children}</main>
      </body>
    </html>
  );
}
