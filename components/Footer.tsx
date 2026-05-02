import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <div className="font-editorial text-2xl font-black">
            Miami<span className="text-accent">Ledger</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-foreground/60">
            Independent journalism from the 305. Published in Miami, read everywhere.
          </p>
          <p className="mt-6 font-terminal text-[11px] uppercase tracking-widest text-foreground/40">
            miamiledger.org
          </p>
        </div>

        <div>
          <div className="font-terminal text-[11px] uppercase tracking-widest text-foreground/40">
            Read
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/local" className="hover:text-accent">Local</Link></li>
            <li><Link href="/fintech" className="hover:text-accent">Fintech</Link></li>
            <li><Link href="/engineering" className="hover:text-accent">Engineering</Link></li>
            <li><Link href="/academics" className="hover:text-accent">Academics</Link></li>
            <li><Link href="/video" className="hover:text-accent">Video</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-terminal text-[11px] uppercase tracking-widest text-foreground/40">
            Tools
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/terminal" className="hover:text-terminal-amber">The Terminal</Link></li>
            <li><a href="#newsletter" className="hover:text-accent">Newsletter</a></li>
            <li><a href="#tips" className="hover:text-accent">Send a tip</a></li>
          </ul>
        </div>

        <div id="newsletter">
          <div className="font-terminal text-[11px] uppercase tracking-widest text-foreground/40">
            Stay in the loop
          </div>
          <p className="mt-3 text-sm text-foreground/70">
            The week in Miami — fintech, civic, campus — every Friday morning.
          </p>
          <form className="mt-3 flex gap-2">
            <input
              type="email"
              placeholder="you@domain.com"
              className="w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm placeholder:text-foreground/30 focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-md bg-accent px-3 py-2 text-sm font-semibold text-ink hover:bg-accent-soft"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-xs text-foreground/40 sm:px-6">
          <span>© {new Date().getFullYear()} Miami Ledger</span>
          <span className="font-terminal uppercase tracking-widest">
            built in 305 · v0.1
          </span>
        </div>
      </div>
    </footer>
  );
}
