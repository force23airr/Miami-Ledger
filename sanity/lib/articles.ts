import "server-only";

import { defineQuery } from "next-sanity";
import {
  ARTICLE_CATEGORIES,
  ARTICLES,
  type Article,
  type Category,
} from "@/lib/articles";
import { sanityClient } from "@/sanity/lib/client";

const ARTICLE_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  dek,
  category,
  author,
  publishedAt,
  readMinutes,
  tag,
  placements,
  "source": "cms",
  locations,
  body[]{
    ...,
    _type == "image" => {
      "url": asset->url,
      alt
    }
  },
  "coverImageUrl": coverImage.asset->url,
  "coverImageAlt": coverImage.alt,
  sources[]{label, url}
`;

const ARTICLES_QUERY = defineQuery(`
  *[_type == "article" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()]
  | order(publishedAt desc) {${ARTICLE_FIELDS}}
`);

const ARTICLE_QUERY = defineQuery(`
  *[_type == "article" && slug.current == $slug && category == $category][0] {
    ${ARTICLE_FIELDS}
  }
`);

type RawArticle = Omit<Article, "category"> & { category?: string };

function isArticle(value: RawArticle | null): value is Article {
  return Boolean(
    value &&
      value.slug &&
      value.title &&
      value.dek &&
      value.author &&
      value.publishedAt &&
      value.category &&
      ARTICLE_CATEGORIES.includes(value.category as Category),
  );
}

export async function getCmsArticles(): Promise<Article[]> {
  try {
    const items = await sanityClient.fetch<RawArticle[]>(
      ARTICLES_QUERY,
      {},
      { next: { revalidate: 30 } },
    );
    return items.filter(isArticle);
  } catch (error) {
    console.warn("[sanity] Using bundled article fallback:", error);
    return [];
  }
}

export async function getAllArticles(): Promise<Article[]> {
  const cmsArticles = await getCmsArticles();
  const cmsSlugs = new Set(cmsArticles.map((article) => article.slug));

  return [...cmsArticles, ...ARTICLES.filter((article) => !cmsSlugs.has(article.slug))]
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

export async function getArticleBySlug(
  category: Category,
  slug: string,
): Promise<Article | undefined> {
  try {
    const item = await sanityClient.fetch<RawArticle | null>(
      ARTICLE_QUERY,
      { category, slug },
      { next: { revalidate: 30 } },
    );
    if (isArticle(item)) return item;
  } catch (error) {
    console.warn("[sanity] Article query failed; checking bundled content:", error);
  }

  return ARTICLES.find(
    (article) => article.category === category && article.slug === slug,
  );
}
