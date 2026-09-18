/* ============================================
   CV DATA — single source of truth (Jade Makwela)
   UMD: browser -> window.CV_DATA
        Node.js -> module.exports
   ============================================ */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CV_DATA = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---------- Contact ---------- */
  const contact = {
    name: 'Jade Makwela',
    email: 'makwela.j.justice@gmail.com',
    linkedin: 'https://linkedin.com/in/jade-makwela-6a79111a8',
    github: 'https://github.com/skydeamon',
    location: 'Cape Town, South Africa',
  };

  /* ---------- Education ---------- */
  const education = [
    {
      degree: 'Bachelor of Science (BSc) in Physics and Astrophysics',
      school: 'University of Cape Town, South Africa',
      date: 'Feb 2015 — Nov 2017',
      details: 'Physics, Astrophysics, Mathematics, Applied Mathematics, Computer Science, Astronomy',
    },
    {
      degree: 'National Senior Certificate',
      school: 'Phusela High School',
      date: 'Jan 2009 — Dec 2014',
      details: 'Mathematics, Physical Science, English, Sepedi',
    },
  ];

  /* ---------- Canonical Experience (reverse chronological) ---------- */
  const experience = [
    {
      roleKey: 'ibitse',
      title: 'Lead Full Stack Developer',
      company: 'Ibitse',
      date: 'Jun 2025 — Present',
      location: 'Remote',
      bullets: [
        'Lead developer for a start-up organization; oversee development team and ensure successful delivery of high-quality software',
        'Architecture & Infrastructure: Design application architecture and set up infrastructure for scalable, secure deployments',
        'Project Management: Manage timelines, milestones, and deadlines for on-time delivery',
        'Development Standards: Establish coding standards, implement CI/CD pipelines, enforce Git best practices',
        'Stakeholder Engagement: Collaborate with stakeholders to align technical deliverables with business objectives',
        'Technologies: TypeScript, React Native, MySQL, PostgreSQL, Docker, Redis, MongoDB, Linux',
      ],
    },
    {
      roleKey: 'zelenial',
      title: 'Director & Property Portfolio Manager',
      company: 'Zelenial Group',
      date: 'Feb 2025 — Present',
      location: 'Cape Town, South Africa',
      bullets: [
        'Founded and direct a property investment and management company; sole director responsible for strategy, compliance, and portfolio performance',
        'Manage a 3-unit residential portfolio at 100% occupancy with RHA-compliant lease administration',
        'Completed the University of Cape Town Property Development & Investment short course (8 modules, marked assignments) covering NOI calculation, valuation, finance, and development planning',
        'Administer RHA-compliant leases: 12-month terms, 8% escalations, interest-bearing deposits, renewal process 60 days before expiry',
        'Oversee tenant screening (credit checks via TPN/Experian/TransUnion, income verification, rental references, FICA) and lease administration',
        'Manage external managing agents with commission reconciliation verified to 5% excl. VAT',
        'Investigate and resolve municipal account arrears (Ekurhuleni + City of Cape Town), identifying root causes and negotiating payment arrangements',
        'Track per-property P&L, portfolio cash flow, yield analysis (gross/net yield, ROI, LTV), and source-verified budget corrections',
      ],
    },
    {
      roleKey: 'om_lead',
      title: 'Lead Analyst Programmer / Data Engineer',
      company: 'Old Mutual South Africa',
      date: 'Oct 2023 — Present',
      location: 'Cape Town, Hybrid',
      bullets: [
        'Lead a team to produce data analytics solutions, data sources, and APIs feeding online applications and services',
        'Implement proof-of-concept evaluations of new technologies, transitioning them from experimental tools to production-ready services used by the business',
        'Own production PySpark pipelines on AWS EMR/Glue orchestrated via Airflow, delivering conformed datasets to Redshift/Athena',
        'Design and document data contracts, marts, and SCD Type 2 dimensions; publish dbt docs and lineage for downstream consumers',
        'Build FastAPI services to expose curated data; add request validation and response schema checks',
        'Impact: Improved critical pipeline runtime by 35% and reduced EMR compute costs by 22%',
        'Impact: Elevated data freshness from D+1 to H+1 via event-driven ingestion',
        'Impact: Increased critical data-quality coverage to 90%+ with dbt tests',
      ],
    },
    {
      roleKey: 'om_analyst',
      title: 'Analyst Programmer',
      company: 'Old Mutual South Africa',
      date: 'Dec 2022 — Oct 2023',
      location: 'Cape Town',
      bullets: [
        'Built ETL pipelines to lift from on-premises databases (DB2) to object stores (AWS S3)',
        'Transformed and cleaned data for business use; managed server administration',
        'Technologies: PySpark, Apache Airflow, Python, SQL, DynamoDB, S3, VPC, dbt, Git, GitHub',
      ],
    },
    {
      roleKey: 'om_de',
      title: 'Data Engineer',
      company: 'Old Mutual South Africa',
      date: 'Sep 2021 — Nov 2022',
      location: 'Cape Town',
      bullets: [
        'Built robust data pipelines to check data quality of processes in the golden layer of the medallion architecture',
        'Implemented checks for consistency, validity, and completeness of data',
        'Technologies: AWS, Apache Airflow, Apache Spark, Linux, Python, REST API Design',
      ],
    },
    {
      roleKey: 'umuzi',
      title: 'Data Engineer (Internship)',
      company: 'Umuzi.org',
      date: 'Dec 2020 — Sep 2021',
      location: 'Johannesburg',
      bullets: [
        'Built RESTful APIs (Django/FastAPI) exposing backend data to front-end applications',
        'Collaborated on data wrangling pipelines and basic analytics endpoints',
        'Technologies: Python, JavaScript, Java, SQLAlchemy, MySQL, Django, FastAPI, Git, HTML5, CSS',
      ],
    },
  ];

  /* ---------- Skills (master categories) ---------- */
  const skills = {
    programming: {
      title: 'Programming & Scripting',
      tags: ['Python', 'SQL', 'PySpark', 'Java', 'TypeScript', 'JavaScript', 'HTML5/CSS', 'Bash'],
      primary: ['Python', 'SQL', 'PySpark'],
    },
    cloud_aws: {
      title: 'Cloud & Infrastructure',
      tags: ['AWS EMR', 'AWS Glue', 'AWS Redshift', 'AWS S3', 'AWS Athena', 'AWS Lambda', 'AWS EC2', 'AWS DynamoDB', 'AWS IAM', 'AWS VPC', 'Docker'],
      primary: ['AWS EMR', 'AWS Glue', 'AWS Redshift', 'AWS S3'],
    },
    data_engineering: {
      title: 'Data & Analytics',
      tags: ['Apache Airflow', 'Apache Kafka', 'dbt', 'Apache Flink', 'Medallion Architecture', 'SCD Type 2', 'Data Quality'],
      primary: ['Apache Airflow', 'Apache Kafka'],
    },
    frameworks: {
      title: 'Frameworks & Tools',
      tags: ['FastAPI', 'Django', 'LangChain', 'Git/GitHub', 'Azure DevOps', 'Jira', 'Alation', 'Matillion'],
      primary: [],
    },
    databases: {
      title: 'Databases',
      tags: ['Redshift', 'Athena', 'DynamoDB', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'DB2', 'SQLAlchemy'],
      primary: [],
    },
    devops: {
      title: 'DevOps',
      tags: ['Git', 'GitHub', 'GitLab', 'Azure DevOps', 'AWS CodePipeline', 'Docker', 'Terraform', 'Linux', 'Jira', 'Agile/Scrum'],
      primary: [],
    },
    ai_llm: {
      title: 'AI/LLM',
      tags: ['RAG', 'Function Calling', 'Prompt Engineering', 'Vector Search (FAISS, pgvector)', 'Evaluation Harnesses', 'Guardrails'],
      primary: ['RAG', 'Function Calling'],
    },
  };

  /* ---------- Projects ---------- */
  const projects = [
    {
      title: 'Agentic RAG LLM Demo',
      url: 'https://github.com/skydeamon/agentic-rag-llm-demo',
      description:
        'FastAPI endpoint with retrieval pipeline (vector index + metadata filters). Templated prompts with deterministic output schema. Basic evaluation harness for regression testing of responses. Function-calling pattern with LangChain/LangGraph for structured queries.',
      tech: ['Python', 'FastAPI', 'LangChain', 'RAG', 'LLM'],
    },
    {
      title: 'High-Throughput PySpark Curation on EMR/Glue',
      description:
        'Architected and optimized PySpark jobs to cleanse, deduplicate, and conform multi-TB datasets into columnar Parquet/Iceberg tables on S3 with Athena/Trino access. Added window-based deduping, semantic validations, and incremental MERGE patterns.',
      tech: ['PySpark', 'AWS EMR', 'Iceberg', 'Athena'],
    },
    {
      title: 'Event-Driven Ingestion with Kafka → Lakehouse',
      description:
        'Designed Kafka-first ingestion for priority domains with idempotent S3 landing, watermarking for late events, and Airflow-managed replay. Improved freshness to H+1 while maintaining deterministic batch reprocessing for backfills.',
      tech: ['Kafka', 'EMR', 'Airflow', 'S3'],
    },
    {
      title: 'Data Contracts & Quality Gates for Analytics/ML',
      description:
        'Introduced dbt source freshness and column contracts, added tests (uniqueness, referential integrity, accepted_values), and blocked publishes on failures. Enabled dependable downstream consumption for analytics and ML feature pipelines.',
      tech: ['dbt', 'Glue Catalog', 'Athena', 'Airflow', 'CloudWatch'],
    },
    {
      title: 'Zelenial Portfolio Analytics & Compliance',
      description:
        'Built the operating model for a 3-unit residential portfolio at 100% occupancy: per-property P&L, portfolio cash-flow tracking, yield analysis (gross/net yield, ROI, LTV), source-verified budget corrections, and RHA-compliant lease administration.',
      tech: ['Property Analytics', 'Yield Analysis', 'RHA Compliance'],
    },
    {
      title: 'Ibitse Platform Architecture & GTM',
      description:
        'Designed the lift-sharing platform for the Limpopo↔Gauteng corridor: 38-person org blueprint, 10-template contract library, 7-document phantom share scheme, and a 10-persona + 13-competitor research base driving a D1–D8 GTM playbook.',
      tech: ['Platform Architecture', 'Org Design', 'GTM Research'],
    },
    {
      title: 'POPIA & B-BBEE Compliance Programme',
      description:
        'Established a POPIA 10-document library and B-BBEE Level 2 / 52% Black-owned scorecard across two businesses, plus an LRA s200A contractor classification framework (8-document deemed-employment pack and 25-question assessment tool).',
      tech: ['POPIA', 'B-BBEE', 'LRA s200A'],
    },
  ];

  /* ---------- Certifications ---------- */
  const certifications = [
    { icon: '☁️', title: 'AWS Cloud Practitioner', detail: 'Amazon Web Services — Self-study' },
    { icon: '📊', title: 'dbt Fundamentals', detail: 'dbt Labs — Online course' },
    { icon: '🤖', title: 'LangChain & LLM Application Patterns', detail: 'Self-study — PoC development' },
  ];

  /* ---------- Languages ---------- */
  const languages = [
    { name: 'English', level: 'Professional Working Proficiency' },
    { name: 'Sepedi (Northern Sotho)', level: 'Native Speaker' },
  ];

  /* ---------- Affiliations ---------- */
  const affiliations = [
    'Umuzi.org — Alumni & Mentor (2020 — Present)',
    'Open Source Contributor — GitHub (skydeamon)',
    'University of Cape Town — Alumni',
  ];

  /* ---------- Interests ---------- */
  const interests = ['Data Engineering', 'AI/LLM Research', 'Open Source', 'Astrophysics', 'Cloud Architecture', 'IoT'];

  /* ---------- Shared section content ---------- */
  const sharedSections = {
    impactHighlights: [
      '<strong>35% pipeline runtime reduction</strong> and <strong>22% EMR compute cost savings</strong> via partition pruning, predicate pushdown, and join tuning',
      '<strong>Freshness D+1 → H+1</strong> with event-driven ingestion and robust late-arrival handling',
      '<strong>90%+ data-quality coverage</strong> via dbt source/column contracts and tests (not_null, unique, relationships)',
      '<strong>Deployment: days → hours</strong> with standardized CI/CD (ADO/Git + CodePipeline) and safe rollout/rollback',
    ],
    services: [
      {
        title: 'Data Engineering',
        tags: ['ETL/ELT Pipeline Development', 'Data Warehouse Design', 'Lakehouse Architecture', 'Streaming Ingestion', 'Data Quality & Governance'],
        primary: ['ETL/ELT Pipeline Development', 'Data Warehouse Design'],
      },
      {
        title: 'AI/LLM Services',
        tags: ['RAG Pipeline Development', 'LLM Data Preparation', 'AI Training Data Curation', 'Evaluation Harnesses'],
        primary: ['RAG Pipeline Development', 'LLM Data Preparation'],
      },
      {
        title: 'Cloud & Infrastructure',
        tags: ['AWS Architecture', 'CI/CD Setup', 'Infrastructure as Code', 'Cost Optimization'],
        primary: ['AWS Architecture'],
      },
      {
        title: 'Consulting',
        tags: ['Data Strategy', 'Architecture Reviews', 'Team Mentoring', 'proof-of-concept'],
        primary: [],
      },
    ],
  };

  /* ---------- CV Profiles ---------- */
  const cvProfiles = {
    /* ---- General / Job Application ---- */
    job_application: {
      theme: 'general',
      subtitle: 'Senior Data Engineer · AI/LLM Practitioner · Full Stack Developer',
      employmentType: 'full-time',
      availability: [
        { label: 'Availability', value: 'Full-time employment' },
        { label: 'Location', value: 'Cape Town, South Africa (Remote-friendly)' },
        { label: 'Work Authorization', value: 'South African Citizen' },
      ],
      summary:
        'Experienced Technology Leader and Lead Developer with <strong>5+ years</strong> building enterprise-grade data platforms and applications on AWS. Proficient in Python, PySpark, and ETL development with deep expertise in AWS services (EMR, Glue, Redshift, Athena, Lambda, Step Functions). Delivers measurable impact: <strong>35% pipeline runtime reduction</strong>, <strong>22% EMR compute cost savings</strong>, and <strong>90%+ data-quality coverage</strong> on business-critical pipelines. Currently leading a team of analysts at Old Mutual while serving as Lead Full Stack Developer at a start-up. Beyond employment, I founded two companies — Ibitse (Pty) Ltd and Zelenial Group — where I designed the operations, compliance, and engineering standards that keep both businesses running. Strong in software architecture, infrastructure setup, and full-stack application development. I\'m driven by turning complex data problems into robust, cloud-ready solutions that move the business forward.',
      sectionOrder: ['summary', 'stats', 'skills-grid', 'impact-highlights', 'experience', 'projects', 'education', 'certifications', 'languages', 'affiliations', 'interests', 'availability', 'references'],
      skills: ['programming', 'cloud_aws', 'data_engineering', 'frameworks', 'databases', 'devops', 'ai_llm'],
      stats: [
        { value: 'H+1', label: 'Data Freshness' },
        { value: '35%', label: 'Pipeline Runtime Reduction' },
        { value: '22%', label: 'Compute Cost Savings' },
        { value: '90%+', label: 'Data Quality Coverage' },
      ],
      impactHighlights: [
        '<strong>35% pipeline runtime reduction</strong> and <strong>22% EMR compute cost savings</strong> via partition pruning, predicate pushdown, and join tuning',
        '<strong>Freshness D+1 → H+1</strong> with event-driven ingestion and robust late-arrival handling',
        '<strong>90%+ data-quality coverage</strong> via dbt source/column contracts and tests (not_null, unique, relationships)',
        '<strong>Founded two companies</strong> — Ibitse (Pty) Ltd and Zelenial Group — bootstrapped with zero external funding',
      ],
      experienceBullets: {
        ibitse: [
          '<strong>Full Stack Development:</strong> Lead Full Stack Developer at a start-up — TypeScript/Node backend services, React front-end, MySQL/PostgreSQL, Docker, and CI/CD standards',
          '<strong>Entrepreneurship:</strong> Co-founded Ibitse (Pty) Ltd — lift-sharing platform — bootstrapped with zero external funding; designed a 38-person org blueprint and 10-template contract library',
          '<strong>Operations Design:</strong> Established engineering standards (coding guidelines, CI/CD, Git branching) and aligned technical delivery with stakeholder expectations',
        ],
        zelenial: [
          '<strong>Business Operations:</strong> Founded Zelenial Group (Pty) Ltd — property management — and built the operating model: tenant screening SOP, RHA-compliant lease administration, and per-property P&L',
          '<strong>Compliance:</strong> POPIA 10-document library, B-BBEE Level 2 scorecard, and LRA s200A contractor classification assessment',
        ],
      },
    },

    /* ---- Data Engineer ---- */
    data_engineer: {
      theme: 'data-engineer',
      subtitle: 'Senior Data Engineer — AWS, PySpark & Data Platforms',
      employmentType: 'contract',
      availability: [],
      targetRole: 'Senior Data Engineer — AI Training Data (Contract)',
      summary:
        'Senior Data Engineer with <strong>5+ years</strong> building enterprise-grade cloud data platforms on AWS using Python, PySpark, EMR/Glue, Redshift, and Athena. Proven impact: <strong>35% pipeline runtime reduction</strong>, <strong>22% EMR compute cost savings</strong>, <strong>freshness D+1 → H+1</strong>, and <strong>90%+ data-quality coverage</strong> via dbt contracts, tests, and Airflow monitors. Experienced in medallion/lakehouse patterns (Parquet/Iceberg), large-scale batch and streaming, Kafka-driven ingestion, and DataOps (CI/CD, testing, observability). Seeking a contract role to architect and build high-throughput curation systems for AI-training datasets. I care deeply about data quality — building pipelines that others can reliably depend on is what gets me excited.',
      sectionOrder: ['target-role', 'summary', 'stats', 'skills-grid', 'impact-highlights', 'experience', 'projects', 'education', 'certifications', 'languages', 'affiliations', 'availability', 'references'],
      skills: ['programming', 'cloud_aws', 'data_engineering', 'frameworks', 'databases', 'devops', 'ai_llm'],
      stats: [
        { value: '35%', label: 'Pipeline Runtime Reduction' },
        { value: '22%', label: 'Compute Cost Savings' },
        { value: '90%+', label: 'Data Quality Coverage' },
        { value: 'H+1', label: 'Data Freshness' },
      ],
      impactHighlights: [
        '<strong>35% pipeline runtime reduction</strong> via partition pruning, predicate pushdown, and join tuning on PySpark/EMR',
        '<strong>22% monthly compute cost reduction</strong> through optimization of EMR cluster usage and job efficiency',
        '<strong>Data freshness D+1 → H+1</strong> by moving priority domains to event-driven/near-real-time ingestion (Kafka → EMR)',
        '<strong>90%+ critical data-quality coverage</strong> by implementing dbt tests (not_null, unique, relationships) and Airflow monitors',
        '<strong>Deployment lead time: days → hours</strong> by standardizing CI/CD for data (ADO/Git + CodePipeline) with blue/green validation',
      ],
      experienceBullets: {
        om_lead: [
          '<strong>Data Pipelines:</strong> Owned and operated business-critical PySpark data pipelines on AWS EMR/Glue with Airflow orchestration, delivering conformed datasets to Redshift and Athena',
          '<strong>Streaming:</strong> Designed Kafka-enabled ingestion patterns and idempotent S3 landing with deterministic keys; implemented late-arrival handling and replay strategies',
          '<strong>Lakehouse:</strong> Applied lakehouse practices on S3 with Parquet/Iceberg tables accessible via Athena/Trino; optimized file sizes, partitioning, and metadata for pruning',
          '<strong>DataOps:</strong> Instituted guardrails: Git PRs, slim CI for dbt (state:modified), automated tests in CI/CD, CloudWatch metrics/alarms, and dataset SLAs',
          '<strong>Modeling:</strong> Partnered with analysts and data scientists to define grains, marts, and SCD Type 2 dimensions; documented lineage/definitions in dbt docs and Alation',
          '<strong>APIs:</strong> Built FastAPI services to expose curated data; added request validation and response schema checks',
          '<strong>Technologies:</strong> AWS Glue, EMR, S3, Redshift, Athena, Lambda, Step Functions, IAM, VPC, Python, PySpark, Airflow, Kafka, dbt, Docker, Terraform (exposure)',
        ],
        ibitse: [
          'Led engineering standards (coding guidelines, CI/CD, Git) and contributed to backend services (Node.js/TypeScript) interfacing with data services and APIs',
          'Designed cloud-ready infrastructure and ensured alignment between technical delivery and stakeholder expectations',
          'Technologies: TypeScript, React Native, MySQL, PostgreSQL, Docker, Redis, MongoDB, Linux',
        ],
        umuzi: [
          'Built RESTful APIs and supported data wrangling pipelines; early exposure to containerized workflows and version-controlled deployments',
          'Technologies: Python, Django, FastAPI, SQLAlchemy, MySQL, JavaScript, Java, Git, HTML5, CSS',
        ],
      },
    },

    /* ---- AI Engineer ---- */
    ai_engineer: {
      theme: 'ai-engineer',
      subtitle: 'Senior Data / AI Engineer — LLM Applications & Data Platforms',
      employmentType: 'contract',
      availability: [],
      summary:
        'Senior data/AI engineer with <strong>5+ years</strong> building production data platforms and APIs on AWS using Python, PySpark, EMR/Glue, Redshift, Athena, and Airflow. Record of measurable impact: <strong>35% pipeline runtime reduction</strong>, <strong>22% compute cost savings</strong>, and <strong>90%+ data-quality coverage</strong> sustaining analytics and ML features. Hands-on with <strong>LLM application patterns</strong> (RAG, function calling, prompt strategies, basic guardrails) and FastAPI integration. Known for end-to-end ownership and cross-functional collaboration with product/analyst teams. Seeking to apply agentic workflows, RAG pipelines, and evaluation practices to deliver safe, traceable AI features in clinical and education contexts — motivated by AI that people can actually depend on.',
      sectionOrder: ['summary', 'stats', 'skills-grid', 'impact-highlights', 'experience', 'projects', 'healthcare-compliance', 'education', 'certifications', 'languages', 'affiliations', 'availability', 'references'],
      skills: ['programming', 'cloud_aws', 'data_engineering', 'frameworks', 'databases', 'devops', 'ai_llm'],
      stats: [
        { value: '35%', label: 'Pipeline Runtime Reduction' },
        { value: '22%', label: 'Compute Cost Savings' },
        { value: '90%+', label: 'Data Quality Coverage' },
        { value: 'H+1', label: 'Data Freshness' },
      ],
      impactHighlights: [
        '<strong>35% pipeline runtime reduction</strong> and <strong>22% EMR compute cost savings</strong> via partition pruning, predicate pushdown, and join tuning',
        '<strong>Freshness D+1 → H+1</strong> with event-driven ingestion and robust late-arrival handling',
        '<strong>90%+ data-quality coverage</strong> via dbt source/column contracts and tests (not_null, unique, relationships)',
        '<strong>Deployment: days → hours</strong> with standardized CI/CD (ADO/Git + CodePipeline) and safe rollout/rollback',
      ],
      experienceBullets: {
        om_lead: [
          'Owned production PySpark pipelines on AWS EMR/Glue orchestrated via Airflow, delivering conformed datasets to Redshift/Athena for analytics and ML features',
          'Designed and documented data contracts, marts, and SCD Type 2 dimensions; published dbt docs and lineage for downstream consumers and auditability',
          'Built FastAPI services to expose curated data and enable downstream applications; added request validation and response schema checks',
          'Partnered with analysts/DS to prototype LLM-ready datasets and retrieval indexes for future RAG use; introduced evaluation harnesses to compare prompt variants (format and basic factual checks)',
          'Technologies: Python, PySpark, AWS EMR/Glue/S3/Redshift/Athena, Airflow, Kafka, dbt, FastAPI, Docker, Terraform',
        ],
        ibitse: [
          'Led engineering standards (coding conventions, CI/CD, Git branching) and contributed to backend services (TypeScript/Node) integrating with data/AI endpoints',
          'Aligned product and engineering on release scope and acceptance criteria; introduced lightweight service contracts and API tests to reduce regressions',
        ],
        umuzi: [
          'Built RESTful APIs (Django/FastAPI) exposing backend data to front-end apps; collaborated on data wrangling pipelines and basic analytics endpoints',
        ],
      },
      healthcareCompliance: [
        '<strong>Quality mindset:</strong> Documentation, contracts, tests, and reproducible deployments; audit-friendly lineage and exposure metadata',
        '<strong>Safety practices:</strong> Controlled prompts/context, schema validation, explicit fallbacks, and logging to support traceability of AI-assisted features',
        '<strong>Familiarity (self-study):</strong> IEC 62304/ISO 13485 expectations around software lifecycle, documentation, and verification/validation workflows',
      ],
    },

    /* ---- Academic ---- */
    academic: {
      theme: 'academic',
      subtitle: 'Bachelor of Science (BSc) in Physics and Astrophysics · Data Engineering Researcher',
      employmentType: 'full-time',
      availability: [],
      summary:
        'Data engineering researcher with a BSc in Physics & Astrophysics and <strong>5+ years</strong> building production data platforms on AWS. Delivers measurable results: <strong>35% pipeline runtime reduction</strong> and <strong>data freshness improved from daily to hourly</strong> on business-critical pipelines. Research interests span machine learning infrastructure, LLM applications & RAG, and data quality & governance. Experienced in mentoring aspiring data engineers and publishing technical documentation for enterprise data platforms. Curiosity about how data systems behave — and teaching that curiosity to the next generation of engineers — keeps me engaged.',
      researchInterests: ['Data Engineering', 'Machine Learning Infrastructure', 'LLM Applications & RAG', 'Astrophysics Data Analysis', 'Distributed Computing', 'Data Quality & Governance', 'Streaming Data Systems'],
      sectionOrder: ['summary', 'stats', 'research-interests', 'skills-grid', 'impact-highlights', 'experience', 'projects', 'publications', 'teaching', 'research-projects', 'education', 'certifications', 'languages', 'affiliations', 'availability', 'references'],
      skills: ['programming', 'cloud_aws', 'data_engineering', 'frameworks', 'databases', 'devops', 'ai_llm'],
      stats: [
        { value: '5+', label: "Years' Experience" },
        { value: '35%', label: 'Pipeline Runtime Reduction' },
        { value: 'H+1', label: 'Data Freshness' },
        { value: '90%+', label: 'Data Quality Coverage' },
      ],
      impactHighlights: [
        '<strong>35% pipeline runtime reduction</strong> via partition pruning, predicate pushdown, and join tuning on PySpark/EMR',
        '<strong>Data freshness D+1 → H+1</strong> by moving priority domains to event-driven ingestion',
        '<strong>90%+ critical data-quality coverage</strong> via dbt contracts and tests',
        '<strong>Mentoring & knowledge sharing</strong> — leading analysts and mentoring aspiring data engineers at Umuzi.org',
      ],
      experienceBullets: {
        om_lead: [
          'Lead a team producing data analytics solutions, data sources, and APIs for business applications',
          'Owned production PySpark pipelines on AWS EMR/Glue with Airflow orchestration',
          'Designed data contracts, marts, and SCD Type 2 dimensions; published dbt docs and lineage',
          'Built FastAPI services exposing curated data with validation and schema checks',
          'Prototyped LLM-ready datasets and retrieval indexes for RAG applications',
          'Introduced evaluation harnesses comparing prompt variants with factual checks',
        ],
        ibitse: [
          'Led engineering standards and contributed to backend services (TypeScript/Node)',
          'Aligned product and engineering on release scope and acceptance criteria',
        ],
        umuzi: [
          'Built RESTful APIs (Django/FastAPI) exposing backend data to front-end applications',
          'Collaborated on data wrangling pipelines and analytics endpoints',
        ],
      },
      publications: [
        {
          title: 'Building a RAG Pipeline on AWS: Lessons from a PoC',
          description:
            'Technical write-up documenting the architecture, challenges, and learnings from implementing a Retrieval-Augmented Generation pipeline using FastAPI, LangChain, and vector search on AWS infrastructure. (In progress)',
          tech: ['RAG', 'AWS', 'FastAPI'],
        },
        {
          title: 'Data Quality Gates in Medallion Architecture',
          description:
            'Internal technical documentation on implementing dbt tests, data contracts, and quality gates across bronze/silver/gold layers for enterprise data platforms. (Internal at Old Mutual)',
          tech: ['dbt', 'Data Quality', 'Medallion'],
        },
        {
          title: 'Competitive Intelligence as a Research Method',
          description:
            'Methodology write-up on building a 13-competitor register: data sources, price-point benchmarking, corridor overlap analysis, and how the framework generalizes to other markets. (In progress)',
          tech: ['Competitive Intelligence', 'Research Methods'],
        },
      ],
      researchProjects: [
        {
          title: 'Agentic RAG LLM Demo',
          url: 'https://github.com/skydeamon/agentic-rag-llm-demo',
          description:
            'FastAPI endpoint with retrieval pipeline (vector index + metadata filters). Templated prompts with deterministic output schema. Evaluation harness for regression testing. Function-calling with LangChain/LangGraph.',
          tech: ['Python', 'FastAPI', 'LangChain', 'RAG'],
        },
        {
          title: 'High-Throughput PySpark Curation on EMR/Glue',
          description:
            'Architected PySpark jobs to cleanse, deduplicate, and conform multi-TB datasets into Parquet/Iceberg tables. Window-based deduping, semantic validations, incremental MERGE patterns.',
          tech: ['PySpark', 'EMR', 'Iceberg'],
        },
        {
          title: 'Event-Driven Ingestion with Kafka → Lakehouse',
          description:
            'Kafka-first ingestion with idempotent S3 landing, watermarking for late events, and Airflow-managed replay. Improved freshness to H+1.',
          tech: ['Kafka', 'EMR', 'Airflow'],
        },
        {
          title: 'Corridor Intelligence Field Research',
          description:
            'Primary field research on the Limpopo ↔ Gauteng commuter corridor: 1.2M+ trips/year, R90B+ minibus-taxi industry, regulatory complexity, and route-demand analysis informing GTM sequencing.',
          tech: ['Field Research', 'Competitive Intelligence', 'GTM'],
        },
        {
          title: 'Competitive Intelligence Register',
          description:
            'Built and maintained a 13-competitor register covering minibus taxis, regional airlines, and ride-hailing platforms — price-point benchmarking, corridor overlap analysis, and positioning gaps.',
          tech: ['Competitive Intelligence', 'Benchmarking'],
        },
        {
          title: 'UCT Property Development & Investment (PDI)',
          description:
            'Completed the 8-module UCT PDI short course with graded assignments (67% and 80%); produced an NOI Calculator and applied cap-rate methodology (gross/net yield, ROI, LTV) across real and academic scenarios.',
          tech: ['NOI', 'Valuation', 'Cap Rate'],
        },
      ],
      teaching: [
        '<strong>Umuzi.org Alumni Mentor</strong> — Mentoring aspiring data engineers in Python, SQL, and API development (2020 — Present)',
        '<strong>Team Lead & Technical Mentor</strong> — Leading a team of analysts at Old Mutual; mentoring in PySpark, dbt, and data modeling best practices',
        '<strong>Knowledge Sharing</strong> — Internal technical documentation and lineage publishing for downstream consumers',
        '<strong>Research Methodology Mentor</strong> — Documenting corridor-intelligence and competitive-intelligence methods (field observation, price benchmarking, positioning analysis) as reusable research frameworks',
      ],
    },

    /* ---- Executive ---- */
    executive: {
      theme: 'executive',
      subtitle: 'Technology Leader · Data Platform Strategist · Engineering Manager',
      employmentType: 'full-time',
      availability: [],
      summary:
        'Technology leader with <strong>5+ years</strong> of experience spanning data engineering, software architecture, and team leadership. Currently leading a team of analysts at Old Mutual while serving as Lead Full Stack Developer for a start-up. Delivers measurable outcomes: <strong>deployment lead time cut from days to hours</strong>, <strong>data freshness improved from D+1 to H+1</strong>, and <strong>90%+ data-quality coverage</strong> across governed pipelines. Proven ability to translate business requirements into scalable technical solutions, establish engineering standards, and drive business results. Combines deep technical expertise in AWS, Python, and data platforms with strong stakeholder management and strategic thinking — clear standards, measurable outcomes, and psychological safety are how great engineering organizations get built.',
      leadershipPhilosophy:
        '"Great engineering organizations are built on three pillars: <strong>clear standards</strong> that everyone follows, <strong>measurable outcomes</strong> that everyone understands, and <strong>psychological safety</strong> that enables everyone to contribute. My role as a leader is to create the conditions where talented people do their best work — then get out of their way."',
      sectionOrder: ['summary', 'stats', 'leadership-philosophy', 'skills-grid', 'impact-highlights', 'experience', 'projects', 'education', 'certifications', 'languages', 'affiliations', 'availability', 'references'],
      skills: ['programming', 'cloud_aws', 'data_engineering', 'frameworks', 'databases', 'devops', 'ai_llm'],
      stats: [
        { value: '35%', label: 'Pipeline Runtime Reduction' },
        { value: '22%', label: 'Compute Cost Savings' },
        { value: '90%+', label: 'Data Quality Coverage' },
        { value: 'Days → Hours', label: 'Deployment Lead Time' },
      ],
      impactHighlights: [
        '<strong>Led team of analysts</strong> producing data analytics solutions and APIs for business applications',
        '<strong>Established engineering standards</strong> (coding conventions, CI/CD, Git branching) adopted across the team',
        '<strong>Reduced deployment lead time from days to hours</strong> through standardized CI/CD with safe rollout/rollback',
        '<strong>Improved data freshness from D+1 to H+1</strong> via event-driven architecture decisions',
        '<strong>Drove 90%+ data-quality coverage</strong> through dbt contracts, tests, and governance practices',
        '<strong>Founded two companies</strong> — Ibitse (Pty) Ltd and Zelenial Group — bootstrapped with zero external funding',
        '<strong>Built a 3-unit property portfolio</strong> at 100% occupancy with RHA-compliant lease administration',
      ],
      experienceBullets: {
        om_lead: [
          '<strong>Leadership:</strong> Lead a team producing data analytics solutions, data sources, and APIs feeding online applications and services',
          '<strong>Strategy:</strong> Implement proof-of-concept evaluations of new technologies, transitioning them from experimental tools to production-ready services used by the business',
          '<strong>Architecture:</strong> Own production PySpark pipelines on AWS EMR/Glue with Airflow orchestration, delivering conformed datasets to Redshift/Athena',
          '<strong>Standards:</strong> Design and document data contracts, marts, and SCD Type 2 dimensions; publish dbt docs and lineage for downstream consumers',
          '<strong>Innovation:</strong> Prototype LLM-ready datasets and retrieval indexes for RAG applications; introduce evaluation harnesses',
          '<strong>Impact:</strong> 35% pipeline runtime reduction, 22% cost savings, 90%+ data-quality coverage, H+1 freshness',
        ],
        ibitse: [
          '<strong>Leadership:</strong> Oversee development team and ensure successful delivery of high-quality software solutions',
          '<strong>Architecture:</strong> Design application architecture and infrastructure for scalable, secure deployments',
          '<strong>Delivery:</strong> Manage project timelines, milestones, and deadlines for on-time delivery',
          '<strong>Standards:</strong> Establish coding standards, implement CI/CD pipelines, enforce Git best practices',
          '<strong>Stakeholders:</strong> Align technical deliverables with business objectives and design specifications',
        ],
        om_analyst: [
          'Built ETL pipelines from on-premises databases (DB2) to AWS S3 with transformation and cleaning',
          'Managed server administration and data infrastructure',
        ],
        om_de: [
          'Built robust data pipelines for data quality checks in the golden layer of medallion architecture',
          'Implemented consistency, validity, and completeness checks',
        ],
        umuzi: [
          'Built RESTful APIs (Django/FastAPI) exposing backend data to front-end applications',
          'Collaborated on data wrangling pipelines and analytics endpoints',
        ],
        zelenial: [
          '<strong>Founder & Director:</strong> Sole director of Zelenial Group (Pty) Ltd — property investment and management company; responsible for strategy, governance, and portfolio performance',
          '<strong>Portfolio Governance:</strong> Manage a 3-unit residential portfolio at 100% occupancy; per-property P&L and portfolio cash-flow tracking',
          '<strong>Compliance Oversight:</strong> RHA-compliant lease administration (written leases, interest-bearing deposits, 14-day return), POPIA 10-document library, and B-BBEE Level 2 / 52% Black-owned scorecard',
          '<strong>Financial Accountability:</strong> Source-verified budget corrections (levy and rates) ensuring P&L reflects actuals, not estimates',
        ],
      },
    },

    /* ---- Freelance ---- */
    freelance: {
      theme: 'freelance',
      subtitle: 'Freelance Data Engineer & AI Consultant',
      employmentType: 'contract',
      availability: [],
      rate: 'R550–R640/hr',
      summary:
        'Senior Data Engineer with <strong>5+ years</strong> building enterprise-grade data platforms on AWS. Specializing in <strong>PySpark pipelines, lakehouse architecture, streaming ingestion, and AI/LLM data preparation</strong>. Proven track record of delivering measurable impact: 35% pipeline runtime reduction, 22% cost savings, and 90%+ data-quality coverage — plus hands-on property consulting (portfolio analysis, yield/ROI, RHA-compliant lease administration) for clients needing asset-level financial rigour.',
      sectionOrder: ['summary', 'stats', 'skills-grid', 'services', 'impact-highlights', 'experience', 'projects', 'education', 'certifications', 'languages', 'affiliations', 'availability', 'references'],
      skills: ['programming', 'cloud_aws', 'data_engineering', 'frameworks', 'databases', 'devops', 'ai_llm'],
      stats: [
        { value: '35%', label: 'Pipeline Runtime Reduction' },
        { value: '22%', label: 'Compute Cost Savings' },
        { value: '90%+', label: 'Data Quality Coverage' },
        { value: 'H+1', label: 'Data Freshness' },
      ],
      services: sharedSections.services.concat([
        {
          title: 'Property Consulting',
          tags: ['Portfolio Analysis', 'Yield & ROI Analysis', 'RHA-Compliant Lease Administration', 'Tenant Screening', 'Property P&L'],
          primary: ['Portfolio Analysis', 'Yield & ROI Analysis'],
        },
      ]),
      impactHighlights: sharedSections.impactHighlights,
      experienceBullets: {
        om_lead: [
          'Owned production PySpark pipelines on AWS EMR/Glue with Airflow orchestration',
          'Designed Kafka-enabled ingestion with idempotent S3 landing and replay strategies',
          'Applied lakehouse practices with Parquet/Iceberg tables via Athena/Trino',
          'Instituted DataOps guardrails: Git PRs, dbt CI, CloudWatch metrics, dataset SLAs',
          'Built FastAPI services exposing curated data with validation and schema checks',
          'Prototyped LLM-ready datasets and retrieval indexes for RAG applications',
        ],
        ibitse: [
          'Led engineering standards and contributed to backend services (TypeScript/Node)',
          'Designed cloud-ready infrastructure aligned with stakeholder expectations',
        ],
        umuzi: [
          'Built RESTful APIs (Django/FastAPI) and data wrangling pipelines',
        ],
        zelenial: [
          '<strong>Property Consulting:</strong> Founded Zelenial Group (Pty) Ltd — property investment and management — with a published rate card (LTR commission 5–8%, STR 20–25%, advisory 5–8%, disposal 3–5%)',
          '<strong>Financial Analysis:</strong> Per-property P&L, portfolio cash-flow tracking, yield analysis (gross/net yield, ROI, LTV), and source-verified budget corrections',
          '<strong>Operations:</strong> Tenant screening SOP (credit checks via TPN/Experian/TransUnion, affordability verification), RHA-compliant lease administration, and 5-stage rent-collection escalation',
        ],
      },
    },

    /* ---- Modern ---- */
    modern: {
      theme: 'modern',
      subtitle: 'Senior Data Engineer · AI/LLM Practitioner · Full Stack Developer',
      employmentType: 'full-time',
      availability: [],
      summary:
        "Data is everywhere — it's my job to find it, extract it, transform it, and deliver it to the business. With <strong>5+ years</strong> building enterprise data platforms on AWS, I combine deep technical expertise in PySpark, Airflow, and Kafka with a passion for AI/LLM applications. I lead teams, build pipelines, and bridge the gap between technical execution and business outcomes. The same analytical discipline powers my ventures: I founded Ibitse (Pty) Ltd (lift-sharing) and Zelenial Group (property management), where I apply data-driven decisions to portfolio analytics, yield tracking, and rent strategy — proving the arc from data engineering to full-stack development to property investment.",
      sectionOrder: ['summary', 'stats', 'skills-grid', 'impact-highlights', 'experience', 'projects', 'education', 'certifications', 'languages', 'affiliations', 'interests', 'availability', 'references'],
      skills: ['programming', 'cloud_aws', 'data_engineering', 'frameworks', 'databases', 'devops', 'ai_llm'],
      stats: [
        { value: '5+', label: "Years' Experience" },
        { value: '35%', label: 'Pipeline Runtime Reduction' },
        { value: '22%', label: 'Compute Cost Savings' },
        { value: '90%+', label: 'Data Quality Coverage' },
      ],
      impactHighlights: [
        '<strong>35% pipeline runtime reduction</strong> and <strong>22% EMR compute cost savings</strong> via partition pruning, predicate pushdown, and join tuning',
        '<strong>Freshness D+1 → H+1</strong> with event-driven ingestion and robust late-arrival handling',
        '<strong>90%+ data-quality coverage</strong> via dbt source/column contracts and tests',
        '<strong>Founded two companies</strong> — Ibitse (Pty) Ltd and Zelenial Group — applying data-driven decisions to portfolio analytics and yield tracking',
      ],
      experienceBullets: {
        ibitse: ['Leading engineering standards, CI/CD, and backend services (TypeScript/Node) for a start-up.'],
        om_lead: ['Leading a team building data analytics solutions. PySpark on EMR/Glue, Airflow, Kafka, dbt, FastAPI. 35% runtime reduction, 22% cost savings.'],
        om_analyst: ['ETL pipelines from DB2 to S3. PySpark, Airflow, dbt, server administration.'],
        om_de: ['Data quality pipelines in medallion architecture golden layer. AWS, Airflow, Spark.'],
        umuzi: ['RESTful APIs with Django/FastAPI. Data wrangling pipelines.'],
        zelenial: [
          'Founded Zelenial Group (Pty) Ltd — property management. Portfolio analytics: per-property P&L, yield/ROI tracking, and data-driven rent decisions (renewal negotiated above agent recommendation).',
        ],
      },
    },

    /* ---- Full-Time (new engagement page) ---- */
    full_time: {
      theme: 'data-engineer',
      subtitle: 'Senior Data Engineer — Full-Time',
      employmentType: 'full-time',
      availability: [
        { label: 'Availability', value: 'Full-time employment' },
        { label: 'Start', value: 'Immediate' },
        { label: 'Location', value: 'Cape Town, South Africa (Remote-friendly)' },
        { label: 'Work Authorization', value: 'South African Citizen' },
      ],
      summary:
        'Senior Data Engineer with <strong>5+ years</strong> building enterprise-grade data platforms on AWS using Python, PySpark, EMR/Glue, Redshift, and Athena. Experienced in medallion/lakehouse patterns, streaming ingestion with Kafka, Airflow orchestration, and DataOps. Proven track record: 35% pipeline runtime reduction, 22% cost savings, 90%+ data-quality coverage. Seeking a full-time role where I can lead data platform engineering and deliver measurable business impact.',
      sectionOrder: ['summary', 'stats', 'skills-grid', 'impact-highlights', 'experience', 'projects', 'education', 'certifications', 'languages', 'affiliations', 'availability', 'references'],
      skills: ['programming', 'cloud_aws', 'data_engineering', 'frameworks', 'databases', 'devops', 'ai_llm'],
      stats: [
        { value: '35%', label: 'Pipeline Runtime Reduction' },
        { value: '22%', label: 'Compute Cost Savings' },
        { value: '90%+', label: 'Data Quality Coverage' },
        { value: 'H+1', label: 'Data Freshness' },
      ],
      impactHighlights: sharedSections.impactHighlights,
      experienceBullets: {},
    },

    /* ---- Contract (new engagement page) ---- */
    contract: {
      theme: 'freelance',
      subtitle: 'Contract Data Engineer & AI Consultant',
      employmentType: 'contract',
      availability: [
        { label: 'Engagement', value: '2–4 month contracts · Full-time (40 hrs/week)' },
        { label: 'Rate', value: 'R550–R640/hr (negotiable based on scope)' },
        { label: 'Location', value: 'Remote — time-zone friendly with UK/EU/US overlap' },
        { label: 'Start', value: 'Immediate' },
      ],
      rate: 'R550–R640/hr',
      summary:
        'Senior Data Engineer with <strong>5+ years</strong> building enterprise-grade data platforms on AWS. Specializing in <strong>PySpark pipelines, lakehouse architecture, streaming ingestion, and AI/LLM data preparation</strong>. Proven impact: 35% runtime reduction, 22% cost savings, 90%+ data-quality coverage. Available for 2–4 month contract engagements where rapid, high-quality delivery matters.',
      sectionOrder: ['summary', 'stats', 'skills-grid', 'services', 'impact-highlights', 'experience', 'projects', 'education', 'certifications', 'languages', 'affiliations', 'availability', 'references'],
      skills: ['programming', 'cloud_aws', 'data_engineering', 'frameworks', 'databases', 'devops', 'ai_llm'],
      stats: [
        { value: '35%', label: 'Pipeline Runtime Reduction' },
        { value: '22%', label: 'Compute Cost Savings' },
        { value: '90%+', label: 'Data Quality Coverage' },
        { value: 'H+1', label: 'Data Freshness' },
      ],
      services: sharedSections.services,
      impactHighlights: sharedSections.impactHighlights,
      experienceBullets: {
        om_lead: [
          'Owned production PySpark pipelines on AWS EMR/Glue with Airflow orchestration',
          'Designed Kafka-enabled ingestion with idempotent S3 landing and replay strategies',
          'Applied lakehouse practices with Parquet/Iceberg tables via Athena/Trino',
          'Instituted DataOps guardrails: Git PRs, dbt CI, CloudWatch metrics, dataset SLAs',
          'Built FastAPI services exposing curated data with validation and schema checks',
          'Prototyped LLM-ready datasets and retrieval indexes for RAG applications',
        ],
        ibitse: [
          'Led engineering standards and contributed to backend services (TypeScript/Node)',
          'Designed cloud-ready infrastructure aligned with stakeholder expectations',
        ],
        umuzi: [
          'Built RESTful APIs (Django/FastAPI) and data wrangling pipelines',
        ],
      },
    },

    /* ---- Part-Time (new engagement page) ---- */
    part_time: {
      theme: 'general',
      subtitle: 'Senior Data Engineer — Part-Time',
      employmentType: 'part-time',
      availability: [
        { label: 'Engagement', value: 'Part-time · 20–30 hrs/week' },
        { label: 'Schedule', value: 'Flexible — aligned to team time zones' },
        { label: 'Location', value: 'Remote' },
        { label: 'Work Authorization', value: 'South African Citizen' },
      ],
      summary:
        'Senior Data Engineer with <strong>5+ years</strong> building enterprise-grade data platforms on AWS. Deep expertise in PySpark, AWS, Airflow, Kafka, and data quality, with proven impact: <strong>35% pipeline runtime reduction</strong>, <strong>22% cost savings</strong>, and <strong>90%+ data-quality coverage</strong>. Available for part-time engagements (20–30 hrs/week) with flexible scheduling across time zones. Ideal for teams needing senior data engineering support without a full-time commitment — I enjoy jumping into a messy codebase and leaving it measurably better.',
      sectionOrder: ['summary', 'stats', 'skills-grid', 'impact-highlights', 'experience', 'projects', 'education', 'certifications', 'languages', 'affiliations', 'availability', 'references'],
      skills: ['programming', 'cloud_aws', 'data_engineering', 'frameworks', 'databases', 'devops', 'ai_llm'],
      stats: [
        { value: '35%', label: 'Pipeline Runtime Reduction' },
        { value: '22%', label: 'Compute Cost Savings' },
        { value: '90%+', label: 'Data Quality Coverage' },
        { value: '20–30', label: 'Hrs/Week' },
      ],
      impactHighlights: [
        '<strong>35% pipeline runtime reduction</strong> and <strong>22% EMR compute cost savings</strong> via partition pruning, predicate pushdown, and join tuning',
        '<strong>Freshness D+1 → H+1</strong> with event-driven ingestion and robust late-arrival handling',
        '<strong>90%+ data-quality coverage</strong> via dbt source/column contracts and tests',
        '<strong>Deployment: days → hours</strong> with standardized CI/CD (ADO/Git + CodePipeline) and safe rollout/rollback',
      ],
      experienceBullets: {},
    },

    /* ---- Founder & CEO ---- */
    founder_ceo: {
      theme: 'executive',
      subtitle: 'Founder · CEO · Executive Leader — Technology & Property',
      employmentType: 'full-time',
      availability: [
        { label: 'Availability', value: 'Full-time / Advisory' },
        { label: 'Location', value: 'Cape Town, South Africa (Remote-friendly)' },
        { label: 'Work Authorization', value: 'South African Citizen' },
      ],
      summary:
        'Founder and CEO with <strong>5+ years</strong> of experience building technology and property businesses. Founded two companies — Ibitse (Pty) Ltd (lift-sharing platform) and Zelenial Group (property management) — bootstrapped with zero external funding, secured an Investec loan proposal, and built a 3-unit property portfolio at 100% occupancy. Led a 10-persona GTM research base, established POPIA and B-BBEE Level 2 compliance programmes, and designed a 38-person org blueprint. Combines hands-on technical depth (data engineering, full stack development) with board-level governance, honest risk management, and evidence-based decision-making.',
      leadershipPhilosophy:
        '"Building companies requires <strong>clear standards</strong> that everyone can follow, <strong>honest risk management</strong> that names problems before they become crises, and <strong>evidence-based decisions</strong> that let data — not optimism — carry the argument. My role as founder is to create the conditions where talented people do their best work, then get out of their way."',
      stats: [
        { value: '2', label: 'Companies Founded' },
        { value: '100%', label: 'Portfolio Occupancy' },
        { value: '3', label: 'Residential Units' },
        { value: '10+13', label: 'Personas & Competitors' },
      ],
      skillsGrid: [
        { category: 'Founder Leadership', skills: ['Company Building', 'Board Governance', 'Fundraising', 'Phantom Equity Design'] },
        { category: 'Governance & Compliance', skills: ['POPIA Programme', 'B-BBEE Level 2', 'LRA s200A', 'Risk Management'] },
        { category: 'Business Operations', skills: ['Org Design', 'Budget Management', 'Property Portfolio', 'Vendor Management'] },
        { category: 'Technical Depth', skills: ['Data Engineering', 'Full Stack Development', 'AWS Architecture', 'AI/LLM Applications'] },
      ],
      sectionOrder: ['summary', 'stats', 'leadership-philosophy', 'skills-grid', 'impact-highlights', 'experience', 'projects', 'education', 'certifications', 'languages', 'affiliations', 'availability', 'references'],
      skills: ['programming', 'cloud_aws', 'data_engineering', 'frameworks', 'databases', 'devops', 'ai_llm'],
      impactHighlights: [
        '<strong>Bootstrapped to funded:</strong> founded two companies with zero external funding and secured an Investec loan proposal with Month-4 profitability projection',
        '<strong>3-unit property portfolio</strong> at 100% occupancy with RHA-compliant lease administration',
        '<strong>10-persona + 13-competitor research base</strong> driving a D1–D8 GTM playbook for the Limpopo↔Gauteng corridor',
        '<strong>POPIA (10-doc library) and B-BBEE Level 2 compliance programme</strong> across two businesses',
      ],
      experienceBullets: {
        zelenial: [
          'Founded and direct Zelenial Group as sole director; manage a 3-unit residential portfolio at 100% occupancy',
          'Completed the University of Cape Town Property Development & Investment short course (8 modules, marked assignments) covering NOI calculation, valuation, finance, and development planning',
          'Administer RHA-compliant leases: 12-month terms, 8% escalations, interest-bearing deposits, renewal process 60 days before expiry',
          'Investigate and resolve municipal account arrears (Ekurhuleni + City of Cape Town), identifying root causes and negotiating payment arrangements',
          'Track per-property P&L, portfolio cash flow, yield analysis (gross/net yield, ROI, LTV), and source-verified budget corrections',
        ],
        ibitse: [
          'Founded Ibitse (Pty) Ltd as sole director; lift-sharing platform for the Limpopo↔Gauteng corridor with an 8-department activation plan',
          'Bootstrapped the company with zero external funding; essentials-first budget hierarchy deferring all non-essential spend',
          'Prepared and submitted an Investec loan proposal (rent-to-own vehicle acquisition + working capital) with Month-4 profitability projection',
          'Designed a 7-document phantom share scheme (1,800,000 units, 3-year vest / 1-year cliff) enabling cash-free equity-for-services compensation',
          'Established corporate governance cadence: weekly standups, sprint retrospectives, monthly compliance/budget self-audit, quarterly R&D reviews',
          'Built a 10-persona research base and 13-profile competitor register to drive GTM strategy (D1–D8 playbook)',
        ],
        om_lead: [
          'Lead a team producing data analytics solutions, data sources, and APIs feeding online applications and services',
          'Implement proof-of-concept evaluations of new technologies, transitioning them from experimental tools to production-ready services used by the business',
          'Own production PySpark pipelines on AWS EMR/Glue orchestrated via Airflow, delivering conformed datasets to Redshift/Athena',
          'Impact: Improved critical pipeline runtime by 35% and reduced EMR compute costs by 22%',
        ],
      },
    },

    /* ---- CTO ---- */
    cto: {
      theme: 'executive',
      subtitle: 'CTO · VP Engineering · Technology Executive',
      employmentType: 'full-time',
      availability: [],
      summary:
        'Technology executive with <strong>5+ years</strong> of experience spanning software architecture, data platform engineering, and engineering leadership. Currently leading a team of analysts at Old Mutual while serving as Lead Full Stack Developer and architect for a start-up. Owns architecture decisions across monolith/tenancy design, infrastructure cost engineering (from zero to scale-stage projections), and AI/LLM gateway architecture. Delivers measurable outcomes: <strong>35% pipeline runtime reduction</strong>, <strong>22% EMR compute cost savings</strong>, and <strong>90%+ data-quality coverage</strong>. Combines deep technical expertise in AWS, Python, and data platforms with strategic planning and stakeholder management.',
      leadershipPhilosophy:
        '"Technology leadership is about making architecture decisions that survive contact with reality — <strong>clear standards</strong> that teams can follow, <strong>cost engineering</strong> that respects the business, and <strong>measurable outcomes</strong> that prove the platform works."',
      stats: [
        { value: '35%', label: 'Pipeline Runtime Reduction' },
        { value: '22%', label: 'EMR Compute Cost Savings' },
        { value: '90%+', label: 'Data Quality Coverage' },
        { value: 'H+1', label: 'Data Freshness' },
      ],
      skillsGrid: [
        { category: 'Architecture', skills: ['System Design', 'Monolith/Tenancy', 'Cloud Architecture', 'Cost Engineering'] },
        { category: 'Engineering Leadership', skills: ['Team Management', 'CI/CD Standards', 'Code Review', 'Stakeholder Management'] },
        { category: 'Data Platform', skills: ['PySpark / EMR', 'Airflow', 'dbt Contracts', 'Redshift / Athena'] },
        { category: 'AI/LLM', skills: ['RAG Pipelines', 'Function Calling', 'Evaluation Harnesses', 'FastAPI Integration'] },
      ],
      sectionOrder: ['summary', 'stats', 'skills-grid', 'impact-highlights', 'experience', 'projects', 'education', 'certifications', 'languages', 'affiliations', 'availability', 'references'],
      skills: ['programming', 'cloud_aws', 'data_engineering', 'frameworks', 'databases', 'devops', 'ai_llm'],
      impactHighlights: [
        '<strong>Architecture decisions</strong> across monolith/tenancy design for a multi-company platform (Ibitse + Zelenial Group)',
        '<strong>Infrastructure cost engineering</strong> from zero to scale-stage projections via GCP/AWS feasibility studies',
        '<strong>AI/LLM gateway architecture</strong>: RAG, function calling, and evaluation harnesses with FastAPI integration',
        '<strong>Multi-company platform</strong>: co-hosted VPS infrastructure shared across two independent legal entities',
      ],
      experienceBullets: {
        ibitse: [
          'Design application architecture and infrastructure for scalable, secure deployments; lead technical delivery for a start-up organization',
          'Establish coding standards, implement CI/CD pipelines, and enforce Git best practices across the development team',
          'Conducted GCP and AWS feasibility studies with cost projections to defer cloud spend until post-revenue',
          'Architected a co-hosted VPS infrastructure shared across two independent legal entities (Ibitse + Zelenial Group)',
          'Prototyped LLM application patterns (RAG, function calling, prompt strategies) with FastAPI integration and evaluation harnesses',
        ],
        om_lead: [
          'Lead a team producing data analytics solutions, data sources, and APIs feeding online applications and services',
          'Own production PySpark pipelines on AWS EMR/Glue orchestrated via Airflow, delivering conformed datasets to Redshift/Athena',
          'Design and document data contracts, marts, and SCD Type 2 dimensions; publish dbt docs and lineage for downstream consumers',
          'Implement proof-of-concept evaluations of new technologies, transitioning them from experimental tools to production-ready services',
          'Impact: Improved critical pipeline runtime by 35%, reduced EMR compute costs by 22%, and elevated data freshness from D+1 to H+1',
        ],
      },
    },

    /* ---- Business Operations ---- */
    business_ops: {
      theme: 'general',
      subtitle: 'COO · Operations Manager · Business Systems',
      employmentType: 'full-time',
      availability: [],
      summary:
        'Operations leader with <strong>5+ years</strong> of experience designing and running business operations across two companies. Built a 38-person org blueprint with a PI03-minimum 17-person trim path, implemented LRA s200A contractor classification compliance, created a 10-template contract library with an 8-stage lifecycle, and documented 11 SOPs across HR, Legal, Marketing, and Properties. Manages property operations for a 3-unit portfolio at 100% occupancy. Combines operational discipline with honest capacity planning and evidence-based process design.',
      leadershipPhilosophy:
        '"Operations is where strategy becomes reality. I build <strong>clear processes</strong> that scale, <strong>honest capacity plans</strong> that name constraints, and <strong>evidence-based systems</strong> that let the business run without me in the room."',
      stats: [
        { value: '38', label: 'Team Org Blueprint' },
        { value: '11', label: 'SOPs Documented' },
        { value: '10', label: 'Contract Templates' },
        { value: '100%', label: 'Property Occupancy' },
      ],
      skillsGrid: [
        { category: 'Operations', skills: ['Org Design', 'Process Engineering', 'Capacity Planning', 'SOP Development'] },
        { category: 'HR & Compliance', skills: ['LRA s200A', 'Contractor Classification', 'Onboarding Design', 'Training'] },
        { category: 'Business Systems', skills: ['Contract Lifecycle', 'Support Models', 'Vendor Management', 'Budget Tracking'] },
        { category: 'Property Operations', skills: ['Lease Administration', 'Tenant Screening', 'Managing-Agent Oversight', 'Municipal Compliance'] },
      ],
      impactHighlights: [
        '<strong>38-person org blueprint</strong> with a PI03-minimum 17-person trim path',
        '<strong>LRA s200A compliance framework</strong>: 8-document deemed-employment pack and a 25-question contractor classification assessment tool',
        '<strong>10-template contract library</strong> with an 8-stage contract lifecycle (draft → review → classify → negotiate → approve → execute → monitor → renew/terminate)',
        '<strong>11 SOPs documented</strong> across HR, Legal, Marketing, and Properties — exceeding the 9+ target',
      ],
      sectionOrder: ['summary', 'stats', 'skills-grid', 'experience', 'projects', 'education', 'certifications', 'languages', 'affiliations', 'availability', 'references'],
      skills: ['programming', 'cloud_aws', 'data_engineering', 'frameworks', 'databases', 'devops', 'ai_llm'],
      experienceBullets: {
        zelenial: [
          'Manage property operations across a 3-unit portfolio: RHA-compliant lease administration, tenant screening (credit checks via TPN/Experian/TransUnion, income verification, FICA), and inspection protocols',
          'Maintain 100% occupancy across a 3-unit portfolio; track per-property P&L and portfolio cash flow',
          'Manage external managing agents with commission reconciliation verified to 5% excl. VAT',
          'Investigate and resolve municipal account arrears, identifying root causes and negotiating payment arrangements',
        ],
        ibitse: [
          'Designed a 38-person ideal-team org blueprint with a PI03-minimum 17-person trim path',
          'Built an LRA s200A compliance framework: 8-document deemed-employment pack and a 25-question contractor classification assessment tool',
          'Created a 10-template contract library with an 8-stage contract lifecycle (draft → review → classify → negotiate → approve → execute → monitor → renew/terminate)',
          'Documented 11 SOPs across both businesses (HR, Legal, Marketing, Properties), exceeding the 9+ target',
          'Designed a 12-state driver onboarding state machine; achieved 3-day actual onboarding vs 5-day target',
          'Established a 4-tier support model (self-service SOPs → contractor leads → full-time hires → founder escalation) tied to PI cadence',
          'Documented capacity planning candidly: 57% of open items carried by founder; top-10 hire order recovers ~80–85 days',
        ],
      },
    },

    /* ---- Marketing & Growth ---- */
    marketing_growth: {
      theme: 'modern',
      subtitle: 'Growth Lead · Marketing Manager · GTM Strategist',
      employmentType: 'full-time',
      availability: [],
      summary:
        'Marketing and growth strategist with <strong>5+ years</strong> of experience building go-to-market systems from zero budget. Built a 10-persona research base validated by an n=15 user survey, a 13-profile competitor register, and a D1–D8 GTM playbook. Defined a 4-pillar messaging framework (Safety, Transparency, Reliability, Community) with SA-specific positioning, and established a KPI framework with first/last-touch attribution and R/Y/G thresholds. Combines research-driven strategy with hands-on campaign design and brand governance across two companies.',
      leadershipPhilosophy:
        '"Growth is a system, not a campaign. I build <strong>research-driven foundations</strong> that everyone can trust, <strong>messaging frameworks</strong> that stay consistent, and <strong>KPI cadences</strong> that turn activity into learning."',
      stats: [
        { value: '10', label: 'Personas Researched' },
        { value: '13', label: 'Competitor Profiles' },
        { value: '4', label: 'Messaging Pillars' },
        { value: 'D1–D8', label: 'GTM Playbook' },
      ],
      skillsGrid: [
        { category: 'GTM Strategy', skills: ['Go-To-Market Planning', 'Launch Playbooks', 'Market Sizing', 'Channel Strategy'] },
        { category: 'Research & Intel', skills: ['Persona Development', 'Competitor Analysis', 'User Surveys', 'Journey Mapping'] },
        { category: 'Brand & Messaging', skills: ['Messaging Frameworks', 'Brand Systems', 'Tone of Voice', 'Campaign Design'] },
        { category: 'Measurement', skills: ['KPI Frameworks', 'Attribution Models', 'R/Y/G Thresholds', 'Reporting Cadence'] },
      ],
      sectionOrder: ['summary', 'stats', 'skills-grid', 'impact-highlights', 'experience', 'projects', 'education', 'certifications', 'languages', 'affiliations', 'availability', 'references'],
      skills: ['programming', 'cloud_aws', 'data_engineering', 'frameworks', 'databases', 'devops', 'ai_llm'],
      impactHighlights: [
        '<strong>10-persona research base</strong> (demographics, pain points, journey maps) validated by an n=15 user survey',
        '<strong>13-profile competitor register</strong> with pricing intelligence and market sizing (~R3B/year corridor TAM, ~550,000+ lift-club members)',
        '<strong>4-pillar messaging framework</strong> (Safety, Transparency, Reliability, Community) with SA-specific positioning',
        '<strong>KPI/attribution framework</strong> with first/last-touch attribution, R/Y/G thresholds, and weekly→quarterly cadence',
      ],
      experienceBullets: {
        ibitse: [
          'Built a 10-persona research system (demographics, pain points, journey maps) validated by an n=15 user survey (cancellations 32%, pricing 28%, map/location 22%)',
          'Developed a 13-profile competitor register covering inDrive, LongDrive/Woza, informal lift clubs, minibus taxis, bus operators, and more',
          'Authored a D1–D8 GTM playbook: strategy, driver acquisition, passenger acquisition, brand messaging, beta community, feature campaigns, launch-day playbook, KPI dashboard',
          'Defined a 4-pillar messaging framework (Safety, Transparency, Reliability, Community) with SA-specific positioning (local payments, local routes)',
          'Established a KPI framework with first/last-touch attribution, R/Y/G thresholds, and weekly→quarterly measurement cadence',
          'Conducted market sizing: ~R3B/year corridor TAM, R90B+ minibus taxi industry, ~1.2M trips/year potential, 15+ Facebook lift-club groups (~550,000+ members)',
        ],
        zelenial: [
          'Developed a Zelenial brand system: palette (Deep Teal #1A535C, Terracotta #E07A5F, Sage #4ECDC4), typography (DM Serif Display + Inter), tone of voice, and logo spec',
          'Created a rate card with 4 service tiers: LTR commission 5–8%, STR 20–25%, advisory 5–8%, disposal 3–5%',
          'Documented a 6-step tenant acquisition flow (lead → qualification → viewing → application → screening → decision)',
        ],
      },
    },

    /* ---- Finance ---- */
    finance: {
      theme: 'executive',
      subtitle: 'CFO · Finance Manager · Financial Analyst',
      employmentType: 'full-time',
      availability: [],
      summary:
        'Finance professional with <strong>5+ years</strong> of experience managing unit economics, property P&L, portfolio cash flow, and tax compliance. Manages a 3-unit property portfolio at 100% occupancy, tracks per-property P&L and yield analysis (gross/net yield, ROI, LTV), and applies source-verified budget corrections. Prepared an Investec loan proposal with Month-4 profitability projection, and maintains VAT201/SARS quarterly compliance. Combines rigorous financial modeling with honest reporting of negative results.',
      leadershipPhilosophy:
        '"Finance is honesty with numbers. I build <strong>rigorous models</strong> that everyone can audit, <strong>source-verified budgets</strong> that survive scrutiny, and <strong>candid reporting</strong> that names negative results before they compound."',
      stats: [
        { value: '3', label: 'Unit Portfolio' },
        { value: '100%', label: 'Occupancy' },
        { value: 'VAT201', label: 'Quarterly SARS Compliance' },
        { value: '5+', label: "Years' Experience" },
      ],
      skillsGrid: [
        { category: 'Financial Modeling', skills: ['Unit Economics', 'P&L Management', 'Cash-Flow Statements', 'Forecast vs Actual'] },
        { category: 'Property Finance', skills: ['Yield Analysis', 'Rent Roll Management', 'ROI / LTV', 'Budget Corrections'] },
        { category: 'Tax & Compliance', skills: ['VAT201 Preparation', 'SARS Verification', 'Input/Output Reconciliation', 'Compliance Cadence'] },
        { category: 'Analysis', skills: ['Commission Reconciliation', 'Municipal Accounts', 'Cost Modeling', 'Variance Tracking'] },
      ],
      sectionOrder: ['summary', 'stats', 'skills-grid', 'impact-highlights', 'experience', 'projects', 'education', 'certifications', 'languages', 'affiliations', 'availability', 'references'],
      skills: ['programming', 'cloud_aws', 'data_engineering', 'frameworks', 'databases', 'devops', 'ai_llm'],
      impactHighlights: [
        '<strong>3-unit property portfolio</strong> at 100% occupancy with RHA-compliant lease administration',
        '<strong>Source-verified budget corrections</strong> (levy and rates) ensuring P&L reflects actuals, not estimates',
        '<strong>Investec loan proposal</strong> with Month-4 profitability projection',
        '<strong>VAT/SARS compliance</strong>: quarterly VAT201 data preparation with input/output reconciliation and verification cadence',
      ],
      experienceBullets: {
        zelenial: [
          'Manage a 3-unit residential portfolio at 100% occupancy; track per-property P&L with income, recovered costs, and expense line items',
          'Maintain portfolio cash-flow statements with income, recovered costs, and expense line items (reported candidly)',
          'Perform yield analysis (gross/net yield, ROI, LTV) across the portfolio',
          'Reconcile management-agent commissions to exact match (verified to 5% excl. VAT)',
          'Apply source-verified budget corrections (levy and rates) ensuring P&L reflects actuals, not estimates',
          'Track municipal accounts across CoCT and Ekurhuleni; investigate arrears root cause (Siyakhokha portal unlinked ~15 months) and negotiate payment arrangements',
        ],
        ibitse: [
          'Model unit economics for a ride-hail platform: 7.5% platform fee (92.5% to driver), per-route P&L before dispatch, zero-rated driver payout flow-through',
          'Prepared an Investec loan proposal (rent-to-own vehicle acquisition + working capital) with Month-4 profitability projection',
          'Compile VAT201 data quarterly with input vs output VAT reconciliation; maintain SARS quarterly verification cadence',
          'Track unfunded items with cost estimates and PI deferral decisions; maintain cost-modeling spreadsheets with forecast vs actual variance tracking',
        ],
      },
    },

    /* ---- Property Manager ---- */
    property_manager: {
      theme: 'freelance',
      subtitle: 'Property Manager · Asset Manager · Investment Analyst',
      employmentType: 'contract',
      availability: [
        { label: 'Engagement', value: 'Contract / Advisory' },
        { label: 'Location', value: 'Cape Town, South Africa (Remote-friendly)' },
      ],
      rate: 'R550–R640/hr',
      summary:
        'Property manager with <strong>5+ years</strong> of experience managing a 3-unit residential portfolio at 100% occupancy. Completed the University of Cape Town Property Development & Investment short course (8 modules, marked assignments). Administers RHA-compliant leases, runs tenant screening (TPN/Experian/TransUnion, income verification, FICA), and performs yield analysis (NOI, gross/net yield, ROI, LTV). Investigates and resolves municipal arrears with root-cause analysis. Available for contract and advisory engagements.',
      leadershipPhilosophy:
        '"Property management is a discipline of <strong>compliance</strong> and <strong>cash flow</strong>. I run portfolios with RHA-compliant processes, evidence-based screening, and yield analysis that tells the truth about every unit."',
      stats: [
        { value: '3', label: 'Unit Portfolio' },
        { value: '100%', label: 'Occupancy' },
        { value: 'RHA', label: 'Compliant Leases' },
        { value: '8', label: 'UCT PDI Modules' },
      ],
      skillsGrid: [
        { category: 'Property Management', skills: ['Portfolio Management', 'LTR/STR Operations', 'Managing-Agent Oversight', 'Rent Collection'] },
        { category: 'Tenant Screening', skills: ['Credit Bureau Checks', 'Income Verification', 'FICA', '6-Tier Decision Matrix'] },
        { category: 'Lease Administration', skills: ['RHA-Compliant Leases', 'Renewal Management', 'Deposit Administration', 'Escalation Clauses'] },
        { category: 'Yield Analysis', skills: ['NOI Calculation', 'Gross/Net Yield', 'ROI & LTV', 'Cap Rate Methodology'] },
        { category: 'Investment Advisory', skills: ['Acquisition Analysis', 'Portfolio Cash Flow', 'Municipal Compliance', 'Valuation'] },
      ],
      sectionOrder: ['summary', 'stats', 'skills-grid', 'services', 'impact-highlights', 'experience', 'projects', 'education', 'certifications', 'languages', 'affiliations', 'availability', 'references'],
      skills: ['programming', 'cloud_aws', 'data_engineering', 'frameworks', 'databases', 'devops', 'ai_llm'],
      services: [
        { title: 'Property Management', tags: ['Portfolio Management', 'LTR/STR Operations', 'Managing-Agent Oversight', 'Rent Collection'] },
        { title: 'Tenant Screening', tags: ['Credit Bureau Checks (TPN, Experian, TransUnion)', 'Income Verification', 'FICA', '6-Tier Decision Matrix'] },
        { title: 'Lease Administration', tags: ['RHA-Compliant Leases', 'Renewal Management', 'Deposit Administration', 'Escalation Clauses'] },
        { title: 'Yield Analysis', tags: ['NOI Calculation', 'Gross/Net Yield', 'ROI & LTV', 'Cap Rate Methodology'] },
        { title: 'Investment Advisory', tags: ['Acquisition Analysis', 'Portfolio Cash Flow', 'Municipal Compliance', 'Valuation'] },
      ],
      impactHighlights: [
        '<strong>3-unit residential portfolio</strong> at 100% occupancy with RHA-compliant lease administration',
        '<strong>UCT Property Development & Investment course</strong> (8 modules, marked assignments; 80% on valuation)',
        '<strong>RHA-compliant lease administration</strong>: 12-month terms, 8% escalations, interest-bearing deposits, 60-day renewals',
        '<strong>Municipal arrears investigation</strong>: root-cause analysis (Siyakhokha portal unlinked ~15 months) and payment arrangements',
      ],
      experienceBullets: {
        zelenial: [
          'Manage a 3-unit residential portfolio at 100% occupancy with RHA-compliant lease administration and per-property P&L tracking',
          'Completed the University of Cape Town Property Development & Investment short course (8 modules, marked assignments) covering NOI calculation, valuation, finance, and development planning',
          'Administer RHA-compliant leases: 12-month terms, 8% escalations, interest-bearing deposits, renewal process 60 days before expiry',
          'Oversee tenant screening (credit checks via TPN/Experian/TransUnion, income verification, rental references, FICA) and lease administration',
          'Manage external managing agents with commission reconciliation verified to 5% excl. VAT',
          'Investigate and resolve municipal account arrears (Ekurhuleni + City of Cape Town), identifying root causes and negotiating payment arrangements',
          'Track per-property P&L, portfolio cash flow, yield analysis (gross/net yield, ROI, LTV), and source-verified budget corrections',
        ],
      },
    },

    /* ---- Full Stack Engineer ---- */
    fullstack_engineer: {
      theme: 'modern',
      subtitle: 'Full Stack Developer · Software Engineer · Technical Lead',
      employmentType: 'full-time',
      availability: [],
      summary:
        'Full stack engineer with <strong>5+ years</strong> of experience building production applications and data platforms. Lead developer for a start-up organization using TypeScript, React, NestJS, and Odoo ERP, with MySQL, PostgreSQL, Docker, Redis, and MongoDB. Built FastAPI services and PySpark pipelines on AWS at Old Mutual, with measurable impact: <strong>35% pipeline runtime reduction</strong> and <strong>22% EMR compute cost savings</strong>. Combines frontend, backend, and DevOps skills with strong engineering standards and CI/CD practices.',
      leadershipPhilosophy:
        '"Great software is built on <strong>clear standards</strong>, <strong>measurable outcomes</strong>, and <strong>continuous delivery</strong>. I write code that ships, set up pipelines that protect it, and measure impact in runtime, cost, and reliability."',
      stats: [
        { value: '35%', label: 'Pipeline Runtime Reduction' },
        { value: '22%', label: 'EMR Compute Cost Savings' },
        { value: '5+', label: "Years' Experience" },
        { value: 'Full', label: 'Stack Coverage' },
      ],
      skillsGrid: [
        { category: 'Frontend', skills: ['React', 'React Native', 'TypeScript', 'Responsive UI'] },
        { category: 'Backend', skills: ['NestJS', 'Node.js', 'FastAPI', 'REST APIs'] },
        { category: 'Data & Cloud', skills: ['PySpark / EMR', 'AWS', 'Airflow', 'dbt'] },
        { category: 'DevOps', skills: ['Docker', 'CI/CD', 'Git Best Practices', 'Linux'] },
      ],
      impactHighlights: [
        '<strong>Lead developer</strong> for a start-up organization; oversee development team and ensure successful delivery of high-quality software',
        '<strong>Design application architecture</strong> and set up infrastructure for scalable, secure deployments',
        '<strong>Establish coding standards</strong>, implement CI/CD pipelines, enforce Git best practices',
        '<strong>Measurable impact</strong>: 35% pipeline runtime reduction and 22% EMR compute cost savings on production PySpark pipelines',
      ],
      sectionOrder: ['summary', 'stats', 'skills-grid', 'experience', 'projects', 'education', 'certifications', 'languages', 'affiliations', 'availability', 'references'],
      skills: ['programming', 'cloud_aws', 'data_engineering', 'frameworks', 'databases', 'devops', 'ai_llm'],
      experienceBullets: {
        ibitse: [
          'Lead developer for a start-up organization; oversee development team and ensure successful delivery of high-quality software',
          'Design application architecture and set up infrastructure for scalable, secure deployments',
          'Establish coding standards, implement CI/CD pipelines, enforce Git best practices',
          'Contribute to backend services (Node.js/TypeScript) and frontend applications (React Native)',
          'Researched Odoo ERP platform (module capabilities, licensing, deployment options, community vs enterprise) to inform the ERP roadmap',
          'Technologies: TypeScript, React, NestJS, MySQL, PostgreSQL, Docker, Redis, MongoDB, Linux',
        ],
        om_lead: [
          'Build FastAPI services to expose curated data; add request validation and response schema checks',
          'Own production PySpark pipelines on AWS EMR/Glue orchestrated via Airflow, delivering conformed datasets to Redshift/Athena',
          'Design and document data contracts, marts, and SCD Type 2 dimensions; publish dbt docs and lineage',
          'Implement proof-of-concept evaluations of new technologies, transitioning them from experimental tools to production-ready services',
        ],
      },
    },
  };

  return {
    contact: contact,
    education: education,
    experience: experience,
    skills: skills,
    projects: projects,
    certifications: certifications,
    languages: languages,
    affiliations: affiliations,
    interests: interests,
    cvProfiles: cvProfiles,
  };
});