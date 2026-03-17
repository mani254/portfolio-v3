import { slugify } from "@/lib/utils";
import { PortableTextComponents } from "next-sanity";
import Image from "next/image";
import { urlFor } from "sanity-lib/src/image";


function extractTextFromChildren(children: React.ReactNode): string {
  if (typeof children === "string") {
    return children;
  }
  if (typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join("");
  }
  if (
    children &&
    typeof children === "object" &&
    "props" in children &&
    children.props &&
    typeof children.props === "object" &&
    "children" in children.props
  ) {
    return extractTextFromChildren(children.props.children as React.ReactNode);
  }
  return "";
}

interface TableCell {
  content?: string;
  isHeader?: boolean;
}

interface TableRow {
  cells?: TableCell[];
}

interface TableValue {
  rows?: TableRow[];
}

const CommonPortableTextComponent: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-4 text-sm text-foreground leading-relaxed">
        {children}
      </p>
    ),
    h1: ({ children }) => {
      const text = extractTextFromChildren(children);
      const id = slugify(text);
      return (
        <h1
          className="mt-10 mb-6 scroll-mt-24 font-bold text-3xl text-foreground md:text-4xl"
          id={id}
        >
          {children}
        </h1>
      );
    },
    h2: ({ children }) => {
      const text = extractTextFromChildren(children);
      const id = slugify(text);
      return (
        <h2
          className="mt-8 mb-5 scroll-mt-24 font-semibold text-2xl text-foreground md:text-3xl"
          id={id}
        >
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const text = extractTextFromChildren(children);
      const id = slugify(text);
      return (
        <h3
          className="mt-8 mb-4 scroll-mt-24 font-semibold text-foreground text-xl md:text-2xl"
          id={id}
        >
          {children}
        </h3>
      );
    },
    h4: ({ children }) => {
      const text = extractTextFromChildren(children);
      const id = slugify(text);
      return (
        <h4
          className="mt-6 mb-3 scroll-mt-24 font-semibold text-lg text-foreground md:text-xl"
          id={id}
        >
          {children}
        </h4>
      );
    },
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-primary py-2 pl-4 text-lg text-muted-foreground italic bg-muted/20 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 ml-6 list-outside list-disc space-y-2 text-foreground">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 ml-6 list-outside list-decimal space-y-2 text-foreground">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-sm leading-relaxed">
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="text-sm leading-relaxed">
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
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null;
      }

      const imageUrl = urlFor(value)
        .width(1200)
        .format("webp")
        .quality(85)
        .url();

      return (
        <div className="my-8 overflow-hidden rounded-xl border border-border">
          <Image
            alt={value.alt || "Image"}
            className="h-auto w-full object-cover"
            height={600}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            src={imageUrl}
            width={1200}
          />
          {value.alt && (
            <p className="mt-3 text-center text-sm text-muted-foreground italic mb-2">
              {value.alt}
            </p>
          )}
        </div>
      );
    },
    table: ({ value }: { value: TableValue }) => {
      if (
        !(value?.rows && Array.isArray(value.rows)) ||
        value.rows.length === 0
      ) {
        return null;
      }

      return (
        <div className="my-8 overflow-x-auto">
          <table className="w-full border-collapse overflow-hidden rounded-lg border border-border text-foreground">
            <tbody>
              {value.rows.map((row: TableRow, rowIndex: number) => {
                if (!(row?.cells && Array.isArray(row.cells))) {
                  return null;
                }

                return (
                  <tr
                    className={
                      rowIndex === 0
                        ? "bg-muted"
                        : "bg-background even:bg-muted/40 transition-colors hover:bg-muted/60"
                    }
                    key={rowIndex}
                  >
                    {row.cells.map((cell: TableCell, cellIndex: number) => {
                      const CellTag = cell?.isHeader ? "th" : "td";
                      return (
                        <CellTag
                          className={`border border-border px-4 py-3 text-left ${cell?.isHeader
                            ? "bg-muted font-semibold text-foreground"
                            : "text-muted-foreground"
                            } text-sm md:text-sm`}
                          key={cellIndex}
                        >
                          {cell?.content || ""}
                        </CellTag>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    },
  },
};

export default CommonPortableTextComponent;