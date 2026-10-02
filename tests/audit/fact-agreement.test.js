'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { ROOT } = require('../helpers');

const CV_DATA = require(path.join(ROOT, 'js', 'cv-data.js'));

// portfolio/audience/general.html renders the contract data-engineer profile.
// It previously rendered cvProfiles.job_application (full-time) while this
// file's "general profile" tests asserted against data_engineer (contract),
// so the tests passed without protecting the page they claimed to cover.
const GENERAL = CV_DATA.cvProfiles.data_engineer;

const AUDIENCE_PAGES = [
  'portfolio/audience/general.html',
  'portfolio/audience/data-engineer.html',
  'portfolio/audience/ai-engineer.html',
  'portfolio/audience/academic.html',
  'portfolio/audience/freelance.html',
  'portfolio/audience/executive.html',
  'portfolio/audience/founder-ceo.html',
  'portfolio/audience/cto.html',
  'portfolio/audience/business-ops.html',
  'portfolio/audience/marketing-growth.html',
  'portfolio/audience/finance.html',
  'portfolio/audience/property-manager.html',
  'portfolio/audience/fullstack-engineer.html',
];

// The 7 Phase-7 audience pages that mirror the canonical cv-data.js profiles.
const NEW_AUDIENCE_PAGES = [
  'portfolio/audience/founder-ceo.html',
  'portfolio/audience/cto.html',
  'portfolio/audience/business-ops.html',
  'portfolio/audience/marketing-growth.html',
  'portfolio/audience/finance.html',
  'portfolio/audience/property-manager.html',
  'portfolio/audience/fullstack-engineer.html',
];

const COVER_LETTERS = [
  'portfolio/cover-letters/founder-ceo.html',
  'portfolio/cover-letters/cto.html',
  'portfolio/cover-letters/business-ops.html',
  'portfolio/cover-letters/marketing-growth.html',
  'portfolio/cover-letters/finance.html',
  'portfolio/cover-letters/property-manager.html',
  'portfolio/cover-letters/fullstack-engineer.html',
  'portfolio/cover-letters/ai-engineer.html',
  'portfolio/cover-letters/data-engineer.html',
  'portfolio/cover-letters/executive.html',
  'portfolio/cover-letters/freelance.html',
  'portfolio/cover-letters/general.html',
];

// The 6 pre-Phase-7 audience pages (older layout, no stats/skillsGrid).
const OLDER_AUDIENCE_PAGES = [
  'portfolio/audience/general.html',
  'portfolio/audience/data-engineer.html',
  'portfolio/audience/ai-engineer.html',
  'portfolio/audience/academic.html',
  'portfolio/audience/freelance.html',
  'portfolio/audience/executive.html',
];

// Older audience pages map to their canonical profile. general.html is the
// contract data_engineer profile, matching GENERAL above.
const OLDER_AUDIENCE_PROFILE_KEYS = {
  'portfolio/audience/general.html': 'data_engineer',
  'portfolio/audience/data-engineer.html': 'data_engineer',
  'portfolio/audience/ai-engineer.html': 'ai_engineer',
  'portfolio/audience/academic.html': 'academic',
  'portfolio/audience/freelance.html': 'freelance',
  'portfolio/audience/executive.html': 'executive',
};

const FORBIDDEN_ON_AUDIENCE = [
  'On-Premises',
  'Proof of Concept',
  'AI/ML',
  'over 5 years',
  '2021–Present',
  '2021 — Present',
  '90%+ data quality',
];

// Personal/identifying + financial specifics that must never appear in public
// pages or the canonical data file (redacted in the Phase-7 remediation).
const REDACTED_TOKENS = [
  'R27,550',
  'R330,600',
  'R80,000',
  'R80k',
  'R117,619.72',
  'R28,006.77',
  'R32,852.33',
  'R4,845.56',
  'R250.13',
  'R247.25',
  '2025/444191/07',
  '444191',
  'De Aan Zicht 6104',
  'Sky City Bronx 261',
  'Sky City Bronx 268',
  'BSC261',
  'BSC268',
  'Bronx 268',
  'R819.92',
  'R1,372.47',
  'R1,500',
  'R820',
  'R814.71',
  'R726.71',
  'R1.79m',
  'R700k',
  'R25k–R55k',
  'R154,200',
  'R2.37M',
  '6.5% cap',
  'R0',
  '~$80–100/mo',
  '~$150–250/mo',
  '12.32%',
  '16.62%',
  '94.12%',
  '94.11%',
  'Astrodon',
  'LIME Burgundy',
];

