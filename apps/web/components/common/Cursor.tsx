
"use client"
import { useIsMobile } from "@/hooks/use-mobile";
import { getCursorBackgroundColor, getCursorColor } from "@/lib/utils";
import gsap from "gsap";
import { useCallback, useEffect, useRef } from "react";


function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const isMobile = useIsMobile()

  const updateCursorStyles = useCallback(({ width, height, mixBlendMode, backgroundColor = getCursorColor(), duration = 0.25 }: { width: string, height: string, mixBlendMode: string, backgroundColor?: string, duration?: number }) => {
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        width,
        height,
        duration,
        ease: "power2.out",
      });
      cursorRef.current.style.mixBlendMode = mixBlendMode;
      cursorRef.current.style.backgroundColor = backgroundColor;
    }
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const x = event.pageX;
    const y = event.pageY;

    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        left: x,
        top: y,
        duration: 0.25,
        ease: "circle.in",
      });
    }
  }, []);

  const handleLinkCursorEnter = useCallback(() => {
    const cursorColor = getCursorBackgroundColor()
    updateCursorStyles({ width: "60px", height: "60px", mixBlendMode: "normal", backgroundColor: cursorColor });
  }, [updateCursorStyles]);

  const handleLinkCursorLeave = useCallback(() => {
    updateCursorStyles({ width: "12px", height: "12px", mixBlendMode: "normal" });
  }, [updateCursorStyles]);

  useEffect(() => {
    if (isMobile) return

    document.addEventListener("mousemove", handleMouseMove);

    const hoverLinks = document.querySelectorAll(".hover-link");
    hoverLinks.forEach((el) => {
      el.addEventListener("mouseenter", handleLinkCursorEnter);
      el.addEventListener("mouseleave", handleLinkCursorLeave);
    });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      hoverLinks.forEach((el) => {
        el.removeEventListener("mouseenter", handleLinkCursorEnter);
        el.removeEventListener("mouseleave", handleLinkCursorLeave);
      });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile])

  return (
    <div
      className="rounded-full absolute z-50 flex items-center justify-center w-3 h-3 pointer-events-none "
      style={{
        background: getCursorColor(),
        transform: "translate(-50%, -50%)",
      }}
      ref={cursorRef}>
      <span className="text-xxs text-center" ref={textRef}></span>
    </div>
  )
}


export default Cursor