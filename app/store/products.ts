export type Product = {
  slug: string;
  name: string;
  price: number;
  tagline: string;
  description: string;
  category: "Supplements" | "Gear" | "Print";
  audience: "Viewer" | "Subscriber" | "Everyone";
  inStock: boolean;
  researchOnly?: boolean;
};

export const SUBSCRIBER_DISCOUNT_PERCENT = 50;
export const SUBSCRIBER_PROMO_CODE = "LEDGER50";

export const products: Product[] = [
  {
    slug: "creatine-monohydrate",
    name: "Creatine Monohydrate — 500g",
    price: 32,
    tagline: "Micronized, unflavored, third-party tested.",
    description:
      "500g of micronized creatine monohydrate. Unflavored, mixes clean. Independently tested for heavy metals and purity.",
    category: "Supplements",
    audience: "Everyone",
    inStock: true,
  },
  {
    slug: "electrolyte-stack",
    name: "Electrolyte Stack — 30 packs",
    price: 38,
    tagline: "Sodium, potassium, magnesium. No sugar.",
    description:
      "Box of 30 single-serve electrolyte packs. 1000mg sodium, 200mg potassium, 60mg magnesium. Lightly flavored, zero sugar.",
    category: "Supplements",
    audience: "Everyone",
    inStock: true,
  },
  {
    slug: "miami-ledger-tee",
    name: "Miami Ledger Tee",
    price: 28,
    tagline: "Heavyweight cotton tee, signature logo.",
    description:
      "100% heavyweight cotton, garment-dyed and pre-shrunk. Miami Ledger logo printed on the chest. True to size.",
    category: "Gear",
    audience: "Everyone",
    inStock: true,
  },
  {
    slug: "ledger-cap",
    name: "Ledger Cap",
    price: 24,
    tagline: "Six-panel washed canvas cap.",
    description:
      "Adjustable strap-back cap in washed canvas. Embroidered Miami Ledger logo on the front.",
    category: "Gear",
    audience: "Everyone",
    inStock: true,
  },
  {
    slug: "subscriber-zine-vol-1",
    name: "Subscriber Zine — Vol. 1",
    price: 15,
    tagline: "Print-only stories. Subscriber exclusive.",
    description:
      "A 48-page print zine collecting our best long-reads. Available exclusively to active Miami Ledger subscribers.",
    category: "Print",
    audience: "Subscriber",
    inStock: true,
  },
  {
    slug: "annual-supporter-bundle",
    name: "Annual Supporter Bundle",
    price: 120,
    tagline: "Tee + Cap + Zine + thank-you note.",
    description:
      "Our most popular bundle for paid supporters: the Miami Ledger tee, the Ledger cap, the latest subscriber zine, and a hand-written thank-you card.",
    category: "Gear",
    audience: "Subscriber",
    inStock: false,
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function subscriberPrice(price: number): number {
  return Math.round(price * (1 - SUBSCRIBER_DISCOUNT_PERCENT / 100) * 100) / 100;
}
