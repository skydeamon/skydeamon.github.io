# PLANNING — CV & Skills Expansion (Department-Level)

**Date:** 2026-09-16
**Owner:** Jade Makwela
**Status:** Phase 0 complete (meta files) — execution driven by `TASKS.md`
**Scope:** Expand the portfolio site's CV ecosystem to cover entrepreneurship, finance, business, marketing, and all business departments, using evidence from the assessment series 15–28.

---

## 1. Purpose & Scope

The portfolio site (`skydeamon.github.io`) currently ships **10 CV profiles** in `js/cv-data.js`, all Old Mutual-centric with thin Ibitse coverage. The assessment series in `Assessments/` (files 15–22, plus new 23–28) documents deep, evidence-backed skills across **every department of both businesses** (Ibitse — lift-sharing; Zelenial Group — property management).

This plan expands the CV ecosystem so any audience — CEO/Exco/Board down to IC/employee — has a dedicated, evidence-backed profile.

**Single source of truth stays `js/cv-data.js`.** Assessment files document *what can be claimed*; `cv-data.js` holds the *distilled claims*; HTML pages are thin renderer shells.

---

## 2. Architecture Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| AD-1 | **7 new profiles reuse existing VALID_THEMES** (`general`, `data-engineer`, `ai-engineer`, `academic`, `freelance`, `executive`, `modern`) | No new CSS themes → `css-consolidation.test.js` VALID_THEMES unchanged; zero theme CSS work |
| AD-2 | **No new section renderers** — new profiles reuse the existing 20 canonical sections (`CANONICAL_INDEX` in `tests/compliance.test.js`) | `js/cv-render.js` untouched; `unit/cv-render.test.js` stays green |
| AD-3 | **New canonical role key `zelenial`** added to the `experience` array (property management role) | `property_manager` profile needs a real role entry; `cv-completeness.test.js` requires `experienceBullets` keys to match canonical `roleKey`s |
| AD-4 | **Department evidence lives in `Assessments/23–28`**; only distilled, tagged claims enter `cv-data.js` | Keeps the data file reviewable; assessment files carry the evidence trail |
| AD-5 | **Integrity rule enforced at render time** — `[implemented]` (shipped) vs `[scaffolded]` (configured/planned) tags in assessment files; never present scaffolded work as shipped in CV bullets | Matches the integrity rule in `Assessments/15` and `22` §5 |
| AD-6 | **Terminology locked to audit conventions** — "5+ years", "AI/LLM", "proof-of-concept", em-dash date ranges (`2020 — Present`) | `docs/audit-2026-09-14.md` findings 10–16; `tests/audit/terminology.test.js` enforces |
| AD-7 | **New pages are thin shells** — `data-profile` + `data-format` attributes on `cv-init.js`; theme resolved at runtime from `profile.theme` | Matches `compliance.test.js` ENGAGEMENT_SHELLS pattern and `css-consolidation.test.js` RUNTIME_THEME_PAGES |

---

## 3. Source → Artifact Mapping

| Department / Domain | Assessment file | CV profile(s) | HTML artifacts |
|---|---|---|---|
| Technical / Programming | `15` | `fullstack_engineer` (new), `job_application`, `modern` | cv shell, engagement, audience, cover letter |
| Architecture / Platform | `16` | `cto` (new), `data_engineer`, `full_time` | cv shell, engagement, audience, cover letter |
| Engineering Management | `17` | `cto` (new), `executive` | cv shell, engagement, audience, cover letter |
| CTO / Tech Executive | `18` | `cto` (new), `executive` | cv shell, engagement, audience, cover letter |
| Founder / CEO / Exco | `19` | `founder_ceo` (new), `executive` | cv shell, engagement, audience, cover letter |
| Product / Programme | `20` | `business_ops` (new), `executive` | cv shell, engagement, audience, cover letter |
| Soft Skills | `21` | all profiles | — (already present) |
| Master Matrix | `22` | routing index — update §3 map + §6 index | — |
| **Entrepreneurship / Founder** | `23` (new) | `founder_ceo` (new) | cv shell, engagement, audience, cover letter |
| **Finance & Accountability** | `24` (new) | `finance` (new), `founder_ceo` | cv shell, engagement, audience, cover letter |
| **Marketing / Sales / Growth** | `25` (new) | `marketing_growth` (new) | cv shell, engagement, audience, cover letter |
| **HR / Operations** | `26` (new) | `business_ops` (new) | cv shell, engagement, audience, cover letter |
| **Research / Competitive Intel** | `27` (new) | `marketing_growth`, `academic` | cv shell, engagement, audience, cover letter |
| **Legal / Compliance Programme** | `28` (new) | `founder_ceo`, `finance` | cv shell, engagement, audience, cover letter |
| **Property Investment** | `29` (new) | `property_manager` (new) | cv shell, engagement, audience, cover letter |

