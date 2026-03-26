import { defineField, defineType } from "sanity";

export default defineType({
  name: "technology",
  title: "Technology / Tool",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "The name of the tool, language, or framework.",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      validation: (Rule) => Rule.required(),
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "A small description of this technology.",
    }),
    defineField({
      name: "isBlack",
      title: "Is Black / Needs Invert?",
      type: "boolean",
      initialValue: false,
      description: "If true, this logo will be inverted in dark mode (useful for solid black logos).",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Languages", value: "Languages" },
          { title: "Frameworks & Libraries", value: "Frameworks & Libraries" },
          { title: "Databases & Tools", value: "Databases & Tools" },
          { title: "Other", value: "Other" },
        ],
      },
      description: "The category of this technology.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
    },
  },
});
