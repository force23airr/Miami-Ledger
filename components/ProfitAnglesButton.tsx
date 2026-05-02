"use client";

import { openAskLedger } from "./AskLedger";

export default function ProfitAnglesButton({
  title,
  dek,
  category,
  size = "sm",
}: {
  title: string;
  dek: string;
  category: string;
  size?: "sm" | "md";
}) {
  const cls =
    size === "md"
      ? "px-3 py-1.5 text-[11px]"
      : "px-2 py-1 text-[10px]";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openAskLedger(
          `Profit angles — give me 3-5 concrete business or career angles a smart Miami operator could pursue based on this story:\n\n` +
            `Category: ${category}\nHeadline: ${title}\nDek: ${dek}\n\nBe specific to Miami. Skip generic advice.`,
          true,
        );
      }}
      className={`relative z-10 inline-flex items-center gap-1.5 rounded-full border border-terminal-amber/40 bg-terminal-amber/5 font-terminal uppercase tracking-widest text-terminal-amber transition hover:bg-terminal-amber/15 ${cls}`}
      title="Open Ask the Ledger with business angles for this story"
    >
      <span>$</span> Profit angles
    </button>
  );
}
