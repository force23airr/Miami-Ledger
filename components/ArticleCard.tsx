import Link from "next/link";
import ArticleCover from "./ArticleCover";
import ProfitAnglesButton from "./ProfitAnglesButton";
import { articleHref, type Article } from "@/lib/articles";

export default function ArticleCard({
  article,
  variant = "row",
}: {
  article: Article;
  variant?: "row" | "stack";
}) {
  if (variant === "stack") {
    return (
      <div className="group relative">
        <Link
          href={articleHref(article)}
          className="block"
        >
          <ArticleCover category={article.category} size="md" imageUrl={article.coverImageUrl} imageAlt={article.coverImageAlt} />
          <div className="mt-3 font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
            {article.category} · {article.readMinutes} min
          </div>
          <h3 className="mt-1 font-editorial text-xl leading-snug text-foreground transition group-hover:text-accent">
            {article.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-foreground/60">{article.dek}</p>
        </Link>
        <div className="mt-3">
          <ProfitAnglesButton
            title={article.title}
            dek={article.dek}
            category={article.category}
            size="md"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="group relative border-b border-white/5 py-4 first:pt-0">
      <Link
        href={articleHref(article)}
        className="flex gap-4"
      >
        <div className="w-28 shrink-0">
          <ArticleCover category={article.category} size="sm" imageUrl={article.coverImageUrl} imageAlt={article.coverImageAlt} />
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
      <div className="mt-2 pl-32">
        <ProfitAnglesButton
          title={article.title}
          dek={article.dek}
          category={article.category}
        />
      </div>
    </div>
  );
}
