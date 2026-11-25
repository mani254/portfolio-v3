"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  label: string;
  href: string;
}

export default function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col items-center justify-center gap-7 w-full my-auto text-center">
      {items.map(({ label, href }) => {
        const isActive =
          href === "/"
            ? pathname === "/"
            : pathname === href || pathname.startsWith(href + "/");

        return (
          <Link
            key={label}
            href={href}
            className={cn(
              "hover-link text-[12px] tracking-[0.22em] uppercase transition-colors duration-200",
              isActive
                ? "text-[#16a34a] font-bold"
                : "text-[#4b5563] font-semibold hover:text-[#111827]"
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
