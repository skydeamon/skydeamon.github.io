#!/usr/bin/env node
/**
 * Spellcheck audit — runs hunspell over site content.
 *
 * Scope: all HTML files (visible text) + js/cv-data.js (content strings).
 * Code, tests, and scripts are intentionally excluded.
 *
 * Usage: npm run audit:spell
 * Requires: hunspell binary + an en-US dictionary.
 * Dictionary resolution order:
 *   1. $HUNSPELL_DICT env var (path without extension, e.g. /usr/share/hunspell/en_US)
 *   2. /usr/share/hunspell/en_US
 *   3. /usr/share/calibre/dictionaries/en-US/en-US
 *   4. /usr/lib/libreoffice/share/wordbook/en-US
 *
 * Unknown words are filtered against an allow-list of technical terms
 * (see ALLOW_LIST below). Anything else is reported with file context.
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');

/* ---------- dictionary resolution ---------- */

function findDict() {
  const candidates = [
    process.env.HUNSPELL_DICT,
    '/usr/share/hunspell/en_US',
    '/usr/share/calibre/dictionaries/en-US/en-US',
    '/usr/lib/libreoffice/share/wordbook/en-US',
  ].filter(Boolean);
  for (const base of candidates) {
    if (fs.existsSync(`${base}.dic`) && fs.existsSync(`${base}.aff`)) return base;
  }
  return null;
}

/* ---------- file walking (mirrors tests/helpers.js) ---------- */

function walk(dir, ext, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === '.opencode' || entry.name === 'node_modules' || entry.name === 'testenv') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, ext, out);
    else if (entry.name.endsWith(ext)) out.push(full);
  }
  return out;
}

/* ---------- text extraction ---------- */

