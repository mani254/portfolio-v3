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
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
    },
  },
});
