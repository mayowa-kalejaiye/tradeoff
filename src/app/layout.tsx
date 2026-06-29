import type { Metadata } from "next";

export const revalidate = 86400; // Revalidate static layout daily (or on deploy)
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
  metadataBase: new URL('https://tradeoff.pxxl.run'),
  title: "Tradeoff | AI Technical Feasibility Advisor",
  description: "Get senior engineering judgment on day zero. Tradeoff analyzes your startup idea, uncovers existential risks, and recommends architecture based on actual tradeoffs.",
  keywords: ["software architecture", "technical advisor", "startup due diligence", "system design", "founder tools", "staff engineer"],
  authors: [{ name: "Tradeoff" }],
  openGraph: {
    title: "Tradeoff | AI Technical Feasibility Advisor",
    description: "Stop building the wrong thing. Tradeoff acts as your Staff Engineer, analyzing your product brief to expose existential risks, architectural debt, and critical unknowns.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
