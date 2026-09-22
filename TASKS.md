# TASKS — CV & Skills Expansion (Department-Level)

**Date:** 2026-09-16
**Owner:** Jade Makwela
**Plan:** `PLANNING.md` (same directory)
**Status:** Phases 0–10 complete (expansion + enrichment shipped). Phase 11 planned (homepage refocus) — see below.

---

## Status Legend

`[ ]` todo · `[~]` in-progress · `[x]` done

---

## Phase 0 — Meta files (no deps)

| ID | Task | Deliverable | Depends on | Est. | Status |
|----|------|-------------|-----------|------|--------|
| DOC-1 | Create `PLANNING.md` | Architecture decisions, mapping, order, test strategy, exit criteria | — | 30 min | [x] |
| DOC-2 | Create `TASKS.md` | Atomic task list with IDs, deps, acceptance | DOC-1 | 20 min | [x] |

---

## Phase 1 — Fix confirmed quality issues in files 15–22 (no deps)

| ID | Task | Deliverable | Depends on | Est. | Status |
|----|------|-------------|-----------|------|--------|
| FIX-15-1 | `Assessments/15` line 107: PayShap `[scaffolded]` → `[absent]` (evidence says "Not present anywhere") | Corrected tag | — | 5 min | [x] |
| FIX-19-1 | `Assessments/19` line 25: "11-doc legal library" → "10-doc" (only 10 items enumerated) | Corrected count | — | 5 min | [x] |
| FIX-19-2 | `Assessments/19` line 14: annotate shared CoR registration as "single CIPC registration referenced across both businesses' docs" | Annotation added | — | 5 min | [x] |
| FIX-21-1 | `Assessments/21` line 44: "9 departments" → "8 departments" (match line 30) | Corrected count | — | 5 min | [x] |
| FIX-22-1 | `Assessments/22` line 5: "9 existing profiles" → "10 existing profiles" | Corrected count | — | 5 min | [x] |

**Acceptance:** grep confirms no `[scaffolded]` on PayShap, no "11-doc", no "9 departments", no "9 existing profiles" in the series.

---

## Phase 2 — New assessment files 23–29 (no deps, parallelizable)

| ID | Task | Deliverable | Depends on | Est. | Status |
|----|------|-------------|-----------|------|--------|
| AS-23 | `Assessments/23_Entrepreneurship_Founder_Domain.md` — zero external funding, phantom equity, PI cadence, risk, dual-company founding | Evidence file, every claim tagged | — | 45 min | [x] |
| AS-24 | `Assessments/24_Finance_Accountability_Skills.md` — unit economics, P&L/rent rolls, VAT, budgets, expense classes, loan tracking | Evidence file, every claim tagged | — | 45 min | [x] |
| AS-25 | `Assessments/25_Marketing_Sales_Growth_Skills.md` — 10 personas, 13 competitor profiles, 7Ps, campaigns, KPIs, brand governance | Evidence file, every claim tagged | — | 45 min | [x] |
| AS-26 | `Assessments/26_HR_Operations_Management_Skills.md` — org design, LRA s200A, onboarding, 9 SOPs, 4-tier support, training | Evidence file, every claim tagged | — | 45 min | [x] |
| AS-27 | `Assessments/27_Research_Competitive_Intelligence_Skills.md` — TAM/SAM, corridor intel, 41-ch LTR/STR, GCP/AWS feasibility, UCT PDI | Evidence file, every claim tagged | — | 45 min | [x] |
| AS-28 | `Assessments/28_Legal_Compliance_Programme_Skills.md` — POPIA program, B-BBEE L2, NLTA, CPA/ECTA, contracts (55+ docs) | Evidence file, every claim tagged | — | 45 min | [x] |
| AS-29 | `Assessments/29_Property_Investment_Skills.md` — UCT PDI, portfolio mgmt, LTR/STR, yield analysis, tenant screening | Evidence file, every claim tagged | — | 45 min | [x] |

**Acceptance:** each file has §1 header (date/audience/sources/purpose), tagged tables, honest gap analysis, and a "Mapping to CV Profiles" section.

---

## Phase 3 — Update master matrix (deps: AS-23..29)

| ID | Task | Deliverable | Depends on | Est. | Status |
|----|------|-------------|-----------|------|--------|
| M22-1 | `Assessments/22` §3 map: add rows for 23–29 → new profiles | Updated map | AS-23..29 | 15 min | [x] |
| M22-2 | `Assessments/22` §6 index: add 23–29 rows; renumber series to "15–29" | Updated index | AS-23..29 | 10 min | [x] |

**Acceptance:** matrix references every new file; no orphan skillsets.

---

## Phase 4 — Canonical data (no deps)

