import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthInitializer } from "@/components/auth-initializer";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Walldeed — Smart Print Platform",
  description:
    "Walldeed lets you upload and print documents instantly from anywhere. Built for students and stationary shops. Developed by Naveen Basyal and Puneet Sharma.",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",

    shortcut: "/favicon.ico",
  },
  keywords: [
    "print near me",
    "online printing",
    "PDF tools",
    "print shop",
    "student print service",
    "stationary digital",
    "walldeed",
    "print Punjab",
    "puneet sharma cgc",
    "puneet sharma hausvalley",
    "puneet sharma github",
    "puneet sharma linkedin",
    "puneet sharma twitter",
    "naveen basyal cgc",
    "naveen basyal hausvalley",
    "naveen basyal github",
    "naveen basyal linkedin",
    "naveen basyal twitter",
    "upload and print documents",
  ],
  openGraph: {
    title: "Walldeed — Smart Print Platform",
    description:
      "Upload, convert, and print documents anywhere. Built by Naveen Basyal & Puneet Sharma.",
    url: "https://walldeed.vercel.app",
    siteName: "Walldeed",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Walldeed Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  authors: [
    { name: "Naveen Basyal", url: "https://github.com/naveenbasyal" },
    { name: "Puneet Sharma", url: "https://github.com/PuneetSharma52" },
  ],
  creator: "Walldeed Team",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthInitializer />
          <div className="flex flex-col">
            <Navbar />
            <main>{children}</main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
