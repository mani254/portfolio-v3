import { useIsMobile } from '@/hooks/use-mobile';
import { CONTACT_LINKS, MOBILE_NAV_LINKS } from '@/lib/consts';
import gsap from 'gsap';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

export function MobileMenuContent({ menuActive }: { menuActive: boolean }) {

  const menuRef = useRef<HTMLDivElement>(null);
  const fadeInUp1 = useRef<(HTMLDivElement | null)[]>([]);
  const fadeInUp2 = useRef<(HTMLDivElement | null)[]>([]);
  const fadeInUp3 = useRef<(HTMLLIElement | null)[]>([]);

  const isMobile = useIsMobile()

  useEffect(() => {
    if (!menuRef.current) return;

    const isMobilePath = "circle(130vh at 100% 0px)";
    const desktopPath = "circle(140vw at 100% 0px)";
    const closedPath = "circle(0px at 100% 0px)";

    // Initialize the timeline
    const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 0.8 } });

    if (menuActive) {
      tl.to(menuRef.current, { clipPath: isMobile ? isMobilePath : desktopPath })
        .fromTo(fadeInUp1.current, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.05 }, "-=0.3")
        .fromTo(fadeInUp2.current, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.05 }, "-=0.6")
        .fromTo(fadeInUp3.current, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.05 }, "-=0.9");
    } else {
      tl.to([...fadeInUp3.current], { y: 30, autoAlpha: 0, stagger: 0.02 })
        .to([...fadeInUp2.current], { y: 30, autoAlpha: 0, stagger: 0.02 }, "<")
        .to([...fadeInUp1.current], { y: 30, autoAlpha: 0, stagger: 0.02 }, "<")
        .to(menuRef.current, { clipPath: closedPath }, "-=0.4");
    }

    return () => {
      tl.kill();
    };
  }, [menuActive, isMobile]);

  return (
    <div ref={menuRef} className={`mobile-menu w-full h-screen inset-0 flex items-center justify-center big-menu fixed z-10 bg-background`}>
      <div className="flex gap-12 sm:gap-28">
        <div className="flex flex-col justify-between">
          <div className="text-md font-semibold text-foreground mb-2" ref={(el) => { if (el) fadeInUp1.current[0] = el }}>
            Mail
          </div>
          <div ref={(el) => { if (el) fadeInUp1.current[1] = el }}>
            <p className="hover-link text-sm font-medium pb-5 cursor-pointer inline-block text-foreground/70 transition-colors hover:text-foreground hover:scale-[1.07]">
              <a href="mailto:manifreelancer25@gmail.com">Send a Mail</a>
            </p>
          </div>

          <div className="text-md font-semibold text-foreground mt-4 mb-2" ref={(el) => { if (el) fadeInUp2.current[0] = el }}>
            Contact
          </div>
          <div className="flex flex-col gap-3 mt-1 hover-link" >
            {CONTACT_LINKS.map((link, index) => (
              <div key={link.name} ref={(el) => { if (el) fadeInUp2.current[index + 1] = el }}>
                <a href={link.href} target="_blank" className="hover:scale-[1.07] text-sm font-medium text-foreground/70 transition-all hover:text-foreground inline-block w-fit">
                  {link.name}
                </a>
              </div>
            ))}
          </div>
        </div>

        <ul className="flex flex-col justify-between">
          {MOBILE_NAV_LINKS.map((link, index) => (
            <li key={link.label} ref={(el) => { if (el) fadeInUp3.current[index] = el }}>
              <Link href={link.to} className="group block">
                <h2 className="hover-link text-xl md:text-2xl text-foreground transition-all hover:scale-[1.07]">
                  {link.label}
                </h2>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
