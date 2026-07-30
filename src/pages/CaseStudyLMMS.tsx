import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  Lock,
  Layers,
  GitBranch,
  Target,
  RefreshCw,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { roles } from '@/data/experience';
import ShareLinks from '@/components/ShareLinks';

/**
 * Long-form case study for LM-MS. Route: /case-study/lm-ms
 *
 * DISCLOSURE BOUNDARY — read before editing.
 * LM-MS is a commercial product. This page describes architecture and the
 * reasoning behind it at a conceptual level only. It deliberately omits:
 * database/table/view/procedure names, column and register schemes, hostnames,
 * ports, install paths, app-pool names, framework versions, licensing and
 * cryptographic mechanisms, and the device vendor's model designations.
 * Do not add any of those here, even if a future reader asks for "more detail" —
 * the depth of a case study comes from the decisions, not the identifiers.
 *
 * THE PAGE IS KEPT DELIBERATELY CONCISE. Every section runs to a word budget:
 * context and architecture stay short, each decision card is a brief Why plus a
 * brief Trade-off, Results carries figures rather than adjectives, and the
 * incident is the only long block. Register is plain and professional — no
 * flourishes, no closing zingers, no commentary about the writing itself. If you
 * add a paragraph, cut one.
 *
 * PROTOCOL NAMES ARE EXCLUDED ON PURPOSE — this is a redaction, not an omission.
 * The polling cadences in Section 05 are real, but the transports they run over
 * are only ever called "primary" and "secondary". Naming one would tell a reader
 * exactly which well-known surface the field devices expose, which is a security
 * disclosure rather than an architectural one. Never reintroduce a protocol name,
 * a protocol family, or a port number anywhere on this page.
 *
 * THE FIGURES IN SECTION 05 ARE REAL PRODUCTION MEASUREMENTS. Each one was taken
 * against the running production deployment, carries the date it was taken
 * (29 July 2026 for the point-in-time counts; 11 June – 28 July 2026 for the
 * detection-to-notification window), and ships with its own "How measured" note.
 * If a figure cannot state how it was measured, it does not belong in Results.
 *
 * Unverified numbers are rendered through <Fill> as a loud [bracket] with a
 * TODO(laila) comment. Never let a placeholder ship as prose. Exactly two <Fill>
 * markers are intended on this page: the pre-LM-MS detection baseline (not
 * measurable from the system) and new-model onboarding time (unmeasured). Adding
 * a third means a real measurement was replaced by a guess — go measure instead.
 */

const role = roles[0];

const PAGE_TITLE = 'Case Study — LM-MS Power Monitoring | Laila Mohamed Fikry';
const PAGE_DESCRIPTION =
  'How LM-MS is architected: a monitoring platform for distributed solar, rectifier, inverter and generator power sites — the separation of acquisition from presentation, a device-agnostic measurement model, and the trade-offs behind each decision.';

const EMAIL = 'laila.mohamed.fikry@gmail.com';

/* Deliberately loud: if one of these reaches production it should read as a bug,
   not as copy. */
const Fill = ({ children }: { children: ReactNode }) => (
  <span className="inline whitespace-normal rounded-md border border-dashed border-amber-500/50 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[0.85em] font-medium text-amber-700 dark:text-amber-300">
    [{children}]
  </span>
);

/* ─── Figure treatments ──────────────────────────────────────────────────────
   Section 05 is carried by its numbers, so numbers get tabular figures and the
   heading colour — otherwise they dissolve into the prose and a reader skimming
   for evidence finds none. Purely presentational: no number lives in here. */
const Fig = ({ children }: { children: ReactNode }) => (
  <span className="font-semibold tabular-nums text-heading">{children}</span>
);

const MetricTile = ({ value, caption }: { value: string; caption: string }) => (
  <div className="rounded-2xl border border-subtle bg-surface-overlay p-4 text-center sm:p-5">
    <div className="font-poppins text-2xl font-black leading-none tracking-tight tabular-nums text-heading sm:text-3xl">
      {value}
    </div>
    <p className="mt-2 font-inter text-[11px] font-medium leading-snug text-subtle sm:text-xs">
      {caption}
    </p>
  </div>
);

