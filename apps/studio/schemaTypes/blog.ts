import { defineField, defineType } from "sanity";

export default defineType({
  name: "blog",
  title: "Blog",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Headline of the blog article.",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      validation: (Rule) => Rule.required(),
      options: {
        source: "title",
        maxLength: 96,
      },
      description: "URL-friendly identifier. Click 'Generate' to create it.",
    }),
    defineField({
      name: "readTime",
      title: "Read Time",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "e.g., '5 min read'",
      initialValue: "5 min read",
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      validation: (Rule) => Rule.required(),
      initialValue: "Sai Manikanta",
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "isFeatured",
      title: "Featured Article",
      type: "boolean",
      description: "Highlight this article at the top of the blogs page.",
      initialValue: false,
    }),
    defineField({
      name: "category",
      title: "Primary Category",
      type: "reference",
      to: [{ type: "blogCategory" }],
      description: "Primary category for filtering (e.g. Development, AI & Automation, Architecture).",
    }),
    defineField({
      name: "categories",
      title: "Additional Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "blogCategory" }] }],
      description: "Secondary or cross-topic categories.",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      description: "Topic tags for automated recommendations and matching (e.g. 'turborepo', 'nextjs', 'llm', 'clean-code').",
    }),
    defineField({
      name: "series",
      title: "Series / Sequential Topic Information",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Series Name",
          type: "string",
          description: "e.g., 'Modern Monorepo Architecture' or 'AI-Powered Fullstack Development'",
        },
        {
          name: "part",
          title: "Part Number",
          type: "number",
          description: "e.g., 1 for Part 1, 2 for Part 2, etc.",
        },
      ],
      description: "Use this if this blog belongs to a multi-part series or structured teaching journey.",
    }),
    defineField({
      name: "previousPost",
      title: "Previous Blog in Series / Topic",
      type: "reference",
      to: [{ type: "blog" }],
      description: "Link to the previous article (e.g. foundational folder structure before Turborepo).",
    }),
    defineField({
      name: "nextPost",
      title: "Next / Follow-up Blog in Series",
      type: "reference",
      to: [{ type: "blog" }],
      description: "Link to the follow-up article (e.g. moving from Turborepo to Nx).",
    }),
    defineField({
      name: "relatedPosts",
      title: "Related / Recommended Posts",
      type: "array",
      of: [{ type: "reference", to: [{ type: "blog" }] }],
      description: "Manually chosen connected reading on this topic.",
    }),
    defineField({
      name: "mainImage",
      title: "Main Cover Image",
      type: "image",
      validation: (Rule) => Rule.required(),
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "Important for accessibility and SEO.",
        },
      ],
    }),
    defineField({
      name: "overview",
      title: "Overview",
      type: "text",
      rows: 3,
      description: "Short, compelling summary of the blog post.",
    }),
    defineField({
      name: "keywords",
      title: "SEO Keywords",
      type: "array",
      of: [{ type: "string" }],
      description: "Keywords for SEO meta tags.",
    }),
    defineField({
      name: "sections",
      title: "Blog Sections",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              title: "Section Title",
              type: "string",
            },
            {
              name: "description",
              title: "Section Body",
              type: "array",
              of: [
                {
                  type: "block",
                  styles: [
                    { title: "Normal", value: "normal" },
                    { title: "H1", value: "h1" },
                    { title: "H2", value: "h2" },
                    { title: "H3", value: "h3" },
                    { title: "H4", value: "h4" },
                    { title: "Quote", value: "blockquote" },
                  ],
                  lists: [
                    { title: "Bullet", value: "bullet" },
                    { title: "Numbered", value: "number" },
                  ],
                  marks: {
                    decorators: [
                      { title: "Strong", value: "strong" },
                      { title: "Emphasis", value: "em" },
                      { title: "Underline", value: "underline" },
                      { title: "Strike", value: "strike-through" },
                      { title: "Code", value: "code" },
                    ],
                    annotations: [
                      {
                        name: "link",
                        type: "object",
                        title: "Link",
                        fields: [
                          {
                            name: "href",
                            type: "url",
                            title: "URL",
                          },
                        ],
                      },
                    ],
                  },
                },
                {
                  type: "image",
                  options: { hotspot: true },
                  fields: [
                    {
                      name: "alt",
                      type: "string",
                      title: "Alternative text",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      description: "Array of sections for rich structured reading.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "author",
      media: "mainImage",
      seriesPart: "series.part",
      seriesTitle: "series.title",
    },
    prepare({ title, subtitle, media, seriesPart, seriesTitle }) {
      const prefix = seriesPart ? `[Part ${seriesPart}] ` : "";
      return {
        title: `${prefix}${title || "Untitled"}`,
        subtitle: seriesTitle ? `${seriesTitle} · ${subtitle}` : subtitle,
        media,
      };
    },
  },
});
