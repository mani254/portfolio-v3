import { cn } from "@/lib/utils";
import { Technology } from "sanity-lib";
import { TechIcon } from "./TechIcon";

const TechPill = ({
  tech,
  className,
}: {
  tech: Technology;
  className?: string;
}) => {
  return (
    <div
      key={tech.id}
      className={cn(
        "group inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full border border-border/80 bg-white/90 hover:border-[#111827]/40 hover:bg-white hover:shadow-xs transition-all duration-200 text-[13px] sm:text-sm font-medium text-foreground cursor-default select-none shadow-2xs",
        className
      )}
    >
      <TechIcon
        name={tech.title}
        image={tech.image}
        className="w-4 h-4 sm:w-4.5 sm:h-4.5 group-hover:scale-110 transition-transform duration-200 shrink-0"
      />
      <span>{tech.title}</span>
    </div>
  );
};

export default TechPill;