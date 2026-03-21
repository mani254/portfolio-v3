"use client"

import { SOCIAL_LINKS } from "@/lib/consts";
import { motion } from "framer-motion";

export const SocialLinks = () => {
  return (
    <div className="flex items-center justify-center gap-5">
      {SOCIAL_LINKS.map((link) => (
        <motion.a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.96 }}
          className={`p-2 rounded-2xl bg-muted/10 backdrop-blur-sm border border-border/30 text-muted-foreground transition-all duration-300 ${link.color} hover:bg-muted/20 hover:border-border/60 group`}
          title={link.name}
        >
          <link.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
        </motion.a>
      ))}
    </div>
  );
};
