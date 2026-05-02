import Link from "next/link";
import { notFound } from "next/navigation";
import { episodes, getEpisode } from "../episodes";

export function generateStaticParams() {
  return episodes.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata(
  props: PageProps<"/whats-going-on/[slug]">,
) {
  const { slug } = await props.params;
  const ep = getEpisode(slug);
  if (!ep) return { title: "Episode not found — Miami Ledger" };
  return {
    title: `${ep.title} — What's Going On`,
    description: ep.summary,
  };
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export default async function EpisodePage(
  props: PageProps<"/whats-going-on/[slug]">,
) {
  const { slug } = await props.params;
  const ep = getEpisode(slug);
  if (!ep) notFound();

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <Link
        href="/whats-going-on"
        className="font-terminal text-[11px] uppercase tracking-widest text-foreground/50 hover:text-foreground"
      >
        ← All episodes
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-3 font-terminal text-[11px] uppercase tracking-widest text-foreground/50">
        <span>EP {String(ep.number).padStart(2, "0")}</span>
        <span>·</span>
        <span>{dateFormatter.format(new Date(ep.publishedAt))}</span>
        {ep.status === "upcoming" && (
          <span className="rounded-sm bg-terminal-amber/10 px-2 py-0.5 text-terminal-amber">
            Upcoming
          </span>
        )}
      </div>

      <h1 className="mt-4 font-editorial text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
        {ep.title}
      </h1>
      <p className="mt-3 text-lg text-foreground/70">{ep.summary}</p>

      {ep.videoUrl && (
        <div className="mt-8 aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black">
          <iframe
            src={ep.videoUrl}
            title={ep.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {ep.body && (
        <section className="mt-10 leading-7 text-foreground/80">
          <p>{ep.body}</p>
        </section>
      )}

      {ep.status === "upcoming" && !ep.videoUrl && (
        <section className="mt-10 rounded-2xl border border-terminal-amber/30 bg-terminal-amber/5 p-6">
          <p className="font-terminal text-[11px] uppercase tracking-widest text-terminal-amber">
            Drops {dateFormatter.format(new Date(ep.publishedAt))}
          </p>
          <p className="mt-2 text-foreground/70">
            Subscribe so you don&apos;t miss it — new episodes every week.
          </p>
        </section>
      )}
    </div>
  );
}
