import { defineField, defineType } from "sanity";

export default defineType({
  name: "education",
  title: "Education",
  type: "document",
  fields: [
    defineField({
      name: "university",
      title: "University / Institution",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "course",
      title: "Course / Degree",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "stream",
      title: "Stream / Major",
      type: "string",
    }),
    defineField({
      name: "percentage",
      title: "Percentage / CGPA",
      type: "string",
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
      description: "Leave blank if currently pursuing.",
    }),
    defineField({
      name: "iconImage",
      title: "Icon Image",
      type: "image",
      validation: (Rule) => Rule.required(),
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Underline", value: "underline" },
            ],
          },
        },
      ],
      description: "Additional details about the education.",
    }),
  ],
  preview: {
    select: {
      title: "university",
      subtitle: "course",
      media: "iconImage",
    },
  },
});
