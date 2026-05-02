import { NextResponse } from "next/server";

// USDC on Ethereum mainnet
const USDC_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
// keccak256("Transfer(address,address,uint256)")
const TRANSFER_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

const RPC_URLS = [
  "https://eth.llamarpc.com",
  "https://cloudflare-eth.com",
  "https://ethereum-rpc.publicnode.com",
];

type RpcResponse<T> = { result?: T; error?: { message: string } };

async function rpc<T>(method: string, params: unknown[]): Promise<T> {
  let lastErr: unknown;
  for (const url of RPC_URLS) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
        cache: "no-store",
        signal: AbortSignal.timeout(4000),
      });
      if (!res.ok) throw new Error(`${url} ${res.status}`);
      const json = (await res.json()) as RpcResponse<T>;
      if (json.error) throw new Error(json.error.message);
      if (json.result === undefined) throw new Error("no result");
      return json.result;
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr ?? new Error("all RPCs failed");
}

type Log = {
  blockNumber: string;
  transactionHash: string;
  logIndex: string;
  topics: string[];
  data: string;
};

function topicToAddress(topic: string): string {
  return "0x" + topic.slice(-40);
}

function hexToAmount(hex: string): number {
  // USDC has 6 decimals. BigInt for precision, then to number for JSON.
  const raw = BigInt(hex);
  return Number(raw) / 1_000_000;
}

export async function GET() {
  try {
    const blockHex = await rpc<string>("eth_blockNumber", []);
    const block = parseInt(blockHex, 16);
    const fromHex = "0x" + (block - 1).toString(16);
    const toHex = "0x" + block.toString(16);

    const logs = await rpc<Log[]>("eth_getLogs", [
      {
        fromBlock: fromHex,
        toBlock: toHex,
        address: USDC_ADDRESS,
        topics: [TRANSFER_TOPIC],
      },
    ]);

    const transfers = logs
      .filter((l) => l.topics.length >= 3)
      .map((l) => ({
        from: topicToAddress(l.topics[1]),
        to: topicToAddress(l.topics[2]),
        amount: hexToAmount(l.data),
        block: parseInt(l.blockNumber, 16),
        tx: l.transactionHash,
        logIndex: parseInt(l.logIndex, 16),
      }))
      .sort((a, b) => b.block - a.block || b.logIndex - a.logIndex)
      .slice(0, 40);

    return NextResponse.json(
      { block, transfers },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
