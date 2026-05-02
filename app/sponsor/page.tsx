"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CATEGORY_LABEL, TIER_META } from "@/lib/startups";

type Tier = "featured" | "spotlight" | "listing";

const TIERS: Tier[] = ["featured", "spotlight", "listing"];
const CATEGORIES = Object.keys(CATEGORY_LABEL) as (keyof typeof CATEGORY_LABEL)[];

export default function SponsorPage() {
  const [tier, setTier] = useState<Tier>("spotlight");
  const [name, setName] = useState("");
  const [oneLiner, setOneLiner] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<keyof typeof CATEGORY_LABEL>("fintech");
  const [url, setUrl] = useState("");
  const [founders, setFounders] = useState("");
  const [hq, setHq] = useState("Miami");
  const [contactEmail, setContactEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const params = useMemo(() => {
    if (typeof window === "undefined") return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, []);
  const cancelled = params.get("cancelled") === "1";

  const charLimits = {
    name: 80,
    oneLiner: 140,
    description: 600,
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/sponsor-apply", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          oneLiner,
          description,
          category,
          url,
          founders,
          hq,
          contactEmail,
          tier,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.url) {
        setError(data?.error ?? "Could not start checkout.");
        setSubmitting(false);
        return;
      }
      window.location.href = data.url as string;
    } catch (err) {
      setError((err as Error).message);
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="border-b border-white/10 pb-8">
        <Link
          href="/startups"
          className="font-terminal text-[11px] uppercase tracking-widest text-foreground/40 hover:text-foreground"
        >
          ← Startups directory
        </Link>
        <div className="mt-3">
          <div className="font-terminal text-[11px] uppercase tracking-widest text-terminal-amber">
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-terminal-amber animate-blink" />
            Become a featured startup
          </div>
          <h1 className="mt-2 font-editorial text-5xl font-bold tracking-tight sm:text-6xl">
            Apply &amp; pay.
          </h1>
          <p className="mt-2 max-w-2xl text-foreground/65">
            Pick a tier, fill out your card, pay via Stripe. Listings go live
            after a quick 24-hour editorial review (we check the link works,
            nothing more). Cancel anytime from your subscription dashboard.
          </p>
        </div>
      </div>

      {cancelled && (
        <div className="mt-6 rounded-md border border-terminal-amber/40 bg-terminal-amber/10 px-4 py-3 font-terminal text-[11px] uppercase tracking-widest text-terminal-amber">
          Checkout cancelled. Your application wasn&apos;t submitted — try again
          when you&apos;re ready.
        </div>
      )}

      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Tier picker */}
        <div className="lg:col-span-5">
          <div className="font-terminal text-[10px] uppercase tracking-widest text-foreground/50">
            1 · Pick a tier
          </div>
          <div className="mt-2 space-y-3">
            {TIERS.map((t) => {
              const meta = TIER_META[t];
              const active = tier === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTier(t)}
                  className={`group block w-full rounded-xl border p-4 text-left transition ${
                    active
                      ? "border-terminal-amber bg-terminal-amber/10"
                      : "border-white/10 bg-white/[0.02] hover:border-terminal-amber/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-terminal text-[10px] uppercase tracking-widest text-terminal-amber">
                      {meta.label}
                    </div>
                    <div className="font-editorial text-lg font-bold">
                      {meta.price}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-foreground/70">{meta.blurb}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <div className="space-y-5 lg:col-span-7">
          <div className="font-terminal text-[10px] uppercase tracking-widest text-foreground/50">
            2 · Your card
          </div>

          <Field
            label="Startup name"
            value={name}
            onChange={setName}
            max={charLimits.name}
            required
          />
          <Field
            label="One-liner"
            value={oneLiner}
            onChange={setOneLiner}
            max={charLimits.oneLiner}
            required
            placeholder="Stablecoin rails for LATAM payroll."
          />
          <FieldArea
            label="Description"
            value={description}
            onChange={setDescription}
            max={charLimits.description}
            required
            placeholder="Two or three sentences. What you do, who it's for, and what's the proof point."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FieldSelect
              label="Category"
              value={category}
              onChange={(v) => setCategory(v as keyof typeof CATEGORY_LABEL)}
              options={CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABEL[c] }))}
            />
            <Field
              label="HQ city"
              value={hq}
              onChange={setHq}
              required
              placeholder="Miami / Brickell"
            />
          </div>

          <Field
            label="Website"
            value={url}
            onChange={setUrl}
            required
            placeholder="https://your-startup.com"
          />
          <Field
            label="Founders (optional)"
            value={founders}
            onChange={setFounders}
            placeholder="A. Doe, B. Lee"
          />
          <Field
            label="Your email (for the receipt)"
            value={contactEmail}
            onChange={setContactEmail}
            type="email"
            required
            placeholder="you@startup.com"
          />

          {error && (
            <div className="rounded-md border border-terminal-red/40 bg-terminal-red/10 px-3 py-2 font-terminal text-[11px] uppercase tracking-widest text-terminal-red">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-md bg-terminal-amber px-5 py-3 font-terminal text-xs uppercase tracking-widest text-ink hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Redirecting to Stripe…" : `Continue · ${TIER_META[tier].price}`}
              <span>↗</span>
            </button>
            <span className="font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
              Stripe-secured · cancel anytime
            </span>
          </div>

          <div className="rounded-md border border-white/5 bg-black/40 p-4 font-terminal text-[11px] leading-relaxed text-foreground/55">
            <span className="text-terminal-amber">Editorial firewall:</span>{" "}
            Sponsorship buys you a spot on /startups and the homepage rail. It
            does not buy newsroom coverage. Our beats stay independent.
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  max,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  max?: number;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between font-terminal text-[10px] uppercase tracking-widest text-foreground/50">
        <span>
          {label}
          {required ? " *" : ""}
        </span>
        {max && (
          <span className={value.length > max ? "text-terminal-red" : "text-foreground/30"}>
            {value.length}/{max}
          </span>
        )}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        maxLength={max}
        placeholder={placeholder}
        className="w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm placeholder:text-foreground/30 focus:border-terminal-amber focus:outline-none"
      />
    </label>
  );
}

function FieldArea({
  label,
  value,
  onChange,
  max,
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  max?: number;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between font-terminal text-[10px] uppercase tracking-widest text-foreground/50">
        <span>
          {label}
          {required ? " *" : ""}
        </span>
        {max && (
          <span className={value.length > max ? "text-terminal-red" : "text-foreground/30"}>
            {value.length}/{max}
          </span>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        maxLength={max}
        placeholder={placeholder}
        rows={4}
        className="w-full resize-y rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm placeholder:text-foreground/30 focus:border-terminal-amber focus:outline-none"
      />
    </label>
  );
}

function FieldSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <div className="mb-1 font-terminal text-[10px] uppercase tracking-widest text-foreground/50">
        {label}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm focus:border-terminal-amber focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-black">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