// Canonical facts that each cover letter must reference (agreement guard).
const COVER_LETTER_ANCHORS = {
  'portfolio/cover-letters/founder-ceo.html': [
    'Founded two companies',
    'Investec loan proposal',
    '10-persona research base',
    '13-profile competitor register',
    'POPIA',
    'B-BBEE Level 2',
    '38-person org blueprint',
    'PI03-minimum 17-person trim path',
  ],
  'portfolio/cover-letters/cto.html': [
    'monolith/tenancy design',
    'co-hosted VPS infrastructure',
    'RAG, function calling',
    '35%',
    '22%',
    '90%+ data-quality coverage',
    'H+1 data freshness',
  ],
  'portfolio/cover-letters/business-ops.html': [
    '38-person org blueprint',
    'PI03-minimum 17-person trim path',
    'LRA s200A',
    '8-document deemed-employment pack',
    '25-question classification assessment tool',
    '10-template contract library',
    '8-stage lifecycle',
    '11 SOPs',
  ],
  'portfolio/cover-letters/marketing-growth.html': [
    '10-persona research base',
    '13-profile competitor register',
    'D1–D8 GTM playbook',
    '4-pillar messaging framework',
    'n=15 user survey',
    'R/Y/G thresholds',
  ],
  'portfolio/cover-letters/finance.html': [
    '3-unit property portfolio',
    'VAT201',
    'SARS quarterly verification cadence',
    'Investec loan proposal',
    'Month-4 profitability projection',
    'Source-verified budget corrections',
  ],
  'portfolio/cover-letters/property-manager.html': [
    'RHA-compliant lease administration',
    'TPN/Experian/TransUnion',
    'FICA',
    'University of Cape Town Property Development',
    '8 modules',
    'NOI calculation',
  ],
  'portfolio/cover-letters/fullstack-engineer.html': [
    '35% reduction',
    '22% reduction',
    'TypeScript',
    'React',
    'NestJS',
    'Odoo ERP',
    'CI/CD',
    'Git best practices',
  ],
  'portfolio/cover-letters/ai-engineer.html': [
    'RAG Service (PoC)',
    'Function-Calling Pattern',
    'Traceability & QA',
    'LLM-Ready Data',
  ],
  'portfolio/cover-letters/data-engineer.html': [
    'PySpark',
    'AWS',
    'EMR',
    'Airflow',
    'Kafka',
  ],
  'portfolio/cover-letters/executive.html': [
    'Leadership experience',
    'Team Leadership',
    'Engineering Standards',
    'Strategic Vision',
    '35% reduction',
  ],
  'portfolio/cover-letters/freelance.html': [
    'What I can deliver',
    'Data Engineering',
    'AI/LLM',
    'Cloud & Infrastructure',
    '35% pipeline runtime reduction',
  ],
  'portfolio/cover-letters/general.html': [
    'Senior Data Engineer',
    'PySpark',
    'AWS',
    '5+ years',
  ],
};

// Canonical facts that each older audience page must reference.
const OLDER_AUDIENCE_ANCHORS = {
  'portfolio/audience/general.html': ['5+ years', 'Senior Data Engineer', 'PySpark', 'AWS'],
  'portfolio/audience/data-engineer.html': ['5+ years', 'Senior Data Engineer', 'PySpark', 'AWS'],
  'portfolio/audience/ai-engineer.html': ['5+ years', 'AI/LLM', 'RAG', 'FastAPI'],
  'portfolio/audience/academic.html': ['BSc', 'Physics', 'Astrophysics', 'Research Interests'],
  'portfolio/audience/freelance.html': ['AI/LLM', 'R550', 'contract engagements'],
  'portfolio/audience/executive.html': ['Technology Leader', 'Engineering Manager', 'Data Platform'],
};

/* ---------- helpers ---------- */

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function profileKeyFromRel(rel) {
  return path.basename(rel, '.html').replace(/-/g, '_');
}

