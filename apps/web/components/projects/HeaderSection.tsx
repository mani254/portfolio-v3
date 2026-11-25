import GithubIcon from '@/public/images/github.png'
import { ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Project } from 'sanity-lib'
import TechPill from '../common/TechPill'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

const HeaderSection = ({ project }: { project: Project }) => {
  return (
    <section id="overview" className="scroll-mt-24 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-foreground tracking-tight">
          {project.title}
        </h1>

        <TooltipProvider>
          <div className="flex items-center gap-3">
            {/* GitHub Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                {project.githubUrl ? (
                  <Link href={project.githubUrl} target="_blank" className="hover-link">
                    <button
                      className="rounded-full hover:scale-105 transition cursor-pointer bg-white p-1 border border-border/80 shadow-2xs"
                    >
                      <Image src={GithubIcon} alt="GitHub repository link" width={22} height={22} />
                    </button>
                  </Link>
                ) : (
                  <button
                    className="rounded-full opacity-50 cursor-not-allowed bg-white p-1 border border-border/80"
                  >
                    <Image src={GithubIcon} alt="GitHub repository link (private)" width={22} height={22} />
                  </button>
                )}
              </TooltipTrigger>

              <TooltipContent>
                {project.githubUrl
                  ? "View source code"
                  : "Source code is private / confidential"}
              </TooltipContent>
            </Tooltip>

            {/* Live Project Button */}
            {project.liveUrl && (
              <Link href={project.liveUrl} target="_blank" className="hover-link">
                <Button
                  className="flex items-center gap-2 bg-[#111827] text-white hover:bg-black rounded-full px-4 py-2 text-xs font-semibold shadow-2xs cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Live Demo</span>
                </Button>
              </Link>
            )}
          </div>
        </TooltipProvider>
      </div>

      {project.overview && (
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl">
          {project.overview}
        </p>
      )}

      {project.toolsAndLanguages && project.toolsAndLanguages.length > 0 && (
        <div className="flex flex-wrap gap-2 sm:gap-2.5 pt-1">
          {project.toolsAndLanguages.map((tech) => (
            <TechPill key={tech.id} tech={tech} />
          ))}
        </div>
      )}
    </section>
  )
}

export default HeaderSection