/* Provenance, attached to the figure rather than to a footnote at the bottom of
   the page. A claim and the way it was measured should not be separable. */
const HowMeasured = ({ children }: { children: ReactNode }) => (
  <div className="mt-4 border-l-2 border-primary/30 pl-4">
    <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-subtle">
      How measured
    </span>
    <p className="font-inter text-[13px] leading-relaxed text-subtle">{children}</p>
  </div>
);

const ResultBlock = ({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}) => (
  <div className="rounded-3xl border border-subtle bg-surface-elevated p-5 sm:p-7">
    <div className="mb-3 flex items-start gap-3">
      <Icon size={18} aria-hidden="true" className="mt-1 flex-shrink-0 text-primary" />
      <h3 className="font-poppins text-base font-bold leading-snug text-heading sm:text-lg">
        {title}
      </h3>
    </div>
    <div className="space-y-3 text-[15px] leading-relaxed text-body">{children}</div>
  </div>
);

/* A note that qualifies the figure above it — kept as prose outside the card so
   it reads as the author speaking, not as part of the measurement. */
const AfterNote = ({ children }: { children: ReactNode }) => (
  <p className="px-1 text-[15px] leading-relaxed text-body sm:px-2">{children}</p>
);

const Lesson = ({ n, title, children }: { n: number; title: string; children: ReactNode }) => (
  <div className="rounded-2xl border border-subtle bg-surface-elevated p-5 sm:p-6">
    <span className="mb-2 inline-block rounded-md bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
      Lesson {n}
    </span>
    <h3 className="mb-2 font-poppins text-base font-bold leading-snug text-heading">{title}</h3>
    <p className="text-[15px] leading-relaxed text-body">{children}</p>
  </div>
);

const IncidentStep = ({ label, children }: { label: string; children: ReactNode }) => (
  <div>
    <span className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
      {label}
    </span>
    <div className="space-y-3 text-[15px] leading-relaxed text-body">{children}</div>
  </div>
);

const Section = ({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.5 }}
    className="mb-20 sm:mb-24"
  >
    {eyebrow && (
      <span className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
        {eyebrow}
      </span>
    )}
    <h2 className="mb-6 font-poppins text-2xl font-black tracking-tight text-heading sm:text-3xl">
      {title}
    </h2>
    <div className="space-y-5 font-inter text-base leading-relaxed text-body">{children}</div>
  </motion.section>
);

/* ─── Decision block: the unit a reader actually learns from ─────────────── */
const Decision = ({
  n,
  title,
  why,
  tradeoff,
}: {
  n: string;
  title: string;
  why: ReactNode;
  tradeoff: ReactNode;
}) => (
  <div className="rounded-3xl border border-subtle bg-surface-elevated p-6 sm:p-8">
    <div className="mb-4 flex items-start gap-4">
      <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 font-mono text-sm font-bold text-primary">
        {n}
      </span>
      <h3 className="font-poppins text-lg font-bold leading-snug text-heading sm:text-xl">
        {title}
      </h3>
    </div>
    <div className="space-y-4 pl-0 sm:pl-[52px]">
      <div>
        <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-subtle">
          Why
        </span>
        <p className="text-body">{why}</p>
      </div>
      <div>
        <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-subtle">
          Trade-off
        </span>
        <p className="text-body">{tradeoff}</p>
      </div>
    </div>
  </div>
);

/* ─── Architecture diagram ───────────────────────────────────────────────────
   Inline SVG. Colours come from CSS tokens so light and dark are both correct
   without duplicated markup. Node labels stay at product level on purpose. */
