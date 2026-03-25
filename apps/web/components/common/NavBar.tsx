"use client";

import { cn } from '@/lib/utils';
import Logo from '@/public/logo.png';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Image from "next/image";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Hamburger } from './Hamburger';
import { ThemeButton } from './ThemeButton';

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Projects", to: "/projects" },
  { label: "Blogs", to: "/blogs" },
  {
    label: "More", to: undefined, dropDownComponent: () => {
      return (
        <div className="bg-linear-to-b from-foreground/15 to-foreground/10 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/10 dark:border-white/5">
          <div className="flex flex-col gap-2">
            <div className="px-2 py-1.5 rounded-lg hover:bg-foreground/5 transition-colors cursor-pointer">
              <p className="text-xs font-semibold">Insights</p>
              <p className="text-[10px] text-foreground/50">Tech and lifestyle</p>
            </div>
            <div className="px-2 py-1.5 rounded-lg hover:bg-foreground/5 transition-colors cursor-pointer">
              <p className="text-xs font-semibold">Snippets</p>
              <p className="text-[10px] text-foreground/50">Reusable code blocks</p>
            </div>
          </div>
        </div>
      )
    }
  },
  { label: "Let's Talk", to: '/contact', active: true }
];

const NavBar = () => {
  const pathname = usePathname();
  const [menuActive, setMenuActive] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleMenu = () => setMenuActive(!menuActive);

  return (
    <nav className="fixed top-5 left-0 right-0 z-50 px-4 md:px-0">
      <div className="container m-auto flex items-center justify-between rounded-full">

        <div className='bg-linear-to-b from-foreground/10 to-foreground/5 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 dark:border-white/5'>
          <div className='flex items-center gap-2'>
            <Link href="/" className="logo flex items-center">
              <Image
                src={Logo}
                alt="Sai manikanta Mamidi website logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </Link>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <div className='hidden md:block bg-linear-to-b from-foreground/15 to-foreground/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 dark:border-white/5'>
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isDropdown = item.to === undefined && item.dropDownComponent;
              const isActive = item.active || (item.to && pathname === item.to);

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => isDropdown && setOpenDropdown(item.label)}
                  onMouseLeave={() => isDropdown && setOpenDropdown(null)}
                >
                  {item.to ? (
                    <Link
                      href={item.to}
                      className={cn(
                        "hover-link px-3 py-1.5 rounded-full text-xs font-medium block",
                        isActive
                          ? "bg-foreground/15 text-foreground shadow-sm"
                          : "text-foreground/70 hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      className={cn(
                        "hover-link px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-all duration-300 ease-in-out border-none outline-none",
                        openDropdown === item.label ? "bg-foreground/10 text-foreground" : "text-foreground/70 hover:text-foreground"
                      )}
                    >
                      {item.label}
                      <motion.div
                        animate={{ rotate: openDropdown === item.label ? 180 : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </motion.div>
                    </button>
                  )}

                  {isDropdown && (
                    <AnimatePresence>
                      {openDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 15, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50 w-max"
                        >
                          <div className="pt-2"> {/* Offset to maintain hover connection */}
                            {item.dropDownComponent && item.dropDownComponent()}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className='bg-linear-to-b from-foreground/10 to-foreground/5 backdrop-blur-md px-5 py-1.5 rounded-full border border-white/10 dark:border-white/5'>
          <div className="flex items-center gap-5 glass-effect rounded-full relative">
            <div className='hover-link'>
              <ThemeButton />
            </div>

            <div className='hover-link'>
              <Hamburger isActive={menuActive} toggle={toggleMenu} />
            </div>
          </div>
        </div>
      </div>

    </nav>
  );
};

export default NavBar;