/* ---------- canonical facts ---------- */

test('general profile targetRole is exactly the canonical contract role (no Staff)', () => {
  // Arrange / Act / Assert
  assert.strictEqual(
    GENERAL.targetRole,
    'Senior Data Engineer — AI Training Data (Contract)'
  );
});

test('general profile summary claims 5+ years, seeks a contract role, and avoids Staff-level', () => {
  // Arrange / Act / Assert
  assert.ok(GENERAL.summary.includes('5+ years'), 'summary missing "5+ years"');
  assert.ok(
    GENERAL.summary.includes('Seeking a contract role'),
    'summary missing "Seeking a contract role"'
  );
  assert.ok(!GENERAL.summary.includes('Staff-level'), 'summary contains "Staff-level"');
});

test('the Umuzi.org Alumni Mentor teaching bullet uses (2020 — Present)', () => {
  // Arrange
  const teaching = CV_DATA.cvProfiles.academic.teaching || [];
  const bullet = teaching.find((b) => b.includes('Umuzi.org Alumni Mentor'));
  // Act / Assert
  assert.ok(bullet, 'no teaching bullet mentions Umuzi.org Alumni Mentor');
  assert.ok(
    bullet.includes('(2020 — Present)'),
    `mentor bullet missing (2020 — Present): ${bullet}`
  );
});

test('the Umuzi.org affiliation entry uses (2020 — Present)', () => {
  // Arrange
  const affiliation = CV_DATA.affiliations.find((a) => a.includes('Umuzi.org'));
  // Act / Assert
  assert.ok(affiliation, 'no affiliation mentions Umuzi.org');
  assert.ok(
    affiliation.includes('(2020 — Present)'),
    `affiliation missing (2020 — Present): ${affiliation}`
  );
});

test('every experience date uses the em-dash with spaces format (no en-dash)', () => {
  // Arrange / Act
  const offenders = [];
  for (const job of CV_DATA.experience) {
    if (!/^(\d{4}|\w{3} \d{4}) — /.test(job.date)) {
      offenders.push(`${job.roleKey}: "${job.date}" does not start with "YYYY — " or "Mon YYYY — "`);
    }
    if (job.date.includes('–')) {
      offenders.push(`${job.roleKey}: en-dash in "${job.date}"`);
    }
  }
  // Assert
  assert.deepStrictEqual(offenders, [], 'Experience dates with wrong dash format');
});

test('general profile summary contains "enterprise-grade cloud data platforms" (no comma)', () => {
  // Arrange / Act / Assert
  assert.ok(
    GENERAL.summary.includes('enterprise-grade cloud data platforms'),
    'summary missing "enterprise-grade cloud data platforms"'
  );
});

test('general.html renders the contract profile it claims, not the full-time one', () => {
  // The regression guard for the mapping bug: the page and GENERAL must agree
  // on the facts a reader actually sees.
  const content = fs.readFileSync(path.join(ROOT, 'portfolio/audience/general.html'), 'utf8');

  // The contract target role is on the page...
  assert.ok(
    content.includes(GENERAL.targetRole),
    'general.html does not render the contract targetRole'
  );
  assert.ok(
    content.includes('Seeking a contract role'),
    'general.html does not signal contract availability'
  );

  // ...and it must not still be selling the full-time framing.
  assert.strictEqual(GENERAL.employmentType, 'contract');
  assert.ok(
    !content.includes('Technology Leader and Lead Developer'),
    'general.html still renders the job_application full-time summary'
  );
});

test('the general-audience page stays distinct from the data-engineer page', () => {
  // Two live URLs must not become near-duplicates: a recruiter comparing them
  // should see different framing, not a copy with a different title.
  const shared = (rel) =>
    fs
      .readFileSync(path.join(ROOT, rel), 'utf8')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const general = shared('portfolio/audience/general.html');
  const dataEng = shared('portfolio/audience/data-engineer.html');

  // The two pages must differ in the claims they make, not merely in wording.
  // Compare distinctive phrases rather than length: a length assertion would
  // only lock in an arbitrary character count, and it silently passed before
  // because one section heading is "Summary" and the other
  // "Professional Summary".
  const claims = [
    'RAG',      // AI/LLM depth -> belongs on the broad page
    'end to end', // cross-stack framing -> general
  ];

  for (const claim of claims) {
    assert.ok(
      general.includes(claim),
      `general.html is missing its own distinguishing claim "${claim}"`
    );
  }

  assert.ok(
    dataEng.includes('high-throughput curation'),
    'data-engineer.html lost its depth-specific framing'
  );
  assert.ok(
    !general.includes('high-throughput curation'),
    'general.html copied the data-engineer.html summary verbatim'
  );
  assert.ok(
    general !== dataEng && general.length > 0 && dataEng.length > 0,
    'both pages must be readable for this comparison to mean anything'
  );
});