const ArchitectureDiagram = () => {
  const box = 'hsl(var(--surface-elevated))';
  const stroke = 'hsl(var(--primary) / 0.35)';
  const strong = 'hsl(var(--primary))';
  const ink = 'hsl(var(--foreground))';
  const muted = 'hsl(var(--muted-foreground))';

  const Node = ({
    x,
    y,
    w,
    h,
    title,
    lines,
    accent,
  }: {
    x: number;
    y: number;
    w: number;
    h: number;
    title: string;
    lines: string[];
    accent?: boolean;
  }) => (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={14}
        fill={accent ? 'hsl(var(--primary) / 0.10)' : box}
        stroke={accent ? strong : stroke}
        strokeWidth={accent ? 2 : 1.5}
      />
      <text
        x={x + w / 2}
        y={y + 30}
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill={ink}
      >
        {title}
      </text>
      {lines.map((line, i) => (
        <text
          key={line}
          x={x + w / 2}
          y={y + 52 + i * 17}
          textAnchor="middle"
          fontSize="11.5"
          fill={muted}
        >
          {line}
        </text>
      ))}
    </g>
  );

  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <svg
        viewBox="0 0 980 330"
        className="min-w-[900px] w-full"
        role="img"
        aria-label="Architecture: field equipment at solar, rectifier, inverter and generator power sites is polled by an acquisition service that normalizes every reading; the normalized data set holds live state and historical snapshots; the web application reads only that data set to serve dashboards, the single-site console, reports and alarms; alarms fan out to notification channels."
        fontFamily="Inter, Segoe UI, sans-serif"
      >
        <title>LM-MS two-stage architecture</title>
        <defs>
          <marker id="lmms-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L8,3 L0,6 Z" fill={strong} />
          </marker>
        </defs>

        <Node
          x={10}
          y={110}
          w={170}
          h={110}
          title="Power sites"
          lines={['Solar · rectifier ·', 'inverter · generator', 'battery, DC bus, load']}
        />

        <Node
          x={250}
          y={95}
          w={200}
          h={140}
          title="Acquisition service"
          lines={['polls every site', 'transport fallback chain', 'normalizes + scales once']}
          accent
        />

        <Node
          x={520}
          y={95}
          w={190}
          h={140}
          title="Normalized data set"
          lines={['live state', 'historical snapshots', 'one integration contract']}
          accent
        />

        <Node
          x={780}
          y={40}
          w={190}
          h={115}
          title="Operator web app"
          lines={['fleet dashboard + map', 'single-site console', 'catalog reporting']}
        />

        <Node
          x={780}
          y={185}
          w={190}
          h={100}
          title="Alerting"
          lines={['in-app · email · SMS', 'one record per event', 'scheduled reports']}
        />

        {/* flows */}
        <line x1={182} y1={165} x2={244} y2={165} stroke={strong} strokeWidth={2.5} markerEnd="url(#lmms-arrow)" />
        <text x={213} y={156} textAnchor="middle" fontSize="10.5" fill={muted}>poll</text>

        <line x1={452} y1={165} x2={514} y2={165} stroke={strong} strokeWidth={2.5} markerEnd="url(#lmms-arrow)" />
        <text x={483} y={156} textAnchor="middle" fontSize="10.5" fill={muted}>write</text>

        <line x1={712} y1={150} x2={774} y2={105} stroke={strong} strokeWidth={2.5} markerEnd="url(#lmms-arrow)" />
        <text x={741} y={116} textAnchor="middle" fontSize="10.5" fill={muted}>read</text>

        <line x1={712} y1={180} x2={774} y2={225} stroke={strong} strokeWidth={2.5} markerEnd="url(#lmms-arrow)" />
        <text x={745} y={220} textAnchor="middle" fontSize="10.5" fill={muted}>raise</text>

        <text x={490} y={305} textAnchor="middle" fontSize="11.5" fill={muted} fontStyle="italic">
          The web app never talks to equipment. The acquisition service never renders UI.
        </text>
      </svg>
    </div>
  );
};

