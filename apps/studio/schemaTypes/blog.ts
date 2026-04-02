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
      description: "URL-friendly identifier generated from the title. Click 'Generate' to create it.",
    }),
    defineField({
      name: "readTime",
      title: "Read Time",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "e.g., '5 min read'",
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      validation: (Rule) => Rule.required(),
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "blogCategory" }] }],
    }),
    defineField({
      name: "overview",
      title: "Overview",
      type: "text",
      rows: 3,
      description: "Short summary of the blog post.",
    }),
    defineField({
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [{ type: "string" }],
      description: "Tags or keywords for SEO and filtering.",
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
      description: "Array of sections instead of a plain description.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "author",
      media: "mainImage",
    },
  },
});