/* ---------- audience page cross-check ---------- */

test('audience pages avoid all forbidden glossary terms', () => {
  // Arrange / Act
  const offenders = [];
  for (const rel of AUDIENCE_PAGES) {
    const content = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    for (const term of FORBIDDEN_ON_AUDIENCE) {
      if (content.includes(term)) {
        offenders.push(`${rel}: "${term}"`);
      }
    }
  }
  // Assert
  assert.deepStrictEqual(offenders, [], 'Forbidden terms on audience pages');
});

/* ---------- Phase-7 data-first agreement ---------- */

test('new audience pages contain the canonical leadershipPhilosophy text', () => {
  // Arrange / Act
  const offenders = [];
  for (const rel of NEW_AUDIENCE_PAGES) {
    const profile = CV_DATA.cvProfiles[profileKeyFromRel(rel)];
    const content = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    const philosophy = profile.leadershipPhilosophy.replace(/^"|"$/g, '');
    if (!content.includes(philosophy)) {
      offenders.push(`${rel}: leadershipPhilosophy not found`);
    }
  }
  // Assert
  assert.deepStrictEqual(offenders, [], 'leadershipPhilosophy missing from audience pages');
});

test('new audience pages contain every canonical stat value and label', () => {
  // Arrange / Act
  const offenders = [];
  for (const rel of NEW_AUDIENCE_PAGES) {
    const profile = CV_DATA.cvProfiles[profileKeyFromRel(rel)];
    const content = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    for (const stat of profile.stats) {
      if (!content.includes(stat.value)) {
        offenders.push(`${rel}: stat value "${stat.value}" not found`);
      }
      if (!content.includes(stat.label)) {
        offenders.push(`${rel}: stat label "${stat.label}" not found`);
      }
    }
  }
  // Assert
  assert.deepStrictEqual(offenders, [], 'Canonical stats missing from audience pages');
});

test('new audience pages contain every canonical skillsGrid category and skill', () => {
  // Arrange / Act
  const offenders = [];
  for (const rel of NEW_AUDIENCE_PAGES) {
    const profile = CV_DATA.cvProfiles[profileKeyFromRel(rel)];
    const content = decodeEntities(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
    for (const group of profile.skillsGrid) {
      if (!content.includes(group.category)) {
        offenders.push(`${rel}: category "${group.category}" not found`);
      }
      for (const skill of group.skills) {
        if (!content.includes(skill)) {
          offenders.push(`${rel}: skill "${skill}" not found`);
        }
      }
    }
  }
  // Assert
  assert.deepStrictEqual(offenders, [], 'Canonical skillsGrid missing from audience pages');
});

test('cover letters reference their canonical fact anchors', () => {
  // Arrange / Act
  const offenders = [];
  for (const [rel, anchors] of Object.entries(COVER_LETTER_ANCHORS)) {
    const content = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    for (const anchor of anchors) {
      if (!content.includes(anchor)) {
        offenders.push(`${rel}: missing anchor "${anchor}"`);
      }
    }
  }
  // Assert
  assert.deepStrictEqual(offenders, [], 'Cover letters missing canonical fact anchors');
});

test('older audience pages reference their canonical fact anchors', () => {
  // Arrange / Act
  const offenders = [];
  for (const [rel, anchors] of Object.entries(OLDER_AUDIENCE_ANCHORS)) {
    const content = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    for (const anchor of anchors) {
      if (!content.includes(anchor)) {
        offenders.push(`${rel}: missing anchor "${anchor}"`);
      }
    }
  }
  // Assert
  assert.deepStrictEqual(offenders, [], 'Older audience pages missing canonical fact anchors');
});

test('older audience pages contain every canonical stat value and label', () => {
  // Arrange / Act
  const offenders = [];
  for (const [rel, key] of Object.entries(OLDER_AUDIENCE_PROFILE_KEYS)) {
    const profile = CV_DATA.cvProfiles[key];
    const content = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    for (const stat of profile.stats) {
      if (!content.includes(stat.value)) {
        offenders.push(`${rel}: stat value "${stat.value}" not found`);
      }
      if (!content.includes(stat.label)) {
        offenders.push(`${rel}: stat label "${stat.label}" not found`);
      }
    }
  }
  // Assert
  assert.deepStrictEqual(offenders, [], 'Canonical stats missing from older audience pages');
});

test('every CV shell has a data-profile matching a canonical profile key', () => {
  // Arrange
  const shells = fs
    .readdirSync(path.join(ROOT, 'portfolio', 'cv'))
    .filter((f) => f.endsWith('.html'));
  // Act
  const offenders = [];
  for (const f of shells) {
    const content = fs.readFileSync(path.join(ROOT, 'portfolio', 'cv', f), 'utf8');
    const m = content.match(/data-profile="([^"]+)"/);
    if (!m) {
      offenders.push(`${f}: no data-profile attribute`);
      continue;
    }
    if (!CV_DATA.cvProfiles[m[1]]) {
      offenders.push(`${f}: unknown profile "${m[1]}"`);
    }
  }
  // Assert
  assert.strictEqual(shells.length, 17, 'expected 17 CV shells');
  assert.deepStrictEqual(offenders, [], 'CV shells with invalid data-profile');
});

