import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Technology } from 'sanity-lib'

const TechPill = ({ tech, className }: { tech: Technology, className?: string }) => {
  return (
    <div key={tech.id} className={cn("flex items-center gap-2 px-4 py-1.5 bg-linear-to-b from-foreground/10 to-foreground/5 backdrop-blur-md border border-border rounded-full shadow-sm", className)}>
      {tech.image && (
        <div className="w-6 h-6 relative shrink-0 rounded-full overflow-hidden">
          <Image unoptimized src={tech.image} alt={tech.title} fill className={cn("object-contain", tech.isBlack && 'dark:invert')} />
        </div>
      )}
      <span className="text-xs font-medium text-foreground">{tech.title}</span>
    </div>
  )
}

export default TechPill