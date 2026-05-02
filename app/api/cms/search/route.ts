import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

export const runtime = "nodejs";

// CMS Open Payments — General Payments dataset (Program Year 2023).
// Schema and dataset IDs are rotated annually by CMS. Override via env.
const DATASET_ID = process.env.CMS_OPEN_PAYMENTS_DATASET_ID ?? "g4pf-hv5t";
const APP_TOKEN = process.env.SOCRATA_APP_TOKEN; // optional, ~1000/hr without
const SOCRATA_BASE = "https://openpaymentsdata.cms.gov/resource";

// Field names target Program Year 2021+ schema. CMS broke these between
// PY2020 and PY2021; if you point at an older dataset, override with env vars.
const F = {
  npi: process.env.CMS_FIELD_NPI ?? "covered_recipient_npi",
  firstName:
    process.env.CMS_FIELD_FIRST_NAME ?? "covered_recipient_first_name",
  lastName: process.env.CMS_FIELD_LAST_NAME ?? "covered_recipient_last_name",
  city:
    process.env.CMS_FIELD_CITY ??
    "recipient_primary_business_street_address_city",
  state:
    process.env.CMS_FIELD_STATE ??
    "recipient_primary_business_street_address_state_name1",
  specialty:
    process.env.CMS_FIELD_SPECIALTY ?? "covered_recipient_specialty_1",
  amount:
    process.env.CMS_FIELD_AMOUNT ?? "total_amount_of_payment_usdollars",
  payer:
    process.env.CMS_FIELD_PAYER ??
    "submitting_applicable_manufacturer_or_applicable_gpo_name",
  drug:
    process.env.CMS_FIELD_DRUG ??
    "name_of_drug_or_biological_or_device_or_medical_supply_1",
  programYear: process.env.CMS_FIELD_PROGRAM_YEAR ?? "program_year",
};

type RawPayment = Record<string, string | undefined>;

type AggregatedDoctor = {
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

async function fetchPayments(
  lastName: string,
  state: string,
): Promise<RawPayment[]> {
  // SoQL where: case-insensitive last-name prefix + state filter.
  const lname = lastName.replace(/[^a-zA-Z\- ]/g, "").trim();
  const st = state.replace(/[^A-Z]/g, "").trim();
  if (!lname) return [];

  const where = st
    ? `starts_with(upper(${F.lastName}), upper('${lname}')) AND ${F.state}='${st === "FL" ? "Florida" : st}'`
    : `starts_with(upper(${F.lastName}), upper('${lname}'))`;

  const params = new URLSearchParams({
    $where: where,
    $limit: "500",
    $order: `${F.amount} DESC`,
    $select: [
      F.npi,
      F.firstName,
      F.lastName,
      F.city,
      F.state,
      F.specialty,
      F.amount,
      F.payer,
      F.drug,
      F.programYear,
    ].join(","),
  });
  if (APP_TOKEN) params.set("$$app_token", APP_TOKEN);

  const url = `${SOCRATA_BASE}/${DATASET_ID}.json?${params.toString()}`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`CMS upstream ${res.status}: ${body.slice(0, 200)}`);
  }
  return (await res.json()) as RawPayment[];
}

// Wrapped in unstable_cache so visitors searching the same name share
// one upstream call. 24h TTL — CMS data only refreshes annually.
const cachedFetch = unstable_cache(
  async (lastName: string, state: string) => fetchPayments(lastName, state),
  ["cms-open-payments-search-v1"],
  { revalidate: 60 * 60 * 24 },
);

function aggregate(payments: RawPayment[]): AggregatedDoctor[] {
  const byNpi = new Map<
    string,
    {
      doctor: Omit<
        AggregatedDoctor,
        "topPayer" | "topPayerUSD" | "topDrug"
      >;
      payerTotals: Map<string, number>;
      drugCounts: Map<string, number>;
    }
  >();

  for (const p of payments) {
    const npi = (p[F.npi] ?? "").trim();
    if (!npi) continue;
    const amount = Number.parseFloat(p[F.amount] ?? "0") || 0;
    const payer = (p[F.payer] ?? "—").trim() || "—";
    const drug = (p[F.drug] ?? "").trim();

    let entry = byNpi.get(npi);
    if (!entry) {
      entry = {
        doctor: {
          npi,
          firstName: (p[F.firstName] ?? "").trim(),
          lastName: (p[F.lastName] ?? "").trim(),
          city: (p[F.city] ?? "").trim(),
          state: (p[F.state] ?? "").trim(),
          specialty: (p[F.specialty] ?? "").trim(),
          totalUSD: 0,
          paymentCount: 0,
        },
        payerTotals: new Map(),
        drugCounts: new Map(),
      };
      byNpi.set(npi, entry);
    }
    entry.doctor.totalUSD += amount;
    entry.doctor.paymentCount += 1;
    entry.payerTotals.set(
      payer,
      (entry.payerTotals.get(payer) ?? 0) + amount,
    );
    if (drug) {
      entry.drugCounts.set(drug, (entry.drugCounts.get(drug) ?? 0) + 1);
    }
  }

  const out: AggregatedDoctor[] = [];
  for (const { doctor, payerTotals, drugCounts } of byNpi.values()) {
    let topPayer = "—";
    let topPayerUSD = 0;
    for (const [name, total] of payerTotals) {
      if (total > topPayerUSD) {
        topPayer = name;
        topPayerUSD = total;
      }
    }
    let topDrug = "";
    let topDrugCount = 0;
    for (const [name, count] of drugCounts) {
      if (count > topDrugCount) {
        topDrug = name;
        topDrugCount = count;
      }
    }
    out.push({ ...doctor, topPayer, topPayerUSD, topDrug });
  }

  out.sort((a, b) => b.totalUSD - a.totalUSD);
  return out.slice(0, 50);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const lastName = (url.searchParams.get("lastName") ?? "").trim();
  const state = (url.searchParams.get("state") ?? "FL").trim().toUpperCase();

  if (!lastName || lastName.length < 2) {
    return NextResponse.json(
      { error: "lastName must be at least 2 characters" },
      { status: 400 },
    );
  }

  try {
    const payments = await cachedFetch(lastName, state);
    const doctors = aggregate(payments);
    return NextResponse.json({
      query: { lastName, state },
      datasetId: DATASET_ID,
      paymentCount: payments.length,
      doctors,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json(
      {
        error: message,
        hint: "If this persists, the CMS_OPEN_PAYMENTS_DATASET_ID env var may be stale. CMS rotates dataset IDs annually — find the current one at openpaymentsdata.cms.gov.",
      },
      { status: 502 },
    );
  }
}
