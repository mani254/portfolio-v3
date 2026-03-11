import { defineField, defineType } from "sanity";

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "The name of the project.",
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
      name: "liveUrl",
      title: "Project Live URL",
      type: "url",
      description: "Optional URL linking to the deployed project.",
    }),
    defineField({
      name: "githubUrl",
      title: "GitHub Repository Link",
      type: "url",
      description: "Optional URL linking to the source code repository.",
    }),
    defineField({
      name: "overview",
      title: "Overview",
      type: "text",
      rows: 3,
      description: "Short summary of the project.",
    }),
    defineField({
      name: "toolsAndLanguages",
      title: "Tools and Languages",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "technology" }],
        },
      ],
      description: "A list of referenced technologies used.",
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "date",
      options: {
        dateFormat: "YYYY-MM-DD",
      },
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "date",
      options: {
        dateFormat: "YYYY-MM-DD",
      },
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      validation: (Rule) => Rule.required(),
      options: {
        hotspot: true,
      },
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
      name: "additionalImage1",
      title: "Additional Image 1",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
    defineField({
      name: "additionalImage2",
      title: "Additional Image 2",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" }
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" }
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Underline", value: "underline" }
            ],
            annotations: [], // no linking or custom annotations needed
          },
        },
      ],
      description: "Rich text editor with limited formatting (paragraphs, bold, italic, underline, lists).",
    }),
    defineField({
      name: "roleDescription",
      title: "Role Description",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" }
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" }
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Underline", value: "underline" }
            ],
            annotations: [],
          },
        },
      ],
      description: "Developer role and responsibilities in the project.",
    }),
    defineField({
      name: "keyFeatures",
      title: "Key Features (FAQ Style)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "question",
              title: "Feature / Question",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "answer",
              title: "Answer / Details",
              type: "array",
              of: [
                {
                  type: "block",
                  styles: [{ title: "Normal", value: "normal" }],
                  lists: [
                    { title: "Bullet", value: "bullet" },
                    { title: "Numbered", value: "number" }
                  ],
                  marks: {
                    decorators: [
                      { title: "Strong", value: "strong" },
                      { title: "Emphasis", value: "em" },
                      { title: "Underline", value: "underline" }
                    ],
                    annotations: [],
                  },
                },
              ],
            },
          ],
        },
      ],
      description: "Array of features represented as Question & Answer.",
    }),
    defineField({
      name: "challengesAndLearnings",
      title: "Challenges & Learnings",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "question",
              title: "Challenge",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "answer",
              title: "Learning / Details",
              type: "array",
              of: [
                {
                  type: "block",
                  styles: [{ title: "Normal", value: "normal" }],
                  lists: [
                    { title: "Bullet", value: "bullet" },
                    { title: "Numbered", value: "number" }
                  ],
                  marks: {
                    decorators: [
                      { title: "Strong", value: "strong" },
                      { title: "Emphasis", value: "em" },
                      { title: "Underline", value: "underline" }
                    ],
                    annotations: [],
                  },
                },
              ],
            },
          ],
        },
      ],
      description: "Array of challenges faced and the subsequent learnings.",
    }),
    defineField({
      name: "techStackDetails",
      title: "Tech Stack Details",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              title: "Technology Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "description",
              title: "Usage Description",
              type: "text",
              rows: 3,
              description: "How it was used in the project.",
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
      description: "Structured list describing the technologies used.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "mainImage",
      subtitle: "overview"
    },
  },
});