| ID | Task | Deliverable | Depends on | Est. | Status |
|----|------|-------------|-----------|------|--------|
| DATA-1 | `js/cv-data.js`: add `zelenial` role to `experience` array (property management, reverse-chronological position after `ibitse`) | New canonical roleKey | — | 15 min | [x] |

**Acceptance:** `CV_DATA.experience.length === 6`; `unit/cv-data.test.js` date-order test updated to include the new role.

---

## Phase 5 — Create 7 new CV profiles (deps: DATA-1, AS-23..29)

| ID | Task | Profile | Theme | Key sections | Depends on | Est. | Status |
|----|------|---------|-------|--------------|-----------|------|--------|
| PROF-1 | `founder_ceo` | CEO / Exco / Board | executive | summary, leadership-philosophy, skills-grid, impact-highlights, experience, projects | DATA-1, AS-23, AS-28 | 30 min | [x] |
| PROF-2 | `cto` | CTO / VP Eng | executive | summary, skills-grid, impact-highlights, experience, projects | DATA-1, AS-23 | 30 min | [x] |
| PROF-3 | `business_ops` | COO / Ops Manager | general | summary, skills-grid, experience, projects | DATA-1, AS-26 | 30 min | [x] |
| PROF-4 | `marketing_growth` | Growth / Marketing Lead | modern | summary, skills-grid, impact-highlights, experience, projects | DATA-1, AS-25, AS-27 | 30 min | [x] |
| PROF-5 | `finance` | CFO / Finance Manager | executive | summary, skills-grid, impact-highlights, experience, projects | DATA-1, AS-24, AS-28 | 30 min | [x] |
| PROF-6 | `property_manager` | Property / Asset Manager | freelance | summary, skills-grid, services, impact-highlights, experience, projects | DATA-1, AS-29 | 30 min | [x] |
| PROF-7 | `fullstack_engineer` | IC / Staff | modern | summary, skills-grid, experience, projects | DATA-1, AS-23 | 30 min | [x] |

**Acceptance:** each profile has theme/subtitle/employmentType/availability/summary/sectionOrder/skills/experienceBullets; `experienceBullets` keys ⊆ canonical roleKeys; summary contains "5+ years"; no scaffolded claims presented as shipped.

> **Note:** the original acceptance named `title`/`description` fields; these were removed as redundant in `b7c187e` (superseded by `subtitle` + rendered headings). `skills`/`skillsGrid` satisfy the skills requirement.

---

## Phase 6 — Expand 5 existing profiles (deps: AS-23..29)

| ID | Task | Profile | Additions | Depends on | Est. | Status |
|----|------|---------|-----------|-----------|------|--------|
| EXP-1 | `executive` | Founder/CTO content, department-sourced bullets (finance, ops, legal) | AS-23..29 | 20 min | [x] |
| EXP-2 | `job_application` | Full-stack + entrepreneurship narrative, operations design | AS-23..29 | 20 min | [x] |
| EXP-3 | `freelance` | Rate justification via ops/financial skills; property consulting | AS-24, AS-26, AS-29 | 20 min | [x] |
| EXP-4 | `academic` | Research methodology (corridor intel, competitive intel, UCT PDI) | AS-27, AS-29 | 20 min | [x] |
| EXP-5 | `modern` | Versatility narrative: data → full-stack → property | AS-23..29 | 20 min | [x] |

**Acceptance:** existing profiles gain Ibitse/Zelenial depth without losing canonical metrics (35%/22%/90%/H+1); `unit/cv-data.test.js` metric test stays green.

---

## Phase 7 — HTML artifacts (deps: PROF-*)

| ID | Task | Deliverable | Depends on | Est. | Status |
|----|------|-------------|-----------|------|--------|
| PAGE-CV-1..7 | 7 CV shells `portfolio/cv/{founder-ceo,cto,business-ops,marketing-growth,finance,property-manager,fullstack-engineer}.html` | Thin shells, runtime theme | PROF-1..7 | 5 min each | [x] |
| PAGE-ENG-1..7 | 7 engagement shells `portfolio/cv/engagement/{...}.html` | Thin shells, `data-format="engagement"` | PROF-1..7 | 5 min each | [x] |
| PAGE-AUD-1..7 | 7 audience pages `portfolio/audience/{...}.html` | Full showcase pages | PROF-1..7 | 15 min each | [x] |
| PAGE-CL-1..7 | 7 cover letters `portfolio/cover-letters/{...}.html` | Templated letters | PROF-1..7 | 10 min each | [x] |
| DIR-1 | Rename `portfolio/cv/freelance-portfolio.html` → `portfolio/cv/freelance.html` (`git mv`); update refs (hub card, audience "Full CV" link, sitemap `<loc>`); rebuild hub with 7 new cards per section; add 28 new sitemap URLs; refresh README page count | Renamed file + updated refs | PAGE-* | 15 min | [x] |

