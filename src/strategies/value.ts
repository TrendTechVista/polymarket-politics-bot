import { getOrderBook, getTickSize, placeLimitOrder } from "../clob.js";
import { config } from "../config.js";

function bestAsk(book: { asks: [string, string][] } | null): number | null {
  if (!book?.asks?.length) return null;
  const p = parseFloat(book.asks[0]![0]);
  return Number.isFinite(p) ? p : null;
}

export async function runValue(
  tokenId: string,
  outcomeLabel: string,
  marketSlug: string,
  fairProb: number
): Promise<{ placed: boolean; reason: string }> {
  const book = await getOrderBook(tokenId);
  const ask = bestAsk(book);
  if (ask == null) return { placed: false, reason: "no book" };
  const fair = Number.isFinite(fairProb) ? fairProb : (config.valueDefaultFairProb ?? 0.5);
  const minEdge = config.valueMinEdge;
  const maxPrice = fair - minEdge;
  if (ask >= maxPrice) return { placed: false, reason: `ask ${ask.toFixed(3)} >= maxPrice ${maxPrice.toFixed(3)}` };
  const tickSize = await getTickSize(tokenId);
  const tick = parseFloat(tickSize);
  const orderPrice = Math.min(maxPrice, ask - tick);
  if (orderPrice < 0.01) return { placed: false, reason: "order price too low" };
  let size = config.stakeUsd / orderPrice;
  if (config.maxOrderUsd != null && config.maxOrderUsd > 0) {
    const cap = config.maxOrderUsd / orderPrice;
    size = Math.min(size, cap);
  }
  size = Math.max(0.01, Math.round(size * 100) / 100);
  if (config.dryRun) {
    console.log(`[DRY RUN] VALUE BUY ${outcomeLabel} @ ${orderPrice.toFixed(3)} size=${size} slug=${marketSlug}`);
    return { placed: true, reason: "dry run" };
  }
  const result = await placeLimitOrder(tokenId, "BUY", orderPrice, size, tickSize, false);
  if (result.error) return { placed: false, reason: result.error };
  console.log(`VALUE BUY ${outcomeLabel} @ ${orderPrice.toFixed(3)} size=${size} orderID=${result.orderID ?? "ok"}`);
  return { placed: true, reason: "placed" };
}
