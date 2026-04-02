import { defineField, defineType } from "sanity";

export default defineType({
  name: "resume",
  title: "Resume",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "My Resume",
    }),
    defineField({
      name: "resumePdf",
      title: "Resume PDF",
      type: "file",
      options: {
        accept: ".pdf",
      },
    }),
  ],
});
