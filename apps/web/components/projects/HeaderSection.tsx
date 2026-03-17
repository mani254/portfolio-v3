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
      <div className="flex justify-between md:items-start gap-4">

        <h1 className="">
          {project.title}
        </h1>


        <TooltipProvider>
          <div className="flex items-center gap-4">

            {/* GitHub Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                {project.githubUrl ? (
                  <Link href={project.githubUrl} target="_blank">
                    <button
                      className="rounded-full hover:scale-105 transition cursor-pointer bg-white/80 dark:bg-white p-0"
                    >
                      <Image src={GithubIcon} alt="GitHub" width={24} height={24} />
                    </button>
                  </Link>
                ) : (
                  <button
                    className="rounded-full hover:scale-105 transition cursor-pointer bg-white/80 dark:bg-white p-0"
                  >
                    <Image src={GithubIcon} alt="GitHub" width={24} height={24} />
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
              <Link href={project.liveUrl} target="_blank">
                <Button
                  className="flex items-center gap-2 bg-foreground text-background hover:opacity-90 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </Button>
              </Link>
            )}

          </div>
        </TooltipProvider>
      </div>

      {project.overview && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {project.overview}
        </p>
      )}

      {project.toolsAndLanguages && project.toolsAndLanguages.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {project.toolsAndLanguages.map((tech) => (
            <TechPill key={tech.id} tech={tech} />
          ))}
        </div>
      )}
    </section>
  )
}

export default HeaderSection