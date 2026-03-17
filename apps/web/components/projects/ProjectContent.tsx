
import { FormatedProject } from "@/app/projects/page"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface Props {
  project: FormatedProject,
  index: number
}

export default function ProjectContent({ project, index }: Props) {

  const features =
    project.keyFeatures?.map((f) => f.question).slice(0, 3) ?? []

  return (
    <div className="space-y-6 max-w-md">
      <h2>{project.title}</h2>
      {project.overview && (
        <p className="text-muted-foreground leading-relaxed">
          {project.overview}
        </p>
      )}

      {features.length > 0 && (
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex gap-2 text-sm">
              <span className="text-primary">✦</span>
              {feature}
            </li>
          ))}
        </ul>
      )}

      {project.toolsAndLanguages && (
        <div className="flex flex-wrap gap-2 pt-2">
          {project.toolsAndLanguages.map((tech) => {
            return (
              <div key={tech.id} className="flex items-center gap-2 px-3 py-1 border border-border rounded-full shadow-sm bg-white/50 dark:bg-black/50">
                {tech.image && (
                  <div className="w-6 h-6 relative shrink-0 rounded-full overflow-hidden">
                    <Image src={tech.image} alt={tech.title} fill className={cn("object-contain", tech.isBlack && 'dark:invert')} />
                  </div>
                )}
                <span className="text-xs font-medium text-foreground">{tech.title}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}