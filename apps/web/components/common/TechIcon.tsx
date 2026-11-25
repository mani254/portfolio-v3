import React from "react";
import Image from "next/image";

interface TechIconProps {
  name: string;
  image?: string;
  className?: string;
}

export function TechIcon({ name, image, className = "w-4 h-4" }: TechIconProps) {
  // If a valid custom image URL is provided from Sanity, use Next.js Image
  if (image && image.startsWith("http")) {
    return (
      <div className={`relative shrink-0 ${className}`}>
        <Image
          unoptimized
          src={image}
          alt={`${name} technology icon`}
          fill
          className="object-contain"
        />
      </div>
    );
  }

  const normalized = name.toLowerCase().replace(/[\s\-_.]/g, "");

  // Crisp, pixel-perfect vector SVGs for all technologies in the design
  switch (normalized) {
    case "javascript":
    case "js":
      return (
        <svg viewBox="0 0 256 256" className={className} fill="none">
          <rect width="256" height="256" rx="36" fill="#F7DF1E" />
          <text
            x="50%"
            y="68%"
            textAnchor="middle"
            fill="#000"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="bold"
            fontSize="140"
          >
            JS
          </text>
        </svg>
      );

    case "html":
    case "html5":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M4 2l1.6 18 6.4 2 6.4-2L20 2H4z" fill="#E34F26" />
          <path d="M12 3.8v16.4l4.8-1.5L18.2 3.8H12z" fill="#EF652A" />
          <path d="M12 7.5H8.3l.3 3.3h3.4v-3.3zm0 5.4H9l.2 2.7 2.8.8v-3.5zm0-8.9" fill="#FFF" />
          <path d="M12 7.5h3.7l-.3 3.3H12v-3.3zm0 5.4h3l-.3 3.5-2.7.8v-4.3z" fill="#EBEBEB" />
        </svg>
      );

    case "css":
    case "css3":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M4 2l1.6 18 6.4 2 6.4-2L20 2H4z" fill="#1572B6" />
          <path d="M12 3.8v16.4l4.8-1.5L18.2 3.8H12z" fill="#33A9DC" />
          <path d="M12 7.5H8.3l.3 3.3h3.4v-3.3zm0 5.4H9l.2 2.7 2.8.8v-3.5zm0-8.9" fill="#FFF" />
          <path d="M12 7.5h3.7l-.3 3.3H12v-3.3zm0 5.4h3l-.3 3.5-2.7.8v-4.3z" fill="#EBEBEB" />
        </svg>
      );

    case "socketio":
    case "socket":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <circle cx="12" cy="12" r="11" fill="#010101" />
          <path
            d="M13.5 4.5L7 13.5h5l-1.5 6 7-9.5h-5l1-5.5z"
            fill="#00D2FF"
          />
        </svg>
      );

    case "convex":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <rect width="24" height="24" rx="6" fill="#F43F5E" />
          <path
            d="M12 5l6 10H6l6-10z"
            fill="#FFF"
          />
        </svg>
      );

    case "restapi":
    case "restapis":
    case "api":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );

    case "react":
    case "reactjs":
      return (
        <svg viewBox="-11.5 -10.23174 23 20.46348" className={className}>
          <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
          <g stroke="#61DAFB" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      );

    case "nextjs":
    case "next":
      return (
        <svg viewBox="0 0 180 180" className={className} fill="none">
          <circle cx="90" cy="90" r="90" fill="#000" />
          <path
            d="M149.508 157.438L69.147 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.137 149.508 157.438Z"
            fill="white"
          />
          <rect x="115" y="54" width="12" height="72" fill="white" />
        </svg>
      );

    case "typescript":
    case "ts":
      return (
        <svg viewBox="0 0 256 256" className={className} fill="none">
          <rect width="256" height="256" rx="36" fill="#3178C6" />
          <text
            x="50%"
            y="68%"
            textAnchor="middle"
            fill="white"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="bold"
            fontSize="140"
          >
            TS
          </text>
        </svg>
      );

    case "tailwind":
    case "tailwindcss":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path
            d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z"
            fill="#06B6D4"
          />
        </svg>
      );

    case "framermotion":
    case "framer":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
        </svg>
      );

    case "nodejs":
    case "node":
      return (
        <svg viewBox="0 0 256 289" className={className}>
          <path
            fill="#539E43"
            d="M128 0L0 74v141l128 74 128-74V74L128 0zm0 25.5l105.8 61v115.8L128 263.4 22.2 202.3V86.5L128 25.5z"
          />
          <path fill="#539E43" d="M128 50l78 45v90l-78 45-78-45V95l78-45z" />
        </svg>
      );

    case "nestjs":
    case "nest":
      return (
        <svg viewBox="0 0 256 256" className={className} fill="none">
          <path
            d="M216.5 120.4c-6.8-21.7-27.1-39-44.8-49.8-7-4.3-14.7-8.3-22.7-11.4 3.7 9.8 4.7 20.3 3.1 30.6-2.3 14.5-9.6 27.6-20.6 37.1 11.2-13.8 17.5-31.3 17.9-49.3-9 2-17.8 5.6-25.7 10.6-13.7 8.7-23.7 22.3-27.9 37.8-2.6 9.6-2.5 19.8.2 29.3-7.5-6.6-12.8-15.3-15-25-2.8-12.1-.8-24.8 5.4-35.8-9.4 6.7-16.7 16-21.2 26.7-5.9 14.1-6.9 29.8-3 44.5 5.5 20.8 19.6 38.3 38.8 48 20.7 10.5 45.4 12.3 67.5 5 21.6-7.1 39.9-22.3 50.4-42.3 6.1-11.7 8.9-24.8 8.6-38-.2-6.1-.9-12.1-2-18.1z"
            fill="#E0234E"
          />
        </svg>
      );

    case "python":
      return (
        <svg viewBox="0 0 256 255" className={className}>
          <path
            fill="#3776AB"
            d="M126.9 0C60.7 0 64.8 28.7 64.8 28.7l.1 29.7h63.2v9H39.4S0 62.8 0 129.2s34.4 63.8 34.4 63.8h20.5v-28.7s-1.1-34.4 33.8-34.4h58.3s32.7.5 32.7-31.7V34.4S185.3 0 126.9 0zM92.8 19.9a10.8 10.8 0 1 1 0 21.6 10.8 10.8 0 0 1 0-21.6z"
          />
          <path
            fill="#FFD43B"
            d="M129.1 254.9c66.2 0 62.1-28.7 62.1-28.7l-.1-29.7H128v-9h88.6s39.4 4.6 39.4-61.8-34.4-63.8-34.4-63.8h-20.5v28.7s1.1 34.4-33.8 34.4H109s-32.7-.5-32.7 31.7v63.8s-5.6 34.4 52.8 34.4zm34.1-19.9a10.8 10.8 0 1 1 0-21.6 10.8 10.8 0 0 1 0 21.6z"
          />
        </svg>
      );

    case "express":
    case "expressjs":
      return (
        <div className={`flex items-center justify-center font-bold text-[11px] tracking-tighter text-[#111827] ${className}`}>
          ex
        </div>
      );

    case "fastify":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <circle cx="12" cy="12" r="11" fill="#000" />
          <path d="M14 6L8 14h5l-1 5 6-8h-5l1-5z" fill="#FFF" />
        </svg>
      );

    case "openai":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 10.59.74a6.056 6.056 0 0 0-5.753 4.178 5.984 5.984 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .747 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 8.64a4.485 4.485 0 0 1 2.366-1.973V12.28a.766.766 0 0 0 .388.677l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 8.64zm16.597 3.855l-5.833-3.387L15.119 7.94a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.663zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.974V7.643a.08.08 0 0 1 .028-.061l4.838-2.791a4.5 4.5 0 0 1 6.675 4.67zM8.306 15.465l-2.02-1.163a.08.08 0 0 1-.038-.057V8.661a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681v6.738zm1.096-2.565l2.6-1.5 2.6 1.5v3l-2.6 1.5-2.6-1.5z" />
        </svg>
      );

    case "gemini":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path
            d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z"
            fill="url(#gemini-grad)"
          />
          <defs>
            <linearGradient
              id="gemini-grad"
              x1="0"
              y1="0"
              x2="24"
              y2="24"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#1BA1E3" />
              <stop offset="0.5" stopColor="#5B65F6" />
              <stop offset="1" stopColor="#D96570" />
            </linearGradient>
          </defs>
        </svg>
      );

    case "groq":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <circle cx="12" cy="12" r="11" fill="#F03D2E" />
          <path
            d="M15.5 12h-4v2.2h2.5c-.3 1.1-1.2 1.8-2.5 1.8a2.5 2.5 0 0 1-2.5-2.5c0-1.4 1.1-2.5 2.5-2.5 1 0 1.7.5 2.1 1.2l1.6-1A4.5 4.5 0 0 0 11.5 7.5 4.5 4.5 0 0 0 7 12c0 2.5 2 4.5 4.5 4.5 2.3 0 4.2-1.7 4.5-4v-.5h-.5z"
            fill="white"
          />
        </svg>
      );

    case "perplexity":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="none"
          stroke="#20B8CD"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
        </svg>
      );

    case "documentai":
    case "docai":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
            fill="#4285F4"
          />
          <path d="M14 2v6h6z" fill="#A1C2FA" />
          <path
            d="M8 13h8M8 17h5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case "docker":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#1D63ED">
          <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185zm0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186zm-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186zm-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186zm5.893 2.715h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185zm-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185zm-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186h-2.119a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185zm-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185zM23.79 9.89a.478.478 0 00-.41-.274h-2.518a4.957 4.957 0 00-3.32-3.212l-.372-.11-.237.303a7.483 7.483 0 01-4.708 2.584H1.365a.478.478 0 00-.478.478v.822c0 3.738 1.94 7.03 5.093 8.653 2.123 1.092 4.636 1.488 7.027 1.114 4.092-.64 7.55-3.385 9.076-7.203.88-.137 1.545-.884 1.707-1.78l.056-.307-.056-.278z" />
        </svg>
      );

    case "aws":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <text
            x="50%"
            y="55%"
            textAnchor="middle"
            fill="#111827"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="bold"
            fontSize="10"
          >
            aws
          </text>
          <path
            d="M5 16c4.5 3 9.5 3 14 0"
            stroke="#FF9900"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );

    case "linux":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path
            d="M12 2C8.5 2 7 5 7 8v4c0 3.5 2 6 5 6s5-2.5 5-6V8c0-3-1.5-6-5-6z"
            fill="#111827"
          />
          <ellipse cx="12" cy="12" rx="3.5" ry="5" fill="#FFF" />
          <circle cx="10.5" cy="7.5" r="1" fill="#111827" />
          <circle cx="13.5" cy="7.5" r="1" fill="#111827" />
          <path d="M10.5 9.5c.5.5 2.5.5 3 0l-1.5 2-1.5-2z" fill="#FFA500" />
          <path
            d="M6 18c2 2 5 2 6 1s4 1 6-1c-1 2-3 3-6 3s-5-1-6-3z"
            fill="#FFA500"
          />
        </svg>
      );

    case "traefik":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#24A1C1">
          <path d="M3 6h18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm2 5h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1zm3 5h8a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z" />
        </svg>
      );

    case "git":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#F05032">
          <path d="M23.6 11.2L12.8.4a1.7 1.7 0 00-2.4 0L8 2.8l3 3a2 2 0 012.5 2.5l2.9 2.9a2 2 0 012.1 3.4 2 2 0 01-3.4-2.1L12.2 9.6v5.2a2 2 0 01.6 1.4 2 2 0 01-4 0 2 2 0 011-1.7V9.2a2 2 0 01-1-1.7L6.8 6.5.4 12.8a1.7 1.7 0 000 2.4l10.8 10.8a1.7 1.7 0 002.4 0l10-10a1.7 1.7 0 000-2.4z" />
        </svg>
      );

    case "mongodb":
    case "mongo":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path
            d="M12 1.5s-6 5.8-6 11.5c0 5 3.5 8.5 6 9.5 2.5-1 6-4.5 6-9.5 0-5.7-6-11.5-6-11.5z"
            fill="#47A248"
          />
          <path
            d="M12 1.5v21c.2 0 6-4.5 6-10 0-5.7-6-11-6-11z"
            fill="#499D4A"
          />
        </svg>
      );

    case "postgresql":
    case "postgres":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="#336791">
          <path d="M12 2C6.5 2 2 6.5 2 12c0 4.2 2.6 7.8 6.3 9.3.2-.8.5-2 .5-2.8 0-.5-.2-1.3-.3-1.8-.7-.2-1.8-.5-2.4-1.2-.5-.6-.5-1.5-.4-2.3.2-1.2 1-2.1 2.2-2.3.8-.1 1.6.2 2.2.8.4-.5 1-1 1.7-1.3 1.1-.5 2.4-.6 3.6-.3 1.6.4 2.8 1.5 3.5 3 .6 1.3.7 2.8.2 4.2-.4 1.1-1.2 2-2.3 2.5-.6.3-1.3.4-2 .4v2.5c4.7-.6 8.3-4.6 8.3-9.5 0-5.5-4.5-10-10-10z" />
        </svg>
      );

    case "redis":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path
            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            stroke="#DC382D"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "sanity":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <rect width="24" height="24" rx="5" fill="#F03E2F" />
          <path
            d="M7 16.5c0-1.8 1.4-2.7 3.3-3.2l2.2-.6c1.1-.3 1.6-.7 1.6-1.3 0-.8-.7-1.4-1.8-1.4-1.2 0-2 .6-2 1.6H8c0-2.2 1.7-3.4 4.3-3.4 2.4 0 4.1 1.3 4.1 3.2 0 1.9-1.4 2.8-3.3 3.3l-2.2.6c-1.1.3-1.6.7-1.6 1.3 0 .9.8 1.4 2 1.4 1.3 0 2.2-.6 2.3-1.7h2.3c-.1 2.3-1.9 3.5-4.6 3.5-2.7 0-4.3-1.4-4.3-3.3z"
            fill="white"
          />
        </svg>
      );

    case "razorpay":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path
            d="M17.4 2H6.6L2 13.5h7.2L6 22l12-10.5h-6.8L17.4 2z"
            fill="#0C2340"
          />
          <path
            d="M17.4 2L9.2 11.5H16L6 22l4-8.5H3.6L7.4 2h10z"
            fill="#3395FF"
          />
        </svg>
      );

    default:
      return (
        <div className={`rounded-full bg-foreground/10 flex items-center justify-center font-bold text-[10px] text-foreground ${className}`}>
          {name.charAt(0)}
        </div>
      );
  }
}
