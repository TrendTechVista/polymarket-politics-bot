const env = process.env;

export const config = {
  strategy: (env.POLITICS_STRATEGY ?? "value").toLowerCase(),
  /** Gamma tag_id for politics. GET https://gamma-api.polymarket.com/tags to find. Empty = all active events */
  politicsTagId: (env.POLITICS_TAG_ID ?? "").trim() || null,
  activeOnly: (env.POLITICS_ACTIVE_ONLY ?? "true").toLowerCase() === "true",
  pollIntervalMs: Math.max(10_000, parseInt(env.POLITICS_POLL_INTERVAL_MS ?? "60000", 10)),
  eventsLimit: Math.min(100, Math.max(10, parseInt(env.POLITICS_EVENTS_LIMIT ?? "50", 10))),

  valueMinEdge: Math.max(0.001, Math.min(0.5, parseFloat(env.POLITICS_VALUE_MIN_EDGE ?? "0.02"))),
  valueDefaultFairProb: env.POLITICS_VALUE_FAIR_PROB ? parseFloat(env.POLITICS_VALUE_FAIR_PROB) : null,
  maxOrderUsd: parseFloat(env.POLITICS_MAX_ORDER_USD ?? "0") || null,
  stakeUsd: Math.max(1, parseFloat(env.POLITICS_STAKE_USD ?? "10")),

  arbMinProfit: Math.max(0.001, Math.min(0.1, parseFloat(env.POLITICS_ARB_MIN_PROFIT ?? "0.01"))),

  dryRun: (env.POLITICS_DRY_RUN ?? "true").toLowerCase() === "true",

  gammaUrl: (env.POLYMARKET_GAMMA_URL ?? "https://gamma-api.polymarket.com").replace(/\/$/, ""),
  clobUrl: (env.POLYMARKET_CLOB_URL ?? "https://clob.polymarket.com").replace(/\/$/, ""),
  chainId: parseInt(env.POLYMARKET_CHAIN_ID ?? "137", 10),
  privateKey: (env.POLYMARKET_PRIVATE_KEY ?? "").trim(),
  funderAddress: (env.POLYMARKET_FUNDER_ADDRESS ?? "").trim(),
  apiKey: (env.POLYMARKET_API_KEY ?? "").trim(),
  apiSecret: (env.POLYMARKET_API_SECRET ?? "").trim(),
  apiPassphrase: (env.POLYMARKET_API_PASSPHRASE ?? "").trim(),
  autoDeriveApiKey: (env.POLYMARKET_AUTO_DERIVE_API_KEY ?? "true").toLowerCase() === "true",
  signatureType: parseInt(env.POLYMARKET_SIGNATURE_TYPE ?? "0", 10),
} as const;

export function validateConfig(): string | null {
  if (!config.privateKey || !/^0x[a-fA-F0-9]{64}$/.test(config.privateKey))
    return "POLYMARKET_PRIVATE_KEY must be 0x + 64 hex";
  if (!config.funderAddress || !/^0x[a-fA-F0-9]{40}$/.test(config.funderAddress))
    return "POLYMARKET_FUNDER_ADDRESS required";
  const hasCreds = config.apiKey && config.apiSecret && config.apiPassphrase;
  if (!config.dryRun && !hasCreds && !config.autoDeriveApiKey)
    return "Set API creds or POLYMARKET_AUTO_DERIVE_API_KEY=true";
  if (config.strategy !== "value" && config.strategy !== "arbitrage")
    return "POLITICS_STRATEGY must be value or arbitrage";
  return null;
}
