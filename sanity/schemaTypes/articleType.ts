import { defineArrayMember, defineField, defineType } from "sanity";

export const articleType = defineType({
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Headline",
      type: "string",
      validation: (rule) => rule.required().min(8).max(140),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "dek",
      title: "Summary",
      description: "One or two sentences used on cards and below the headline.",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().min(20).max(320),
    }),
    defineField({
      name: "body",
      title: "Article body",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alternative text",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "category",
      title: "Desk",
      type: "string",
      options: {
        list: [
          { title: "Local", value: "local" },
          { title: "Fintech", value: "fintech" },
          { title: "Engineering", value: "engineering" },
          { title: "Academics", value: "academics" },
          { title: "Video", value: "video" },
          { title: "Facts", value: "facts" },
          { title: "Blueprints", value: "blueprints" },
          { title: "Records", value: "records" },
          { title: "Startups", value: "startups" },
          { title: "Projects", value: "projects" },
          { title: "What's Going On", value: "whats-going-on" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Byline",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Publish date and time",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "readMinutes",
      title: "Estimated reading time",
      type: "number",
      initialValue: 5,
      validation: (rule) => rule.required().integer().min(1).max(90),
    }),
    defineField({
      name: "tag",
      title: "Story label",
      description: "Optional, for example: Investigation, Analysis, or Cover.",
      type: "string",
    }),
    defineField({
      name: "placements",
      title: "Display placements",
      description:
        "The selected Desk is the story's main section. Choose any additional places where it should appear.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: {
        list: [
          { title: "Homepage — featured story", value: "homepageFeatured" },
          { title: "Homepage — latest list", value: "homepageLatest" },
          { title: "Homepage — desk section", value: "homepageSection" },
          { title: "Breaking-news ticker", value: "ticker" },
          { title: "Ledger Terminal", value: "terminal" },
          { title: "Video Desk", value: "video" },
        ],
        layout: "grid",
      },
    }),
    defineField({
      name: "locations",
      title: "Cities, neighborhoods, and ZIP codes",
      description: "Press Enter after each location so local-news filtering can find it.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "sources",
      title: "Sources",
      description: "Add the primary documents and links that support the reporting.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Source name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "Source URL",
              type: "url",
              validation: (rule) => rule.required().uri({ scheme: ["http", "https"] }),
            }),
          ],
          preview: { select: { title: "label", subtitle: "url" } },
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Publish date, newest",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "coverImage",
    },
  },
});
