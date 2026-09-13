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
      details: 'Mathematics and Applied Mathematics · Computer Science · Physics · Astronomy',
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
        'Impact: Improved critical pipeline runtime by ~35% and reduced EMR compute costs by ~22%',
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
        'Built ETL pipelines to lift from On-Premises databases (DB2) to object stores (AWS S3)',
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
    'Umuzi.org — Alumni & Mentor (2020–Present)',
    'Open Source Contributor — GitHub (skydeamon)',
    'University of Cape Town — Alumni',
  ];

  /* ---------- Interests ---------- */
  const interests = ['Data Engineering', 'AI/LLM Research', 'Open Source', 'Astrophysics', 'Cloud Architecture', 'IoT'];

  /* ---------- Shared section content ---------- */
  const sharedSections = {
    impactHighlights: [
      '<strong>~35% pipeline runtime reduction</strong> and <strong>~22% EMR compute cost savings</strong> via partition pruning, predicate pushdown, and join tuning',
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
        tags: ['Data Strategy', 'Architecture Reviews', 'Team Mentoring', 'Proof of Concept'],
        primary: [],
      },
    ],
    stats: [
      { number: '35%', label: 'Pipeline Runtime Reduction' },
      { number: '22%', label: 'Compute Cost Savings' },
      { number: '90%+', label: 'Data Quality Coverage' },
      { number: 'H+1', label: 'Data Freshness' },
    ],
  };

  /* ---------- CV Profiles ---------- */
  const cvProfiles = {
    /* ---- General / Job Application ---- */
    job_application: {
      theme: 'general',
      title: 'Jade Makwela — General CV',
      subtitle: 'Senior Data Engineer · AI/LLM Practitioner · Full Stack Developer',
      description: 'Professional CV of Jade Makwela — Senior Data Engineer, AI/LLM Practitioner, Full Stack Developer',
      employmentType: 'full-time',
      availability: [],
      summary:
        'Experienced Technology Leader and Lead Developer with <strong>5+ years</strong> building enterprise-grade data platforms and applications on AWS. Proficient in Python, PySpark, and ETL development with deep expertise in AWS services (EMR, Glue, Redshift, Athena, Lambda, Step Functions). Demonstrated success in implementing proof-of-concept evaluations, leading data analytics solutions, and bridging technical execution with business outcomes. Strong in software architecture, infrastructure setup, and full-stack application development. Passionate about building robust, cloud-ready solutions that drive business growth and innovation.',
      sectionOrder: ['summary', 'skills-grid', 'experience', 'projects', 'education', 'certifications', 'languages', 'affiliations', 'interests', 'references'],
      skills: ['programming', 'cloud_aws', 'data_engineering', 'frameworks'],
      experienceBullets: {},
    },

    /* ---- Data Engineer ---- */
    data_engineer: {
      theme: 'data-engineer',
      title: 'Jade Makwela — Data Engineer CV',
      subtitle: 'Senior Data Engineer — AWS, PySpark & Data Platforms',
      description: 'CV of Jade Makwela — Senior Data Engineer specializing in PySpark, AWS, and data platform engineering',
      employmentType: 'contract',
      availability: [],
      targetRole: 'Staff / Senior Data Engineer — AI Training Data (Contract)',
      summary:
        'Senior Data Engineer with <strong>5+ years</strong> building enterprise-grade, cloud data platforms on AWS using Python, PySpark, EMR/Glue, Redshift, and Athena. Strong in Kafka-driven ingestion, Airflow orchestration, and DataOps (CI/CD, testing, observability). Experienced in medallion/lakehouse patterns (Parquet/Iceberg), large-scale batch and streaming, and rigorous data quality for analytics and ML readiness. Seeking a Staff-level contract to architect and build high-throughput curation systems for AI-training datasets.',
      sectionOrder: ['target-role', 'summary', 'skills-grid', 'impact-highlights', 'experience', 'projects', 'education', 'languages', 'references'],
      skills: [
        { title: 'Programming', tags: ['Python (Advanced)', 'SQL (Advanced)', 'PySpark', 'Java (Basic)', 'TypeScript'], primary: ['Python (Advanced)', 'SQL (Advanced)', 'PySpark'] },
        { title: 'Distributed & Lakehouse', tags: ['Apache Spark', 'Apache Iceberg', 'Parquet', 'Trino/Athena', 'Medallion Architecture'], primary: ['Apache Spark', 'Apache Iceberg', 'Parquet'] },
        { title: 'Streaming & Events', tags: ['Apache Kafka', 'AWS Kinesis', 'AWS SQS', 'Event-Driven Patterns'], primary: ['Apache Kafka'] },
        { title: 'Cloud (AWS)', tags: ['EMR', 'Glue', 'S3', 'Redshift', 'Athena', 'Lambda', 'Step Functions', 'IAM', 'VPC'], primary: ['EMR', 'Glue', 'S3', 'Redshift'] },
        { title: 'Orchestration & DataOps', tags: ['Apache Airflow', 'dbt', 'Git', 'Azure DevOps', 'AWS CodePipeline'], primary: ['Apache Airflow', 'dbt'] },
        { title: 'Data Quality & Governance', tags: ['dbt Tests', 'Alation Catalog', 'Data Contracts', 'SLAs', 'Observability'], primary: ['dbt Tests'] },
        { title: 'Data Modeling', tags: ['Dimensional Modeling', 'SCD Type 2', 'Facts & Dimensions', 'Medallion (Bronze/Silver/Gold)'], primary: ['Dimensional Modeling', 'SCD Type 2'] },
        { title: 'Containers & Infra', tags: ['Docker', 'Terraform', 'Linux'], primary: [] },
      ],
      impactHighlights: [
        '<strong>~35% pipeline runtime reduction</strong> via partition pruning, predicate pushdown, and join tuning on PySpark/EMR',
        '<strong>~22% monthly compute cost reduction</strong> through optimization of EMR cluster usage and job efficiency',
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
      title: 'Jade Makwela — AI Engineer CV',
      subtitle: 'Senior Data / AI Engineer — LLM Applications & Data Platforms',
      description: 'CV of Jade Makwela — AI/LLM Engineer with production data platform experience',
      employmentType: 'contract',
      availability: [],
      summary:
        'Senior data/AI engineer with <strong>5+ years</strong> building production data platforms and APIs on AWS using Python, PySpark, EMR/Glue, Redshift, Athena, and Airflow. Hands-on with <strong>LLM application patterns</strong> (RAG, function calling, prompt strategies, basic guardrails) and FastAPI integration. Known for end-to-end ownership, rigorous data quality, and cross-functional collaboration with product/analyst teams. Seeking to apply agentic workflows, RAG pipelines, and evaluation practices to deliver safe, traceable AI features in clinical and education contexts.',
      sectionOrder: ['summary', 'skills-grid-ai', 'skills-grid-data', 'impact-highlights', 'experience', 'projects', 'healthcare-compliance', 'education', 'technical-stack', 'languages', 'references'],
      skillsAI: [
        { title: 'LLM Application Patterns', tags: ['Retrieval-Augmented Generation (RAG)', 'Function Calling', 'Multi-Step Tool Use', 'Output Post-Processing', 'Guardrail Hooks'], primary: ['Retrieval-Augmented Generation (RAG)', 'Function Calling'] },
        { title: 'Frameworks', tags: ['LangChain / LangGraph', 'LlamaIndex', 'FAISS', 'pgvector'], primary: ['LangChain / LangGraph', 'LlamaIndex'] },
        { title: 'Backend Integration', tags: ['FastAPI', 'Django', 'Request/Response Contracts', 'Observability', 'Rate Limiting'], primary: ['FastAPI'] },
        { title: 'Evaluation & Quality', tags: ['Prompt Templates', 'Offline Eval Sets', 'Regression Harnesses', 'Factuality Heuristics'], primary: [] },
        { title: 'Safety & Traceability', tags: ['Deterministic Contexts', 'Citation-Style Responses', 'Input Validation', 'PII Handling'], primary: [] },
        { title: 'RAG Data Design', tags: ['Chunking / Token Budgets', 'Metadata Enrichment', 'Freshness Pipelines', 'Cache Strategies'], primary: [] },
      ],
      skillsData: [
        { title: 'AWS Services', tags: ['EMR', 'Glue (Jobs/Crawlers/Triggers)', 'S3', 'Athena', 'Redshift', 'Lambda', 'Step Functions', 'IAM', 'VPC'], primary: ['EMR', 'Glue (Jobs/Crawlers/Triggers)', 'S3'] },
        { title: 'Distributed Processing', tags: ['PySpark on EMR/Glue', 'Partitioning', 'Predicate Pushdown', 'Broadcast Joins', 'File Compaction'], primary: ['PySpark on EMR/Glue'] },
        { title: 'Streaming & Events', tags: ['Kafka Patterns', 'Idempotent Landing', 'Watermarking', 'Replay Strategies'], primary: ['Kafka Patterns'] },
        { title: 'Orchestration & DataOps', tags: ['Apache Airflow', 'CI/CD (Git/ADO/CodePipeline)', 'dbt (Athena + Glue Catalog)'], primary: ['Apache Airflow'] },
        { title: 'Modeling & Lakehouse', tags: ['Medallion (Bronze/Silver/Gold)', 'Dimensional Modeling', 'SCD Type 2', 'Parquet / Iceberg'], primary: ['Medallion (Bronze/Silver/Gold)'] },
        { title: 'APIs & Services', tags: ['RESTful API Design', 'FastAPI/Django', 'Contract Tests', 'Versioned Releases'], primary: ['RESTful API Design'] },
      ],
      impactHighlights: [
        '<strong>~35% pipeline runtime reduction</strong> and <strong>~22% EMR compute cost savings</strong> via partition pruning, predicate pushdown, and join tuning',
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
      technicalStack: [
        { label: 'Languages', value: 'Python, SQL, PySpark; Java (basic); TypeScript (15 months)' },
        { label: 'Frameworks', value: 'FastAPI, Django, LangChain/LangGraph (working knowledge), LlamaIndex (working knowledge)' },
        { label: 'Data & Compute', value: 'AWS EMR/Glue, S3, Athena, Redshift; Apache Kafka; Airflow; dbt (Athena + Glue Catalog)' },
        { label: 'Lakehouse', value: 'Parquet, Iceberg; Trino/Athena; medallion architecture; dimensional modeling (facts/dims, SCD Type 2)' },
        { label: 'DevOps', value: 'Git, Azure DevOps, AWS CodePipeline; Docker; Terraform (exposure)' },
      ],
    },

    /* ---- Academic ---- */
    academic: {
      theme: 'academic',
      title: 'Jade Makwela — Academic CV',
      subtitle: 'BSc Physics & Astrophysics · Data Engineering Researcher',
      description: 'Academic CV of Jade Makwela — BSc Physics & Astrophysics, Data Engineering researcher',
      employmentType: 'full-time',
      availability: [],
      summary:
        'Data engineering researcher with a BSc in Physics & Astrophysics and <strong>5+ years</strong> building production data platforms on AWS. Research interests span machine learning infrastructure, LLM applications & RAG, and data quality & governance. Experienced in mentoring aspiring data engineers and publishing technical documentation for enterprise data platforms.',
      researchInterests: ['Data Engineering', 'Machine Learning Infrastructure', 'LLM Applications & RAG', 'Astrophysics Data Analysis', 'Distributed Computing', 'Data Quality & Governance', 'Streaming Data Systems'],
      sectionOrder: ['research-interests', 'education', 'experience', 'publications', 'research-projects', 'teaching', 'skills-grid', 'languages', 'affiliations', 'references'],
      skills: [
        { title: 'Programming', tags: ['Python', 'SQL', 'PySpark', 'Java', 'TypeScript'], primary: ['Python', 'SQL', 'PySpark'] },
        { title: 'Data & Compute', tags: ['AWS EMR/Glue', 'Apache Airflow', 'Apache Kafka', 'dbt', 'Redshift', 'Athena'], primary: ['AWS EMR/Glue', 'Apache Airflow'] },
        { title: 'Research Tools', tags: ['Jupyter', 'NumPy', 'Pandas', 'Matplotlib', 'SciPy'], primary: [] },
        { title: 'Academic Skills', tags: ['Technical Writing', 'Data Analysis', 'Statistical Methods', 'Scientific Computing'], primary: [] },
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
      ],
      teaching: [
        '<strong>Umuzi.org Alumni Mentor</strong> — Mentoring aspiring data engineers in Python, SQL, and API development (2021–Present)',
        '<strong>Team Lead & Technical Mentor</strong> — Leading a team of analysts at Old Mutual; mentoring in PySpark, dbt, and data modeling best practices',
        '<strong>Knowledge Sharing</strong> — Internal technical documentation and lineage publishing for downstream consumers',
      ],
    },

    /* ---- Executive ---- */
    executive: {
      theme: 'executive',
      title: 'Jade Makwela — Executive CV',
      subtitle: 'Technology Leader · Data Platform Strategist · Engineering Manager',
      description: 'Executive CV of Jade Makwela — Technology Leader, Data Platform Strategist',
      employmentType: 'full-time',
      availability: [],
      summary:
        'Technology leader with <strong>5+ years</strong> of experience spanning data engineering, software architecture, and team leadership. Currently leading a team of analysts at Old Mutual while serving as Lead Full Stack Developer for a start-up. Proven ability to translate business requirements into scalable technical solutions, establish engineering standards, and drive measurable business outcomes. Combines deep technical expertise in AWS, Python, and data platforms with strong stakeholder management and strategic thinking.',
      leadershipPhilosophy:
        '"Great engineering organizations are built on three pillars: <strong>clear standards</strong> that everyone follows, <strong>measurable outcomes</strong> that everyone understands, and <strong>psychological safety</strong> that enables everyone to contribute. My role as a leader is to create the conditions where talented people do their best work — then get out of their way."',
      sectionOrder: ['summary', 'leadership-philosophy', 'skills-grid', 'impact-highlights', 'experience', 'education', 'languages', 'references'],
      skills: [
        { title: 'Team Leadership', tags: ['Team Management', 'Mentoring & Coaching', 'Performance Management', 'Cross-Functional Collaboration'], primary: ['Team Management', 'Mentoring & Coaching'] },
        { title: 'Strategic', tags: ['Architecture Strategy', 'Technology Roadmapping', 'Proof of Concept Leadership', 'Cost Optimization'], primary: ['Architecture Strategy', 'Technology Roadmapping'] },
        { title: 'Delivery', tags: ['Project Management', 'Agile/Scrum', 'CI/CD Implementation', 'Quality Assurance'], primary: ['Project Management', 'Agile/Scrum'] },
        { title: 'Business', tags: ['Stakeholder Engagement', 'Vendor Management', 'Budget Management', 'Risk Assessment'], primary: [] },
      ],
      impactHighlights: [
        '<strong>Led team of analysts</strong> producing data analytics solutions and APIs for business applications',
        '<strong>Established engineering standards</strong> (coding conventions, CI/CD, Git branching) adopted across the team',
        '<strong>Reduced deployment lead time from days to hours</strong> through standardized CI/CD with safe rollout/rollback',
        '<strong>Improved data freshness from D+1 to H+1</strong> via event-driven architecture decisions',
        '<strong>Drove 90%+ data-quality coverage</strong> through dbt contracts, tests, and governance practices',
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
          'Built ETL pipelines from On-Premises databases (DB2) to AWS S3 with transformation and cleaning',
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
      },
    },

    /* ---- Freelance ---- */
    freelance: {
      theme: 'freelance',
      title: 'Jade Makwela — Freelance CV',
      subtitle: 'Freelance Data Engineer & AI Consultant',
      description: 'Freelance CV of Jade Makwela — Contract Data Engineer, AI/LLM Consultant',
      employmentType: 'contract',
      availability: [],
      rate: 'R550–R640/hr',
      summary:
        'Senior Data Engineer with <strong>5+ years</strong> building enterprise-grade data platforms on AWS. Specializing in <strong>PySpark pipelines, lakehouse architecture, streaming ingestion, and AI/LLM data preparation</strong>. Proven track record of delivering measurable impact: 35% pipeline runtime reduction, 22% cost savings, and 90%+ data-quality coverage.',
      sectionOrder: ['summary', 'services', 'stats-grid', 'experience', 'projects', 'skills-grid', 'education', 'languages', 'references'],
      skills: [
        { title: 'Core Stack', tags: ['Python', 'PySpark', 'SQL', 'TypeScript'], primary: ['Python', 'PySpark', 'SQL'] },
        { title: 'AWS', tags: ['EMR', 'Glue', 'S3', 'Redshift', 'Athena', 'Lambda', 'Step Functions'], primary: ['EMR', 'Glue', 'S3'] },
        { title: 'Data Tools', tags: ['Airflow', 'Kafka', 'dbt', 'Iceberg', 'Parquet'], primary: ['Airflow', 'Kafka'] },
        { title: 'AI/LLM', tags: ['LangChain', 'LangGraph', 'FastAPI', 'Vector Search'], primary: [] },
      ],
      services: sharedSections.services,
      stats: sharedSections.stats,
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

    /* ---- Modern ---- */
    modern: {
      theme: 'modern',
      title: 'Jade Makwela — Modern CV',
      subtitle: 'Senior Data Engineer · AI/LLM Practitioner · Full Stack Developer',
      description: 'Modern creative CV of Jade Makwela — Senior Data Engineer & AI Practitioner',
      employmentType: 'full-time',
      availability: [],
      summary:
        "Data is everywhere — it's my job to find it, extract it, transform it, and deliver it to the business. With <strong>5+ years</strong> building enterprise data platforms on AWS, I combine deep technical expertise in PySpark, Airflow, and Kafka with a passion for AI/LLM applications. I lead teams, build pipelines, and bridge the gap between technical execution and business outcomes.",
      sectionOrder: ['stats-grid', 'summary', 'timeline', 'projects', 'education', 'skill-bars', 'languages', 'certifications', 'interests', 'references'],
      layout: {
        type: 'two-column',
        main: ['summary', 'timeline', 'projects', 'education'],
        sidebar: ['skill-bars', 'languages', 'certifications', 'interests', 'references'],
      },
      stats: [
        { number: '5+', label: 'Years Experience' },
        { number: '35%', label: 'Runtime Reduction' },
        { number: '22%', label: 'Cost Savings' },
        { number: '90%+', label: 'Data Quality' },
      ],
      skillBars: [
        { name: 'Python', level: 95 },
        { name: 'PySpark', level: 90 },
        { name: 'SQL', level: 90 },
        { name: 'AWS', level: 85 },
        { name: 'Airflow', level: 85 },
        { name: 'Kafka', level: 70 },
        { name: 'dbt', level: 70 },
        { name: 'FastAPI', level: 75 },
        { name: 'LangChain', level: 60 },
        { name: 'TypeScript', level: 50 },
      ],
      experienceBullets: {
        ibitse: ['Leading engineering standards, CI/CD, and backend services (TypeScript/Node) for a start-up.'],
        om_lead: ['Leading a team building data analytics solutions. PySpark on EMR/Glue, Airflow, Kafka, dbt, FastAPI. 35% runtime reduction, 22% cost savings.'],
        om_analyst: ['ETL pipelines from DB2 to S3. PySpark, Airflow, dbt, server administration.'],
        om_de: ['Data quality pipelines in medallion architecture golden layer. AWS, Airflow, Spark.'],
        umuzi: ['RESTful APIs with Django/FastAPI. Data wrangling pipelines.'],
      },
    },

    /* ---- Full-Time (new engagement page) ---- */
    full_time: {
      theme: 'data-engineer',
      title: 'Jade Makwela — Full-Time CV',
      subtitle: 'Senior Data Engineer — Full-Time',
      description: 'Full-time CV of Jade Makwela — Senior Data Engineer, AI/LLM Practitioner',
      employmentType: 'full-time',
      availability: [
        { label: 'Availability', value: 'Full-time employment' },
        { label: 'Start', value: 'Immediate' },
        { label: 'Location', value: 'Cape Town, South Africa (Remote-friendly)' },
        { label: 'Work Authorization', value: 'South African Citizen' },
      ],
      summary:
        'Senior Data Engineer with <strong>5+ years</strong> building enterprise-grade data platforms on AWS using Python, PySpark, EMR/Glue, Redshift, and Athena. Experienced in medallion/lakehouse patterns, streaming ingestion with Kafka, Airflow orchestration, and DataOps. Proven track record: 35% pipeline runtime reduction, 22% cost savings, 90%+ data-quality coverage. Seeking a full-time role where I can lead data platform engineering and deliver measurable business impact.',
      sectionOrder: ['summary', 'skills-grid', 'impact-highlights', 'experience', 'projects', 'education', 'certifications', 'languages', 'availability', 'references'],
      skills: ['programming', 'cloud_aws', 'data_engineering', 'frameworks'],
      impactHighlights: sharedSections.impactHighlights,
      experienceBullets: {},
    },

    /* ---- Contract (new engagement page) ---- */
    contract: {
      theme: 'freelance',
      title: 'Jade Makwela — Contract CV',
      subtitle: 'Contract Data Engineer & AI Consultant',
      description: 'Contract CV of Jade Makwela — Senior Data Engineer available for 2–4 month engagements',
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
      sectionOrder: ['summary', 'services', 'stats-grid', 'experience', 'projects', 'skills-grid', 'education', 'certifications', 'languages', 'availability', 'references'],
      skills: ['programming', 'cloud_aws', 'data_engineering', 'frameworks'],
      services: sharedSections.services,
      stats: sharedSections.stats,
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
      title: 'Jade Makwela — Part-Time CV',
      subtitle: 'Senior Data Engineer — Part-Time',
      description: 'Part-time CV of Jade Makwela — Senior Data Engineer, AI/LLM Practitioner',
      employmentType: 'part-time',
      availability: [
        { label: 'Engagement', value: 'Part-time · 20–30 hrs/week' },
        { label: 'Schedule', value: 'Flexible — aligned to team time zones' },
        { label: 'Location', value: 'Remote' },
        { label: 'Work Authorization', value: 'South African Citizen' },
      ],
      summary:
        'Senior Data Engineer with <strong>5+ years</strong> building enterprise-grade data platforms on AWS. Deep expertise in PySpark, AWS, Airflow, Kafka, and data quality. Available for part-time engagements (20–30 hrs/week) with flexible scheduling across time zones. Ideal for teams needing senior data engineering support without a full-time commitment.',
      sectionOrder: ['summary', 'skills-grid', 'experience', 'projects', 'education', 'certifications', 'languages', 'availability', 'references'],
      skills: ['programming', 'cloud_aws', 'data_engineering', 'frameworks'],
      experienceBullets: {},
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