> Note: the plan adds **7 new assessment files (23–29)** — one more than the earlier 6-file proposal — because `property_manager` requires its own evidence file (`29_Property_Investment_Skills.md`) sourced from `zelenial-group/properties/` and `zelenial-group/education/` (UCT PDI course).

---

## 4. File Inventory

### New files
| File | Role |
|---|---|
| `Assessments/23_Entrepreneurship_Founder_Domain.md` | zero external funding, phantom equity, PI cadence, risk, dual-company founding |
| `Assessments/24_Finance_Accountability_Skills.md` | unit economics, P&L/rent rolls, VAT, budgets, expense classes, loan tracking |
| `Assessments/25_Marketing_Sales_Growth_Skills.md` | 10 personas, 13 competitor profiles, 7Ps, campaigns, KPIs, brand governance |
| `Assessments/26_HR_Operations_Management_Skills.md` | org design, LRA s200A, onboarding, 9 SOPs, 4-tier support, training |
| `Assessments/27_Research_Competitive_Intelligence_Skills.md` | TAM/SAM, corridor intel, 41-ch LTR/STR, GCP/AWS feasibility, UCT PDI |
| `Assessments/28_Legal_Compliance_Programme_Skills.md` | POPIA program, B-BBEE L2, NLTA, CPA/ECTA, contracts (55+ docs) |
| `Assessments/29_Property_Investment_Skills.md` | UCT PDI, portfolio mgmt, LTR/STR, yield analysis, tenant screening |
| `portfolio/cv/founder-ceo.html` + `engagement/` | founder_ceo shells |
| `portfolio/cv/cto.html` + `engagement/` | cto shells |
| `portfolio/cv/business-ops.html` + `engagement/` | business_ops shells |
| `portfolio/cv/marketing-growth.html` + `engagement/` | marketing_growth shells |
| `portfolio/cv/finance.html` + `engagement/` | finance shells |
| `portfolio/cv/property-manager.html` + `engagement/` | property_manager shells |
| `portfolio/cv/fullstack-engineer.html` + `engagement/` | fullstack_engineer shells |
| `portfolio/audience/{founder-ceo,cto,business-ops,marketing-growth,finance,property-manager,fullstack-engineer}.html` | 7 audience pages |
| `portfolio/cover-letters/{founder-ceo,cto,business-ops,marketing-growth,finance,property-manager,fullstack-engineer}.html` | 7 cover letters |

### Edited files
| File | Change |
|---|---|
| `Assessments/15_Technical_Programming_Skills_Inventory.md` | Fix PayShap tag `[scaffolded]` → `[absent]` (line 107) |
| `Assessments/19_Founder_CEO_Executive_Leadership_Skills.md` | Fix "11-doc legal library" → "10-doc" (line 25); annotate shared CoR (line 14) |
| `Assessments/21_Soft_Skills_Communication_Leadership_Inventory.md` | Fix "9 departments" → "8 departments" (line 44) |
| `Assessments/22_Master_Skills_Matrix_All_Audiences.md` | Fix "9 existing profiles" → "10" (line 5); add 23–29 to §3 map + §6 index |
| `js/cv-data.js` | Add `zelenial` role to `experience`; add 7 profiles; expand 5 existing |
| `portfolio/cv/freelance-portfolio.html` → `portfolio/cv/freelance.html` | DIR-1: kebab-case rename (`git mv`) + ref updates (hub card, audience "Full CV" link, sitemap `<loc>`) |
| `portfolio/index.html` | DIR-1: hub rebuild — 7 new cards per section (Audience 13, CV 14, Engagement 14, Cover Letters 12) |
| `sitemap.xml` | DIR-1: rename `<loc>` + 28 new URLs |
| `README.md` | DIR-1: page count 27 → 55 (incl. `404.html`); engagement shell list refresh |
| `PLANNING.md` + `TASKS.md` | DOC-3: mark phases done, add DIR-1/DOC-3 rows, correct counts |
| `tests/css-consolidation.test.js` | RUNTIME_THEME_PAGES (14 → 28 CV shells); themed.length (10 → 24) |
| `tests/compliance.test.js` | ENGAGEMENT_SHELLS (4 → 11) |
| `tests/cv-completeness.test.js` | no hard count — verify only |
| `tests/unit/cv-data.test.js` | profile count 10 → 17; experience count 5 → 6 |
| `tests/education-consistency.test.js` | AUDIENCE_PAGES (6 → 13); engagement profileKeys (4 → 11) |
| `tests/integration/portfolio-themes.spec.js` | THEME_EXPECTATIONS (6 → 13) |

