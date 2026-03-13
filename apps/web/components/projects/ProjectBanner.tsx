import ProjectBannerImg from "@/public/images/projects-banner.jpg";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


const ProjectBanner = () => {
  return (
    <section className="relative w-full h-[25vh] min-h-[180px] max-h-[300px] overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={ProjectBannerImg}
          alt="Project Banner"
          fill
          priority
          className="object-cover object-top"
        />
      </div>

      {/* Gradient Fade */}
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-background via-background/70 via-60% to-background/40" />

      <div className="container mx-auto px-4 max-w-7xl py-4">

        {/* Back Button - Top Left */}

        <Link
          href="/projects"
          className="relative z-10 flex items-center gap-2 text-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back</span>
        </Link>

        {/* Centered Title */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground/50">
            Project Details
          </h1>
        </div>

      </div>
    </section>
  );
};

export default ProjectBanner;