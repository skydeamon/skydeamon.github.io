<!-- Context: data/fpna-analysis | Priority: critical | Version: 1.0 | Updated: 2026-08-09 -->

# FP&A Analysis Standards

**Purpose**: Core methodology for internal budgeting, rolling forecasting, variance analysis, strategic/long-range planning, and management decision support.

---

## Core Idea

Bridge operational drivers (headcount, sales pipeline, production volumes) with financial outcomes to guide management toward optimal resource allocation, cost efficiency, and sustainable growth. Internal financial stewardship — not external market analysis.

---

## Key Points

- **Driver-based modeling**: every financial line item ties to an operational driver (e.g., revenue = leads × conversion × avg deal size). Never purely extrapolate.
- **Budgeting**: driver-based budgets; ZBB (justify from scratch) vs. incremental; cascade top-down targets into bottom-up budgets, reconciling gaps; flag over-optimistic assumptions (>2× historical growth without catalyst).
- **Forecasting**: rolling 12–18 month forecasts refreshed monthly/quarterly; statistical methods (moving averages, driver regression); leading indicators (pipeline velocity, web traffic) before close; continuous reforecasting with drift tracking.
- **Variance analysis**: decompose into volume, price, mix, efficiency; explain operational root causes; recommend corrective actions.
- **Strategic planning / LRP**: 3–5 yr models; baseline/upside/downside scenarios; sensitivity on 2–3 EBITDA/FCF drivers; explicit trade-off analysis.
- **Decision support**: headcount ROI (productivity vs. fully loaded cost), make-vs-buy, pricing elasticity, CAPEX vs. OPEX (NPV/IRR, lease vs. buy), working capital targets.
- **Cash focus**: EBITDA → Operating CF → Free CF; cash runway in months.
- **Rule of 40** (SaaS/tech): growth % + FCF margin % ≥ 40 = healthy.
- **Benchmarking**: unit costs / productivity vs. industry peers (provided data or proxy).

## Report Structure (7 Sections)

1. Executive Dashboard — 3–5 key metrics (Revenue, Gross Margin %, EBITDA %, FCF, Headcount) actuals vs. budget vs. forecast vs. prior year (Markdown table)
2. Budget/Forecast Detail — line-item projections with assumption notes
3. Variance Bridge — waterfall/bridge of key variance drivers
4. Scenario Summary — Base/Bull/Bear with probability weights + cash-runway impact
5. Decision Support Analysis — ROI, payback, break-even for specific requests
6. Risk & Opportunity Register — top 3 risks / top 3 upsides, quantified dollar impact
7. Recommended Actions — clear, prioritized management actions

Also emit structured JSON (dashboard, forecast, variance_bridge, scenarios, decisions, risks_opportunities, recommended_actions) for dashboarding tools.

## Data Handling Rules

- State every assumption explicitly (e.g., "cost per lead flat at $50").
- Flag data quality issues (misclassified line items, blended cost buckets) and recommend separation.
- When actuals deviate materially from forecast, recommend root-cause data capture (e.g., CRM sales-stage tracking).
- Read-only DB queries only (aggregated tables such as `sales_orders`, `expenses`).

## Quick Example (Variance Bridge)

| Driver | Impact |
|--------|--------|
| Volume (more customers) | +$6.0M |
| Price increase (5%) | +$2.5M |
| Upsell/cross-sell | +$1.5M |
| Churn reduction | +$1.0M |
| **Total revenue bridge** | **+$11.0M** |

## Related

- `data/navigation.md` — Data category navigation
- `data/financial-analysis.md` — External investment & valuation standards
- `core/standards/documentation.md` — Documentation standards