import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CATEGORY_META,
  articlesByCategory,
  type Category,
} from "@/lib/articles";
import ArticleCover from "@/components/ArticleCover";

const VALID: Category[] = ["local", "fintech", "engineering", "academics", "video"];

export function generateStaticParams() {
  return VALID.map((c) => ({ category: c }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!VALID.includes(category as Category)) notFound();

  const cat = category as Category;
  const meta = CATEGORY_META[cat];

  // Video desk gets a different layout
  if (cat === "video") return <VideoDesk />;

  const items = articlesByCategory(cat);
  const [lead, ...rest] = items;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="border-b border-white/10 pb-8">
        <Link
          href="/"
          className="font-terminal text-[11px] uppercase tracking-widest text-foreground/40 hover:text-foreground"
        >
          ← Miami Ledger
        </Link>
        <h1 className={`mt-3 font-editorial text-5xl font-bold tracking-tight sm:text-6xl ${meta.accent}`}>
          {meta.label}
        </h1>
        <p className="mt-2 max-w-2xl text-foreground/65">{meta.blurb}</p>
      </div>

      {lead && (
        <Link
          href={`#${lead.slug}`}
          id={lead.slug}
          className="group mt-10 grid gap-8 lg:grid-cols-2"
        >
          <ArticleCover category={cat} size="lg" label={lead.tag ?? "Lede"} />
          <div className="self-center">
            <div className="font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
              {lead.tag ?? "Lede"} · {lead.readMinutes} min · {lead.author}
            </div>
            <h2 className="mt-2 font-editorial text-3xl font-bold leading-tight text-foreground sm:text-4xl group-hover:text-accent">
              {lead.title}
            </h2>
            <p className="mt-3 text-foreground/70">{lead.dek}</p>
          </div>
        </Link>
      )}

      <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((a) => (
          <article key={a.slug} id={a.slug}>
            <ArticleCover category={cat} size="md" />
            <div className="mt-3 font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
              {a.author} · {a.readMinutes} min
            </div>
            <h3 className="mt-1 font-editorial text-xl leading-snug">{a.title}</h3>
            <p className="mt-1.5 text-sm text-foreground/60">{a.dek}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function VideoDesk() {
  const meta = CATEGORY_META.video;
  const reels = [
    { title: "Brickell skyline: a balance sheet", duration: "11:24", host: "A. Fernandez" },
    { title: "Inside FIU's Cat-6 wind tunnel", duration: "07:52", host: "L. Okafor" },
    { title: "Stablecoins crossing the Florida Straits", duration: "14:08", host: "M. Carrillo" },
    { title: "How Metromover stays alive", duration: "09:41", host: "J. Patel" },
    { title: "Wynwood after dark: the new traffic map", duration: "06:13", host: "C. Joseph" },
    { title: "What VC pullback looks like from Brickell", duration: "08:35", host: "R. Singh" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="border-b border-white/10 pb-8">
        <Link
          href="/"
          className="font-terminal text-[11px] uppercase tracking-widest text-foreground/40 hover:text-foreground"
        >
          ← Miami Ledger
        </Link>
        <h1 className={`mt-3 font-editorial text-5xl font-bold tracking-tight sm:text-6xl ${meta.accent}`}>
          Video
        </h1>
        <p className="mt-2 max-w-2xl text-foreground/65">{meta.blurb}</p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative aspect-video overflow-hidden rounded-md bg-gradient-to-br from-amber-500/30 via-orange-700/20 to-zinc-900 ring-1 ring-white/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur transition hover:bg-accent">
                <svg viewBox="0 0 24 24" className="h-9 w-9 translate-x-0.5 fill-white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-sm bg-black/60 px-2 py-0.5 font-terminal text-[10px] uppercase tracking-widest text-terminal-red">
              <span className="h-1.5 w-1.5 rounded-full bg-terminal-red animate-blink" /> Live
            </div>
          </div>
          <div className="mt-4">
            <div className="font-terminal text-[11px] uppercase tracking-widest text-foreground/50">
              Now playing · 11:24
            </div>
            <h2 className="mt-1 font-editorial text-3xl font-bold leading-tight">
              Brickell skyline: a balance sheet
            </h2>
            <p className="mt-2 text-foreground/65">
              A walk through downtown with our Local desk on what foreign capital built — and what
              comes next.
            </p>
          </div>
        </div>

        <aside>
          <div className="font-terminal text-[11px] uppercase tracking-widest text-foreground/50">
            Up next
          </div>
          <ul className="mt-3 space-y-3">
            {reels.map((r) => (
              <li
                key={r.title}
                className="group flex cursor-pointer gap-3 rounded-md border border-white/5 bg-white/[0.02] p-2 hover:border-terminal-amber/40"
              >
                <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-sm bg-gradient-to-br from-zinc-700 to-zinc-900">
                  <span className="absolute bottom-1 right-1 rounded-sm bg-black/70 px-1 font-terminal text-[10px] text-white">
                    {r.duration}
                  </span>
                </div>
                <div>
                  <div className="text-sm leading-tight group-hover:text-terminal-amber">{r.title}</div>
                  <div className="mt-1 font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
                    {r.host}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