**Acceptance:** shells carry `data-profile`/`data-format` on `cv-init.js`; no hardcoded `body data-theme`; audience pages link `portfolio.css` + `themes.css`; engagement pages link `cv-minimal.css` only. **Naming convention:** kebab-case filename = profile key (`founder-ceo.html` → `founder_ceo`).

---

## Phase 8 — Test coordination (deps: PROF-*, PAGE-*)

| ID | Task | File | Change | Depends on | Est. | Status |
|----|------|------|--------|-----------|------|--------|
| TEST-1 | `tests/unit/cv-data.test.js` | profile count 10 → 17; experience count 5 → 6; date-order list | PROF-*, DATA-1 | 15 min | [x] |
| TEST-2 | `tests/css-consolidation.test.js` | RUNTIME_THEME_PAGES 14 → 28; themed.length 10 → 24; NO_THEME_PAGES unchanged | PAGE-CV-*, PAGE-ENG-* | 10 min | [x] |
| TEST-3 | `tests/compliance.test.js` | ENGAGEMENT_SHELLS 4 → 11 | PAGE-ENG-* | 10 min | [x] |
| TEST-4 | `tests/education-consistency.test.js` | AUDIENCE_PAGES 6 → 13; engagement profileKeys 4 → 11 | PAGE-AUD-*, PAGE-ENG-* | 10 min | [x] |
| TEST-5 | `tests/integration/portfolio-themes.spec.js` | THEME_EXPECTATIONS 6 → 13 | PAGE-AUD-* | 10 min | [x] |
| TEST-6 | `tests/audit/*` + `tests/e2e/*` | verify only — no new forbidden terms, no broken nav | PAGE-* | 15 min | [x] |
| DOC-3 | `PLANNING.md` + `TASKS.md` | Mark phases done; add DIR-1/DOC-3 rows; correct counts (RUNTIME 28, themed 24, ENGAGEMENT 11, AUDIENCE 13, keys 11, THEME 13); document kebab-case naming convention | TEST-* | 15 min | [x] |

**Acceptance:** every updated test passes against the new data/pages.

---

## Phase 9 — Final validation (deps: TEST-*)

| ID | Task | Deliverable | Depends on | Est. | Status |
|----|------|-------------|-----------|------|--------|
| FINAL-1 | `npm test` | 127 static/unit/audit green | TEST-1..6 | 5 min | [x] |
| FINAL-2 | `npm run test:integration` | 82 integration green | TEST-1..6 | 10 min | [x] |
| FINAL-3 | `npm run test:e2e` | 4 e2e green | TEST-1..6 | 10 min | [x] |
| FINAL-4 | `npm run audit:spell` | 0 unknown words | PAGE-* | 5 min | [x] |
| FINAL-5 | Cross-check: no scaffolded claim shipped; no new themes; no new renderers | Scope-guard sign-off | FINAL-1..4 | 10 min | [x] |

**Acceptance:** all four commands green; scope guard confirmed; `TASKS.md` fully `[x]`.

---

## Phase 10 — CV enrichment pass (deps: none — data + page sync + guards)

| ID | Task | Deliverable | Depends on | Est. | Status |
|----|------|-------------|-----------|------|--------|
| ENRICH-1 | `js/cv-data.js`: add `stats` (Key Metrics) to 10 profiles (data_engineer, ai_engineer, executive, freelance, academic, full_time, contract, part_time, modern, job_application); insert `stats` after `summary` in each sectionOrder; harmonize `~` convention (single no-tilde for `35%`/`22%`) | 10 profiles with 4 canonical stats each | — | 30 min | [x] |
| ENRICH-2 | `js/cv-data.js`: add `impactHighlights` to job_application, academic, modern, part_time; insert `impact-highlights` after `skills-grid` in sectionOrder | 4 profiles gain Proven Impact | ENRICH-1 | 15 min | [x] |
| ENRICH-3 | `js/cv-data.js`: tailored `experienceBullets` for 10 profiles (ai_engineer, freelance, executive, academic, founder_ceo, cto, business_ops, finance, property_manager, fullstack_engineer) — ~2 roles each, canonical-fact sourced | Per-role bullet overrides | — | 60 min | [x] |
| ENRICH-4 | `js/cv-data.js`: add 3 shared venture projects (Zelenial portfolio analytics, Ibitse platform architecture, POPIA/B-BBEE compliance programme) to canonical `projects` | 7 shared projects | — | 20 min | [x] |
| ENRICH-5 | Sync audience pages: `general.html` stat swap (5+ → H+1); add stats-grid to `ai-engineer.html` + `academic.html` | Audience pages match profile stats | ENRICH-1 | 20 min | [x] |
| ENRICH-6 | Regression guards: `tests/cv-completeness.test.js` "every profile declares stats + impactHighlights" (+1); `tests/audit/fact-agreement.test.js` "older audience pages contain profile stats" (+1) | 2 new tests | ENRICH-1..5 | 20 min | [x] |
| ENRICH-7 | `scripts/audit-spell.js`: add any newly-flagged content tokens to ALLOW_LIST | 0 unknown words | ENRICH-1..5 | 10 min | [x] |
| ENRICH-8 | Count-sync docs (running-tests, test-inventory, README, PLANNING §6, TASKS FINAL) → 127 static/unit/audit + 82 integration + 4 e2e; fix README integration count 81 → 82 (pre-existing drift); commit + push | Docs + push | ENRICH-6..7 | 15 min | [x] |

