"use client";

import BannerImg from "@/public/images/projects-banner.jpg";
import Image from "next/image";
// import { useRouter } from "next/navigation";


const CommonBanner = ({ title }: { title: string }) => {
  // const router = useRouter();
  return (
    <section className="relative w-full h-[35vh] min-h-[180px] max-h-[300px] overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={BannerImg}
          alt="Project Banner"
          fill
          priority
          className="object-cover object-top"
        />
      </div>

      {/* Gradient Fade */}
      <div className="absolute inset-0 z-1 bg-linear-to-t from-background via-background/70 via-60% to-background/40" />

      <div className="container">

        {/* Back Button - Top Left */}

        {/* <button
          onClick={() => router.back()}
          className="relative z-20 flex items-center gap-2 text-foreground hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back</span>
        </button> */}

        {/* Centered Title */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground/60">
            {title}
          </h1>
        </div>

      </div>
    </section>
  );
};

export default CommonBanner;