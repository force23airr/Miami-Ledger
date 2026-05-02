import Link from "next/link";
import { notFound } from "next/navigation";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { BLUEPRINTS, getBlueprint, type Blueprint } from "../blueprints";

export function generateStaticParams() {
  return BLUEPRINTS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata(props: PageProps<"/blueprints/[slug]">) {
  const { slug } = await props.params;
  const b = getBlueprint(slug);
  if (!b) return { title: "Blueprint not found — Miami Ledger" };
  return {
    title: `${b.title} — The Blueprints`,
    description: b.tagline,
  };
}

function statusTone(status: Blueprint["status"]) {
  switch (status) {
    case "Concept":
      return "bg-white/10 text-foreground/70";
    case "Dream":
      return "bg-fuchsia-500/15 text-fuchsia-300";
    case "Proposed":
      return "bg-terminal-amber/15 text-terminal-amber";
    case "Under study":
      return "bg-terminal-green/15 text-terminal-green";
    case "Shelved":
      return "bg-terminal-red/15 text-terminal-red";
  }
}

function imagePathFor(slug: string): string | undefined {
  const exts = ["jpg", "jpeg", "png", "webp"];
  for (const ext of exts) {
    const fp = join(process.cwd(), "public", "blueprints", `${slug}.${ext}`);
    if (existsSync(fp)) return `/blueprints/${slug}.${ext}`;
  }
  return undefined;
}

export default async function BlueprintPage(
  props: PageProps<"/blueprints/[slug]">,
) {
  const { slug } = await props.params;
  const b = getBlueprint(slug);
  if (!b) notFound();

  const img = imagePathFor(b.slug);
  const related = BLUEPRINTS.filter(
    (x) => x.slug !== b.slug && x.category === b.category,
  ).slice(0, 3);

  return (
    <article className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <Link
        href="/blueprints"
        className="font-terminal text-[11px] uppercase tracking-widest text-foreground/50 hover:text-foreground"
      >
        ← All blueprints
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2 font-terminal text-[10px] uppercase tracking-widest">
          <span
            className={`rounded-sm px-2 py-0.5 ${statusTone(b.status)}`}
          >
            {b.status}
          </span>
          <span className="rounded-sm bg-white/5 px-2 py-0.5 text-foreground/70">
            {b.category}
          </span>
          <span className="text-foreground/50">target · {b.yearTarget}</span>
          <span className="text-foreground/30">·</span>
          <span className="text-foreground/50">{b.location}</span>
        </div>

        <h1 className="mt-4 font-editorial text-5xl font-bold leading-[1.02] tracking-tight text-foreground sm:text-6xl">
          {b.title}
        </h1>
        <p className="mt-4 text-xl leading-9 text-foreground/75 sm:text-2xl">
          {b.tagline}
        </p>
        <div className="mt-4 font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
          By {b.architect}
        </div>
      </header>

      {/* Hero */}
      <div
        className={`relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${b.cover}`}
      >
        {img && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={img}
            alt={b.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 terminal-grid-bg opacity-30" />
        {!img && (
          <div className="absolute inset-0 flex items-end justify-end p-6 font-terminal text-[10px] uppercase tracking-widest text-white/40">
            no rendering yet · gradient placeholder
          </div>
        )}
      </div>

      {/* The pitch */}
      <section className="mt-12">
        <h2 className="font-terminal text-[11px] uppercase tracking-widest text-terminal-amber">
          The pitch
        </h2>
        <p className="mt-3 text-lg leading-9 text-foreground/85">{b.pitch}</p>
      </section>

      {/* Why now */}
      <section className="mt-10">
        <h2 className="font-terminal text-[11px] uppercase tracking-widest text-terminal-amber">
          Why now
        </h2>
        <p className="mt-3 text-lg leading-9 text-foreground/85">{b.whyNow}</p>
      </section>

      {/* Where it fits */}
      <section className="mt-10">
        <h2 className="font-terminal text-[11px] uppercase tracking-widest text-terminal-amber">
          Where it fits
        </h2>
        <p className="mt-3 text-lg leading-9 text-foreground/85">
          {b.whereItFits}
        </p>
      </section>

      {/* Specs */}
      <section className="mt-10">
        <h2 className="font-terminal text-[11px] uppercase tracking-widest text-terminal-amber">
          Specs · back of the envelope
        </h2>
        <ul className="mt-3 divide-y divide-white/10 rounded-md border border-white/10 bg-white/[0.03] font-terminal text-sm">
          {b.specs.map((s) => (
            <li key={s} className="px-4 py-3 text-foreground/80">
              <span className="text-terminal-amber">›</span>{" "}
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-14 border-t border-white/10 pt-8">
          <h2 className="font-terminal text-[11px] uppercase tracking-widest text-foreground/50">
            More in {b.category}
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/blueprints/${r.slug}`}
                  className="group block rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-terminal-amber/60"
                >
                  <div
                    className={`mb-3 aspect-[16/9] w-full overflow-hidden rounded-md bg-gradient-to-br ${r.cover}`}
                  />
                  <div className="font-terminal text-[10px] uppercase tracking-widest text-foreground/50">
                    {r.status}
                  </div>
                  <div className="mt-1 font-editorial text-base leading-snug text-foreground group-hover:text-terminal-amber">
                    {r.title}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Disclaimer / submission */}
      <footer className="mt-14 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <div className="font-terminal text-[10px] uppercase tracking-widest text-foreground/50">
          Caveat
        </div>
        <p className="mt-2 text-sm leading-7 text-foreground/70">
          {b.architect.startsWith("Speculative")
            ? "This brief is a conceptual provocation from the Ledger desk, not an architectural commitment. Numbers are back-of-the-envelope. Built to start a better conversation."
            : "Sourced from public proposals and reporting. Cross-reference with city documents before citing in formal work."}
        </p>
        <a
          href="mailto:desk@miamiledger.org?subject=Blueprint%20Feedback"
          className="mt-4 inline-flex items-center gap-2 font-terminal text-[10px] uppercase tracking-widest text-terminal-amber hover:text-foreground"
        >
          Push back · email the desk →
        </a>
      </footer>
    </article>
  );
}