**Acceptance:** every profile declares non-empty `stats` + `impactHighlights`; audience pages match profile stats; `npm test` = 127 (65 static + 40 unit + 22 audit); integration 82; e2e 4; spell 0 unknown.

---

## Phase 11 — Homepage design refocus (deps: Phase 10 — venture projects must be canonical before the homepage features them)

> Sequencing: runs after Phase 10 so the 3 venture projects are canonical and linkable on the homepage.

| ID | Task | Deliverable | Depends on | Est. | Status |
|----|------|-------------|-----------|------|--------|
| HOMEPAGE-1 | Rewrite `index.html`: light-first left-aligned Hero (role+domain in first words, one primary CTA) → What I Do (3 pillars: Data Platforms · AI/LLM · Ventures) → Impact (`#impact`, one designed dark evidence band, stats with context line) → Selected Work (`#projects`, featured layout; venture cards + metric chips + context lines; external link only where real, else internal deep-page links) → About → CVs (`#audience`, curated 6) → Contact; remove Experience/Skills/Education + hero photo | Aggressive portfolio-landing structure | — | 45 min | [ ] |
| HOMEPAGE-2 | `css/main.css`: kill homepage `--gradient-soft` hero wash + gradient stat-text (brand gradient only on primary CTA + focus ring); add `.impact-band`/`.pillar`/`.project-metric` (mono, `tabular-nums`); promote 768px single-column hero to default; prune `.hero-photo`/`.hero-img`/`.timeline-*`/`.education-*`/`.skill-group*` + unused `images/profile/hero-560.*`; homepage-only type system (Archivo display + JetBrains/IBM Plex Mono labels, Inter body unchanged) | No dead CSS/assets; new section styles | HOMEPAGE-1 | 45 min | [ ] |
| HOMEPAGE-3 | Nav `#nav-links`: About · Work · Impact · CVs · Contact; no `app.js` changes (theme/nav hooks untouched) | Updated anchors | HOMEPAGE-1 | 10 min | [ ] |
| HOMEPAGE-4 | Copy rewrite per recruiter-scan evidence (role+domain in first words, one outcome-bearing line, one primary CTA; 3 pillars; Impact context line; metric chips + method/context lines on work cards); audit conventions respected ("5+ years", em-dash ranges, terminology) | Canonical-fact copy | HOMEPAGE-1 | 30 min | [ ] |
| HOMEPAGE-5 | `tests/html-structure.test.js`: id list → home/about/projects/impact/audience/contact + guard no `#experience/#skills/#education`; `tests/education-consistency.test.js`: root exemption (root no longer carries full BSc/NSC blocks; engagement pages keep BSc+NSC); keep `#projects` anchor + exact `a.audience-card` ai-engineer href (mobile-manager, recruiter-journey, nav-flows) | Tests updated | HOMEPAGE-1 | 10 min | [ ] |
| HOMEPAGE-6 | Docs sync: README line 10 description + README integration 81 → 82, `.opencode/context`, audit-2026-09-14 superseded note; no URL/sitemap changes | Docs | HOMEPAGE-1..5 | 10 min | [ ] |
| HOMEPAGE-7 | Verify: npm test 127, integration 82, e2e 4 local + deployed, audit:spell; commit + push | Green + push | HOMEPAGE-2..6 | 20 min | [ ] |

**Acceptance:** root renders `#home/about/projects/impact/audience/contact`, no résumé sections or photo, no dead CSS/assets, no banned anti-patterns, both e2e specs green.

---

## Summary

| Phase | Tasks | Status |
|-------|-------|--------|
| 0 — Meta files | 2 | [x] [x] |
| 1 — Quality fixes | 5 | all [x] |
| 2 — Assessment files 23–29 | 7 | all [x] |
| 3 — Matrix update | 2 | all [x] |
| 4 — Canonical data | 1 | [x] |
| 5 — New profiles | 7 | all [x] |
| 6 — Expand existing | 5 | all [x] |
| 7 — HTML artifacts | 28 | all [x] |
| 8 — Test coordination | 6 | all [x] |
| 9 — Final validation | 5 | all [x] |
| 10 — CV enrichment | 8 | all [x] |
| 11 — Homepage refocus | 7 | all [ ] |
| **Total** | **83** | 76 done, 7 todo |