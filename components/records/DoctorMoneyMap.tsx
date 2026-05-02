"use client";

import { useState } from "react";
import MakeSenseOfThis from "./MakeSenseOfThis";

type Doctor = {
  npi: string;
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  specialty: string;
  totalUSD: number;
  paymentCount: number;
  topPayer: string;
  topPayerUSD: number;
  topDrug: string;
};

type SearchResponse = {
  query: { lastName: string; state: string };
  datasetId: string;
  paymentCount: number;
  doctors: Doctor[];
};

const STATES = [
  "FL",
  "AL",
  "CA",
  "GA",
  "IL",
  "NJ",
  "NY",
  "OH",
  "PA",
  "TX",
  "WA",
  "ALL",
];

const CHIPS = [
  "What do payments to doctors actually pay for?",
  "How big are these compared to a doctor's salary?",
  "Which drug company shows up most here, and what do they make?",
  "Does receiving these payments change how doctors prescribe?",
  "How do I check if my own doctor is in this database?",
];

const fmtUSD = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

const fmtCompactUSD = (n: number) =>
  "$" +
  n.toLocaleString("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  });

export default function DoctorMoneyMap() {
  const [lastName, setLastName] = useState("");
  const [state, setState] = useState("FL");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [data, setData] = useState<SearchResponse | null>(null);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    const q = lastName.trim();
    if (q.length < 2) {
      setErr("Last name needs at least 2 characters.");
      return;
    }
    setErr(null);
    setLoading(true);
    try {
      const params = new URLSearchParams({ lastName: q, state });
      const res = await fetch(`/api/cms/search?${params.toString()}`);
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
          hint?: string;
        };
        throw new Error(
          body.error
            ? body.hint
              ? `${body.error}. ${body.hint}`
              : body.error
            : `Upstream ${res.status}`,
        );
      }
      const json = (await res.json()) as SearchResponse;
      setData(json);
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Search failed.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  // The context we hand to MakeSenseOfThis. Top 5 doctors keeps token use sane.
  const aiContext = data
    ? {
        query: data.query,
        rows: data.doctors.slice(0, 5).map((d) => ({
          name: `${d.firstName} ${d.lastName}`,
          npi: d.npi,
          city: d.city,
          state: d.state,
          specialty: d.specialty,
          totalUSD: d.totalUSD,
          paymentCount: d.paymentCount,
          topPayer: d.topPayer,
          topDrug: d.topDrug || null,
        })),
      }
    : { rows: [] };

  return (
    <div className="flex flex-col gap-6">
      {/* Search form */}
      <form
        onSubmit={search}
        className="rounded-2xl border border-terminal-amber/30 bg-black/40 p-5"
      >
        <div className="font-terminal text-[10px] uppercase tracking-widest text-terminal-amber">
          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-terminal-amber animate-blink" />
          Search the database
        </div>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doctor's last name (e.g. Rodriguez)"
            className="flex-1 rounded-md border border-white/10 bg-black/60 px-3 py-2.5 font-terminal text-sm text-foreground placeholder:text-foreground/30 focus:border-terminal-amber/60 focus:outline-none"
            autoFocus
          />
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="rounded-md border border-white/10 bg-black/60 px-3 py-2.5 font-terminal text-sm text-foreground focus:border-terminal-amber/60 focus:outline-none"
          >
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s === "ALL" ? "All states" : s}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={loading || lastName.trim().length < 2}
            className="rounded-md border border-terminal-amber/50 bg-terminal-amber/15 px-5 font-terminal text-xs uppercase tracking-widest text-terminal-amber transition hover:bg-terminal-amber/25 disabled:opacity-40"
          >
            {loading ? "Searching…" : "Search →"}
          </button>
        </div>
        <div className="mt-3 font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
          Tip: physicians with common surnames return many rows. Use the NPI
          column to confirm identity.
        </div>
      </form>

      {/* Results table */}
      {err && (
        <div className="rounded-md border border-terminal-red/30 bg-terminal-red/10 p-4 font-terminal text-sm text-terminal-red">
          {err}
        </div>
      )}

      {data && (
        <section className="rounded-2xl border border-white/10 bg-black/40">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-5 py-3 font-terminal text-[10px] uppercase tracking-widest">
            <div className="flex items-center gap-3">
              <span className="text-terminal-amber">
                {data.doctors.length}{" "}
                {data.doctors.length === 1 ? "doctor" : "doctors"} matched
              </span>
              <span className="text-foreground/40">
                · {data.paymentCount.toLocaleString()} payment rows aggregated
              </span>
            </div>
            <span className="text-foreground/40">
              query: {data.query.lastName} · {data.query.state}
            </span>
          </div>
          <ul className="divide-y divide-white/5">
            {data.doctors.map((d, i) => (
              <li
                key={d.npi}
                className="grid grid-cols-12 gap-2 px-5 py-3 font-terminal text-[12px] hover:bg-white/[0.03]"
              >
                <span className="col-span-1 text-foreground/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="col-span-4">
                  <div className="text-foreground">
                    {d.firstName} {d.lastName}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-foreground/40">
                    {d.specialty || "—"}
                  </div>
                </div>
                <div className="col-span-3 text-foreground/70">
                  <div>{d.city || "—"}</div>
                  <div className="text-[10px] uppercase tracking-widest text-foreground/40">
                    NPI {d.npi || "—"}
                  </div>
                </div>
                <div className="col-span-2 text-right">
                  <div className="text-terminal-amber">
                    {fmtCompactUSD(d.totalUSD)}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-foreground/40">
                    {d.paymentCount} payments
                  </div>
                </div>
                <div className="col-span-2 text-right text-foreground/70">
                  <div className="truncate">{d.topPayer}</div>
                  <div className="text-[10px] uppercase tracking-widest text-foreground/40">
                    top payer · {fmtUSD(d.topPayerUSD)}
                  </div>
                </div>
              </li>
            ))}
            {data.doctors.length === 0 && (
              <li className="px-5 py-8 text-center font-terminal text-sm text-foreground/50">
                No matching physicians. Try a different last name or state.
              </li>
            )}
          </ul>
          <div className="border-t border-white/10 px-5 py-2 font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
            Source: CMS Open Payments · dataset {data.datasetId} · cached 24h
          </div>
        </section>
      )}

      {/* Make sense of this */}
      <MakeSenseOfThis
        datasetId="doctor-money-map"
        chips={CHIPS}
        context={aiContext}
      />
    </div>
  );
}
