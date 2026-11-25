import { Github, Linkedin, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SidebarNav from "./SidebarNav";

const NAV = [
  { label: "WORK", href: "/projects" },
  { label: "ABOUT ME", href: "/" },
  { label: "BLOGS", href: "/blogs" },
  { label: "CONTACT", href: "/contact" },
];

const SOCIALS = [
  {
    href: "https://github.com/mani254",
    icon: Github,
    label: "GitHub",
  },
  {
    href: "https://www.linkedin.com/in/sai0421/",
    icon: Linkedin,
    label: "LinkedIn",
  },
  {
    href: "mailto:manifreelancer25@gmail.com",
    icon: Mail,
    label: "Email",
  },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex fixed top-0 left-0 h-screen w-[240px] flex-col items-center justify-between py-12 z-40 select-none bg-transparent">
      {/* ── Top Profile Logo ── */}
      <Link
        href="/"
        className="group flex flex-col items-center w-full cursor-pointer px-4 transition-transform duration-200"
      >
        {/* Avatar container with 85% height curved pill background */}
        <div className="relative flex items-end justify-center">
          {/* 85% height curved background pill */}
          <div className="absolute -bottom-[2px] w-[110px]  rounded-3xl h-[80%] bg-[#fdecd2] border border-[#f5ddba]/60 " />

          {/* Avatar cutout rising above the 85% curve */}
          <div className="relative w-[90px] z-10 overflow-hidden pointer-events-none">
            <Image
              src="/images/profile-logo.png"
              alt="Sai Manikanta - Full Stack Developer Profile"
              width={110}
              height={120}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>

        {/* Name with increased font size & bold styling */}
        <div className="mt-2 text-center tracking-wider font-semibold">
          <h4>
            Manikanta
          </h4>
        </div>
      </Link>

      {/* ── Middle Nav (Client leaf component for active route detection) ── */}
      <SidebarNav items={NAV} />

      {/* ── Bottom Section: Heading + Email + Socials ── */}
      <div className="flex flex-col items-center gap-2.5 w-full px-4 text-center pb-2">
        <span className="text-[10px] font-bold tracking-[0.24em] uppercase text-[#9ca3af]">
          Drop me a message
        </span>

        <a
          href="mailto:manifreelancer25@gmail.com"
          className="hover-link text-[12px] font-medium text-[#4b5563] hover:text-[#111827] hover:underline underline-offset-4 transition-colors tracking-tight"
        >
          manifreelancer25@gmail.com
        </a>

        <div className="flex items-center justify-center gap-6 mt-1.5 w-full">
          {SOCIALS.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="hover-link text-[#4b5563] hover:text-[#111827] transition-all duration-200 hover:scale-115"
            >
              <Icon className="w-[19px] h-[19px]" strokeWidth={1.8} />
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
