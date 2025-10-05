import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ClientLayout } from '@/components/layout/client-layout';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Prashiskshan - NEP 2020 Internship Management Platform",
    template: "%s | Prashiskshan"
  },
  description: "Comprehensive internship management system for students, colleges, and industry partners under NEP 2020 framework. Streamline internships with real-time tracking, automated reporting, and role-based access control.",
  keywords: [
    "internship management",
    "NEP 2020",
    "student portal",
    "college management",
    "industry collaboration",
    "internship tracking",
    "academic credits",
    "education technology"
  ],
  authors: [{ name: "Prashiskshan Team" }],
  creator: "Prashiskshan",
  publisher: "Prashiskshan",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://prashiskshan.edu",
    title: "Prashiskshan - NEP 2020 Internship Management Platform",
    description: "Transform your internship programs with our comprehensive management platform designed for NEP 2020 compliance.",
    siteName: "Prashiskshan",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prashiskshan - NEP 2020 Internship Management Platform",
    description: "Transform your internship programs with our comprehensive management platform designed for NEP 2020 compliance.",
    creator: "@prashiskshan",
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
  verification: {
    google: 'google-site-verification-code',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
