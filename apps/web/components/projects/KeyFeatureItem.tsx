"use client";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PortableText, PortableTextComponents, PortableTextProps } from "@portabletext/react";

interface KeyFeatureItemProps {
  question: string;
  answer: PortableTextProps["value"];
  value: string;
}

export const FaqPortableTextComponents: PortableTextComponents = {

  block: {
    normal: ({ children }) => (
      <p className="mb-3 leading-relaxed">
        {children}
      </p>
    ),

    paragraph: ({ children }) => (
      <p className="mb-3 leading-relaxed">
        {children}
      </p>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="ml-4 mb-4 list-disc space-y-1">
        {children}
      </ul>
    ),

    number: ({ children }) => (
      <ol className="ml-4 mb-4 list-decimal">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <li className="leading-snug">
        {children}
      </li>
    ),

    number: ({ children }) => (
      <li className="leading-snug">
        {children}
      </li>
    ),
  },

  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">
        {children}
      </strong>
    ),

    em: ({ children }) => (
      <em className="italic text-foreground/90">
        {children}
      </em>
    ),

    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-2 hover:text-primary/80"
      >
        {children}
      </a>
    ),
  },
};

export default function KeyFeatureItem({ question, answer, value }: KeyFeatureItemProps) {
  return (
    <AccordionItem
      value={value}
      className="bg-card border border-border rounded-xl px-6 mb-4 shadow-sm overflow-hidden data-[state=open]:border-primary/50 transition-all duration-300"
    >
      <AccordionTrigger className="hover:no-underline py-3 outline-none ring-0 border-0">
        <h5 className="font-semibold">
          {question}
        </h5>
      </AccordionTrigger>
      <AccordionContent>
        <div className="text-muted-foreground leading-relaxed text-[15px]">
          <PortableText components={FaqPortableTextComponents} value={answer} />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
