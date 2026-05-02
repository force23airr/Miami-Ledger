# Miami Ledger — Future Ideas

The on-deck list. Not a roadmap, not a commitment — a parking lot for things we want to build when the moment is right. See `CLAUDE.md` for the vision and what's already shipped.

Order is rough priority, not sequence.

---

## Streets — citizen dashcam + bad-driver feed

**The pitch:** A public, watchdog-style feed where users upload dashcam clips, photos of reckless driving, hit-and-runs, parking violations, and road incidents. Like Waze meets Watch_Dogs. Approved clips appear in a chronological feed with a map view of where they happened. Watchdog journalism, citizen-powered.

**The bigger play (this is what makes it lucrative):** Every Uber/Lyft/delivery driver with a dashcam is sitting on a goldmine of training data for autonomous-driving and traffic-prediction models. Anthropic, Waymo, Tesla, Mobileye, Wayve, and a long tail of computer-vision startups all pay for high-quality real-world driving footage. Two-sided market:

- **Free side:** drivers upload clips, the public sees them, watchdog vibes
- **Paid side:** opt-in licensing — drivers tick "yes, license my footage to AI training partners" and earn a cut of whatever the Ledger negotiates per minute of usable footage. Ledger takes a percentage as the marketplace.

This converts a content feature into a real revenue line. Nobody is doing this in Miami yet.

**Pre-build decisions still open:**
- Moderation: queue (approve before publish) vs. auto-publish + flag
- Storage: Cloudflare Stream + R2 (cheap, needs CF account) vs. Vercel Blob (simpler, pricier)
- Audio stripping (yes — Florida is two-party consent, §934.03)
- Face blur (v2; v1 trusts uploader + flag button)
- Plates stay visible (legal, the whole point)
- Licensing tier UX: how drivers opt in, how earnings are tracked, how partners browse footage
- TOS: no doxxing, no minors-as-targets, no private-property footage, IP logged
- Disclaimer on every clip: "User-submitted. Alleged, not adjudicated."

**The masthead `Streets` entry is already in place** — the page just doesn't exist yet.

---

## SEC EDGAR live filings panel

Drop into `/wire` as a fourth panel. Every 8-K, S-1, S-4, Form 4 (insider buys/sells) as it hits SEC EDGAR. Free public data, traders pay hundreds for this elsewhere. Massive Bloomberg-feel credibility for the Wire room. Polling EDGAR's RSS or the JSON API every 30s would cover it. Highlight insider buys ≥ $1M.

---

## Macro strip on `/wire`

Across the top of the Wire room: 10Y / 2Y Treasury yields, DXY, oil, gold, VIX, plus a yield-curve inversion indicator. All free from FRED API (one signup, free tier huge). Completes the "market terminal" picture: crypto + equities + macro in one screen.

---

## `/research` — PubMed-powered research digest

Latest peptide, longevity, and training papers as they publish. Free NCBI E-utilities API. **Highest-leverage move for the store** — converts the peptide section from "trust me" to "here's the actual research" sitting next to the buy button. Sections: Peptides, Supplements, Training, Longevity. Each entry: title, authors, journal, plain-English summary, link to PubMed.

---

## Miami real estate deed feed

Miami-Dade Clerk publishes property sales as open data. Pull fresh deed recordings, show buyer / seller / price / neighborhood. Hyperlocal, fits the Miami brand, nobody aggregates this nicely. Filter by zip / neighborhood / price band. Could expand into a "Miami Money Map" showing where capital is actually landing.

---

## Equities panel on `/wire`

Live US equity tickers via **Alpaca** (free real-time, no per-user auth — unlike Schwab which requires per-user OAuth and is a non-starter for a public site). Plus a **TradingView embed** widget for charts (zero-config, free). Then the Wire is: crypto + equities + macro + on-chain — the full house.

---

## `/tip` — anonymous source submission

Encrypted tip line for sources to send the Ledger leads, documents, photos. Standard real-journalism credibility move. Could use SecureDrop (heavyweight) or just a Tor-friendly form + age.io / signal:// link with strong TOS. Differentiates the site from a content blog.

---

## Civic feeds for Miami-Dade

- Commission meeting agendas + livestreams (Granicus has feeds)
- 311 service requests by neighborhood
- FL court filings of public interest
- Crime/incident map (Miami-Dade open data)
- Property tax / TRIM lookup tool

These are individually small but together = real civic value. Bundle into a `/civic` room.

---

## Stripe checkout for the store

The buy button on `/store/[slug]` currently posts to `/api/checkout`, which redirects to a placeholder confirmation page. To take real money: add `STRIPE_SECRET_KEY` env var, create a Checkout Session in the route handler with the product line item, redirect to `session.url`. ~30 lines. Two webhook routes (`checkout.session.completed`, `payment_intent.failed`) for fulfillment.

Subscriber discount could move from a manual promo code to gated pricing once we have a real auth system.

---

## Hurricane / weather room

Miami needs this. Live NOAA / NHC feeds during storm season, evacuation zone lookup by address, gas station status (hard but powerful), shelter list. Off-season: a quiet status indicator. On-season: probably the most valuable page on the site.

---

## Polls / surveys

Lightweight civic polls per beat. "Should Miami extend the Metromover to Brickell South?" — captures audience opinion, generates content for follow-up articles. Cheap to build, sticky, share-able.

---

## Comments on articles

Eventually. Needs moderation infrastructure first. Probably gated to subscribers to keep signal high.

---

## Mobile app shell

The site already feels app-like on mobile because of the Terminal/Wire aesthetic. A real native shell (Capacitor or React Native) gets you push notifications for breaking stories + Wire alerts (whale transfer ≥ $50M, BTC moved >5% in 1hr, etc.). High-leverage retention loop.

---

## Notes

When picking what to build next, ask: *does this make the site dope-er and more useful, or is it filler?* Build the former. Refer back to `CLAUDE.md` for the principles.
