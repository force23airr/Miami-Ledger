export type FeedItem = {
  id: string;
  time: string; // HH:MM:SS
  beat: "LCL" | "FIN" | "ENG" | "ACA" | "WIRE";
  text: string;
  priority?: "ALERT" | "BREAKING";
};

export const TICKER_ITEMS: string[] = [
  "BREAKING — Miami-Dade commission delays Little Haiti rezoning vote 4–3",
  "FED · Powell signals June pause; LATAM remittance corridors react",
  "MIA — Wynwood foot traffic +12% WoW per Placer.ai feed",
  "PORT — Three super-post-Panamax cranes still pending FCC software cert",
  "FIU — Climate lab releases revised Cat-6 wind model",
  "FINTECH — Miami stablecoin volume crosses $4.2B notional Q1",
  "UM — Miller School AI triage tool enters external audit",
  "WX — NOAA outlook: above-normal Atlantic season, 19 named storms forecast",
  "GOV — Mayor Levine Cava convenes housing task force, Friday 9am",
  "MARKETS — BTC 71,420 +0.8% · ETH 3,812 +1.4% · USDC market cap 38B",
];

export const FEED_BY_BEAT: Record<string, FeedItem[]> = {
  LCL: [
    { id: "l1", time: "08:42:11", beat: "LCL", text: "Brightline announces Aventura platform extension" },
    { id: "l2", time: "08:39:02", beat: "LCL", text: "Coral Gables BoCC approves Miracle Mile redesign" },
    { id: "l3", time: "08:31:55", beat: "LCL", text: "Coconut Grove arts walk returns Saturday after 2-yr hiatus" },
    { id: "l4", time: "08:22:18", beat: "LCL", text: "MDC enrollment up 6% YoY, leading state system" },
    { id: "l5", time: "08:11:09", beat: "LCL", text: "Beach commission greenlights resilience bonds, Phase II", priority: "ALERT" },
    { id: "l6", time: "07:58:44", beat: "LCL", text: "FDOT closes I-95 ramp at NW 79th overnight for repaving" },
  ],
  FIN: [
    { id: "f1", time: "08:44:01", beat: "FIN", text: "Citadel adds 80k sqft to Brickell footprint" },
    { id: "f2", time: "08:38:22", beat: "FIN", text: "Bitso Miami desk hits record stablecoin throughput" },
    { id: "f3", time: "08:30:12", beat: "FIN", text: "Mercado Bitcoin opens compliance HQ in Wynwood" },
    { id: "f4", time: "08:21:00", beat: "FIN", text: "Fed beige book: South FL services PMI 54.2" },
    { id: "f5", time: "08:09:33", beat: "FIN", text: "OFAC issues fresh guidance on LATAM remittance KYC", priority: "BREAKING" },
    { id: "f6", time: "07:55:21", beat: "FIN", text: "Crypto.com Miami arena renewal terms leaked" },
  ],
  ENG: [
    { id: "e1", time: "08:43:18", beat: "ENG", text: "Metromover control system passes 60-day soak test" },
    { id: "e2", time: "08:36:44", beat: "ENG", text: "PortMiami crane software cert review pushed to May 14" },
    { id: "e3", time: "08:28:09", beat: "ENG", text: "FPL substation Doral expansion enters commissioning" },
    { id: "e4", time: "08:18:51", beat: "ENG", text: "Underline Phase 4 fiber backbone now lit end-to-end" },
    { id: "e5", time: "08:05:22", beat: "ENG", text: "MDX deploys radar-based wrong-way driver detection" },
    { id: "e6", time: "07:52:14", beat: "ENG", text: "Miami-Dade WASD boil-water lifted for Hialeah Gardens" },
  ],
  ACA: [
    { id: "a1", time: "08:41:58", beat: "ACA", text: "UM faculty senate votes on AI use policy this Thursday" },
    { id: "a2", time: "08:34:11", beat: "ACA", text: "FIU climate lab paper accepted to Nature Geoscience" },
    { id: "a3", time: "08:26:33", beat: "ACA", text: "Barry expands nursing capacity, +120 seats this fall" },
    { id: "a4", time: "08:15:48", beat: "ACA", text: "MDC opens new cybersecurity AAS at Wolfson campus" },
    { id: "a5", time: "08:02:09", beat: "ACA", text: "FAU/UM joint hurricane modeling grant clears NOAA review" },
    { id: "a6", time: "07:49:55", beat: "ACA", text: "Miller School audit timeline shared with HHS, per memo" },
  ],
};
