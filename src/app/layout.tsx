import type { Metadata } from "next";

export const revalidate = 86400; // Revalidate static layout daily (or on deploy)
import "./globals.css";


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
      className="light h-full antialiased overscroll-none"
      suppressHydrationWarning
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&amp;family=JetBrains+Mono:wght@500;700&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" />
      </head>
      <body className="text-on-background min-h-screen font-body-lg flex flex-col selection:bg-primary selection:text-white overscroll-none" suppressHydrationWarning>{children}</body>
    </html>
  );
}
