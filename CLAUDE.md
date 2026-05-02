@AGENTS.md

# Miami Ledger — what we're actually building

This is not just a news site. The vision is a **free, cool, dope, useful, informative, pro-interaction website** — all vibes. A place you'd open when you're bored, when you're working, when you just want to see what's happening in the world. Like a school computer-lab homepage you actually wanted to be on, except it scales to adults and operators.

## The pitch in one breath

A multi-room news outlet from the 305 that fuses live data, real journalism, hyperlocal dispatches, useful tools, and a small store — all in one place, all free, all in a distinctive editorial-meets-Bloomberg-terminal aesthetic. X is the funnel; the site is where the depth lives.

## Principles

- **Free always.** Nothing of substance behind a paywall. Subscribers get perks (50% off store, exclusive zines, etc.), not gatekeeping.
- **Dope, not BS.** Every feature has to pass the "would I open this when I'm bored?" test. No filler tabs. No content for content's sake.
- **Useful, not just informative.** Tools that actually do something — live tape, on-chain feed, fact lookups, eventually mortgage calculators / property-tax lookups / civic feeds. The reader leaves with information they can act on.
- **Interactive, not passive.** Streaming data, queryable facts, AI side panel, future "control room" rooms. The site responds to you.
- **All vibes.** Editorial fonts (Fraunces), terminal accents (JetBrains, amber/green/red), scanlines, blinking cursors. The aesthetic is the brand.
- **Multi-room architecture.** One site, many lenses on the same content: `/` (editorial), `/terminal` (Bloomberg), `/wire` (markets + on-chain), `/facts` (fact desk), `/whats-going-on` (weekly series), `/store`. New rooms are additive, not replacements.

## Audience

Mixed: smart Miami operators, traders, students, curious people on TikTok, X followers from the founder's account, peptide/training community, and anyone who wants a chill check-what's-happening service. Built to scale from "bored teenager on a school laptop" to "fintech analyst on a Brickell desk."

## Currently shipped

- `/` — editorial homepage, cover story + latest, rooms CTA band
- `/terminal` — multi-panel live newsroom (Bloomberg-style)
- `/wire` — BTC/ETH/SOL tickers, cross-pair tape, live USDC on-chain transfers
- `/store` — peptides, supplements, gear (50% subscriber discount, code `LEDGER50`)
- `/whats-going-on` — weekly video series
- `/[category]` — Local / Fintech / Engineering / Academics / Video beats
- "Ask the Ledger" — global Claude-powered side panel
- "Profit Angles" — per-article business-idea generator
- Globe Feed — interactive geopolitical events globe inside the Terminal

## The roadmap (live)

When in doubt about whether to add something, ask: *does this make the site dope-er and more useful, or is it filler?* Build the former. Examples on deck:

- **Facts Desk** — free-text fact lookup ("how many arrests in Miami-Dade last year?")
- **SEC EDGAR live filings panel** in `/wire` — 8-Ks, S-1s, insider Form 4s as they hit
- **Macro strip** in `/wire` — 10Y/2Y yields, DXY, oil, gold, VIX (FRED API)
- **PubMed research digest** at `/research` — peptide, longevity, training papers as they publish
- **Miami real estate deed feed** — fresh property sales from Miami-Dade Clerk open data
- **`/tip`** — anonymous source submission (real-journalism credibility)
- **Civic feeds** — Miami-Dade commission agendas, 311, court filings

## Engineering reality

- Next.js 16 / React 19, App Router. **This is not the Next.js you know** — read `node_modules/next/dist/docs/` before writing routing code (see AGENTS.md).
- Tailwind v4. Custom CSS vars in `app/globals.css` for the editorial + terminal palette: `--accent` (orange), `--terminal-amber`, `--terminal-green`, `--terminal-red`. Use these, not raw Tailwind colors, when matching the brand.
- Fonts: `font-editorial` (Fraunces serif) for headlines, `font-terminal` (JetBrains Mono) for terminal/data UI.
- Deploys to Vercel. Some features need env vars set there: `ANTHROPIC_API_KEY` for Ask the Ledger / Facts Desk, `STRIPE_SECRET_KEY` (eventually) for store checkout.
- Public-data-first: prefer free/public sources (Coinbase WS, Ethereum public RPCs, FRED, SEC EDGAR, Miami-Dade open data) over paid APIs. Cache server-side when traffic warrants.

## Tone for new copy

Direct. Sharp. A little dry. Editorial, not corporate. Bilingual aware (Spanish/English) when relevant. Take a position when asked. Anchor to Miami specifics whenever possible.
