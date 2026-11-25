"use client";

import { ArrowUp, Github, Instagram, Linkedin, Mail, MessageCircle, Twitter } from "lucide-react";
import Link from "next/link";

const FOOTER_NAV = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact", href: "/contact" },
];

const FOOTER_SOCIALS = [
  { name: "GitHub", href: "https://github.com/mani254", icon: Github },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/sai0421/", icon: Linkedin },
  { name: "Twitter", href: "https://twitter.com", icon: Twitter },
  { name: "Instagram", href: "https://www.instagram.com/dev_mani25/", icon: Instagram },
  { name: "WhatsApp", href: "https://wa.me/+918688014415", icon: MessageCircle },
  { name: "Email", href: "mailto:manifreelancer25@gmail.com", icon: Mail },
];

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full border-t border-border/60 bg-transparent text-foreground/80 mt-auto">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-10 sm:py-14">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-10 border-b border-border/50 items-start">
          {/* Brand & Status Column */}
          <div className="md:col-span-6 space-y-3.5">
            <Link
              href="/"
              className="text-base sm:text-lg font-bold font-heading tracking-tight text-foreground hover:opacity-80 transition-opacity inline-block"
            >
              Sai Manikanta
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm leading-relaxed">
              Full-Stack Developer crafting fast, human-centered web experiences and production systems.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-border/70 text-[11px] font-semibold text-foreground/85 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Available for roles & select projects</span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Navigation
            </p>
            <ul className="space-y-2">
              {FOOTER_NAV.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover-link text-xs sm:text-sm font-medium text-foreground/75 hover:text-foreground hover:translate-x-0.5 transition-all inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect / Socials */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Connect
            </p>
            <div className="flex flex-wrap gap-2">
              {FOOTER_SOCIALS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="hover-link w-8 h-8 rounded-full bg-white/70 border border-border/70 hover:border-foreground/40 hover:bg-[#111827] hover:text-white text-muted-foreground flex items-center justify-center transition-all duration-200 shadow-2xs"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                );
              })}
            </div>
            <p className="text-[11px] text-muted-foreground pt-1">
              Bengaluru, India · IST (UTC+5:30)
            </p>
          </div>
        </div>

        {/* Bottom Credits & Back to Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] sm:text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Sai Manikanta Mamidi. All rights reserved.</p>

          <button
            type="button"
            onClick={scrollToTop}
            className="hover-link cursor-pointer group inline-flex items-center gap-1.5 text-xs font-semibold text-foreground/80 hover:text-foreground transition-colors"
          >
            <span>Back to top</span>
            <div className="w-5 h-5 rounded-full border border-border/80 flex items-center justify-center group-hover:-translate-y-0.5 transition-transform">
              <ArrowUp className="w-3 h-3" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
