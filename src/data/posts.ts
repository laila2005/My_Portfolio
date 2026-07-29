/**
 * Long-form writing, stored as structured blocks rather than HTML strings.
 *
 * Rendering blocks (instead of `dangerouslySetInnerHTML`) keeps the article
 * markup owned by the renderer in src/pages/WritingPost.tsx: styling stays in
 * one place, and no post can inject markup into the page.
 *
 * HONESTY NOTE FOR THE AUTHOR: every claim here is traceable either to something
 * already published elsewhere in this repo (src/data/projects.ts descriptions,
 * Hero.tsx terminal text) or to a technical write-up supplied by the author —
 * which is where the 68% F1-score in the crash-detection post comes from.
 * Anywhere a real measurement belongs and does not yet exist, the copy carries a
 * visible `[add: ...]` / `[verify: ...]` marker plus a TODO comment below. Fill
 * those in or cut the sentence — do not let them ship as prose.
 *
 * The three posts added after the first two carry no placeholders: they were
 * written to work around the figures that do not exist rather than to reserve a
 * slot for them. If you later want a number in one of those posts, measure it
 * first.
 *
 * DISCLOSURE BOUNDARY — 'monitoring-a-fleet-you-cannot-see' describes LM-MS,
 * which is a commercial product. That post holds exactly the same line as
 * src/pages/CaseStudyLMMS.tsx: no database/table/view/procedure names, no column
 * or register schemes, no hostnames, ports, install paths or app-pool names, no
 * framework versions, no licensing or cryptographic mechanisms, no hardware
 * vendor or model designations, and no customer or site identities. The depth
 * comes from the decisions. Do not add identifiers to it later, however
 * reasonable the request sounds.
 *
 * Ordering is oldest first. Both consumers (src/pages/Writing.tsx and
 * src/pages/WritingPost.tsx) sort by date themselves, so this is a filing
 * convention rather than a rendering one — keep new entries in date order.
 */

export type Block =
  | { type: 'p' | 'h2' | 'h3' | 'quote'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'code'; lang: string; code: string };