function stripHtml(content) {
  return content
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

function extractJsStrings(content) {
  // Keep only string literals (the content-bearing parts of cv-data.js).
  const tokens = [];
  const re = /'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`/g;
  let m;
  while ((m = re.exec(content))) tokens.push(m[0]);
  return tokens.join(' ');
}

/** Drop underscore-delimited identifiers (e.g. om_de, data_engineering) so hunspell
 *  does not split them into false-positive fragments. */
function stripUnderscoreIdentifiers(text) {
  return text.replace(/\b[A-Za-z0-9]+(?:_[A-Za-z0-9]+)+\b/g, ' ');
}

/* ---------- allow-list ---------- */

const ALLOW_LIST = new Set(
  (
    'AWS S3 EMR Glue Redshift Athena Kafka Airflow DataOps Parquet Iceberg FastAPI LangChain LangGraph ' +
    'RAG LLM dbt PySpark CI CD SQL API ETL PoC QA DB2 Umuzi Ibitse Makwela Jade skydeamon GitHub ' +
    'TypeScript Node JSON HTML CSS JS SaaS MVP KPI SLA SLO IaC Terraform Docker Kubernetes Databricks ' +
    'Snowflake BigQuery Looker Tableau PowerBI Airbyte Fivetran Stitch Meltano Great Expectations Soda ' +
    'Monte Carlo OpenMetadata DataHub Amundsen Marquez Dagster Prefect Luigi Oozie NiFi Flume Spark ' +
    'Hadoop Hive Impala Presto Trino ClickHouse Druid Pinot StarRocks Doris Kinesis SQS SNS Lambda ' +
    'CloudFormation CDK SAM Lake Formation Spectrum EKS ECS Fargate EC2 VPC IAM Route53 CloudFront WAF ' +
    'Shield GuardDuty Inspector Config CloudTrail CloudWatch X-Ray CodePipeline CodeBuild CodeDeploy ' +
    'CodeCommit CodeArtifact CodeGuru DevOps GitOps FinOps SecOps MLOps ' +
    'BSc NSC PoC RAG QA DB2 ETL SQL API AWS S3 EMR Glue Redshift Athena Kafka Airflow DataOps ' +
    'Parquet Iceberg FastAPI LangChain LangGraph dbt PySpark CI CD SaaS MVP KPI SLA SLO IaC ' +
    'Terraform Docker Kubernetes Databricks Snowflake BigQuery Looker Tableau PowerBI ' +
    'TypeScript Node JSON HTML CSS JS GitHub Umuzi Ibitse Makwela Jade skydeamon ' +
    'medallion lakehouse observability orchestration ingestion curation ' +
    'agentic guardrails traceability auditability ' +
    'on-premises proof-of-concept data-quality ' +
    'AI LLM ML GenAI Copilot ChatGPT Claude Gemini OpenAI ' +
    'Alation Architected APIs backend backfills Cmd CTO Ctrl CVs deduping deduplicate devops ' +
    'ELT DS H1 H+1 Ibitse Umuzi Makwela Jade skydeamon ' +
    'Cape Town Johannesburg Pretoria Durban Stellenbosch ' +
    'Python PySpark SQL TypeScript Node.js JavaScript ' +
    'Ibitse Umuzi Makwela Jade skydeamon ' +
    'ai aws Eval FAISS fallbacks Flink github GitLab ibitse IEC infographic IoT Jira js ' +
    'Jupyter lakehouses learnings lifecycle linkedin LinkedIn llm makwela Matillion Matplotlib ' +
    'NumPy onboarding ong parseability pgvector Phusela Prototyped PRs pushdown RESTful ' +
    'Roadmapping rollout scalable SCD SciPy Sepedi SLAs Sotho SQLAlchemy standups templated ' +
    'Templated UCT Agentic agentic umuzi ' +
    // hunspell affix-splitting artifacts (from lineage/edge in concatenated text)
    'linea ge'
  ).split(/\s+/)
);

/* ---------- main ---------- */

const dict = findDict();
if (!dict) {
  console.error('No hunspell dictionary found. Install one or set HUNSPELL_DICT.');
  process.exit(1);
}

const htmlFiles = walk(ROOT, '.html');
const contentFiles = [...htmlFiles, path.join(ROOT, 'js', 'cv-data.js')];
const unknown = new Map(); // word -> Set of files

for (const file of contentFiles) {
  const rel = path.relative(ROOT, file);
  const content = fs.readFileSync(file, 'utf8');
  const text = file.endsWith('.html') ? stripHtml(content) : stripUnderscoreIdentifiers(extractJsStrings(content));

  const tmp = path.join(os.tmpdir(), `audit-spell-${path.basename(file)}.txt`);
  fs.writeFileSync(tmp, text);

  let output;
  try {
    output = execFileSync('hunspell', ['-d', dict, '-l', tmp], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  } catch (err) {
    output = err.stdout ? err.stdout.toString() : '';
  } finally {
    fs.unlinkSync(tmp);
  }

  const words = output.split('\n').map((w) => w.trim()).filter(Boolean);
  for (const word of words) {
    // Skip tokens that are not alphabetic words (emoji, hex colors, numbers, code).
    if (!/^[A-Za-z][A-Za-z'’-]*$/.test(word)) continue;
    if (ALLOW_LIST.has(word) || ALLOW_LIST.has(word.toLowerCase())) continue;
    if (!unknown.has(word)) unknown.set(word, new Set());
    unknown.get(word).add(rel);
  }
}

const sorted = [...unknown.entries()].sort((a, b) => a[0].localeCompare(b[0]));
if (sorted.length === 0) {
  console.log('Spellcheck passed — no unknown words.');
  process.exit(0);
}

console.log(`Spellcheck found ${sorted.length} unknown word(s):\n`);
for (const [word, files] of sorted) {
  console.log(`  ${word}  (${[...files].join(', ')})`);
}
console.log('\nAdd legitimate technical terms to ALLOW_LIST in scripts/audit-spell.js.');
process.exit(1);