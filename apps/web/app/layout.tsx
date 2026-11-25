import { AuthModal } from "@/components/auth/auth-modal";
import { AuthHydrator } from "@/components/auth/AuthHydrator";
import ChatWidget from "@/components/chat/ChatWidget";
import Cursor from "@/components/common/Cursor";
import Footer from "@/components/common/Footer";
import MobileNav from "@/components/common/MobileNav";
import Sidebar from "@/components/common/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:1234"
  ),
  title: {
    default: "Sai Manikanta — Full-Stack Developer",
    template: "%s | Sai Manikanta",
  },
  description:
    "Full-stack developer with 3+ years of experience building scalable web applications and seamless user experiences.",
  openGraph: {
    title: "Sai Manikanta — Full-Stack Developer",
    description:
      "Full-stack developer with 3+ years of experience building scalable web applications.",
    url: "/",
    siteName: "Sai Manikanta",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sai Manikanta — Full-Stack Developer",
    description:
      "Full-stack developer with 3+ years of experience building scalable web applications.",
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
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${inter.variable}`}
    >
      <body className="antialiased w-full overflow-x-hidden bg-background text-foreground">
        {/* Custom cursor */}
        <Cursor />

        {/* Desktop sidebar (fixed, 240px wide) */}
        <Sidebar />

        {/* Subtle, unnoticeable animated background colors for a cool ambient depth */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
          <div className="absolute -top-[12%] -left-[8%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full bg-gradient-to-br from-emerald-200/25 via-teal-100/15 to-transparent blur-3xl animate-ambient-1" />
          <div className="absolute top-[25%] -right-[10%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-bl from-amber-200/20 via-orange-100/15 to-transparent blur-3xl animate-ambient-2" />
          <div className="absolute -bottom-[15%] left-[25%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-gradient-to-tr from-lime-100/20 via-slate-100/20 to-transparent blur-3xl" />
        </div>

        {/* Main content area — offset by sidebar on md+ */}
        <div className="md:pl-[240px] min-h-screen flex flex-col">
          {/* Mobile top bar with hamburger */}
          <MobileNav />

          {/* Page content */}
          <div className="flex-1">{children}</div>

          {/* Footer */}
          <Footer />
        </div>

        {/* Global overlays */}
        <ChatWidget />
        <AuthHydrator />
        <AuthModal />
        <Toaster />
      </body>
    </html>
  );
}
