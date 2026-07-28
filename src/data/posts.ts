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
        // TODO(laila): confirm how the 3,000 images were split. If the split was
        // random-by-frame, the headline score is not trustworthy and should be
        // recomputed on an incident-level split before being quoted anywhere.
        text: 'The trap that costs the most credibility at this scale is leakage. Traffic imagery sampled from video is full of near-duplicates — consecutive frames of one incident, or several crops of one photo. Split those at random and the same crash lands in both train and test, and your test score is measuring memorisation with extra steps. The fix is to split by source: by incident, scene, or video, never by frame. [add: how the 3,000 images were partitioned, and whether the split was by incident or by frame — this one detail decides whether the reported score means anything at all].',
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
];
