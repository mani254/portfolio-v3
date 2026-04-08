import type { Metadata } from "next";
import { Inter, Quicksand } from "next/font/google";
import "./globals.css";


const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  title: {
    default: "Portfolio",
    template: "%s | Portfolio",
  },
  description: "A professional portfolio showcasing projects, insights, and posts.",
  openGraph: {
    title: "Portfolio",
    description: "A professional portfolio showcasing projects, insights, and posts.",
    url: "/",
    siteName: "Portfolio UI",
    images: [
      {
        url: "/og-image.jpg", // placeholder, assuming it exists
        width: 1200,
        height: 630,
        alt: "Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio",
    description: "A professional portfolio showcasing projects, insights, and posts.",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import Cursor from "@/components/common/Cursor";
import NavBar from "@/components/common/NavBar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import ChatWidget from "@/components/chat/ChatWidget";
import { AuthModal } from "@/components/auth/auth-modal";
import { AuthHydrator } from "@/components/auth/AuthHydrator";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${quicksand.variable} ${inter.variable}`} suppressHydrationWarning>
      <body
        className="antialiased w-full overflow-x-hidden"
      >

        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <NavBar />
          <Cursor />
          {children}
          <Footer />
          <ChatWidget />
          <AuthHydrator />
          <AuthModal />
          {/* <Toaster richColors position="top-right" /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
