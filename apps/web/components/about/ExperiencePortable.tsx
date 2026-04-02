import { PortableTextComponents } from "next-sanity";

const ExperiencePortable: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-3 text-sm text-foreground leading-relaxed">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-primary py-2 pl-4 text-lg text-muted-foreground italic bg-muted/20 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="text-sm mb-1 ml-6 list-outside list-disc space-y-1 text-foreground">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="text-sm mb-1 ml-6 list-outside list-decimal space-y-1 text-foreground">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-xs md:text-sm leading-relaxed">
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="text-xs md:text-sm leading-relaxed">
        {children}
      </li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
        href={value?.href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {children}
      </a>
    ),
  },
};

export default ExperiencePortable