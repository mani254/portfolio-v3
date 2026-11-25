"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { CONTACT_LINKS, MOBILE_NAV_LINKS } from "@/lib/consts";
import gsap from "gsap";
import Link from "next/link";
import React, { useEffect, useRef } from "react";

interface MobileMenuContentProps {
  menuActive: boolean;
  onClose: () => void;
}

export function MobileMenuContent({
  menuActive,
  onClose,
}: MobileMenuContentProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const fadeInUp1 = useRef<(HTMLDivElement | null)[]>([]);
  const fadeInUp2 = useRef<(HTMLDivElement | null)[]>([]);
  const fadeInUp3 = useRef<(HTMLLIElement | null)[]>([]);

  const isMobile = useIsMobile();

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (menuActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuActive]);

  useEffect(() => {
    if (!menuRef.current) return;

    const isMobilePath = "circle(130vh at 100% 0px)";
    const desktopPath = "circle(140vw at 100% 0px)";
    const closedPath = "circle(0px at 100% 0px)";

    const tl = gsap.timeline({
      defaults: { ease: "power4.out", duration: 0.7 },
    });

    if (menuActive) {
      tl.to(menuRef.current, {
        clipPath: isMobile ? isMobilePath : desktopPath,
      })
        .fromTo(
          fadeInUp1.current.filter(Boolean),
          { y: 25, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, stagger: 0.05 },
          "-=0.3"
        )
        .fromTo(
          fadeInUp2.current.filter(Boolean),
          { y: 25, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, stagger: 0.04 },
          "-=0.5"
        )
        .fromTo(
          fadeInUp3.current.filter(Boolean),
          { y: 25, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, stagger: 0.05 },
          "-=0.7"
        );
    } else {
      tl.to(
        [
          ...fadeInUp3.current.filter(Boolean),
          ...fadeInUp2.current.filter(Boolean),
          ...fadeInUp1.current.filter(Boolean),
        ],
        { y: 20, autoAlpha: 0, stagger: 0.02, duration: 0.2 }
      ).to(menuRef.current, { clipPath: closedPath, duration: 0.4 }, "-=0.1");
    }

    return () => {
      tl.kill();
    };
  }, [menuActive, isMobile]);

  return (
    <div
      ref={menuRef}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      className="mobile-menu w-full h-screen inset-0 flex flex-col justify-between fixed z-[70] bg-background px-6 sm:px-10 pt-20 pb-6"
    >
      {/* ── Content Grid ── */}
      <div className="flex-1 flex items-center py-6">
        <div className="w-full max-w-lg mx-auto grid grid-cols-2 gap-8 sm:gap-14 items-start">
          {/* Column 1: Contact & Mail */}
          <div className="space-y-6">
            <div>
              <div
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2"
                ref={(el) => {
                  if (el) fadeInUp1.current[0] = el;
                }}
              >
                Mail
              </div>
              <div
                ref={(el) => {
                  if (el) fadeInUp1.current[1] = el;
                }}
              >
                <a
                  href="mailto:manifreelancer25@gmail.com"
                  onClick={onClose}
                  className="text-xs sm:text-sm font-medium text-foreground/80 hover:text-foreground hover:underline transition-colors block break-all"
                >
                  manifreelancer25@gmail.com
                </a>
              </div>
            </div>

            <div>
              <div
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2"
                ref={(el) => {
                  if (el) fadeInUp2.current[0] = el;
                }}
              >
                Connect
              </div>
              <div className="flex flex-col gap-2.5">
                {CONTACT_LINKS.slice(0, 5).map((link, index) => (
                  <div
                    key={link.name}
                    ref={(el) => {
                      if (el) fadeInUp2.current[index + 1] = el;
                    }}
                  >
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${link.name} in a new tab`}
                      className="text-xs sm:text-sm font-medium text-foreground/75 hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                    >
                      {link.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Internal Page Navigation */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Navigation
            </div>
            <ul className="flex flex-col gap-4 sm:gap-5">
              {MOBILE_NAV_LINKS.map((link, index) => (
                <li
                  key={link.label}
                  ref={(el) => {
                    if (el) fadeInUp3.current[index] = el;
                  }}
                >
                  <Link
                    href={link.to}
                    onClick={onClose}
                    className="group block"
                  >
                    <span className="text-lg sm:text-xl font-heading font-semibold text-foreground group-hover:text-primary transition-all duration-200 group-hover:translate-x-1 inline-block">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom Status Note ── */}
      <div className="w-full text-center pt-3 border-t border-border/40 text-[11px] text-muted-foreground">
        Available for fulltime work & freelance systems
      </div>
    </div>
  );
}
