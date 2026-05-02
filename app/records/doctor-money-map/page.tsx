import Link from "next/link";
import DoctorMoneyMap from "@/components/records/DoctorMoneyMap";
import { getDataset } from "../datasets";

const META = getDataset("doctor-money-map")!;

export const metadata = {
  title: `${META.title} — The Records Desk`,
  description: META.oneLiner,
};

export default function DoctorMoneyMapPage() {
  return (
    <div className="terminal-scanlines relative min-h-screen overflow-hidden bg-terminal-bg text-foreground">
      <div className="terminal-grid-bg absolute inset-0 opacity-50" />
      <div className="relative z-10 mx-auto max-w-[1400px] px-4 py-4 sm:px-6">
        {/* System bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-terminal-amber/20 pb-2 font-terminal text-[11px]">
          <div className="flex items-center gap-4">
            <Link
              href="/records"
              className="rounded-sm border border-white/10 bg-white/5 px-2 py-1 uppercase tracking-widest text-foreground/70 hover:border-accent hover:text-accent"
            >
              ← All records
            </Link>
            <span className="font-editorial text-lg font-black uppercase tracking-tight text-foreground">
              Ledger
              <span className="text-terminal-amber">::Records</span>
            </span>
            <span className="text-foreground/40">v0.1 · CMS Open Payments</span>
          </div>
          <div className="flex items-center gap-4 text-foreground/40">
            <span>src: openpaymentsdata.cms.gov</span>
            <span className="text-terminal-green glow-green">● online</span>
            <Link
              href="/wire"
              className="rounded-sm border border-terminal-amber/40 bg-terminal-amber/10 px-2 py-1 uppercase tracking-widest text-terminal-amber hover:bg-terminal-amber/20"
            >
              → Wire
            </Link>
          </div>
        </div>

        <div className="my-6">
          <h1 className="font-editorial text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {META.title}
          </h1>
          <p className="mt-2 font-terminal text-[10px] uppercase tracking-widest text-foreground/50">
            Public CMS Open Payments data, 2017–latest. Listed payments do not
            imply wrongdoing — many are legitimate research, speakers&apos;
            fees, or meals. Names appear because federal law requires their
            disclosure.
          </p>
          <p className="mt-4 max-w-2xl text-foreground/70">{META.oneLiner}</p>
        </div>

        <DoctorMoneyMap />

        <footer className="mt-10 border-t border-terminal-amber/20 pt-3 font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
          Source: CMS Open Payments General Payments. Aggregations computed
          server-side, cached 24h. Editorial commentary streams from the desk.
        </footer>
      </div>
    </div>
  );
}
