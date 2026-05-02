import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Miami Ledger · TV",
  description:
    "Ambient newsroom display — live markets, headlines, and beats from the 305. Cast it to your TV.",
};

export default function TvLayout({ children }: { children: React.ReactNode }) {
  return children;
}
