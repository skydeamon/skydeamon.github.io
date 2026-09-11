<!-- Context: data/financial-analysis | Priority: critical | Version: 1.0 | Updated: 2026-08-09 -->

# Financial Analysis Standards

**Purpose**: Core methodology for financial statement analysis, valuation, forecasting, and investment/budgeting recommendations.

---

## Core Idea

Analyze raw financial data (statements, operational metrics, market data) to evaluate performance, identify value and risk drivers, forecast future financials, and produce data-driven investment or budgeting recommendations — always anchored to fundamental valuation.

---

## Key Points

- **Statement analysis**: horizontal (YoY) + vertical (common-size) + trend identification.
- **Ratios**: profitability (gross/operating/net margin, ROE, ROA, ROIC), liquidity (current, quick), leverage (D/E, interest coverage), efficiency (asset turnover, inventory/receivables/payables days), valuation (P/E, P/B, EV/EBITDA, P/S).
- **Cash flow**: separate operating/investing/financing; assess FCF, FCF yield, cash conversion cycle.
- **DuPont**: ROE = profit margin × asset turnover × financial leverage.
- **Quality of earnings**: flag aggressive revenue recognition, receivables rising faster than revenue, one-off gains, related-party transactions.
- **Forecast**: 3-statement model (3–5 yrs) with explicit assumptions for growth, margins, working capital, CAPEX.
- **Valuation**: DCF (WACC + tornado sensitivity), trading comps, precedent transactions; base/bull/bear scenarios with probability weighting; optional Monte Carlo.
- **Recommendation**: intrinsic vs. market → upside/downside; risk matrix (company-specific + systematic); grade Strong Buy/Buy/Hold/Sell/Strong Sell + confidence %; catalysts; exit conditions.
- **Budgeting**: CAPEX NPV/IRR/payback/ROI; budget-vs-actual variance analysis; capital allocation (buybacks vs. dividends vs. reinvestment); optimal debt/equity mix.

## Data Handling Rules

- State every assumption; flag missing/inconsistent data with sensitivity impact.
- Warn when market prices are outdated — require refresh.
- Flag accounting anomalies (e.g., inventory rising faster than sales) as potential distress signals.
- NEVER recommend on price momentum alone — anchor to fundamental valuation.
- Market data APIs (`ALPHA_VANTAGE_API_KEY`, `YAHOO_FINANCE_API_KEY`) used only if configured; never fabricate data.

## Report Structure (7 Sections)

1. Executive Summary (2–3 sentences, final recommendation)
2. Company/Investment Overview
3. Historical Performance (Markdown tables)
4. Forecast & Valuation (projected financials, intrinsic value, sensitivity)
5. Risk & Opportunity Matrix (top 3 risks / top 3 upsides with probabilities)
6. Recommendation (action, rationale, confidence level)
7. Supporting Data (assumptions, comps table, DCF inputs, peer comparisons)

Also emit a structured JSON summary (executive_summary, metrics, valuation, scenarios, risks, recommendation, confidence, catalysts, exit_conditions).

## Quick Example (DCF Inputs)

| Input | Value |
|-------|-------|
| WACC | 12% |
| Terminal growth | 4% |
| Projection horizon | 5 years |
| Base-case revenue CAGR | 30% |
| Terminal value method | Gordon growth |

## Related

- `data/navigation.md` — Data category navigation
- `core/standards/code-quality.md` — Code standards
- `core/standards/documentation.md` — Documentation standards