export type Post = {
  slug: string;
  title: string;
  /** ISO date (YYYY-MM-DD). Rendered with toLocaleDateString. */
  date: string;
  readingTime: string;
  excerpt: string;
  tags: string[];
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: 'zagel-websocket-architecture',
    title: 'The Real-Time Layer Behind Zagel: Sockets, Signalling, and Three Shells',
    date: '2026-05-18',
    readingTime: '9 min read',
    excerpt:
      'Zagel carries messaging over WebSockets and calls over WebRTC, across web, desktop, and mobile. These are the problems that combination forces you to solve — connection lifecycle, handshake auth, fan-out, and keeping one codebase honest across three shells.',
    tags: ['WebSockets', 'WebRTC', 'FastAPI', 'Next.js', 'Real-time'],
    body: [
      {
        type: 'p',
        text: 'Zagel is a messaging platform built on a Next.js frontend and a FastAPI backend, with WebSockets carrying messages, WebRTC carrying audio and video, JWT for authentication, and native shells produced by Electron on desktop and Capacitor on mobile. This post is not a tour of that codebase. It is a write-up of the engineering problems that stack forces you to confront, and the patterns I reach for when solving them. The code samples are deliberately generic teaching examples, not production source.',
      },

      { type: 'h2', text: 'A socket is not a request' },
      {
        type: 'p',
        text: 'With plain HTTP, the server holds almost nothing about a client between calls. Each request arrives with everything it needs, gets answered, and is forgotten. A WebSocket inverts that: the connection is long-lived, stateful, ordered, and — the part that surprises people — perfectly capable of dying without telling anyone.',
      },
      {
        type: 'p',
        text: 'So the hard part of "real-time" is almost never pushing bytes down a pipe. It is every question a persistent connection quietly hands you: who is on the other end, are they still allowed to be, what did they miss while they were gone, and what do you do when the network lies about being up.',
      },

      { type: 'h2', text: 'Connection lifecycle is most of the work' },
      {
        type: 'p',
        text: 'If I could give a real-time client exactly one piece of engineering budget, it would go here. Everything users perceive as "the app is broken" tends to live in the lifecycle, not in the message handling.',
      },
      {
        type: 'ul',
        items: [
          'Open is not connected. Treat a socket as usable only once the server has acknowledged authentication and handed back a session identity — otherwise the UI flips to "online" before the connection can actually do anything.',
          'Closures are not equal. A clean 1000 after sign-out must not reconnect. A 1006 abnormal closure, or a network change, must. Conflating the two produces either a dead app or a reconnect storm.',
          'Dead-but-open sockets are the classic failure. A phone walks into a lift and the socket stays "open" for minutes. Application-level heartbeats — client pings, server pongs, both with deadlines — detect this far faster than TCP will.',
          'Reconnecting is easy; resynchronising is the hard part. A reconnected client has a gap in its history and must be able to ask "what happened after message X?", which means the server needs a per-conversation cursor it can answer from.',
          'Backoff must be jittered. Without jitter, every client dropped by the same blip comes back in lockstep and recreates the outage you just recovered from.',
        ],
      },
      {
        type: 'code',
        lang: 'ts',
        code: `// Illustrative reconnect helper: exponential backoff, jitter, fresh ticket
// per attempt. Resync is deliberately the caller's job — see onReady.
type Handlers = {
  onMessage: (data: unknown) => void;
  onReady: () => void; // good place to request "everything since my cursor"
};

export function connect(getUrl: () => Promise<string>, h: Handlers) {
  let attempt = 0;
  let socket: WebSocket | null = null;
  let closedByUs = false;

  const delay = () => {
    const ceiling = Math.min(30_000, 500 * 2 ** attempt);
    return ceiling / 2 + Math.random() * (ceiling / 2); // jittered
  };

  async function open() {
    socket = new WebSocket(await getUrl());

    socket.onopen = () => {
      attempt = 0;
      h.onReady();
    };

    socket.onmessage = (event) => h.onMessage(JSON.parse(event.data));

    socket.onclose = (event) => {
      if (closedByUs || event.code === 1000) return; // intentional
      if (event.code === 4401 || event.code === 4403) return; // auth: stop
      const wait = delay();
      attempt += 1;
      setTimeout(open, wait);
    };
  }

  open();

  return () => {
    closedByUs = true;
    socket?.close(1000, 'client shutdown');
  };
}`,
      },

      { type: 'h2', text: 'Authenticating the handshake' },
      {
        type: 'p',
        text: 'Browsers give you no way to set custom headers on `new WebSocket(...)`, which rules out the Authorization header you use everywhere else. That leaves three real options, and they are not equally good. A cookie rides along automatically but behaves differently the moment your app runs from a native shell origin. A token in the query string ends up in proxy logs, server logs, and browser history. The option I prefer is a short-lived, single-use ticket minted over an already-authenticated HTTP call and exchanged during the handshake.',
      },
      {
        type: 'code',
        lang: 'py',
        code: `# Illustrative: verify identity during the handshake, before accepting.
async def ws_endpoint(ws: WebSocket, ticket: str):
    try:
        claims = decode_jwt(ticket, audience="ws")  # signature + exp + aud
    except InvalidToken:
        await ws.close(code=4401)   # app-level "unauthorized", not a blip
        return

    await ws.accept()
    session = await registry.join(user_id=claims["sub"], ws=ws)
    try:
        # The read loop also handles "auth" frames, so a long-lived socket
        # can refresh a short-lived identity without dropping.
        await session.pump()
    finally:
        await registry.leave(session)`,
      },
      {
        type: 'ul',
        items: [
          'Validate before you accept. Accepting first and checking later means there is a window where an unauthenticated socket exists in your registry.',
          'Close with an application code (4401, 4403) so the client can distinguish "you are not allowed" from "the network broke". One of those should never trigger a retry loop.',
          'Scope the socket credential. A separate audience and a lifetime measured in seconds makes a leaked ticket close to worthless.',
          'Long sockets outlive short tokens. A connection authenticated an hour ago is not evidence the user is still valid; support re-auth on the open connection and expire connections that stop refreshing.',
          'Authentication is not authorisation. Permission to hold a socket is not permission to read a given conversation — check that on subscribe, per room, every time.',
        ],
      },

      { type: 'h2', text: 'Fan-out: deciding who gets the message' },
      {
        type: 'p',
        text: 'When a message lands, the server has to answer one question: which connections care? With a single process that is a Map from room id to a set of sockets, and it is genuinely fast. It is also the design that breaks the first time you run two instances, because two members of the same conversation can be attached to different processes.',
      },
      {
        type: 'ul',
        items: [
          'An in-process registry is correct only while there is exactly one process. Write it knowing you will replace its transport, and keep the lookup behind an interface.',
          'A pub/sub layer between instances restores correctness: each instance subscribes to the rooms its local sockets care about and re-broadcasts locally. Redis, NATS, or the database notification channel all work; the pattern matters more than the pick.',
          'Give every connection a bounded send queue. One slow consumer on hotel Wi-Fi must not apply backpressure to an entire broadcast — when its queue overflows, drop the socket and let it resync on reconnect.',
          'Persist before you broadcast. If the write fails after fan-out, some clients are now displaying a message that does not exist anywhere.',
          'Deduplicate on a client-generated id. The client mints the id, the server persists and echoes it, and the sender reconciles its optimistic bubble against the echo. That single move is what makes an at-least-once path feel exactly-once.',
        ],
      },

      { type: 'h2', text: 'WebSockets for signalling, WebRTC for media' },
      {
        type: 'p',
        text: 'These are not competing choices; they solve different problems and Zagel needs both. A WebSocket is a TCP stream, so it retransmits and preserves order — exactly right for chat, where a lost message is unacceptable and a 200ms delay is invisible. That same guarantee is wrong for live media, where a video frame that arrives 300ms late is worthless and head-of-line blocking turns a dropped packet into a visible stall.',
      },
      {
        type: 'p',
        text: 'WebRTC exists for the media side: UDP-based transport, its own congestion control, jitter buffers, and the possibility of a direct peer path. What it cannot do is bootstrap itself. Offers, answers, and ICE candidates have to travel over a reliable, ordered, already-authenticated channel — which is the WebSocket. The clean way to hold it in your head: the WebSocket is the control plane, WebRTC is the media plane.',
      },
      {
        type: 'ul',
        items: [
          'Signalling must be reliable and ordered. A single dropped ICE candidate is a call that silently never connects.',
          'NAT means the direct path sometimes does not exist. STUN discovers your public address; TURN relays when discovery is not enough. Relay bandwidth is a cost line, not an edge case.',
          'Group calls are a different system. Full-mesh peer connections stop scaling after a handful of participants, and moving to a server-side forwarding unit changes your operational profile completely.',
          'Permissions and device state are UI problems, not protocol problems, and they are where most call bugs actually live: revoked microphone access, a headset unplugged mid-call, a camera held by another app.',
        ],
      },

      { type: 'h2', text: 'One codebase, three shells' },
      {
        type: 'p',
        text: 'Zagel ships to the browser, to desktop through Electron, and to mobile through Capacitor. Most of that really is free — it is the same app. The parts that are not free are precisely the parts that touch the platform, and they cluster around the socket.',
      },
      {
        type: 'ul',
        items: [
          'Credential storage differs. Browsers give you cookies and localStorage; the native shells give you real secure storage. Hide it behind one interface and let each shell supply the implementation.',
          'Mobile suspends your process. A backgrounded app loses its socket with no close event and no error; treat "app resumed" as an explicit reconnect-and-resync trigger rather than hoping the socket survived.',
          'Origins differ. Serving from a native scheme rather than https changes CORS, cookie behaviour, and what counts as a secure context — which is exactly why cookie-based handshake auth tends to collapse first on native shells.',
          'Notifications do not generalise. A live socket reaches a foreground app; a closed app needs push. That is a second delivery path with its own failure modes, not a fallback you inherit.',
          'Keep platform branching at the edges. One `platform` module with narrow, well-named capabilities beats conditionals sprinkled through feature code, because the conditionals are what make the third shell expensive.',
        ],
      },

      { type: 'h2', text: 'What I actually measured' },
      {
        type: 'p',
        text: 'This project used to be described as doing "sub-millisecond WebSocket messaging". That was never plausible — a network round trip does not fit inside a millisecond outside a loopback interface — so here is the number with its method attached, which is the only form in which a latency figure is worth anything.',
      },
      {
        type: 'ul',
        items: [
          'Boundary: client send-to-echo, `t_receive_ack - t_send`. Not the server\'s internal handling time — the whole path, including client-side AES-256-GCM encryption, the socket hop, the in-memory dispatch, and arrival plus render on the receiving client.',
          'Percentile: p95 over a sample of 1,000 transmitted messages. Not a best case, and not a mean hiding a long tail.',
          'Load: 100 concurrent WebSocket sessions, all holding ping/pong keep-alive frames, rather than one idle connection with the whole server to itself.',
          'Result: under 50ms at p95, with the server\'s own routing isolated at roughly 3.8–6.2ms average and a p99 below 12ms.',
        ],
      },
      {
        type: 'p',
        text: 'The interesting part of that breakdown is the gap. If the server routes in about five milliseconds and the full round trip is an order of magnitude larger, then the backend is not the bottleneck and optimising it further buys almost nothing — the remaining time is network, encryption, and render. That is the difference a measurement boundary makes: quote only the server number and you would walk away with the wrong plan.',
      },
      {
        type: 'quote',
        text: 'A latency figure without a percentile, a path, and a load level is a screenshot, not a measurement.',
      },
      {
        type: 'p',
        text: 'The instrumentation I would want before quoting any number again is unglamorous and short:',
      },
      {
        type: 'ul',
        items: [
          'A histogram of server-side handling time, bucketed per message type, so one expensive path cannot hide inside an average.',
          'Client-side send-to-echo round trip, reported as percentiles, because that is the number a user actually experiences.',
          'Connection churn: reconnects per client per hour, and the close codes behind them. Rising churn is the earliest signal something is wrong.',
          'Fan-out size distribution, since broadcast cost scales with the biggest room, not the median one.',
          'Send-queue depth per connection, which is how you find slow consumers before they find you.',
        ],
      },

      { type: 'h2', text: 'The short version' },
      {
        type: 'ul',
        items: [
          'Budget your effort for the reconnect, not the happy path.',
          'Authenticate during the handshake with a short-lived scoped ticket, and re-check authorisation per subscription.',
          'Assume a second process will exist, and keep fan-out behind an interface that can grow a pub/sub layer.',
          'WebSocket for control, WebRTC for media — and never try to make one do the other job.',
          'Publish measurements with a method attached, or do not publish numbers at all.',
        ],
      },
    ],
  },

  {
    slug: 'an-llm-key-does-not-belong-in-your-app-bundle',
    title: 'An API Key Inside an APK Is a Published Key',
    date: '2026-06-14',
    readingTime: '5 min read',
    excerpt:
      'A mobile bundle is a file sitting on a device you do not control, and a language model that is allowed to answer in prose eventually will. Two boundaries in RiseList exist because of those two sentences.',
    tags: ['Mobile Security', 'API Keys', 'LLM Integration', 'JSON Schema', 'Flutter'],
    body: [
      {
        type: 'p',
        text: 'RiseList is a voice-first planner. You talk at it — a rambling, half-formed account of what your day contains — and it gives back structured tasks with priorities, categories, and times. On-device speech-to-text captures the transcript with a live waveform so the app is visibly listening, and capture is bilingual: English, Arabic, or the two mixed inside one sentence, with the language detected rather than picked from a menu. Firestore handles sync and offline persistence, daily streaks are calculated server-side in a transaction, and a timezone-aware local notification delivers a morning briefing.',
      },
      {
        type: 'p',
        text: 'Two boundaries in that pipeline are worth writing about on their own, because neither is specific to this app. One decides what the client is allowed to know. The other decides what the model is allowed to say.',
      },

      { type: 'h2', text: 'An APK is a zip file' },
      {
        type: 'p',
        text: 'That is the whole argument, and it is worth stating bluntly, because plenty of tutorials still drop an API key into a constant and move on. A shipped mobile binary is a file on a device you do not control. It can be pulled off, unzipped, and read. Strings can be dumped out of it. Traffic can be watched through a proxy. Obfuscation raises the effort slightly and changes nothing structural, because at the moment the request goes out the key has to exist in plaintext in memory.',
      },
      {
        type: 'p',
        text: 'So a key in a client bundle is not a hidden key. It is a published key with an awkward distribution format. The consequences are practical rather than theoretical: the usage is billed to you, the key is on every install you have ever shipped, and you cannot rotate it without publishing a release and waiting for people to update. Until they do, the old one is still live in their hands.',
      },

      { type: 'h2', text: 'A thin proxy is the minimum, not the clever part' },
      {
        type: 'p',
        text: 'RiseList sends the transcript to a small Val Town HTTP endpoint, and that endpoint is where the Gemini key lives. The client never holds it. There is nothing sophisticated about this. It is the floor — the least you can do and still be able to say the key is not published.',
      },
      {
        type: 'code',
        lang: 'ts',
        code: `// Illustrative proxy sketch, not production source. The credential is read
// from the server environment and never crosses the wire to the client.
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('method not allowed', { status: 405 });
  }

  const { transcript, timezone } = await req.json();
  if (typeof transcript !== 'string' || transcript.length > 4000) {
    return new Response('bad request', { status: 400 });
  }

  // The only place the key exists — and therefore the only place a per-user
  // rate limit, an abuse check, or a spend cap can be enforced at all.
  const upstream = await fetch(MODEL_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: 'Bearer ' + env('MODEL_API_KEY'),
    },
    body: JSON.stringify(buildRequest(transcript, timezone)),
  });

  if (!upstream.ok) return new Response('upstream failed', { status: 502 });

  // Validate here, so the phone is never the first thing to discover that the
  // model answered in prose.
  const parsed = TaskPlan.safeParse(await upstream.json());
  if (!parsed.success) {
    return new Response('unusable model output', { status: 502 });
  }

  return Response.json(parsed.data);
}`,
      },
      {
        type: 'p',
        text: 'What makes the proxy worth more than the fix itself is that it is a seam. Before it existed there was nowhere to put a policy, because the only path to the model ran on hardware I do not own. Afterwards there is exactly one place all model traffic passes through, and that is where a per-user rate limit goes, where abuse controls go, where a monthly spend cap goes, and where a prompt changes without an app release. Swapping the model later is a server edit rather than a store submission.',
      },
      {
        type: 'p',
        text: 'The limit is worth naming too. A proxy does not authenticate anyone. It moves the problem from "anybody holding the APK can spend my quota" to "anybody who can reach my endpoint can spend my quota". The second problem is smaller, and it sits on infrastructure I control, which makes it one I can actually work on.',
      },

      { type: 'h2', text: 'A model that can answer in prose eventually will' },
      {
        type: 'p',
        text: 'Leave the output shape open and a model will mostly return something parseable, then occasionally return a friendly sentence in front of the JSON, or the JSON inside a fenced code block, or a paragraph explaining what it would have returned. Not often. Often enough that the client accumulates a small pile of defensive string handling, which is the worst possible home for that logic, because fixing it means shipping a release.',
      },
      {
        type: 'p',
        text: 'So the endpoint constrains the response to a strict schema. The model is not asked for a task list, it is required to emit objects with declared fields: a title, a priority, a category, a scheduled time. That is the move that turns model output into a data structure instead of a parsing problem.',
      },
      {
        type: 'code',
        lang: 'ts',
        code: `// Illustrative schema — the enum members are placeholders. The shape of the
// idea is the point: unknown fields rejected rather than ignored, lists
// bounded, and every field that can be a fixed set declared as one.
const Task = z
  .object({
    title: z.string().min(1).max(120), // kept exactly as spoken
    priority: z.enum(['high', 'medium', 'low']),
    category: z.enum(['work', 'study', 'health', 'errand', 'personal']),
    scheduledAt: z.string().datetime().optional(),
  })
  .strict();

const TaskPlan = z.object({ tasks: z.array(Task).max(20) }).strict();`,
      },
      {
        type: 'p',
        text: 'A narrower schema can express fewer wrong answers. And it belongs on the server for the same reason the key does: the server is the part you can change today.',
      },

      { type: 'h2', text: 'The failure to design for is valid JSON that is wrong' },
      {
        type: 'p',
        text: 'A schema checks shape. It cannot check sense. Once parse errors stop happening, this is the failure you actually meet: a response that validates perfectly and puts the gym at high priority at 3am, or invents a task nobody mentioned, or quietly drops the one thing the user cared about, or reads a passing "I should probably" as a commitment.',
      },
      {
        type: 'p',
        text: 'Two things help. Narrow the schema until it can express less, then range-check what the schema cannot: a valid timestamp is not necessarily a plausible one. And do not write anything silently. RiseList shows every extracted task for review before it is committed, which I first built as a courtesy and now regard as the real safety mechanism. Structured output is not correct output, and a person glancing at four rows for two seconds catches a kind of wrong that no validator will.',
      },

      { type: 'h2', text: 'Two languages in one sentence' },
      {
        type: 'p',
        text: 'This is the part I did not see coming. Speech here mixes Arabic and English constantly, and not politely at sentence boundaries — inside a single clause, mid-phrase, the English word sitting in the middle of an Arabic sentence because that is simply the word people use for it. A transcript comes back holding both scripts, and there is no single correct language tag for it.',
      },
      {
        type: 'p',
        text: 'The schema has to tolerate that rather than resolve it. No required language field, because the honest answer to that field is "both". No transliterating titles into one script, because the title a person recognises is the one they actually said. Two text directions inside one string, which the interface then has to render without mangling. The structure around the text is strict; the text itself is left alone.',
      },
      {
        type: 'p',
        text: 'Neither boundary is clever, and that is roughly the point. One keeps a secret off a device I cannot trust. The other keeps prose out of a code path that expects objects. Everything downstream is ordinary application work, and it gets to stay ordinary because neither a credential nor an unparsed paragraph ever reaches it.',
      },
    ],
  },

  {
    slug: 'crash-detection-lessons',
    title: 'Three Thousand Images and a 68% F1-Score',
    date: '2026-06-29',
    readingTime: '8 min read',
    excerpt:
      'A crash-detection classifier trained on 3,000 real-world traffic images scored 68% F1 on entirely unseen test data. What that taught me about small-data vision: why transfer learning wins, what Grad-CAM does and does not prove, and why F1 — not accuracy — is the only headline metric worth quoting on imbalanced safety data.',
    tags: ['Computer Vision', 'Transfer Learning', 'Grad-CAM', 'Model Evaluation', 'MobileNetV2'],
    body: [
      {
        type: 'p',
        text: 'The crash-detection project in my portfolio is a pair of image classifiers — a CNN written from scratch and a MobileNetV2 fine-tuned through transfer learning — trained on roughly 3,000 real-world traffic images, with Grad-CAM producing heatmaps over the regions the model associated with structural damage, served through a Streamlit app. That is the whole of what shipped. This post is about what building it taught me, including the parts that do not flatter the project.',
      },

      { type: 'h2', text: '3,000 images is a constraint, not a dataset' },
      {
        type: 'p',
        text: 'Modern vision backbones are shaped by millions of examples. At three thousand, model capacity comfortably outruns the data, so the real engineering shifts away from architecture and towards two things: suppressing overfitting, and being disciplined about what you are entitled to conclude.',
      },
      {
        type: 'ul',
        items: [
          'Geometric augmentation — horizontal flips, small rotations, random resized crops, scale jitter — is nearly free and buys genuine robustness to framing and distance.',
          'Photometric augmentation matters more than it looks like it should. Brightness and contrast shifts, motion blur, and JPEG artefacts approximate the conditions real traffic imagery actually arrives in: night, rain, glare, cheap lenses.',
          'Augmentation has to respect semantics. A horizontal flip is fine. A vertical flip produces a world that does not exist. Aggressive colour shifting can erase the very cue the model depends on.',
          'Augmentation multiplies what you have; it cannot add a scene type you never collected. If there are no night-time examples, no amount of brightness jitter creates them.',
        ],
      },
      {
        type: 'p',
        text: 'The trap that costs the most credibility at this scale is leakage. Traffic imagery sampled from video is full of near-duplicates — consecutive frames of one incident, or several crops of one photo. Split those at random and the same crash lands in both train and test, and your test score is measuring memorisation with extra steps. The fix is to split by source: by incident, scene, or video, never by frame.',
      },
      {
        type: 'p',
        text: 'I am going to be specific about this rather than leave it as general advice, because my own pipeline fell into it. The dataset is extracted frames rather than isolated incidents, and I split it at frame level. So near-duplicate frames of the same physical incident sit on both sides of the divide, and the model had already seen something very close to parts of its own test set. The 68% is therefore somewhat inflated relative to what a strict incident-level split would report.',
      },
      {
        type: 'p',
        text: 'That is worth saying out loud for two reasons. The first is that a number quoted without its split methodology is not a result, it is a screenshot — and the same applies whether the methodology flatters you or not. The second is that the correction is cheap and I know exactly what it is: group every frame belonging to one incident, then assign whole incidents to train or test, and never let a group straddle the boundary. Doing that will move the headline number down and make it worth considerably more.',
      },
      {
        type: 'quote',
        text: 'A metric you have not tried to break is a guess you have grown attached to.',
      },

      { type: 'h2', text: 'Why transfer learning wins at this size' },
      {
        type: 'p',
        text: 'A from-scratch CNN has to learn edges, textures, and object parts from your three thousand images while simultaneously learning your decision boundary. A pretrained backbone has already paid for the first part on a far larger corpus, so you are only fitting the last step. That is the entire argument, and at this data scale it is decisive. The from-scratch model still earns its place — as a baseline it tells you how much the pretrained features are actually worth, which is information you cannot get any other way.',
      },
      {
        type: 'ul',
        items: [
          'Freeze first, then unfreeze. Train the classification head over frozen features, then unfreeze the top blocks at a much lower learning rate. Unfreezing everything at full learning rate washes away the features you came for.',
          'Match the preprocessing the backbone was pretrained with. Wrong input scaling is a silent tax that presents as a mediocre model rather than as a bug.',
          'BatchNorm is the classic fine-tuning footgun. Its running statistics keep updating in training mode and will drift on small, unrepresentative batches — which is exactly what a 3,000-image loader produces.',
          'MobileNetV2 is a deliberate trade: far fewer parameters and much cheaper inference in exchange for a lower ceiling. With three thousand images you were never approaching that ceiling, and the cheap inference is what makes deployment thinkable at all.',
          'Watch the head, not just the loss. With small data, a heavily parameterised classifier head overfits long before the backbone does; dropout and a smaller head are usually worth more than another epoch.',
        ],
      },

      { type: 'h2', text: 'The number I actually report: 68% F1' },
      {
        type: 'p',
        text: 'The result from the fine-tuned MobileNetV2 is a 68% F1-score on entirely unseen test data. That is not a state-of-the-art figure and I have no interest in dressing it up as one. It is a defensible figure, which on a safety-critical task is the more useful property: three thousand real-world traffic images rather than a curated benchmark, and a held-out set the model never saw during training.',
      },
      {
        type: 'p',
        text: 'It is also, deliberately, not an accuracy number. An earlier version of this site led with a 99.9% accuracy figure in its hero terminal; that number did not describe this model and it is gone now, replaced by the F1 score. The swap is worth explaining, because accuracy is close to the least informative metric available for this particular task.',
      },
      {
        type: 'p',
        text: 'Accuracy is one number over a distribution you chose. If ninety percent of your images are ordinary traffic, a model that never predicts "crash" scores ninety percent and is completely useless. Worse, accuracy averages together two mistakes that are not remotely comparable: a missed crash is a delayed response to a real emergency; a false alarm is a wasted dispatch and a slow erosion of trust in the system. Collapsing those into a single percentage discards the exact distinction an operator cares about.',
      },
      {
        type: 'p',
        text: 'F1 is the metric that survives all of that, which is exactly why it is the one I quote. As the harmonic mean of precision and recall it only moves upward when the model is both finding crashes and not crying wolf, and it cannot be propped up by a large, easy majority class the way accuracy can. A flattering accuracy and a middling F1 routinely describe the same model on the same test set — only one of them tells you whether the thing is any use. Read in that light, 68% is a considerably more honest headline than a number in the nineties would have been.',
      },
      {
        type: 'ul',
        items: [
          'Report per-class precision and recall instead of a global average, and publish the confusion matrix so the direction of failure is visible.',
          'Show a precision–recall curve, then commit to one operating point: recall at a precision you can defend, or the reverse. Where that threshold sits is a product decision, not a training artefact.',
          'Check calibration. A triage system ranks by confidence, so a 0.9 output should be right about ninety percent of the time. Deep classifiers are routinely overconfident, and a reliability curve is cheap to plot.',
          'Attach confidence intervals. On a few hundred test images, a couple of points of F1 in either direction may be indistinguishable from noise.',
          'Slice the metrics: night versus day, rain versus clear, close-up versus wide. An aggregate score is very good at hiding an entire scene type where the model is blind.',
        ],
      },

      { type: 'h2', text: 'What Grad-CAM actually tells you' },
      {
        type: 'p',
        text: 'Grad-CAM weights the activation maps of a late convolutional layer by the gradient of a class score, producing a coarse map of which spatial regions pushed that score upward. Rendered with a hot colormap it looks like a thermal image of the damage. It is not one. The colours encode influence on a logit, not temperature, and not physical severity; the resolution is that of the final feature map, upsampled to look smoother than it is.',
      },
      {
        type: 'p',
        text: 'That does not make it useless — it makes it a specific tool with a specific job, which is catching shortcut learning before it embarrasses you in front of someone who matters.',
      },
      {
        type: 'ul',
        items: [
          'It catches the cheap failures: a model keyed on a watermark, a timestamp overlay, letterboxing, or the fact that crash photos in your set happen to be closer-up than the negatives.',
          'It gives an operator something to look at. An unexplained "crash: 0.94" is hard to act on; a highlighted region is reviewable in a second. That is a real product feature, not decoration.',
          'It does not prove the model is right. A plausible heatmap over a crumpled bumper is equally consistent with a correct model and with one that learned "crumpled metal texture" and will fire happily on a scrapyard.',
          'It explains one prediction. Aggregate behaviour needs aggregate evidence: error slices, held-out scenes, and deliberately hard cases.',
        ],
      },

      { type: 'h2', text: 'The distance between a Streamlit demo and a safety system' },
      {
        type: 'p',
        text: 'Streamlit was the right choice for what it was for. It turned a notebook into something a human could try in an afternoon, and that is worth a great deal. It is also worth stating plainly that the gap between that and something you would allow to dispatch an emergency response is where most of the engineering actually lives.',
      },
      {
        type: 'ul',
        items: [
          'Input distribution. A demo receives photos a human chose. A deployment receives whatever the camera produces: motion blur, night, glare, water on the lens, and long stretches of nothing happening.',
          'Latency and placement. A detection that arrives forty seconds late is a different product. Whether inference runs on the device or on a server changes which model you can afford in the first place.',
          'Silent degradation. Models do not crash when the world shifts underneath them; they just become quietly wrong. That requires monitoring of input statistics and prediction distributions, plus a sampled human review loop.',
          // TODO(laila): fill in the intended threshold and escalation path, or
          // remove this bullet if the project never defined one.
          'Thresholds and escalation. Someone has to own the false-alarm budget and define what a positive detection triggers. [add: the intended operating threshold and escalation path — who or what receives a positive detection, and what happens if nobody acknowledges it].',
          'Reproducibility. Pinned data snapshot, pinned weights, pinned preprocessing, and one command that regenerates the reported number. Without it, the metric is unfalsifiable.',
          'Governance. Real traffic imagery contains people, plates, and locations. Retention limits and access rules are part of the system design, not paperwork bolted on afterwards.',
        ],
      },
      {
        type: 'quote',
        text: 'A model that is right on average and wrong in the rain is not a safety system. It is a weather-dependent one.',
      },

      { type: 'h2', text: 'What I would do differently' },
      {
        type: 'ul',
        items: [
          'Split by incident before training anything, and report numbers from that split only.',
          'Lead with recall at a fixed precision rather than accuracy, and put the confusion matrix directly beside it.',
          'Build a small, deliberately hard evaluation set — night, rain, occlusion, damaged-but-parked, near-miss-with-no-damage — and treat it as the real scoreboard.',
          'Add abstention. A third "uncertain" outcome routed to a human is far more useful than a confident guess, and it is the cheapest safety feature available.',
          'Log the model version and an input hash with every prediction, so a disputed result can be reconstructed months later.',
        ],
      },
    ],
  },

  {
    slug: 'monitoring-a-fleet-you-cannot-see',
    title: 'A Stale Number Is Worse Than a Blank Screen',
    date: '2026-07-05',
    readingTime: '6 min read',
    excerpt:
      'Nobody is standing next to the equipment, so everything an operator knows arrives through my software. Almost every decision in the platform hands back a capability in exchange for a reason to be believed, and I have come to think that trade is the job.',
    tags: ['Monitoring', 'Industrial Telemetry', 'System Design', 'Trust'],
    body: [
      {
        type: 'p',
        text: 'Most of my week goes into a monitoring platform for distributed power sites. A site here is not one machine. It is the utility supply, a solar array or a bank of rectifier modules, a DC bus, a battery, sometimes an inverter or a generator, and the load all of it exists to keep alive. Multiply that across a fleet spread over regions and the question is easy to ask and hard to answer well: is every site healthy right now, and if not, which piece of equipment is at fault?',
      },
      {
        type: 'p',
        text: 'The product is commercial, so this stays at the level of decisions and reasoning. No schema, no internal component names, no hosts, no protocol or hardware specifics. That costs the post very little, because the identifiers were never the interesting part.',
      },
      {
        type: 'p',
        text: 'What I did not expect going in is how little of the design turns out to be about capability. Nearly every consequential decision trades something the software could do for a reason to believe what it says. In monitoring, being trusted is the product. Being clever is optional.',
      },

      { type: 'h2', text: 'Nobody is standing next to the equipment' },
      {
        type: 'p',
        text: 'That is the whole constraint. Everything an operator knows about a site three regions away arrives through my software, so a wrong reading is not a display bug. It is a false statement somebody acts on. They decide not to send an engineer. They decide mains is carrying the load, when mains went hours ago and the battery has been draining since.',
      },
      {
        type: 'p',
        text: 'The failures that matter here are quiet. Mains lost and nobody noticed. A rectifier module faulted, so the rest carry more than they should. A fan died and the temperature is climbing slowly. Each is cheap in the first hour and expensive as an outage, and none of them announce themselves. They are only visible if the numbers on the screen are true.',
      },
      {
        type: 'quote',
        text: 'A monitoring tool that shows a stale number confidently is worse than one that admits it is offline.',
      },
      {
        type: 'p',
        text: 'A tool that is honestly down sends somebody to go and look. A tool that is confidently wrong sends nobody.',
      },

      { type: 'h2', text: 'One thing talks to devices; everything else only reads' },
      {
        type: 'p',
        text: 'The system is two stages with one contract between them. An acquisition service owns every part of talking to equipment — reaching the site, coping with transport differences, converting raw values into engineering units — and writes into a normalized data set. The web application reads only that data set. It never contacts a device. The obvious payoff is independent failure: acquisition can restart mid-shift without the dashboards going dark, and a UI release cannot break collection. The payoff I value more is that a device\'s quirks live in exactly one place, so when somebody asks why a number reads the way it does there is one answer, and the dashboard, the report, and the export all give it.',
      },
      {
        type: 'p',
        text: 'That data set is device-agnostic on purpose: readings are stored against canonical measurement identities rather than per-model fields, so one identity means one physical quantity whatever produced it. The platform standardises on a single vendor\'s device family, which sounds like it should make the abstraction unnecessary and is actually the reason it earns its keep. One family still spans four kinds of plant, and solar, rectifier, inverter and generator sites do not report the same things. Without a shared identity you get four dialects, four dashboard definitions, four report definitions, and four chances for one quantity to read differently in two places.',
      },

      { type: 'h2', text: 'Scale the reading once, then live with what that costs' },
      {
        type: 'p',
        text: 'Raw device values need scaling and unit conversion. Put that logic in the presentation layer and it gets copied into every dashboard, report, and export, and the copies drift. Then one measurement reads differently in two places, and a user who has seen that happen is right never to trust either number again. So scaling happens at acquisition. The stored value is already the truth, and every consumer displays it verbatim.',
      },
      {
        type: 'p',
        text: 'The cost is not small, and I would rather state it than skip past it. A scaling mistake is not displayed wrong, it is written into history. Fixing one is not a UI patch — it is a corrected transform plus a backfill of every affected reading, and until that finishes the past and the present disagree. I still think it is the right trade, because the version I designed away fails silently and this one fails loudly.',
      },

      { type: 'h2', text: 'Never build a report from the live table' },
      {
        type: 'p',
        text: 'Live state and history want opposite things. Live is a small picture, constantly overwritten, optimised for what is happening now. History is append-only and exists to be aggregated over weeks. Keeping them apart lets the dashboards stay quick while an availability report reads a series nothing is rewriting underneath it. A report computed from live state changes when you run it twice, and a figure that will not reproduce is not a figure. The cost lands on resolution: snapshot cadence becomes a hard ceiling, so a spike shorter than the interval is visible live and simply absent from history. Somebody will eventually ask about an event they watched happen, and the answer will be that the record does not contain it.',
      },

      { type: 'h2', text: 'Reachable is not a boolean' },
      {
        type: 'p',
        text: 'Field connectivity is not uniform. What a site supports and what its network currently permits are different questions, and one fixed transport strands part of the fleet. So acquisition tries transports in priority order, uses whichever answers, then reuses that one for a while before re-probing the better options — re-testing everything every cycle would spend the polling budget rediscovering what it already knew.',
      },
      {
        type: 'p',
        text: 'This is the decision that taught me most about trust, because it creates a state I had not thought about. A site can run quietly on a lower-priority transport: answering, therefore online, while exposing fewer readings than it should. Online was never a boolean. Degraded has to be its own visible state, or the fleet view is lying by omission.',
      },

      { type: 'h2', text: 'Do not invent a severity scheme' },
      {
        type: 'p',
        text: 'The equipment already classifies its own faults, and operators are trained on those classifications. Re-deriving severity in software is tempting, because you can be smarter about it. The cost is that the platform and the hardware then disagree during an incident, which is precisely when disagreement is most expensive. So an alarm carries the severity the device assigned, and nothing else.',
      },
      {
        type: 'p',
        text: 'The stricter half of the same rule: an alarm clears only when the equipment reports recovery. Acknowledging, annotating, reminding, handing over — all workflow layered on top, and none of it clears anything. An operator cannot make a live fault leave the screen by interacting with it. That is unpopular for about a week, because people want a clear button, and the reason there is not one is that a clear button is a way for a real fault to become invisible through ordinary use. It also means noise cannot be fixed in the interface: a chatty device stays chatty until somebody fixes it at the device. Worse for the operator in the short term, and the only version of the trade I can defend.',
      },

      { type: 'h2', text: 'A score that will not explain itself gets ignored' },
      {
        type: 'p',
        text: 'Each site carries a health score, and a bare number out of a hundred is easy to build and easy to dismiss. So every deduction is itemised: which alarms, which faulted modules, which recurring temperature problem, what availability. The number is the summary, the itemisation is the feature, because it turns the score into a work list. The caveat is that rule-based scoring only recognises failure modes somebody anticipated, and it reads as objective while encoding judgement. Fine while the rules stay visible. Not fine the moment people quote the number without being able to open it.',
      },

      { type: 'h2', text: 'Say how old the number is' },
      {
        type: 'p',
        text: 'This is the smallest thing on the list and the one I would defend hardest. Every view states the age of what it is showing, the console refreshes on a fixed cadence, and any reading past a staleness threshold is flagged rather than left to age quietly on screen looking exactly like a fresh one.',
      },
      {
        type: 'p',
        text: 'It costs support load. Ordinary network variance becomes visible, and visible variance produces questions nobody would otherwise have asked. I will take every one of them. The alternative is a screen that renders a two-hour-old voltage in the same typeface as a two-second-old one, in front of somebody with no way to tell the difference and no reason to suspect there is one.',
      },

      { type: 'h2', text: 'The shape of all of it' },
      {
        type: 'p',
        text: 'Read the list back and the pattern is consistent. Normalising at acquisition gives up a cheap fix for consistency. Splitting history from live gives up resolution for reproducibility. Mirroring the device\'s severity gives up noise control for agreement with the hardware. Freshness flags give up a calm interface for never presenting a stale number as fact. Every one of them hands back a capability and takes trustworthiness in return.',
      },
      {
        type: 'p',
        text: 'That does make the product less impressive in a demo, and I have not found a version where the honest choice is also the most magical one. But the people using it are not in a demo. They are deciding whether to drive four hours to a site, at night, on the strength of a number my software put on a screen. I would rather that number be boring and true.',
      },
    ],
  },

  {
    slug: 'scoping-down-to-something-i-could-finish',
    title: 'Cutting the Project Down Until It Had a Number',
    date: '2026-07-12',
    readingTime: '5 min read',
    excerpt:
      'Inqaz was too big for me to finish, so I carved one binary question out of it and shipped that instead. The small project is the one with a defensible number attached, and the gap between the two is what I keep thinking about.',
    tags: ['Scope', 'Shipping', 'Computer Vision', 'Evaluation'],
    body: [
      {
        type: 'p',
        text: 'I started with Inqaz. The idea is an emergency response platform for Egyptian highways: read live camera footage, notice an accident as it happens, judge how bad it is, and dispatch help with exact coordinates before anybody thinks to reach for a phone. I still think it is the right problem. I also could not finish it, and it took me a while to say that plainly instead of describing it as going slowly.',
      },
      {
        type: 'p',
        text: 'What I did instead was cut one question out of the middle of it. Not a phase or a milestone — a single question narrow enough that I could answer it, check the answer against something, and hand the result to somebody else to run. Is this image a crash, or is it not. That became its own project. I trained it, evaluated it, wrapped it in a small Streamlit dashboard, submitted it as university coursework, and it was marked highly. Then I went back to Inqaz, which I am still building.',
      },
      {
        type: 'p',
        text: 'The classifier is not the interesting part of that story. The interesting part is what the two projects look like side by side now, because the smaller one is better evidenced than the larger one. That is not modesty and it is not an accident. It is the mechanical consequence of one of them being finished.',
      },

      { type: 'h2', text: 'An unfinished project has nothing to be wrong about' },
      {
        type: 'p',
        text: 'An ambitious project you never ship does teach you things. It teaches you the shape of the problem, which papers are worth reading, which libraries fight you. What it cannot teach you is whether you were right, because it never reaches the point of producing a claim somebody could attack. Every belief you hold about it stays a belief. You get to keep all of them.',
      },
      {
        type: 'p',
        text: 'A small finished thing takes that away from you, and that is the service it does. It produces a number on data it has not seen, and from that moment the conversation stops being about intentions. Is that number good. Compared to what. Measured how. What would break it. Every one of those questions is only available once something is done, and each of them is worth more than another week of architecture.',
      },
      {
        type: 'quote',
        text: 'You cannot argue with a project that has never produced a claim. That is exactly what makes it comfortable to keep working on.',
      },

      { type: 'h2', text: 'What each project can actually tell me' },
      {
        type: 'p',
        text: 'Inqaz has two detection models, both ResNet-34 backbones fine-tuned for different jobs — one classifying the scene, one reading injury severity from posture. I have validation accuracies for both, 92.4% and 88.2%. What I do not have is a held-out test figure for either. They were scored on a validation split I was tuning against, on curated data, which means the numbers describe how the models did on the material that shaped them. That is the weakest useful form of evidence there is.',
      },
      {
        type: 'p',
        text: 'The scoped-down classifier reports a 68% F1 on a hold-out test set it never saw during training, and I publish it with a flaw attached. The dataset is extracted video frames and I split it at frame level, so near-duplicate frames of one physical incident sit on both sides of the divide. The 68% is inflated against what a strict incident-level split would give. I know the correction: group frames by incident, assign whole incidents, never let a group straddle the boundary.',
      },
      {
        type: 'p',
        text: 'There is an obvious wrong reading here that I want to close off. These are not comparable numbers — different models, different datasets, different splits, different questions, and one is accuracy while the other is F1. Putting 92.4 next to 68 would be meaningless. What is comparable is the kind of claim each one supports. One says: on data I was tuning against, this did well. The other says: on data I had never touched, this scored 68% F1, and here is the specific reason that figure is generous. The second sentence is much smaller and much harder to knock down. The bigger project has the better-looking numbers and the worse evidence, and that is the whole of what I am trying to say.',
      },

      { type: 'h2', text: 'What I cut, specifically' },
      {
        type: 'p',
        text: 'Scope down is easy to say and vague in practice, so here is the actual list. Every item on it was something I wanted.',
      },
      {
        type: 'ul',
        items: [
          'Live camera ingestion. No stream, no frame buffer, no edge capture. One still image at a time, uploaded by a person.',
          'Severity tiers. No SEVERE, MEDIUM, or MILD, and no motion heuristics feeding a score. Crash, or not a crash.',
          'Dispatch. Nothing is contacted. The demo shows what a dispatch would look like and then stops.',
          'The mobile client. No app on a phone doing capture at the roadside.',
          'The realtime dashboard. No incident stream, no telemetry grid, no map with colour-coded markers.',
        ],
      },
      {
        type: 'p',
        text: 'What survived was one input, one binary question, one metric. Cutting the severity tiers hurt most, because grading how serious an incident is was the part of Inqaz I thought was clever. It was also the part with no honest way to be checked — I had no labelled ground truth for severity, so any tier I produced would have been an opinion the system stated confidently. Removing it was the difference between a project with a score and a project with a demo.',
      },

      { type: 'h2', text: 'It is not the same as giving up, but it looks identical for a while' },
      {
        type: 'p',
        text: 'I went back. Inqaz is still in development, and what I learned training and evaluating the small one fed into it — mostly things about data, splits, and what a number is allowed to claim, which are precisely the things the ambitious version was going to get wrong at a larger scale.',
      },
      {
        type: 'p',
        text: 'Still, I understand why people hear "scope down" and hear "settle", because most of the time that is what it turns out to be. The distinction is not in the decision. It is in what happens afterwards: you cut the thing down to get a measurement, and then you spend the measurement on the original problem. If you never come back, you did quit, and you find that out months later rather than at the time. I do not think there is a way to know in the moment which one you are doing. You go back and see.',
      },
      {
        type: 'p',
        text: 'The part I have not resolved is that the small project is the one I can defend in a room, and it is the one I care least about. Ask me what I have actually proven and the answer is a 68% F1 on a binary image question with a documented leakage flaw. Ask me what I want to build and it is the other thing, the one I currently cannot prove much of anything about. Those two sentences have not converged yet. Getting Inqaz to a held-out test figure is the next honest step, and it is a lot of work that adds no features and will almost certainly make the numbers go down.',
      },
    ],
  },
];
