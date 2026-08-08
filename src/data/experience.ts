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
    project: 'LM-MS — Unified Power Monitoring System',
    title: 'Co-Founder & Lead Software Engineer',
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
      "Summer placement in the data analytics branch at one of Egypt's largest banks — focusing on data governance practices for enterprise systems.",
    tech: ['Data Governance', 'Data Analytics', 'Compliance'],
  },
  {
    company: 'Media Gate Company',
    project: 'Bagi Job Platform (bagijob.com)',
    title: 'Full-Stack Engineer (Freelance)',
    duration: 'Aug 2025 – Oct 2025',
    summary:
      'Built a job portal from scratch as a freelance engagement: React frontend, backend server architecture, and the payment and admin workflows behind bagijob.com.',
    tech: ['React.js', 'Redux', 'REST API', 'PostgreSQL', 'Tailwind CSS'],
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
    period: 'Expected graduation 2028',
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
];
