import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RegisterSW from "./register-sw";
import MdBottomNav from "@/components/md-bottom-nav";

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
        <meta name="theme-color" content="#0A0A0B" />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--md-surface)] text-[var(--md-on-surface)]">
        <RegisterSW />
        <main className="flex-1 pb-20">{children}</main>
        <MdBottomNav />
      </body>
    </html>
  );
}
