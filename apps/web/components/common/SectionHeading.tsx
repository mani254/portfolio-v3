
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
      <h2 className="font-semibold text-2xl md:text-3xl lg:text-5xl text-foreground">
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
