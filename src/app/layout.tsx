import type { Metadata } from "next";
import "./globals.css";
import "./nes.css";

export const metadata: Metadata = {
  title: "TechNegotia 3.0 | Multi-Round Hackathon Event",
  description: "Begin Your Journey - A multi-round hackathon-style event focusing on problem-solving, prototyping under crisis, investor pitching with credit-based funding, and final negotiations. Join 150+ teams!",
  keywords: ["hackathon", "TechNegotia", "coding competition", "startup pitch", "problem solving", "negotiation"],
  authors: [{ name: "TechNegotia Team" }],
  openGraph: {
    title: "TechNegotia 3.0 | Begin Your Journey",
    description: "Multi-round hackathon event with problem-solving, prototyping, and investor pitches",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "TechNegotia 3.0 | Begin Your Journey",
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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1a1a2e" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
