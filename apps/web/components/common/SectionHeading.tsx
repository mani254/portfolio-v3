
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  heading: string;
  spanContent?: string;
  center?: boolean;
  className?: string;
  breakBeforeSpan?: boolean;
}

export default function SectionHeading({
  heading,
  spanContent,
  center = false,
  className,
  breakBeforeSpan = false,
}: SectionHeadingProps) {
  return (
    <div className={cn("space-y-2 mb-8", center && "text-center", className)}>
      <h2 className="text-2xl md:text-3xl lg:text-5xl font-black font-lexend tracking-tighter text-foreground leading-[0.9]">
        {heading}
        {spanContent && (
          <span
            className={cn(
              "bg-linear-to-r from-primary via-purple-500 to-primary bg-size-[200%_auto] animate-gradient-x bg-clip-text text-transparent",
              breakBeforeSpan ? "block mt-2" : " ml-2"
            )}
          >
            {spanContent}
          </span>
        )}
      </h2>
    </div>
  );
}
