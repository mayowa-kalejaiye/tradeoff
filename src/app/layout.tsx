import type { Metadata } from "next";

export const revalidate = 86400; // Revalidate static layout daily (or on deploy)
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tradeoff.pxxl.run'),
  title: "Tradeoff | AI Technical Feasibility Advisor",
  description: "Engineering-informed business judgment for founders. Tradeoff analyzes your startup idea to uncover existential risks and recommend architecture.",
  keywords: ["software architecture", "technical advisor", "startup due diligence", "system design", "founder tools", "staff engineer"],
  authors: [{ name: "Tradeoff" }],
  openGraph: {
    title: "Tradeoff | AI Technical Feasibility Advisor",
    description: "Stop building the wrong thing. Tradeoff acts as your Staff Engineer, exposing existential risks and architectural debt.",
    type: "website",
    locale: "en_US",
    siteName: "Tradeoff",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tradeoff | Technical Feasibility Advisor",
    description: "Engineering-informed business judgment for founders.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 selection:bg-indigo-500/30 font-sans" suppressHydrationWarning>{children}</body>
    </html>
  );
}
