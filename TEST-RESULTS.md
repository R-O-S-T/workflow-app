# Test Results — 2026-04-02

## Summary: 10/10 PASS

| # | Scenario | Result | Notes |
|---|----------|--------|-------|
| S1 | Simple linear chain | PASS | `"Post by @testuser: Mock tweet content"` |
| S2 | Type preservation | PASS | `"Price result: true, actual: 3200.5"` — numeric comparison works |
| S3 | Multi-expression | PASS | `"Wallet 0xABC has 1.234 ETH"` — 3 expressions in one field |
| S4 | Missing reference | PASS | `"Value:  and 2026-..."` — missing ref → empty string, no crash |
| S5 | Branching DAG | PASS | Both branches execute: sentiment + notification |
| S6 | Three-node chain | PASS | `"Sentiment: 0.51 (neutral) asset: unknown"` — chained resolution works |
| S7 | Condition boolean | PASS | `"Alert triggered: true"` — fixed after string coercion |
| S8 | Polymarket trigger | PASS | `"Market Will BTC hit 100k? at 58.8%"` |
| S9 | Object in text | PASS | `"Payload: [object Object]"` — expected behavior documented |
| S10 | Disconnected node | PASS | All 3 nodes execute including disconnected one |

## Issues Found and Fixed

### S7: Condition handler boolean comparison (FIXED)

**Problem:** `==`/`!=` operators used JS loose equality, which fails for `true == "true"` (returns `false` because JS coerces `"true"` to `NaN`).

**Fix:** Changed `condition.ts` to use `String()` coercion on both sides for `==`/`!=` operators:
```
String(actual) === String(target)
```

**File:** `apps/server/src/engine/handlers/condition.ts` line 9-10
