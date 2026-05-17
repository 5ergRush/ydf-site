import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { festivalInfo } from "@/data/festival";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(festivalInfo.siteUrl),
  title: {
    default: festivalInfo.name,
    template: `%s | ${festivalInfo.name}`,
  },
  description: festivalInfo.tagline,
  applicationName: festivalInfo.name,
  openGraph: {
    title: festivalInfo.name,
    description: festivalInfo.tagline,
    siteName: festivalInfo.name,
    type: "website",
    url: festivalInfo.siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: festivalInfo.name,
    description: festivalInfo.tagline,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
