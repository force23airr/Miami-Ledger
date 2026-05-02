import Link from "next/link";
import ArticleCover from "./ArticleCover";
import type { Article } from "@/lib/articles";

export default function ArticleCard({
  article,
  variant = "row",
}: {
  article: Article;
  variant?: "row" | "stack";
}) {
  if (variant === "stack") {
    return (
      <Link
        href={`/${article.category}#${article.slug}`}
        className="group block"
      >
        <ArticleCover category={article.category} size="md" />
        <div className="mt-3 font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
          {article.category} · {article.readMinutes} min
        </div>
        <h3 className="mt-1 font-editorial text-xl leading-snug text-foreground transition group-hover:text-accent">
          {article.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-foreground/60">{article.dek}</p>
      </Link>
    );
  }

  return (
    <Link
      href={`/${article.category}#${article.slug}`}
      className="group flex gap-4 border-b border-white/5 py-4 first:pt-0"
    >
      <div className="w-28 shrink-0">
        <ArticleCover category={article.category} size="sm" />
      </div>
      <div className="min-w-0">
        <div className="font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
          {article.category} · {article.author}
        </div>
        <h3 className="mt-1 font-editorial text-base leading-snug text-foreground transition group-hover:text-accent">
          {article.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-foreground/55">{article.dek}</p>
      </div>
    </Link>
  );
}
