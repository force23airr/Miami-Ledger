import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "next-sanity";
import ProfitAnglesButton from "@/components/ProfitAnglesButton";
import { ARTICLE_CATEGORIES, CATEGORY_META, type Category } from "@/lib/articles";
import { getArticleBySlug } from "@/sanity/lib/articles";

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const image = value as { url?: string; alt?: string };
      if (!image.url) return null;

      return (
        <figure className="my-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-white/10">
            <Image
              src={image.url}
              alt={image.alt || "Article image"}
              fill
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover"
            />
          </div>
          {image.alt && (
            <figcaption className="mt-2 text-sm text-foreground/45">{image.alt}</figcaption>
          )}
        </figure>
      );
    },
  },
};

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { category, slug } = await params;
  if (!ARTICLE_CATEGORIES.includes(category as Category)) return {};
  const article = await getArticleBySlug(category as Category, slug);
  if (!article) return {};

  return {
    title: `${article.title} — Miami Ledger`,
    description: article.dek,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { category, slug } = await params;
  if (!ARTICLE_CATEGORIES.includes(category as Category)) notFound();

  const article = await getArticleBySlug(category as Category, slug);
  if (!article) notFound();
  const meta = CATEGORY_META[article.category];

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href={`/${article.category}`}
        className="font-terminal text-[11px] uppercase tracking-widest text-foreground/45 hover:text-accent"
      >
        ← {meta.label} desk
      </Link>

      <header className="mt-6 border-b border-white/10 pb-8">
        <div className={`font-terminal text-[11px] uppercase tracking-widest ${meta.accent}`}>
          {article.tag || meta.label} · {article.readMinutes} min read
        </div>
        <h1 className="mt-3 font-editorial text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          {article.title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-foreground/70 sm:text-xl">
          {article.dek}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-foreground/55">
          <span className="font-medium text-foreground">{article.author}</span>
          <span>·</span>
          <time dateTime={article.publishedAt}>
            {new Date(article.publishedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        </div>
      </header>

      {article.coverImageUrl && (
        <figure className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg border border-white/10">
          <Image
            src={article.coverImageUrl}
            alt={article.coverImageAlt || article.title}
            fill
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
          />
        </figure>
      )}

      <div className="article-body mt-10 text-[17px] leading-8 text-foreground/82">
        {article.body?.length ? (
          <PortableText value={article.body} components={portableTextComponents} />
        ) : (
          <p>{article.dek}</p>
        )}
      </div>

      {article.sources && article.sources.length > 0 && (
        <aside className="mt-12 border-t border-white/10 pt-6">
          <h2 className="font-terminal text-[11px] uppercase tracking-widest text-foreground/45">
            Sources
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {article.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-terminal-cyan hover:underline"
                >
                  {source.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </aside>
      )}

      <div className="mt-10 border-t border-white/10 pt-6">
        <ProfitAnglesButton
          title={article.title}
          dek={article.dek}
          category={article.category}
          size="md"
        />
      </div>
    </article>
  );
}
