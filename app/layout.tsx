import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
  preload: true,
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "StackTally — AI Spend Audit for Startups",
  description:
    "Stop overpaying for AI tools. Audit your startup&apos;s AI stack in 60 seconds. Find wasted seats, overlapping tools, and cheaper alternatives.",
  openGraph: {
    title: "StackTally — AI Spend Audit for Startups",
    description:
      "Most startups waste 30% of their AI tool budget. Find your leaks in 60 seconds.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