test('no redacted personal/financial tokens appear in public pages or canonical data', () => {
  // Arrange
  const files = [
    ...AUDIENCE_PAGES,
    ...COVER_LETTERS,
    'index.html',
    'portfolio/index.html',
    'js/cv-data.js',
  ];
  // Act
  const offenders = [];
  for (const rel of files) {
    const content = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    for (const token of REDACTED_TOKENS) {
      if (content.includes(token)) {
        offenders.push(`${rel}: "${token}"`);
      }
    }
  }
  // Assert
  assert.deepStrictEqual(offenders, [], 'Redacted tokens found in public files');
});

test('an audience page that names a target role links to the CV that fills it', () => {
  // 12 of the 13 audience pages pair audience/<role>.html with cv/<role>.html.
  // general.html is the catch-all entry point, so nothing about its filename
  // pins it -- but once it states a target role, "View Full CV" has to lead to a
  // CV that actually targets that role, or the page contradicts its own CTA.
  const offenders = [];
  const pages = fs
    .readdirSync(path.join(ROOT, 'portfolio', 'audience'))
    .filter((f) => f.endsWith('.html'));

  for (const file of pages) {
    const rel = `portfolio/audience/${file}`;
    const html = fs.readFileSync(path.join(ROOT, rel), 'utf8');

    const stated = /Target role:\s*<strong>([\s\S]*?)<\/strong>/.exec(html);
    const cta = /href="\.\.\/cv\/([a-z_-]+)\.html" class="control-btn cta-btn"/.exec(html);
    if (!stated || !cta) continue; // pages that do not name a target role

    const statedRole = stated[1].replace(/\s+/g, ' ').trim();

    const cvRel = `portfolio/cv/${cta[1]}.html`;
    const cvHtml = fs.readFileSync(path.join(ROOT, cvRel), 'utf8');
    const profile = /data-profile="([a-z_]+)"/.exec(cvHtml);
    assert.ok(profile, `${cvRel}: no data-profile attribute`);

    const cvProfile = CV_DATA.cvProfiles[profile[1]];
    assert.ok(cvProfile, `${cvRel}: unknown profile "${profile[1]}"`);

    const cvRole = String(cvProfile.targetRole ?? '').replace(/\s+/g, ' ').trim();
    if (cvRole !== statedRole) {
      offenders.push(`${rel} states "${statedRole}" but its CTA opens ${cvRel} ("${cvRole}")`);
    }
  }

  assert.deepStrictEqual(offenders, [], 'audience pages whose CTA contradicts their stated target role');
});