---

## 5. Implementation Order & Dependency Graph

```
Phase 0  DOC-1/DOC-2   PLANNING.md + TASKS.md (this file)          [no deps] ✅ DONE
Phase 1  FIX-*         Fix 5 confirmed issues in 15/19/21/22       [no deps]
Phase 2  AS-23..29     Create 7 assessment files                   [no deps, parallelizable]
Phase 3  M22           Update master matrix 22                     [deps: AS-23..29]
Phase 4  DATA-1        Add zelenial role to experience array       [deps: none]
Phase 5  PROF-*        Create 7 new profiles in cv-data.js         [deps: DATA-1, AS-23..29]
Phase 6  EXP-*         Expand 5 existing profiles                  [deps: AS-23..29]
Phase 7  PAGE-*        Create 7×4 HTML artifacts                   [deps: PROF-*]
Phase 7b DIR-1         Rename freelance-portfolio.html → freelance.html; hub/sitemap/README refresh [deps: PAGE-*]
Phase 8  TEST-*        Update all affected test files              [deps: PROF-*, PAGE-*]
Phase 8b DOC-3         Update PLANNING.md + TASKS.md               [deps: TEST-*]
Phase 9  FINAL         Full test suite green + spellcheck          [deps: TEST-*]
```

**Parallelization:** Phases 1–2 can run in parallel (independent). Phases 5–6 can run in parallel after Phase 4. Phase 7 batches by profile.

---

## 6. Test Strategy

Baseline (from `docs/audit-2026-09-14.md`): **125 static/unit/audit + 82 integration + 4 e2e green**.

| Test file | Current expectation | After change |
|---|---|---|
| `tests/unit/cv-data.test.js` | 10 profiles, 5 experience entries | 17 profiles, 6 experience entries |
| `tests/css-consolidation.test.js` | RUNTIME_THEME_PAGES = 14, themed = 10, NO_THEME_PAGES = 2 | RUNTIME_THEME_PAGES = 28, themed = 24, NO_THEME_PAGES = 2 |
| `tests/compliance.test.js` | ENGAGEMENT_SHELLS = 4 | ENGAGEMENT_SHELLS = 11 |
| `tests/education-consistency.test.js` | AUDIENCE_PAGES = 6, engagement keys = 4 | AUDIENCE_PAGES = 13, engagement keys = 11 |
| `tests/integration/portfolio-themes.spec.js` | THEME_EXPECTATIONS = 6 | THEME_EXPECTATIONS = 13 |
| `tests/audit/*` | terminology/placeholders/html/css | verify only — no new forbidden terms |
| `tests/e2e/*` | 4 specs | verify only — no new nav targets unless added |

**Commands:** `npm test` → `npm run test:integration` → `npm run test:e2e` → `npm run audit:spell`.

---

## 7. Exit Criteria & Scope Guard

1. All 5 confirmed quality issues in files 15/19/21/22 fixed.
2. 7 new assessment files (23–29) created with `[implemented]`/`[scaffolded]` tags on every claim.
3. `js/cv-data.js` has **17 profiles**; all new profiles pass `cv-completeness` + `compliance` + `unit/cv-data` checks.
4. 7 new CV shells + 7 engagement shells + 7 audience pages + 7 cover letters render with correct runtime theme.
5. Full test suite green: `npm test`, `npm run test:integration`, `npm run test:e2e`, `npm run audit:spell`.
6. **Scope guard:** no scaffolded work presented as shipped in any CV bullet; no new CSS themes; no new section renderers; no changes outside the files listed in §4 without a new task entry.