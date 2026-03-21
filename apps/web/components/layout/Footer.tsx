
import { footerLinks, socialLinks } from "@/lib/consts";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full backdrop-blur-sm text-muted-foreground border-t border-border/50 py-10 md:py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-16">
          {/* Logo and Bio Section */}
          <div className="space-y-4 max-w-sm">
            <p className="text-sm leading-relaxed text-muted-foreground">
              I&apos;m Sai Manikanta - a full-stack developer, freelancer & problem solver. Thanks for checking out my site!
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/40 border border-border/40 text-[10px] font-medium tracking-wide text-foreground/80">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
              </span>
              Available for work
            </div>
          </div>

          {/* Link Columns - Flex for better mobile side-by-side */}
          <div className="flex gap-12 md:gap-16">
            {footerLinks.map((column) => (
              <div key={column.title} className="space-y-4">
                <h3 className="text-foreground font-semibold text-xs tracking-widest uppercase">{column.title}</h3>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm hover:text-primary transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-[12px]">
            <p>© {new Date().getFullYear()} Sai Manikanta. All rights reserved.</p>
            <div className="flex items-center gap-2 opacity-80">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <span className="opacity-40">•</span>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Use</Link>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground/60 hover:text-primary transition-all transform hover:scale-110"
                  aria-label={social.label}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
