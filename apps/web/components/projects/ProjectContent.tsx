
import { FormatedProject } from "@/app/projects/page"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface Props {
  project: FormatedProject,
  index: number,
  isMobile?: boolean
}

export default function ProjectContent({ project, index, isMobile }: Props) {

  const features =
    project.keyFeatures?.map((f) => f.question).slice(0, 3) ?? []

  return (
    <div className="space-y-4 max-w-md ">
      <div className="space-y-3">
        <h2 className="section-title mb-0 font-bold tracking-tight text-foreground">
          {project.title}
        </h2>
        <div className="w-12 h-1 bg-primary rounded-full opacity-80" />
      </div>

      {project.overview && (
        <p className={cn("text-sm text-muted-foreground/90 leading-relaxed font-medium", isMobile && "line-clamp-3")}>
          {project.overview}
        </p>
      )}

      {features.length > 0 && (
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex gap-3 text-sm font-medium items-start group">
              <span className="text-primary mt-1 group-hover:scale-125 transition-transform duration-300">✦</span>
              <span className="text-foreground/80 group-hover:text-foreground transition-colors duration-300">{feature}</span>
            </li>
          ))}
        </ul>
      )}

      {project.toolsAndLanguages && !isMobile && (
        <div className="flex flex-wrap gap-2 pt-4">
          {project.toolsAndLanguages.map((tech) => {
            return (
              <div
                key={tech.id}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-1 border border-border/50 rounded-full shadow-sm",
                  "bg-white/40 backdrop-blur-md dark:bg-white/5 dark:hover:bg-white/10 transition-all duration-300",
                  "hover:shadow-lg hover:-translate-y-0.5"
                )}
              >
                {tech.image && (
                  <div className="w-5 h-5 relative shrink-0 rounded-full overflow-hidden brightness-110">
                    <Image src={tech.image} alt={tech.title} fill className={cn("object-contain", tech.isBlack && 'dark:invert')} />
                  </div>
                )}
                <span className="text-[12px] font-medium tracking-wide text-foreground/90">{tech.title}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}