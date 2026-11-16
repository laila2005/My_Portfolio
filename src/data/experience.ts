/**
 * Single source of truth for work history and education.
 *
 * About.tsx and Experience.tsx both render from this file. They previously held
 * separate inline arrays that drifted apart (two different employer names, job
 * titles, and product names for the same roles appeared on one page).
 */

export type Role = {
  /** Employer or client. */
  company: string;
  /** Product or engagement the role delivered, when it differs from the company. */
  project?: string;
  title: string;
  /** Human-readable range; always include a start date. */
  duration: string;
  summary: string;
  tech: string[];
  link?: string;
  /** Internal route to a deeper write-up, when one exists. */
  caseStudy?: string;
  /**
   * Short badge for a role that isn't a finished chapter — e.g. 'Internship'.
   * Deliberately not used to assert progress ("in progress", "incoming"): the
   * `duration` dates already tell a reader where a role sits in time, and a
   * hardcoded status is a claim that silently goes stale.
   */
  badge?: string;
};

/**
 * Ordering: the ongoing lead role first, then the rest most-recent-first. The
 * dates are stated on every entry, so leading with the flagship role rather than
 * with whatever started most recently costs a reader nothing.
 */
export const roles: Role[] = [
  {
    company: 'LM Smart Solutions',
    project: 'LM-MS Monitoring System',
    title: 'Co-Founder & Full-Stack Engineer',
    duration: 'Nov 2025 – Present',
    summary:
      'Architecting and shipping LM-MS, a monitoring platform for distributed power sites — solar, rectifier, inverter, and generator plants. Covers the telemetry acquisition service, the normalized data model behind it, the operator dashboards and single-site console, catalog-driven reporting, and multi-channel alarm delivery.',
    // Product stack. Deliberately kept at this level: no versions, hosts, or
    // internal component names — see the case study's disclosure note.
    tech: ['C# / .NET', 'ASP.NET', 'SQL Server', 'Industrial protocols', 'IoT telemetry'],
    link: 'https://lm-tech-solutions.tech/',
    caseStudy: '/case-study/lm-ms',
  },
  {
    company: 'Banque Misr',
    title: 'Data Governance Intern',
    duration: '2 – 27 August 2026',
    badge: 'Internship',
    summary:
      "Summer placement in the data analytics division at one of Egypt's largest banks. Profiled a 50,000-record synthetic banking dataset in Python, SQL, and Excel — building data quality scorecards and auditing cross-field validation rules across completeness, consistency, and conformity. Modeled a money-transfer graph in Neo4j to trace lineage across systems, writing Cypher queries and handling CSV ingestion with ISO-8601 normalization and batched imports. Awarded Best Squad of the Program after a board-style executive presentation and technical Q&A before senior banking leadership.",
    tech: ['Python', 'SQL', 'Neo4j / Cypher', 'Data Profiling', 'MDM', 'Data Lifecycle Management', 'Excel'],
  },
  {
    company: 'Media Gate Company',
    project: 'Bagi Job Platform (bagijob.com)',
    title: 'Full-Stack Engineer (Freelance)',
    duration: 'Aug 2025 – Oct 2025',
    summary:
      "Took over an unfinished job portal and shipped it: completed the work a previous developer left incomplete, then built the payment and admin layers behind bagijob.com — Stripe subscription processing, automated revenue calculation, real-time approval notifications, and Bunny CDN video delivery. Also produced a revised technical plan for the platform's next phase.",
    tech: ['React.js', 'Stripe', 'Bunny CDN', 'REST API', 'Tailwind CSS'],
  },
];

export type Credential = {
  title: string;
  detail: string;
  period: string;
  /** External verification URL. Omit rather than link a dead verifier. */
  credential?: string;
  /** Locally hosted proof, used when the issuer's verifier is unavailable. */
  localProof?: string;
  kind: 'work' | 'education' | 'community' | 'certification';
};

export const credentials: Credential[] = [
  {
    kind: 'education',
    title: 'ALX Africa — Software Engineering',
    detail:
      'Intensive software engineering program covering full-stack development, systems programming in C, and DevOps fundamentals.',
    period: 'Oct 2023 – Jul 2025',
    credential: 'https://savanna.alxafrica.com/certificates/59enB3JY6M',
  },
  {
    kind: 'education',
    title: 'El Sewedy University of Technology',
    detail: 'B.Sc. Computer Science (Polytechnic of Egypt).',
    period: 'Expected graduation 2027',
  },
];

export const certifications: Credential[] = [
  {
    kind: 'certification',
    title: 'Green Digital Certificate',
    detail: 'Sustainable development and green technology principles.',
    period: '2025',
    // The issuer's verifier URL no longer resolves, so the local PDF is the proof.
    localProof: '/green%20digital%20certificate.pdf',
  },
  {
    kind: 'certification',
    title: 'Galactic Problem Solver — NASA Space Apps Challenge',
    detail:
      'Certificate for outstanding participation in the 2026 NASA International Space Apps Challenge (14–15 November 2026), awarded to team AstroSpark for FlameLens, a dashboard that checks cabin atmospheres against NASA microgravity fire experiments.',
    period: 'Nov 2026',
    localProof: '/nasa-space-apps-2026-certificate.webp',
  },
];
