import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ahead AI - Master AI Development That Actually Works",
  description:
    "Stop copy-pasting ChatGPT responses. Learn to build with AI that delivers razor-sharp, production-ready results. From beginner to principal engineer.",
  keywords: [
    "AI development",
    "AI coding",
    "prompt engineering",
    "AI tools",
    "Claude",
    "ChatGPT",
    "AI-driven development",
    "MCP",
    "agentic workflows",
  ],
  openGraph: {
    title: "Ahead AI - Master AI Development That Actually Works",
    description:
      "Stop copy-pasting ChatGPT responses. Learn AI development that delivers real results.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahead AI - Master AI Development That Actually Works",
    description:
      "Stop copy-pasting ChatGPT responses. Learn AI development that delivers real results.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
