import Link from "next/link";
import { topFeatured } from "@/lib/startups";
import StartupCard from "./StartupCard";

export default function StartupsRail() {
  const featured = topFeatured(3);
  if (featured.length === 0) return null;

  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
      <div className="mb-6 flex items-end justify-between border-b border-white/10 pb-3">
        <div>
          <div className="font-terminal text-[11px] uppercase tracking-widest text-accent">
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            Sponsored startups · presented partners
          </div>
          <h2 className="mt-1 font-editorial text-3xl font-bold tracking-tight">
            The 305 is building.
          </h2>
        </div>
        <Link
          href="/startups"
          className="font-terminal text-[11px] uppercase tracking-widest text-foreground/50 hover:text-foreground"
        >
          See the directory →
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {featured.map((s) => (
          <StartupCard key={s.slug} startup={s} size="md" />
        ))}
      </div>

      <div className="mt-3 font-terminal text-[10px] uppercase tracking-widest text-foreground/30">
        Sponsored placements. Editorial coverage in the newsroom is independent.
      </div>
    </section>
  );
}
