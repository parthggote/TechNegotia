import type { Metadata } from "next";
import "./globals.css";
import "./nes.css";
import "@hackernoon/pixel-icon-library/fonts/iconfont.css";
import { ToastProvider } from "@/components/Toast";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";

export const metadata: Metadata = {
  title: "TechNegotia | Multi-Round Hackathon Event",
  description: "Begin Your Journey - A multi-round hackathon-style event focusing on problem-solving, prototyping under crisis, investor pitching with credit-based funding, and final negotiations. Join 150+ teams!",
  keywords: ["hackathon", "TechNegotia", "coding competition", "startup pitch", "problem solving", "negotiation"],
  authors: [{ name: "TechNegotia Team" }],

  openGraph: {
    title: "TechNegotia | Begin Your Journey",
    description: "Multi-round hackathon event with problem-solving, prototyping, and investor pitches",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "TechNegotia | Begin Your Journey",
    description: "Multi-round hackathon event with problem-solving, prototyping, and investor pitches",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css?family=Press+Start+2P" rel="stylesheet" />

        <meta name="theme-color" content="#1a1a2e" />
      </head>
      <body>
        <ToastProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </ToastProvider>
      </body>
    </html>
  );
}