const CaseStudyLMMS = () => {
  useEffect(() => {
    const previousTitle = document.title;
    const metaTag = document.querySelector('meta[name="description"]');
    const previousDescription = metaTag?.getAttribute('content') ?? null;

    document.title = PAGE_TITLE;
    metaTag?.setAttribute('content', PAGE_DESCRIPTION);

    return () => {
      document.title = previousTitle;
      if (previousDescription !== null) metaTag?.setAttribute('content', previousDescription);
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-surface pb-24">
      {/* Decorative glows, clipped so negative offsets can't cause page overflow. */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[130px]" />
        <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-8">
        <div className="py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg font-inter text-sm font-semibold text-subtle outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <ArrowLeft size={16} />
            Back to portfolio
          </Link>
        </div>

        {/* ─── Hero ─────────────────────────────────────────────────────── */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 border-b border-subtle pb-12"
        >
          <span className="mb-4 block text-[11px] font-bold uppercase tracking-[0.25em] text-primary">
            Case Study
          </span>
          <h1 className="mb-5 font-poppins text-4xl font-black leading-[1.1] tracking-tight text-heading sm:text-5xl">
            LM-MS — monitoring a fleet of{' '}
            <span className="text-gradient">power sites</span>
          </h1>
          <p className="mb-8 font-inter text-lg leading-relaxed text-body">
            A monitoring platform for distributed solar, rectifier, inverter and generator plants:
            one place to see whether every site is up, what carries its load, and what is about to
            fail.
          </p>

          <dl className="grid grid-cols-2 gap-5 font-inter text-sm sm:grid-cols-4">
            <div>
              <dt className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-subtle">Role</dt>
              <dd className="font-semibold text-heading">{role.title}</dd>
            </div>
            <div>
              <dt className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-subtle">Period</dt>
              <dd className="font-semibold text-heading">{role.duration}</dd>
            </div>
            <div>
              <dt className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-subtle">Company</dt>
              <dd className="font-semibold text-heading">{role.company}</dd>
            </div>
            <div>
              <dt className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-subtle">Status</dt>
              <dd className="font-semibold text-heading">In production</dd>
            </div>
          </dl>

          <div className="mt-7 flex flex-wrap gap-2">
            {role.tech.map(item => (
              <span
                key={item}
                className="rounded-lg border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary"
              >
                {item}
              </span>
            ))}
          </div>
        </motion.header>

        {/* ─── Disclosure note ──────────────────────────────────────────── */}
        <div className="mb-16 flex gap-4 rounded-2xl border border-subtle bg-surface-elevated p-5 sm:p-6">
          <Lock size={20} className="mt-0.5 flex-shrink-0 text-primary" />
          <div className="font-inter text-sm leading-relaxed text-body">
            <p className="mb-2 font-bold text-heading">What this write-up covers</p>
            <p className="mb-2">
              LM-MS is a commercial product, so this page stays at architecture and reasoning.
              Schema, hosts, ports, transports, licensing and hardware details are left out.
            </p>
            <p>
              The figures in <span className="font-semibold text-heading">Results</span> were
              measured against the running production deployment on the dates stated, and each says
              how. Anything in <Fill>amber brackets</Fill> is unverified.
            </p>
          </div>
        </div>

        {/* ─── Context ──────────────────────────────────────────────────── */}
        <Section id="context" eyebrow="01" title="Context & problem">
          <p>
            A power site is not one machine: mains, solar or rectifier modules, a DC bus, a battery,
            the load, sometimes an inverter or generator, each with its own readings and alarms.
            Across a fleet, the hard question is whether every site is healthy, and which equipment
            is at fault.
          </p>
          <p>
            Before a unified system, that meant checking site by site, each model in its own dialect.
            The failures that matter are quiet: mains lost hours ago and the battery draining, a
            faulted rectifier module, a dead cooling fan. All are cheap to fix early and expensive as
            an outage. LM-MS serves both the operator on one plant and the manager on fleet trends,
            and it writes settings back to equipment.
          </p>
        </Section>

        {/* ─── Architecture ─────────────────────────────────────────────── */}
        <Section id="architecture" eyebrow="02" title="Architecture">
          <p>
            The system is two stages with one contract between them. Acquisition owns all contact
            with equipment: it handles device differences and converts raw values into engineering
            units. It tries the primary transport first and falls back to a secondary, reusing whichever
            answers for a number of cycles before re-probing higher-priority ones. It writes into a
            normalized data set, which is all the web application reads.
          </p>
          <ArchitectureDiagram />
          <p>
            That boundary is the most consequential decision: the two halves deploy and fail
            independently, acquisition can restart mid-shift without taking dashboards down, and a UI
            release cannot break collection.
          </p>
        </Section>

        {/* ─── Decisions ────────────────────────────────────────────────── */}
        <motion.section
          id="decisions"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-20 sm:mb-24"
        >
          <span className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            03
          </span>
          <h2 className="mb-6 font-poppins text-2xl font-black tracking-tight text-heading sm:text-3xl">
            Key decisions
          </h2>
          <p className="mb-8 font-inter text-base leading-relaxed text-body">
            Each of these bought something and cost something.
          </p>

          <div className="space-y-5">
            <Decision
              n="01"
              title="Normalize once, at acquisition — the UI never re-scales a reading"
              why={
                <>
                  Every device model reports raw values that need scaling. In the presentation layer
                  that logic gets copied into every dashboard and report, and the copies drift.
                  Scaling at acquisition fixes the value once, for every consumer.
                </>
              }
              tradeoff={
                <>
                  A scaling mistake is written into history, not just displayed wrong. Fixing one
                  needs a corrected transform plus a backfill. Section 06 is exactly that, still
                  unreplayed.
                </>
              }
            />

            <Decision
              n="02"
              title="A device-agnostic measurement model, so one definition serves the whole fleet"
              why={
                <>
                  Readings are stored against canonical measurement identities, not per-model fields:
                  same identity, same quantity, every device. One dashboard column, report or alarm
                  definition works fleet-wide, and a new model is configuration, not code.
                </>
              }
              tradeoff={
                <>
                  The abstraction has to be right early, and it has no home for an unanticipated
                  reading. Section 06 vindicates it: a fleet-wide correction was one catalog edit.
                </>
              }
            />

            <Decision
              n="03"
              title="Separate live state from recorded history, and never build a report from live"
              why={
                <>
                  Live state and history have opposite requirements: a small picture, constantly
                  overwritten, versus an append-only series aggregated over weeks. Separating them
                  keeps dashboards fast and reports stable.
                </>
              }
              tradeoff={
                <>
                  Snapshot cadence is a hard ceiling on historical resolution: a spike shorter than
                  the interval is visible live and absent from history. Storage grows with the fleet,
                  so retention needs planning.
                </>
              }
            />

            <Decision
              n="04"
              title="Mirror the equipment's own alarm severity; never invent a tier"
              why={
                <>
                  Equipment classifies its own faults and operators are trained on those classes.
                  Re-deriving severity would put platform and hardware at odds during an incident.
                  Alarms carry the device's severity and clear on reported recovery.
                </>
              }
              tradeoff={
                <>
                  Noise cannot be quietened by reclassifying it in the UI; it has to be fixed at the
                  device or in the catalog. Operators cannot clear alarms themselves.
                </>
              }
            />

            <Decision
              n="05"
              title="Remote configuration writes are staged, reviewed, verified, and audited"
              why={
                <>
                  A careless write to a charge voltage or protection limit can take a site down.
                  Edits accumulate as a pending set, reviewed as old → new against the manufacturer's
                  limits, then read back, verified, and audited.
                </>
              }
              tradeoff={
                <>
                  Adjusting one value takes several steps, the right trade here and still slower.
                  Fleet-wide writes are asynchronous and partly applied, so per-site outcomes must be
                  surfaced.
                </>
              }
            />
          </div>
        </motion.section>

        {/* ─── What shipped ─────────────────────────────────────────────── */}
        <Section id="shipped" eyebrow="04" title="What shipped">
          <p>In production today, an operator gets:</p>
          <ul className="space-y-3">
            {[
              'A fleet view in list and map form, each site coloured by its worst active alarm.',
              'A single-site console showing which source feeds the load, whether the battery is charging, and each plant\'s real topology.',
              'A report catalog across solar, energy, battery, power quality, alarms and availability, runnable over any period, saveable, exportable, schedulable.',
              'An alarm workspace to acknowledge, annotate and hand over, with delivery in-app, email and SMS from one notification record.',
              'Health scoring that itemises each deduction: alarms, faulted modules, temperature, availability, so the score doubles as a work list.',
              'Remote configuration with staged edits and drift detection, per-user access scoping, and help plus a full offline manual.',
            ].map(item => (
              <li key={item} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-[0.6rem] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* ─── Results ──────────────────────────────────────────────────── */}
        <Section id="results" eyebrow="05" title="Results">
          {/* 2-up on mobile, 4-up from sm. Values are short enough that no tile
              needs to wrap its number at 375px. */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <MetricTile value="45 s" caption="median fault to SMS dispatched" />
            <MetricTile value="99.0%" caption="alarms cleared automatically on recovery" />
            <MetricTile value="10 min" caption="before a site is flagged stale" />
            {/* Both scales, side by side rather than one standing in for the other. */}
            <MetricTile value="300+" caption="sites across client deployments" />
          </div>

          <div className="space-y-5">
            <ResultBlock icon={Layers} title="Fleet scale">
              <p>
                LM-MS runs as deployments, one per client, and across them monitors <Fig>300+</Fig>{' '}
                sites. Every other figure here comes from the one deployment I have production
                database access to: <Fig>13</Fig> sites, <Fig>one</Fig> monitored controller each. The
                300+ is reach; the 13 is what I can verify end to end.
              </p>
              <HowMeasured>
                The 13 is a direct count of registered sites, devices and polling targets in the
                production database; all three agree. As of 29 July 2026. The 300+ is the deployed
                total reported from the business.
              </HowMeasured>
            </ResultBlock>

            <ResultBlock icon={RefreshCw} title="Data freshness">
              <p>
                Equipment is polled every <Fig>120 s</Fig> on the primary transport,{' '}
                <Fig>60 s</Fig> on the secondary, and acquisition flushes every <Fig>30 s</Fig>. The
                console refreshes every <Fig>60 s</Fig> and prints the age of what it shows. A site is
                flagged stale after <Fig>10 minutes</Fig> without data.
              </p>
              <p>
                Worst-case age of a displayed reading is roughly <Fig>3.5 minutes</Fig>: poll cycle,
                flush, refresh. Past 10 minutes it is flagged stale rather than left to age silently.
              </p>
              <HowMeasured>
                Read from the live service configuration in the current release, not from
                documentation. As of 29 July 2026.
              </HowMeasured>
            </ResultBlock>

            <ResultBlock icon={Target} title="Operational outcome — detection to notification">
              <p>
                From acquisition detecting a fault to SMS dispatch: median <Fig>45 s</Fig>, mean{' '}
                <Fig>86 s</Fig>, 90th percentile <Fig>207 s</Fig>, range <Fig>10–912 s</Fig>, across{' '}
                <Fig>2,039</Fig> matched fault-to-message pairs.
              </p>
              <p>
                Two caveats: this is detection to dispatch, not the instant the fault occurred, so
                add up to one polling cycle. Dispatch means handed to the gateway, not delivered.
              </p>
              <p>
                In the same window, <Fig>783</Fig> of <Fig>791</Fig> alarms (<Fig>99.0%</Fig>) closed
                themselves when the equipment recovered. Of <Fig>3,924</Fig> messages the gateway
                accepted <Fig>3,923</Fig>.
              </p>
              <HowMeasured>
                Joined each alarm event record to its outbound message record on the shared event key
                over 11 June – 28 July 2026, discarding pairs beyond one hour. The auto-clear rate is
                the share of alarms with a system-set recovery time.
              </HowMeasured>
            </ResultBlock>

            <AfterNote>
              {/* TODO(laila): this one stays bracketed. Do not substitute an estimate, a
                  vendor-brochure number, or a "typically hours" hand-wave — the only thing
                  that unblocks it is a customer willing to state their old detection time
                  on the record. */}
              The obvious comparison, time to notice a fault before LM-MS, is{' '}
              <Fill>not measurable from the system</Fill>. That baseline lived in phone calls and
              site visits, and stays bracketed until a customer states it.
            </AfterNote>

            <ResultBlock icon={GitBranch} title="Extensibility">
              <p>
                The catalog describes <Fig>four</Fig> device models against a shared measurement
                model of <Fig>~3,400</Fig> field definitions, with <Fig>867</Fig> alarm definitions
                per model. All of it is data rows, not code.
              </p>
              <p>
                On <Fig>7 July 2026</Fig> a fleet-wide correction to how a whole measurement family
                is interpreted (see the incident below) shipped as a catalog change: no code, no
                deployment, no restart, live within <Fig>10 minutes</Fig>.
              </p>
              <HowMeasured>
                Counts taken from the live device catalog; the 7 July change is evidenced by the
                measurement artefact disappearing from the stored series on that date with no
                accompanying release.
              </HowMeasured>
            </ResultBlock>

            <AfterNote>
              {/* TODO(laila): unblocked by one timed onboarding of a model you have never
                  integrated before — start-to-first-good-reading, wall clock. Until then it
                  stays bracketed. */}
              End-to-end time to onboard a brand-new model is{' '}
              <Fill>unmeasured — needs one timed example</Fill>. Correcting an existing model is not
              commissioning an unfamiliar one.
            </AfterNote>
          </div>
        </Section>

        {/* ─── Reflection ───────────────────────────────────────────────── */}
        <Section id="reflection" eyebrow="06" title="What I'd do differently">
          <p>Four lessons, then the incident behind three of them.</p>

          <div className="space-y-4">
            <Lesson n={1} title="Invest in the measurement model's tooling sooner.">
              A browsable reference and a lint for mis-mapped identities would have paid for
              themselves early; my slow debugging was mostly reading identifiers by hand.
            </Lesson>

            <Lesson n={2} title="Make the transform versioned and replayable from day one.">
              Normalizing at acquisition is right, but a scaling correction implies a backfill, and
              replaying history through a new transform version would make that routine.
            </Lesson>

            <Lesson n={3} title="Put contract tests on the boundary between the two stages.">
              A mismatch between what one side writes and the other expects shows up as a blank
              panel, not an error, and deserves its own tests.
            </Lesson>

            <Lesson n={4} title="Design alarm-noise reduction as a real feature.">
              Refusing to mask live faults is right, but flapping detection and correlation, one
              incident rather than forty alarms, belong in the plan.
            </Lesson>
          </div>

          {/* ─── Incident write-up ───────────────────────────────────────────
              Deliberately the most prominent block on the page: the coloured
              strip is a sibling element rather than a border-t utility so it
              cannot lose a specificity race with .border-subtle. */}
          <div className="overflow-hidden rounded-3xl border border-subtle bg-surface-elevated">
            <div
              aria-hidden="true"
              className="h-1.5 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500"
            />
            <div className="p-5 sm:p-7">
              <div className="mb-5 flex items-start gap-3">
                <AlertTriangle
                  size={20}
                  aria-hidden="true"
                  className="mt-1 flex-shrink-0 text-primary"
                />
                <div>
                  <h3 className="font-poppins text-lg font-bold leading-snug text-heading sm:text-xl">
                    One incident worth writing up: a battery current of 6,553 amps
                  </h3>
                  <p className="mt-1.5 font-inter text-xs font-medium text-subtle">
                    Present from the first day of recorded history · fixed 7 July 2026
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <IncidentStep label="Symptom">
                  <p>
                    Battery current on several solar sites intermittently read about{' '}
                    <Fig>6,553 A</Fig>, impossible on a 48-volt plant whose real currents are single
                    or low double digits.
                  </p>
                </IncidentStep>

                <IncidentStep label="Diagnosis">
                  <p>The scale factor for that measurement is one tenth:</p>
                  <div className="overflow-x-auto rounded-xl border border-subtle bg-surface-overlay px-4 py-3">
                    <p className="text-center font-mono text-sm font-semibold tabular-nums text-heading sm:text-base">
                      65535 × 0.1 = 6553.5
                    </p>
                  </div>
                  <p>
                    <Fig>65535</Fig> is the top of an unsigned 16-bit range. The controller reports
                    battery current as a <em>signed</em> value, positive charging and negative
                    discharging, and the model declared that whole family unsigned. Every discharge
                    reading became a large positive one.
                  </p>
                  <p>
                    The bug was invisible while the battery charged and appeared when the battery
                    carried the site.
                  </p>
                </IncidentStep>

                <IncidentStep label="Blast radius">
                  <p>
                    Because normalization happens once at acquisition (decision 01), this was never a
                    display bug. The wrong values went into history: <Fig>22,052</Fig> of{' '}
                    <Fig>238,565</Fig> stored records, across <Fig>8</Fig> sites, from the start of
                    the series on <Fig>17 May 2026</Fig> until the fix on <Fig>7 July 2026</Fig>.
                    Every trend and battery report over that window drew on them.
                  </p>
                </IncidentStep>

                <IncidentStep label="Fix">
                  <p>
                    One metadata change: declare the family signed in the device catalog. No code, no
                    release, no restart; live on the next configuration reload. Zero occurrences
                    since, verified over the last seven days of data. Decision 02 paid for itself.
                  </p>
                </IncidentStep>

                <IncidentStep label="What it changed in the design">
                  <ol className="space-y-4">
                    <li className="flex gap-3">
                      <span className="mt-px flex-shrink-0 font-mono text-xs font-bold text-subtle">
                        01
                      </span>
                      <span>
                        Signedness, unit and physical range became first-class metadata rather than
                        assumptions. A check flagging values outside a declared range would have
                        caught this on day one, not week seven.{' '}
                        <em className="text-subtle">Lesson 1.</em>
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-px flex-shrink-0 font-mono text-xs font-bold text-subtle">
                        02
                      </span>
                      <span>
                        Those <Fig>22,052</Fig> rows are still wrong. The transform is not versioned,
                        so fixing the past is a bespoke migration and has not been run.{' '}
                        <em className="text-subtle">Lesson 2.</em>
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-px flex-shrink-0 font-mono text-xs font-bold text-subtle">
                        03
                      </span>
                      <span>
                        Nothing raised an error. A physically impossible value passed through
                        acquisition, storage, dashboards, health scoring and reports without a
                        complaint. Range assertions belong on that boundary as tests.{' '}
                        <em className="text-subtle">Lesson 3.</em>
                      </span>
                    </li>
                  </ol>
                </IncidentStep>
              </div>
            </div>
          </div>
        </Section>

        {/* ─── CTA ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 border-t border-subtle pt-12 sm:flex-row">
          <Button
            asChild
            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#a78bfa] via-[#f472b6] to-[#7c3aed] font-bold text-white shadow-lg hover-glow"
          >
            <a href={`mailto:${EMAIL}?subject=LM-MS%20case%20study`}>
              <Mail size={18} className="mr-2" />
              Discuss this project
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex-1 h-12 rounded-xl border-subtle bg-surface-elevated font-bold text-heading"
          >
            <Link to="/writing">
              Read the writing
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>
        </div>

        <div className="mt-4">
          <ShareLinks title={PAGE_TITLE} label="Share this case study" />
        </div>
      </div>
    </main>
  );
};

export default CaseStudyLMMS;
