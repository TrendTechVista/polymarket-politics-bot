# polymarket politics bot

TypeScript/Node bot for **politics prediction markets** on Polymarket: **elections**, **referendums**, **leadership**, and **policy**. Implements **value betting** and **arbitrage** strategies.

## Contact me for more profitable bots
<a href="https://t.me/cashblaze129" target="_blank">
  <img src="https://img.shields.io/badge/Telegram-@Contact_Me-0088cc?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram Support" />
</a>

## Politics market types

The bot trades **binary Yes/No** politics markets. You choose scope via **`POLITICS_TAG_ID`** (Gamma tag) or leave it empty for **all active events**.

| Type | Examples |
|------|----------|
| **Elections** | Presidential winner, Senate/House control, governor races, party nominee |
| **Referendums** | National votes, state ballots, Brexit-style outcomes |
| **Leadership** | Party leader, cabinet post, next Fed chair |
| **Policy / events** | Bill passage, veto, government shutdown, impeachment |
| **International** | Foreign elections, EU/UN votes, conflicts |

- **Single category:** Set `POLITICS_TAG_ID` to the tag ID from `GET https://gamma-api.polymarket.com/tags`.
- **All politics:** Leave `POLITICS_TAG_ID` empty to scan all active events (any politics-related binary market).

## Strategies

### 1. Value (edge betting)

- **Idea:** Buy when the market’s **implied probability** (best ask) is **below** your **fair probability** by at least a minimum edge.
- **Logic:** Place a limit BUY when `ask < fair - POLITICS_VALUE_MIN_EDGE`. Use polls, models, or external odds as fair value; set `POLITICS_VALUE_FAIR_PROB` for a global prior (default 0.5).
- **Best for:** When your view (or data) disagrees with the market; the bot executes when the market is “cheap” vs that view.

### 2. Arbitrage

- **Idea:** When **ask_yes + ask_no < 1 - fee**, buying both sides locks in profit (payout 1 per share).
- **Logic:** When the sum is below `1 - POLITICS_ARB_MIN_PROFIT`, place BUY on both outcomes with sized stakes.
- **Best for:** Short-lived mispricings; use a small min profit to filter noise.

## Setup

```bash
cd polymarket-politics-bot
npm install
cp .env.example .env
# Edit .env: POLYMARKET_PRIVATE_KEY, POLYMARKET_FUNDER_ADDRESS, POLITICS_STRATEGY, POLITICS_TAG_ID (optional)
npm run dev
```

## Config

| Variable | Description |
|----------|-------------|
| `POLITICS_STRATEGY` | `value` or `arbitrage` |
| `POLITICS_TAG_ID` | Gamma politics tag. Empty = all active events |
| `POLITICS_VALUE_MIN_EDGE` | Min edge for value (e.g. 0.02) |
| `POLITICS_VALUE_FAIR_PROB` | Optional fair prob (0–1). Default 0.5 |
| `POLITICS_STAKE_USD` | Stake per order (USDC) |
| `POLITICS_MAX_ORDER_USD` | Cap per order (0 = no cap) |
| `POLITICS_ARB_MIN_PROFIT` | Min arb profit (e.g. 0.01) |
| `POLITICS_DRY_RUN` | If true, no real orders |

Wallet/API: `POLYMARKET_PRIVATE_KEY`, `POLYMARKET_FUNDER_ADDRESS`, optional API key or auto-derive.

## Discovery

- **Gamma API** `GET /events?tag_id=...&active=true&closed=false` (or no tag for all).
- **List tags:** `GET https://gamma-api.polymarket.com/tags` to find the politics tag ID.
- Bot parses **binary markets** (Yes/No tokens) and runs the chosen strategy on each.

## Disclaimer

No strategy guarantees profit. Value depends on accurate fair values; arbitrage is rare. Use `POLITICS_DRY_RUN=true` first.
