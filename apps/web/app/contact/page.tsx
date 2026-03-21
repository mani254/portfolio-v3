import CommonBanner from "@/components/common/CommonBanner";
import SectionHeading from "@/components/common/SectionHeading";
import { ContactTabs } from "@/components/contact/ContactTabs";
import { ContactTabsSkeleton } from "@/components/contact/ContactTabsSkeleton";
import { SocialLinks } from "@/components/contact/SocialLinks";
import { Suspense } from "react";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ContactPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const initialTab = (params.tab as string) || "call";

  return (
    <main className="min-h-screen">
      {/* 1. Banner Section */}
      <CommonBanner title="Leave A Message" />

      {/* 2. Content Section with Tabs */}
      <section className="page-section">
        <div className="container max-w-3xl mx-auto text-center mb-16 space-y-4">
          <p className="font-semibold text-sm text-muted-foreground tracking-widest">
            CONTACT ME
          </p>
          <SectionHeading heading="Let's Get" spanContent="In Touch" />
          <p className="text-muted-foreground text-lg">
            Whether you have a specific project in mind or just want to say hi,
            feel free to reach out through any of the options below.
          </p>
          <SocialLinks />
        </div>

        <Suspense fallback={<ContactTabsSkeleton />}>
          <ContactTabs initialTab={initialTab} />
        </Suspense>
      </section>
    </main>
  );
}