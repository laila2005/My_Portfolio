import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Mail, Lock, Layers, GitBranch, Target, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { roles } from '@/data/experience';

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
 * Unverified numbers are rendered through <Fill> as a loud [bracket] with a
 * TODO(laila) comment. Never let a placeholder ship as prose.
 */

const role = roles[0];

const PAGE_TITLE = 'Case Study — LM-MS Power Monitoring | Laila Mohamed Fikry';
const PAGE_DESCRIPTION =
  'How LM-MS is architected: a monitoring platform for distributed solar, rectifier and inverter power sites — the separation of acquisition from presentation, a device-agnostic measurement model, and the trade-offs behind each decision.';

const EMAIL = 'laila.mohamed.fikry@gmail.com';

/* Deliberately loud: if one of these reaches production it should read as a bug,
   not as copy. */
const Fill = ({ children }: { children: ReactNode }) => (
  <span className="inline whitespace-normal rounded-md border border-dashed border-amber-500/50 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[0.85em] font-medium text-amber-700 dark:text-amber-300">
    [{children}]
  </span>
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
        aria-label="Architecture: field equipment at power sites is polled by an acquisition service that normalizes every reading; the normalized data set holds live state and historical snapshots; the web application reads only that data set to serve dashboards, the single-site console, reports and alarms; alarms fan out to notification channels."
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
          lines={['Solar · rectifier ·', 'inverter plants', 'batteries, DC bus, load']}
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
            A monitoring platform for distributed solar, rectifier, and inverter plants: one place
            to see whether every site is up, what is carrying its load right now, and which
            equipment is about to cause an outage.
          </p>

          <dl className="grid grid-cols-1 gap-5 font-inter text-sm sm:grid-cols-3">
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
            <p>
              LM-MS is a commercial product, so this page stays at the level of architecture and
              reasoning. Schema, internal component names, hosts, ports, licensing and hardware
              vendor details are deliberately left out. Anything in{' '}
              <Fill>amber brackets</Fill> is a figure I have not yet verified for publication —
              treat it as unconfirmed rather than as a claim.
            </p>
          </div>
        </div>

        {/* ─── Context ──────────────────────────────────────────────────── */}
        <Section id="context" eyebrow="01" title="Context & problem">
          <p>
            A power site is not a single machine. It is utility mains, a solar array or a bank of
            rectifier modules, a DC bus, a battery, the load it feeds, and sometimes an inverter or
            generator — each reporting its own readings and its own alarms. Multiply that by a fleet
            spread across regions and the operational question becomes simple to ask and hard to
            answer: <em>is every site healthy right now, and if not, which piece of equipment is at
            fault?</em>
          </p>
          <p>
            Before a unified system, answering that meant checking equipment site by site, each
            model speaking its own dialect, with no shared history to compare against. The failures
            that matter are quiet ones: mains lost hours ago and the battery is now draining, a
            rectifier module has faulted so the rest carry more load, a cooling fan died and
            temperature is climbing. Every one of those is cheap to fix early and expensive as an
            outage.
          </p>
          <p>
            LM-MS had to serve two audiences at once: an operator who needs the current state of one
            plant in a glance, and a manager who needs availability, energy, and alarm trends across
            the fleet — while remaining safe enough to change equipment settings remotely.
          </p>
        </Section>

        {/* ─── Architecture ─────────────────────────────────────────────── */}
        <Section id="architecture" eyebrow="02" title="Architecture">
          <p>
            The system is two stages with a single contract between them. An acquisition service
            owns everything about talking to equipment: reaching each site, handling protocol
            differences, and converting raw values into engineering units. It writes into a
            normalized data set. The web application reads only that data set — it never contacts a
            device.
          </p>
          <ArchitectureDiagram />
          <p>
            That boundary is the most consequential decision in the project. It means the two halves
            deploy and fail independently: acquisition can be restarted mid-shift without taking the
            dashboards down, and a UI release cannot break data collection. It also means there is
            exactly one place where a device's quirks are handled.
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
            Each of these bought something and cost something. The costs are the honest part.
          </p>

          <div className="space-y-5">
            <Decision
              n="01"
              title="Normalize once, at acquisition — the UI never re-scales a reading"
              why={
                <>
                  Every device model reports raw values that need scaling and unit conversion. If
                  that logic lives in the presentation layer it gets duplicated into every
                  dashboard, report, and export, and the copies drift — the same measurement then
                  reads differently in two places, which destroys trust in the whole system. Scaling
                  at the point of acquisition means the stored value is already the truth, and every
                  consumer displays it verbatim.
                </>
              }
              tradeoff={
                <>
                  A scaling mistake is written into history, not just displayed wrong. Fixing one is
                  not a UI patch — it needs a corrected transform plus a backfill of affected
                  history, and until that runs, past and present disagree.
                </>
              }
            />

            <Decision
              n="02"
              title="A device-agnostic measurement model, so one definition serves the whole fleet"
              why={
                <>
                  Readings are stored against canonical measurement identities rather than
                  per-model fields: the same identity means the same physical quantity on every
                  device type. One dashboard column, one report definition, and one alarm definition
                  then work across the entire fleet, and onboarding a new equipment model becomes a
                  configuration exercise — its readings, units, and alarm catalog are described as
                  data — instead of a code change plus a release.
                </>
              }
              tradeoff={
                <>
                  The abstraction has to be right up front, and it is unforgiving when a device
                  exposes something the model has no home for. Canonical identifiers are also far
                  less readable than named columns, so the model needs its own metadata and tooling
                  before anyone new can navigate it confidently.
                </>
              }
            />

            <Decision
              n="03"
              title="Separate live state from recorded history, and never build a report from live"
              why={
                <>
                  The two have opposite requirements. Live state is a small, constantly overwritten
                  picture optimised for “what is happening now”; history is append-only and exists
                  to be aggregated over weeks. Keeping them separate lets the dashboards stay fast
                  while trends, health scoring, and reports read a stable series that nothing
                  overwrites underneath them.
                </>
              }
              tradeoff={
                <>
                  Snapshot cadence becomes a hard ceiling on historical resolution — a spike shorter
                  than the interval is visible live and absent from history. Storage grows with the
                  fleet, so retention has to be managed deliberately rather than discovered when a
                  disk fills.
                </>
              }
            />

            <Decision
              n="04"
              title="Multiple transports with automatic fallback, and remember what worked"
              why={
                <>
                  Field connectivity is not uniform: what a site supports and what its network
                  currently permits vary, so a single fixed protocol strands part of the fleet.
                  Acquisition tries transports in priority order and uses whichever answers, so one
                  site configuration works everywhere. Because re-probing every option on every
                  cycle would waste most of the polling budget, a successful transport is reused for
                  a number of cycles before higher-priority options are retried — a device that
                  returns to a richer transport gets promoted back automatically.
                </>
              }
              tradeoff={
                <>
                  A site quietly running on a lower-priority transport can expose fewer readings
                  while still looking “online”, so degradation needs its own visibility. The
                  stickiness is also a small state machine, and state machines are where the
                  intermittent bugs live.
                </>
              }
            />

            <Decision
              n="05"
              title="Mirror the equipment's own alarm severity; never invent a tier"
              why={
                <>
                  The equipment already classifies its faults, and operators are trained on those
                  classifications. Re-deriving severity in software would mean the platform and the
                  hardware disagree during an incident, which is exactly when disagreement is most
                  expensive. Alarms therefore carry the severity the device assigned, and an alarm
                  clears only when the equipment reports recovery — acknowledgement and notes are
                  workflow annotations layered on top, and none of them can mask a live fault.
                </>
              }
              tradeoff={
                <>
                  A chatty device stays chatty: noise cannot be quietened by reclassifying it in the
                  UI, it has to be fixed at the device or catalog level. Operators also lose the
                  satisfying “clear” button, which needs explaining once before it feels right.
                </>
              }
            />

            <Decision
              n="06"
              title="Remote configuration writes are staged, reviewed, verified, and audited"
              why={
                <>
                  Changing a charge voltage or a protection limit on live power equipment can take a
                  site down, so the flow is built to make a careless change hard: edits accumulate as
                  a pending set rather than being sent as you type; a review step shows every change
                  as old → new and range-checks it against the manufacturer's limits; the write is
                  read back and verified against what was intended; and every change lands in an
                  audit trail — including changes made physically at the equipment, so the record
                  stays complete. A baseline captured from a known-good site turns configuration
                  drift into a report, and there is a global switch to disable writes entirely.
                </>
              }
              tradeoff={
                <>
                  Deliberate friction: adjusting one value takes several steps, which is the correct
                  trade for this domain but genuinely slower. Fleet-wide writes also become
                  asynchronous and partially applied by nature, so per-site outcomes have to be
                  surfaced rather than assumed.
                </>
              }
            />

            <Decision
              n="07"
              title="Health scoring has to explain itself, or it gets ignored"
              why={
                <>
                  A bare score out of 100 is easy to build and easy to dismiss. Every deduction is
                  therefore itemised — which alarms, which faulted modules, which recurring
                  temperature problem, what availability — so the score doubles as a work list, and
                  a handful of plain-language notices name the subsystem and the evidence behind
                  them. That is the difference between a number an operator argues with and one
                  they act on.
                </>
              }
              tradeoff={
                <>
                  Rule-based scoring only recognises failure modes someone anticipated, and the
                  weights need periodic tuning as the fleet changes. It reads as objective while
                  actually encoding judgement — which is fine as long as the rules stay visible.
                </>
              }
            />

            <Decision
              n="08"
              title="Show how fresh the data is, everywhere"
              why={
                <>
                  A monitoring tool that renders stale readings as though they were current is worse
                  than one that is honestly offline, because it produces confident wrong decisions.
                  Every view states the age of what it is showing, the console refreshes on a fixed
                  cadence, and readings past a staleness threshold are flagged as stale instead of
                  silently ageing on screen.
                </>
              }
              tradeoff={
                <>
                  Surfacing this exposes normal network variance to users and generates “why is this
                  site stale?” questions — real support load, accepted in exchange for never
                  presenting a stale number as fact.
                </>
              }
            />
          </div>
        </motion.section>

        {/* ─── What shipped ─────────────────────────────────────────────── */}
        <Section id="shipped" eyebrow="04" title="What shipped">
          <p>
            The platform is in production use. What an operator gets today:
          </p>
          <ul className="space-y-3">
            {[
              'A fleet view in list and map form, each site coloured by its worst active alarm, with the power source currently carrying it.',
              'A single-site console that draws the plant as connected equipment and animates which source is feeding the load — including whether the battery is charging or discharging — and adapts to each plant\'s actual topology instead of showing empty panels for equipment that is not fitted.',
              'A catalog of reports across solar, energy, battery, power quality, alarms and availability, runnable over any period, saveable as reusable templates, exportable, and deliverable on a schedule.',
              'An alarm workspace for working incidents — acknowledge, annotate, remind, hand over — plus response-time tracking and a full action history.',
              'Alarm delivery through in-app, email, and SMS from a single notification record per event, so the channels cannot contradict each other.',
              'Remote device configuration with staged edits, validation, verification, drift detection against a baseline, and reusable setting profiles.',
              'Access scoped per user, so every dashboard, alarm list, and report shows only the sites that user is entitled to see.',
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
          <p className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm">
            <strong className="text-heading">On numbers:</strong> I would rather publish fewer
            figures than unverified ones. The bracketed items below are measurements I have not
            confirmed for public use yet, and they stay bracketed until I can point at how they were
            measured.
          </p>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <Layers size={18} className="mt-1 flex-shrink-0 text-primary" />
              <span>
                {/* TODO(laila): confirm the fleet figure you are willing to publish, whether it counts
                    sites or devices, and the as-of date. Hero.tsx currently claims "300+ remote sites
                    monitored" — make the two agree or soften both. */}
                <strong className="text-heading">Fleet scale:</strong>{' '}
                <Fill>confirm site count, whether it counts sites or devices, and as-of date</Fill>
              </span>
            </li>
            <li className="flex gap-3">
              <RefreshCw size={18} className="mt-1 flex-shrink-0 text-primary" />
              <span>
                {/* TODO(laila): the console's refresh cadence and staleness threshold are product
                    behaviour and safe to state precisely. Fill them in from the current release. */}
                <strong className="text-heading">Data freshness:</strong> the console refreshes on a
                fixed cadence and flags readings as stale past a set age —{' '}
                <Fill>state the two values from the current release</Fill>
              </span>
            </li>
            <li className="flex gap-3">
              <Target size={18} className="mt-1 flex-shrink-0 text-primary" />
              <span>
                {/* TODO(laila): the strongest possible claim here is a before/after on detection time.
                    Even a rough, honestly-caveated figure beats a generic statement. */}
                <strong className="text-heading">Operational outcome:</strong>{' '}
                <Fill>time to notice a fault before vs after LM-MS, and how you measured it</Fill>
              </span>
            </li>
            <li className="flex gap-3">
              <GitBranch size={18} className="mt-1 flex-shrink-0 text-primary" />
              <span>
                {/* TODO(laila): if onboarding a new device model is genuinely config-only, quantify it
                    — "a new model in a day, no release" is a strong, checkable claim. */}
                <strong className="text-heading">Extensibility:</strong> new equipment models are
                onboarded by configuration rather than a code release —{' '}
                <Fill>how long a new model actually takes, from one real example</Fill>
              </span>
            </li>
          </ul>
        </Section>

        {/* ─── Reflection ───────────────────────────────────────────────── */}
        <Section id="reflection" eyebrow="06" title="What I'd do differently">
          <p>
            <strong className="text-heading">Invest in the measurement model's tooling sooner.</strong>{' '}
            A device-agnostic identity scheme is the right core, and it is also the steepest part of
            the system to learn. Metadata, a browsable reference, and a lint that catches a
            mis-mapped identity would have paid for themselves early — most of my own slow debugging
            sessions traced back to reading identifiers by hand.
          </p>
          <p>
            <strong className="text-heading">Make the transform versioned and replayable from day one.</strong>{' '}
            Normalizing at acquisition is the correct call, but it means a scaling correction implies
            a historical backfill. Versioning the transform and being able to replay a window of
            history through a new version turns a delicate migration into a routine operation.
          </p>
          <p>
            <strong className="text-heading">Put contract tests on the boundary between the two stages.</strong>{' '}
            The single integration contract is the system's biggest strength and its most silent
            failure mode: a mismatch in what one side writes and the other expects shows up as a
            blank panel, not an error. That deserves automated tests in its own right, not the
            end-to-end checks I leaned on.
          </p>
          <p>
            <strong className="text-heading">Design alarm-noise reduction as a real feature.</strong>{' '}
            Refusing to mask live faults in the UI is right, but it leaves noise as somebody else's
            problem. Flapping detection and correlation — one root cause presented as one incident
            rather than forty alarms — belongs in the plan rather than in a backlog.
          </p>
          <p>
            {/* TODO(laila): the single most credible thing you can add to this page is one real
                incident — what broke, how you found it, what you changed afterwards. Recruiters
                remember the story; they skim the architecture. */}
            <strong className="text-heading">One incident worth writing up:</strong>{' '}
            <Fill>a real bug or outage from LM-MS, how you diagnosed it, and what it changed in the design</Fill>
          </p>
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
      </div>
    </main>
  );
};

export default CaseStudyLMMS;
