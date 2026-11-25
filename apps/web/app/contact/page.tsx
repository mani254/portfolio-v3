import { ContactTabs } from "@/components/contact/ContactTabs";
import { ContactTabsSkeleton } from "@/components/contact/ContactTabsSkeleton";
import { SocialLinks } from "@/components/contact/SocialLinks";
import { Suspense } from "react";
import type { Metadata } from "next";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export const metadata: Metadata = {
  title: "Contact",
  description: "Let's work together — reach out via email, phone, or schedule a call.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const initialTab = (params.tab as string) || "call";

  return (
    <main className="pt-20 md:pt-12 min-h-screen pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Page header — Centered heading, description, and social media icons */}
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-12 space-y-3">
          <p className="text-[11px] font-semibold text-muted-foreground tracking-[0.2em] uppercase">
            Get in Touch
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight font-heading">
            Let&apos;s Talk
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed pt-1">
            Whether you have a project in mind, want to collaborate, or just
            want to say hello — I&apos;m always happy to hear from you. Pick the
            channel that works best for you.
          </p>
          <div className="pt-3 flex items-center justify-center">
            <SocialLinks />
          </div>
        </div>

        {/* Content area without artificial enclosing box */}
        <div className="w-full">
          <Suspense fallback={<ContactTabsSkeleton />}>
            <ContactTabs initialTab={initialTab} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}