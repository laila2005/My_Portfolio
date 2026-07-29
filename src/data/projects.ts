/**
 * Every project, in one place. Route: /projects/:slug renders one of these.
 *
 * This used to be a local array inside src/components/Projects.tsx, which meant
 * the card grid was the only thing that could read it. Several of these repos are
 * private, so the detail page — not a GitHub link — has to be the proof.
 *
 * ─── HONESTY CONTRACT FOR THIS FILE ───────────────────────────────────────────
 * `tagline`, `sections`, and `highlights` are restatements or reorganisations of
 * the `description` for that same project, or of a technical write-up supplied
 * by the author for that project (zagel, riselist, inqaz, petpulse, and
 * crash-detection). Nothing here introduces a fact from outside one of those two
 * sources — no invented metrics, dates, team sizes, feature lists, or outcomes.
 *
 * inqaz and crash-detection are related but are NOT the same model stack, and the
 * copy must not blur them: inqaz runs a dual ResNet-34 system (InqazSceneNet +
 * InqazPoseNet, validation accuracy figures), crash-detection is a scoped-down
 * TensorFlow CNN/MobileNetV2 classifier on the same problem (F1 on a held-out
 * test set). Different models, datasets, metrics, and splits — never compare the
 * numbers across the two pages.
 *
 * Where a real detail page needs something this repo does not contain, the copy
 * carries an inline `[[ ... ]]` marker. The renderer in
 * src/pages/ProjectDetail.tsx turns those into a loud dashed-amber placeholder
 * (the same `<Fill>` treatment used in src/pages/CaseStudyLMMS.tsx), and each one
 * has a `TODO(laila)` comment beside it. Fill them in or delete the sentence —
 * never let a placeholder ship as prose, and never replace one with a guess.
 */

export type Project = {
  /** URL-safe id. Used by /projects/:slug — changing one breaks a live link. */
  slug: string;
  title: string;
  description: string;
  image: string;
  tech: string[];
  languages?: string[];
  github?: string;
  live?: string;
  /** Overrides the "Live Demo" button text, e.g. for a preview that isn't finished. */
  liveLabel?: string;
  /** Sets expectations before the visitor clicks, e.g. "still in development". */
  liveNote?: string;
  apk?: string;
  featured?: boolean;
  status?: string;
  /** Shown when a repo/demo cannot be linked publicly. */
  note?: string;
  /** Internal route to a long-form write-up. */
  caseStudy?: string;
  /** Concrete, factual bullets drawn from this project's own description. */
  highlights?: string[];
  /** One short line for the detail-page hero. */
  tagline?: string;
  /** Only set where the existing copy already states it. */
  role?: string;
  gallery?: { src: string; alt: string; caption?: string }[];
  sourceStatus?: 'public' | 'private';
  /** Rendered instead of a repo link when the source is private. */
  privateNote?: string;
  /** Long-form detail blocks. May contain `[[placeholder]]` markers. */
  sections?: { heading: string; body: string }[];
};

export const projects: Project[] = [
  {
    slug: 'zagel',
    title: "Zagel – Enterprise Real-Time Messaging",
    description: "A hybrid communications platform: instant multi-device messaging with client-side end-to-end encryption, plus peer-to-peer WebRTC video calls carrying 1080p screen sharing and live connection telemetry. Runs as a web app and as a native Android build from one codebase.",
    tagline: "Instant multi-device messaging and 1080p peer-to-peer video calls in one platform, encrypted on the client.",
    role: "Lead Systems & Full-Stack Architect",
    image: "/chat-ui-cover.webp",
    apk: "/zagel-app.apk",
    // Versions are fine to state here: this is a public web app, unlike the
    // LM-MS case study where an exact stack version is recon information.
    tech: ["Next.js 16", "React 19", "FastAPI", "WebSockets", "WebRTC", "Capacitor 7", "Web Crypto API"],
    languages: ["TypeScript", "Python"],
    github: "https://github.com/laila2005/messaging-system",
    sourceStatus: 'public',
    live: "https://zagel-orpin.vercel.app/",
    // The deployment is still in development. Saying so up front is the whole
    // point: a visitor who clicks expecting a finished product and finds a
    // work in progress trusts the rest of the page less, whereas one who was
    // told first reads the same thing as progress.
    liveLabel: "Open the preview",
    liveNote: "The web app is still in development — the preview is usable but not feature-complete.",
    status: "In development",
    caseStudy: "/writing/zagel-websocket-architecture",
    highlights: [
      "One account, many live sessions — messages, read receipts, and reactions echo to every connected device",
      "Client-side AES-256-GCM encryption with PBKDF2-derived conversation keys, applied before anything leaves the device",
      "Peer-to-peer WebRTC calls with 1080p 30fps screen sharing, swapped in without dropping the call",
      "ICE restart renegotiation so a call survives a WiFi-to-mobile-network handover",
      "Live call telemetry on screen: round-trip time, packet loss, and video bitrate",
      "Sub-50ms p95 send-to-echo across 1,000 messages under 100 concurrent sessions",
    ],
    gallery: [
      {
        src: "/zagel-01-signin.webp",
        alt: "Zagel sign-in screen: a dark glassmorphic card with username and password fields under the tagline “Enterprise-grade encrypted messaging”.",
        caption: "The public entry point, captured from the live deployment — dark glassmorphic UI throughout.",
      },
      { src: "/chat-ui-cover.webp", alt: "Zagel chat interface" },
      // TODO(laila): everything past sign-in needs an account, so these three have
      // to come from you. They are the ones that actually prove the hard parts:
      //   1. Desktop and phone side by side on the same chat, with the
      //      end-to-end-encrypted badge visible — proves multi-device sync.
      //   2. A live call with the picture-in-picture window, a 1080p screen share,
      //      and the telemetry overlay (RTT / loss / bitrate) legible.
      //   3. The image lightbox open over the dark UI.
      // Add each to public/ as WebP plus its size in src/data/image-dimensions.json.
    ],
    sections: [
      {
        heading: "The challenge",
        body: "Communication tools tend to be good at one thing. Chat apps give you instant messaging but treat a second device as an afterthought and have little to offer for presenting. Conference suites do high-definition video and screen sharing, but are heavy and awkward for quick messages. Zagel is an attempt at one platform that does both properly: chat that keeps every one of your devices in step, and calls good enough to present from.",
      },
      {
        heading: "The multi-device sync engine",
        body: "Treating a user as one connection is what breaks multi-device chat. The FastAPI backend instead keeps a connection manager that maps each user to a set of live sockets, so one account can hold several sessions at once. A message, a read receipt, or a reaction fans out to every socket in that set, which is what lets you read on your phone and reply from the desktop without either session dropping or falling behind.",
      },
      {
        heading: "Encrypting on the client, not the server",
        body: "Direct messages are encrypted in the browser with the Web Crypto API before they touch a WebSocket or a REST endpoint: AES-256-GCM, under a conversation key derived with PBKDF2. The point of doing it client-side is that the server stores and relays ciphertext it cannot read, so the trust question stops being \"do you trust the operator\" — and the chat shows an explicit encrypted indicator so that guarantee is visible rather than a footnote.",
      },
      {
        heading: "Calls, screen sharing, and surviving the network",
        body: "Calls are peer-to-peer WebRTC, so audio and video flow directly between participants instead of through the server. Screen sharing captures at 1080p 30fps and is swapped into the existing connection by replacing the outgoing video track, which means starting or stopping a share does not tear down the call. Networks are the hard part: a handover from WiFi to mobile data triggers an ICE restart to renegotiate the path rather than dropping the call, and hanging up sends explicit signalling so the camera and microphone are actually released rather than left holding the hardware.",
      },
      {
        heading: "Showing the connection, not hiding it",
        body: "A call overlay reports round-trip time, packet loss percentage, and video bitrate live while you talk. It is a small feature with an outsized effect: when a call degrades, the usual experience is not knowing whether the problem is you, them, or the app. Surfacing the numbers turns that into something a user can actually act on.",
      },
      {
        heading: "One codebase, web and native",
        body: "The frontend is Next.js 16 with React 19, deployed as a web app and packaged as a native Android build with Capacitor 7 — which needs real hardware permissions for audio recording, camera, and audio-mode changes to make calls work on a phone. Mobile got specific attention rather than a shrunken desktop layout: dynamic viewport-height handling so the composer is not hidden behind mobile browser chrome, message bubbles bounded so long text stays readable, deliberate tap-target sizing, and a full-screen image lightbox with a direct download.",
      },
      {
        heading: "What the latency figure actually measures",
        body: "The sub-50ms number is a p95 over 1,000 messages, measured end to end rather than at a convenient internal boundary: from the moment Send is pressed on one client, through client-side AES-256-GCM encryption, over the WebSocket, through the server's in-memory socket dispatch, to arrival and render on the receiving client. It was taken under 100 concurrent sessions holding ping/pong keep-alives, not against a single idle connection. Isolating the server's own routing puts it at roughly 3.8–6.2ms on average with a p99 under 12ms, which is the useful part of the breakdown: the bulk of the round trip is network and client work, so that is where any further improvement has to come from.",
      },
    ],
    featured: true
  },
  {
    slug: 'riselist',
    title: "RiseList – AI Voice-First Productivity",
    description: "An AI-powered, voice-first productivity engine. Integrated Google Gemini AI to autonomously extract prioritized task lists from voice notes and generate 'Magic Breakdowns' for massive tasks. Features a Zen Mode focus environment, Daily Journaling, offline voice queueing, a robust paywall system, and premium fluid animations.",
    tagline: "Speak a raw, rambling thought and get back a structured, prioritised, scheduled day.",
    image: "/riselist_logo.webp",
    apk: "/RiseList.apk",
    tech: ["Flutter", "Dart", "Riverpod", "Firebase Auth", "Firestore", "Google Gemini AI", "Val Town"],
    languages: ["Dart"],
    github: "#",
    live: "https://rise-list.vercel.app",
    note: "Source private — APK available on request.",
    sourceStatus: 'private',
    privateNote: "Source private — APK available on request.",
    highlights: [
      "Google Gemini AI autonomously extracts prioritized task lists from voice notes",
      "'Magic Breakdowns' decompose massive tasks automatically",
      "Bilingual voice capture — English, Arabic, or a mix, detected automatically",
      "Zen Mode focus environment, Daily Journaling, and offline voice queueing",
      "Robust paywall system with premium fluid animations",
    ],
    // The gallery walks the actual pipeline in order: speak, parse, confirm,
    // then live in the plan. These same shots cover the Play Store listing's
    // screenshot requirement (docs/PLAY_STORE_LISTING.md in the app repo).
    gallery: [
      {
        src: "/riselist-00-splash.webp",
        alt: "RiseList splash screen: the app icon over a purple-to-coral gradient, the name RiseList, the line “Rise. Speak. Done.”, and three checked steps — Wake up, Speak your day, Get it done.",
        caption: "The whole product in three steps, stated on launch: wake up, speak your day, get it done.",
      },
      {
        src: "/riselist-01-listening.webp",
        alt: "RiseList capture screen: a live audio waveform above a 00:06 / 08:00 timer, with the prompt “Listening… speak in English, Arabic, or both.”",
        caption: "Capture. The waveform confirms the app is listening, and the language is detected rather than chosen.",
      },
      {
        src: "/riselist-02-processing.webp",
        alt: "RiseList processing screen reading “Turning your words into a plan… Transcribing, sorting, scheduling and prioritizing.”",
        caption: "The transcript goes to the Gemini proxy, which must answer in a fixed JSON schema.",
      },
      {
        src: "/riselist-03-confirm.webp",
        alt: "RiseList confirmation screen listing four extracted tasks, each with a priority, a category, and a scheduled time, above an “Add 4 tasks” button.",
        caption: "Structured output, reviewable before it is committed — priority, category, and time per task.",
      },
      {
        src: "/riselist-04-today.webp",
        alt: "RiseList home screen showing four scheduled tasks for today with category tags and times, and a 0/4 completion ring.",
        caption: "The day as a plan. Task titles mix Arabic and English exactly as they were spoken.",
      },
      {
        src: "/riselist-05-progress.webp",
        alt: "RiseList home screen with one task completed, a 1/4 ring, a streak counter showing 1, and the finished task struck through under a Completed heading.",
        caption: "Completing a task advances the streak, which is calculated server-side in a transaction.",
      },
      {
        src: "/riselist-06-calendar.webp",
        alt: "RiseList calendar view with a horizontal week strip and the selected day's scheduled tasks listed beneath it.",
        caption: "Scheduled times are real calendar entries, not just labels.",
      },
      {
        src: "/riselist-07-stats.webp",
        alt: "RiseList progress screen showing day streak, best streak, completed count, a bar chart for the week, and completion split by category.",
        caption: "Progress view: streaks, weekly completion, and a per-category breakdown.",
      },
    ],
    sections: [
      {
        heading: "The challenge",
        body: "Traditional task management apps require high-friction manual data entry, and that friction is what disrupts flow. The goal was an intelligent engine that could capture raw, rambling thoughts and autonomously organise them into a structured, prioritised, and scheduled day.",
      },
      {
        heading: "The voice-to-structured-data pipeline",
        body: "RiseList is a cross-platform mobile application engineered in Flutter and Dart, with Riverpod handling reactive, scalable state management. It ships on Android with iOS to follow. The core innovation is the voice-to-structured-data pipeline: I integrated on-device speech-to-text to capture live audio transcripts, with visual waveform feedback so the app is visibly listening while you talk. Capture is bilingual — English, Arabic, or the two mixed in one sentence, with the language detected automatically rather than selected from a menu.",
      },
      {
        heading: "Keeping the Gemini keys out of the client bundle",
        body: "An API key shipped inside a mobile bundle is an API key shipped to everyone who installs the app, so rather than call the model from the client I engineered a secure proxy architecture. The app sends the raw transcript to a lightweight Val Town HTTP endpoint, which is where the Google Gemini API keys are held. That endpoint enforces strict JSON schemas, forcing the LLM to return fully structured objects — Tasks, Priorities, Categories, and Scheduled Times — instead of prose that would then need parsing on the device.",
      },
      {
        heading: "Sync, streaks, and offline persistence",
        body: "Firebase Firestore backs the app, which is what enables real-time synchronisation across devices and offline persistence when there is no network. Daily user streaks run through a robust Firestore transaction system so the count is calculated securely on the server side rather than trusted from the client.",
      },
      {
        heading: "Motivation, briefings, and the UI",
        body: "On top of the capture loop I implemented a gamified motivation system and a daily morning briefing delivered through timezone-aware local notifications, so the briefing arrives in the user's morning rather than the server's. The whole thing is wrapped in a premium, heavily animated UI powered by flutter_animate.",
      },
      {
        heading: "Around the capture loop",
        body: "The app also carries a Zen Mode focus environment, Daily Journaling, offline voice queueing, 'Magic Breakdowns' that decompose massive tasks automatically, and a robust paywall system.",
      },
      {
        heading: "Seeing it work",
        body: "The repository is private, so the gallery above is the proof: the same run captured end to end, from the waveform while it listens through to the scheduled day it produces. Two details worth noticing — the task titles keep whatever mix of Arabic and English was actually spoken, and every extracted task is shown for review before anything is written.",
      },
    ],
    featured: true
  },
  {
    slug: 'inqaz',
    title: "Inqaz-app – Egypt Emergency AI Response System",
    description: "An end-to-end highway emergency response platform: computer vision detects accidents and disasters from live mobile camera footage, and the system then performs triage automatically and dispatches emergency services in real time with precise GPS coordination. A Flutter mobile edge client, a FastAPI Python backend, a dual ResNet-34 detection stack, and a React command centre dashboard.",
    tagline: "Detect a severe highway accident from a live camera feed and dispatch emergency services with exact GPS coordinates, before anyone picks up the phone.",
    role: "Architected the end-to-end platform — mobile edge client, backend, detection models, and command centre",
    image: "/inqaz-cover.webp",
    tech: ["Flutter", "FastAPI", "Python", "ResNet-34", "timm", "OpenCV", "WebSockets", "React.js", "Computer Vision"],
    languages: ["Python"],
    github: "#",
    note: "Repository private — architecture write-up available on request.",
    sourceStatus: 'private',
    privateNote: "Repository private — architecture write-up available on request.",
    status: "In development",
    highlights: [
      "End-to-end architecture: Flutter mobile edge client, FastAPI Python backend, real-time React command centre dashboard",
      "Detects highway collisions, structural collapses, and severe pedestrian injuries from live mobile camera feeds",
      "Two ResNet-34 models: InqazSceneNet classifies scenes, InqazPoseNet reads injury severity from posture",
      "92.4% validation accuracy for InqazSceneNet and 88.2% validation accuracy for InqazPoseNet — validation splits, not held-out test sets",
      "Test-time augmentation averages the softmax scores of five augmented views of each incoming image",
      "Deterministic severity mapping blends scene classification with OpenCV motion heuristics into SEVERE, MEDIUM, and MILD tiers",
      "Incidents stream over WebSockets to a telemetry grid and an interactive map, with markers colour-coded by tier",
      "Past a critical severity threshold, GPS dispatch routing to the Ministry of Interior (122) and Ambulance services (123) is coordinated without manual review",
    ],
    gallery: [
      { src: "/inqaz-cover.webp", alt: "Inqaz-app cover image" },
      // TODO(laila): add screenshots here. Shape:
      // { src: "/inqaz-detection.webp", alt: "A detection result on camera footage", caption: "Optional one-line caption" },
    ],
    sections: [
      {
        heading: "The challenge",
        body: "Emergency response times are delayed by manual reporting. Somebody has to notice the crash, decide to call, describe the situation, and communicate where it happened — four steps before help starts moving. Inqaz removes that chain entirely: analyse live dashcam or bystander camera feeds, detect severe accidents instantly, and dispatch with exact GPS coordinates before a human picks up the phone. This is the original project and the one still under active development; a deliberately scoped-down crash-versus-normal classifier, built separately as coursework along the way, is documented elsewhere in this portfolio.",
      },
      {
        heading: "End-to-end architecture",
        body: "I architected the whole path rather than a model in isolation: a Flutter mobile application acting as the edge client that captures the feed, a FastAPI Python backend running detection and triage, and a React command centre dashboard that shows incidents to a dispatcher in real time.",
      },
      {
        heading: "The detection models",
        body: "The core AI is a dual-model system — two custom models built on the ResNet-34 architecture via the timm library, each fine-tuned for a different emergency classification job. InqazSceneNet handles Driver Mode: fine-tuned on the AIDER dataset to classify environmental disasters and highway collisions, it reaches 92.4% validation accuracy. InqazPoseNet handles Bystander Mode: a ResNet-34 backbone plus a custom PoseMLP keypoint classifier that analyses human silhouettes to judge injury severity from posture — whether a person is lying down or upright — reaching 88.2% validation accuracy. Both figures are accuracy on a validation split of a curated dataset, which is a weaker guarantee than held-out test performance on imbalanced real-world footage; the comparable test-set numbers are the thing to measure and publish next.",
      },
      {
        heading: "Test-time augmentation",
        body: "A single uploaded photo gives the model one look at the scene, which is the worst case for precision. Each incoming image is therefore run through five augmented views and the softmax scores averaged, which raises precision on single-photo uploads without costing enough time to matter for a live feed.",
      },
      {
        heading: "Severity scoring and live telemetry",
        body: "A bare confidence score is not something a human dispatcher can act on, so the classifier output feeds a deterministic severity mapping system that blends the ResNet-34 scene classifications with OpenCV-based motion severity heuristics. Results stream over WebSockets to the React dashboard: a telemetry grid, and an interactive map where each incident appears as a marker colour-coded by severity tier — SEVERE, MEDIUM, or MILD.",
      },
      {
        heading: "Triage and GPS dispatch",
        body: "The engine ingests live camera feeds, performs real-time triage, and calculates a severity score from the scene classification and the motion heuristics together. When that score breaches a critical threshold, the system bypasses manual review and coordinates GPS dispatch routing to the Ministry of Interior (122) and Ambulance services (123).",
      },
    ],
    featured: true
  },

  {
    slug: 'petpulse',
    title: "PetPulse",
    description: "A unified digital ecosystem designed to simplify every stage of pet ownership. Built as a comprehensive platform for pet care, health tracking, and management.",
    tagline: "A location-aware marketplace for finding nearby, verified veterinarians and trainers.",
    // A screenshot of the running product makes a better card than a logo.
    image: "/petpulse-01-hero.webp",
    tech: ["React.js", "Node.js", "Express.js", "PostgreSQL", "Leaflet"],
    languages: ["TypeScript"],
    github: "https://github.com/laila2005/Mewoo",
    sourceStatus: 'public',
    // The previous deployment (petpulse-pi) now 404s; this is the live one.
    live: "https://petpulse-showcase.vercel.app/",
    highlights: [
      "Unified digital ecosystem covering every stage of pet ownership",
      "Booking, adoption, hosting, training, and community in one marketplace",
      "Nearest-first vendor sorting from client-side Haversine distance",
    ],
    gallery: [
      {
        src: "/petpulse-01-hero.webp",
        alt: "PetPulse landing page: the header nav, the headline “Your Pet Care Companion in One Place”, and a photograph of an owner with a golden retriever.",
        caption: "The marketplace entry point — one place for services, adoption, and community.",
      },
      {
        src: "/petpulse-02-services.webp",
        alt: "PetPulse services grid with five cards: Vet Booking, Trainers, Adoption, Pet Hosting, and Community Support, each with its own call to action.",
        caption: "Five distinct service flows, each with its own booking and vendor model behind it.",
      },
      {
        src: "/petpulse-03-adoption.webp",
        alt: "PetPulse adoption section showing pet cards for Milo and Luna with age and temperament, beside an online veterinary surgeon panel offering a quick chat.",
        caption: "Adoption listings alongside direct access to a verified vet — the two sides of the marketplace.",
      },
      {
        src: "/petpulse-04-features.webp",
        alt: "PetPulse trust section: cards for Verified Pros, Easy Booking, Safe Adoption, and Active Community, next to a checklist covering direct communication, insured bookings, and digital health records.",
        caption: "Vendor verification and insured bookings are the trust layer the relational schema enforces.",
      },
    ],
    sections: [
      {
        heading: "The challenge",
        body: "PetPulse exists because pet care services are fragmented, which makes it difficult for owners to find nearby, verified veterinarians and trainers. What that actually requires is a robust, location-aware marketplace capable of handling complex booking workflows and vendor management.",
      },
      {
        heading: "Backend, data integrity, and the frontend",
        body: "PetPulse is a comprehensive full-stack ecosystem built on a Node.js/Express backend with a PostgreSQL relational database. The relational choice is deliberate: bookings, user roles, and vendor profiles all need strict data integrity, and that is what a constrained relational schema gives you. The frontend is a highly responsive React.js single-page application.",
      },
      {
        heading: "The geo-centered architecture",
        body: "The defining technical feature is the geo-centered architecture. I integrated Leaflet maps for visual location tracking and engineered a nearest-first sorting algorithm using client-side Haversine distance calculations. That lets the platform instantly calculate the exact spherical distance between the user's coordinates and hundreds of vendors, rendering the closest available services in real time without overwhelming the backend server.",
      },
      {
        heading: "Read this one in the browser instead",
        body: "This is the project with both a public repository and a live deployment, so the demo above is better evidence than anything written here. The gallery is captured from that deployment.",
      },
    ],
    featured: true
  },
  {
    slug: 'crash-detection',
    title: "Crash Detection and Classification Model",
    description: "A deep learning pipeline for automated emergency triage. I trained both a custom CNN and a MobileNetV2 on a balanced dataset of 3,000 real-world traffic scenes to classify \"Crash\" against \"Normal\", integrated Grad-CAM to pinpoint vehicular structural damage, and deployed the inference pipeline as a Streamlit dashboard that simulates live dispatch protocols.",
    tagline: "A deep learning pipeline for automated emergency triage, with Grad-CAM explainability and a Streamlit deployment.",
    role: "Model training, explainability integration, and full-stack web deployment",
    image: "/crash-detection-cover-v2.webp",
    tech: ["Python", "TensorFlow", "Keras", "CNN", "MobileNetV2", "Transfer Learning", "Grad-CAM", "Streamlit"],
    languages: ["Python"],
    github: "#",
    note: "Model architecture and pipeline notebooks available upon request.",
    sourceStatus: 'private',
    privateNote: "Model architecture and pipeline notebooks available upon request.",
    highlights: [
      "Custom CNN trained from scratch as a baseline, then MobileNetV2 fine-tuned with transfer learning",
      "Balanced dataset of 3,000 real-world traffic scenes, classified \"Crash\" against \"Normal\"",
      "68% F1-score on an entirely unseen hold-out test set — inflated by a frame-level split, and published as a baseline rather than a ceiling",
      "Grad-CAM heatmaps show where the network detected structural damage, so a life-critical prediction can be reviewed rather than taken on trust",
      "Data pipeline with automated ingestion, 224×224 resizing, rotation, flip and zoom augmentation, and normalisation into the -1 to 1 range MobileNetV2 expects",
      "Streamlit command-centre deployment taking live camera feeds or uploaded scene evidence, showing confidence metrics and the Grad-CAM output",
    ],
    gallery: [
      { src: "/crash-detection-cover-v2.webp", alt: "Crash detection model cover image" },
      // TODO(laila): add screenshots here — a Grad-CAM heatmap next to its input
      // image would carry this page on its own. Shape:
      // { src: "/crash-gradcam.webp", alt: "Grad-CAM heatmap over a damaged vehicle", caption: "Optional one-line caption" },
    ],
    sections: [
      {
        heading: "The models",
        body: "I engineered a custom CNN from scratch first, to establish a performance baseline before reaching for anything pre-trained — without that number, a transfer-learning result has nothing to be measured against. The second model applies transfer learning through MobileNetV2 with a custom classification head, using Global Average Pooling rather than a flatten layer so spatial feature extraction is not squeezed through a flattening bottleneck.",
      },
      {
        heading: "The data pipeline",
        body: "The training set is 3,000 real-world traffic scenes, balanced between Crash and Normal. Ingestion is automatic; every scene is resized to 224×224 and augmented with rotations, flips, and zooms for robustness against real-world variation; pixel values are normalised into the -1 to 1 range MobileNetV2 expects.",
      },
      {
        heading: "How the split was made, and what it costs the score",
        body: "The raw dataset is extracted frames rather than isolated incidents, and I executed the train/test split at frame level. That means near-duplicate frames of the same physical incident inevitably land on both sides of the divide, so the model has already seen something very close to parts of its own test set. The 68% F1 below is therefore somewhat inflated against what a strict incident-level split would produce. I state it because it changes how the number should be read, and I treat it as an honest baseline rather than a ceiling: the correction for the next iteration is to split at incident level — group every frame belonging to one physical incident, then assign whole incidents to train or test — which will lower the headline figure and make it worth more.",
      },
      {
        heading: "Explainability",
        body: "I applied Grad-CAM (Gradient-weighted Class Activation Mapping) to generate thermal heatmaps over the input, visualising where the network detected structural damage. The point is confirming that the prediction is driven by physical crash indicators rather than background artifacts — a model that has quietly learned a background cue instead of the damage itself still scores well and still fails in service. On a life-critical decision that bridge between the network output and human oversight is the difference between a prediction that can be reviewed and one that can only be trusted.",
      },
      {
        heading: "Results",
        body: "The fine-tuned MobileNetV2 achieved a 68% F1-score on an entirely unseen hold-out test set, read with the frame-level split above attached to it: the figure is somewhat inflated against a strict incident-level split, and an incident-level rerun is the first correction I would make. F1 rather than accuracy is the honest metric here: real-world traffic data is heavily imbalanced, so a high global accuracy could flatter a model that defaults to predicting \"no crash\". F1 evaluates the thing that actually matters, which is whether the model catches the crash events that require an ambulance.",
      },
      {
        heading: "Deployment",
        body: "The inference engine is deployed as a Streamlit web app with a dark-mode command-centre UI, carrying live telemetry and interactive analysis. It accepts live camera feeds or uploaded scene evidence, executes the analysis in real time, and displays both the confidence metrics and the Grad-CAM output alongside the input. Once the visual damage assessment is done, the dashboard simulates the dispatch protocol that assessment would trigger — the alert to the Ministry of Interior (122) and Ambulance services (123).",
      },
      {
        heading: "Why this project exists",
        body: "Inqaz came first, and it is the more ambitious system: live mobile feeds, two detection models, severity scoring, GPS dispatch. It was too complex to land in one go, so I cut the same problem down to the one question I could answer end to end — is this scene a crash or not — on a balanced 3,000-scene dataset with a held-out test set to check the answer against. That narrower scope is what made this version shippable and measurable: a single classification target, one metric that means something, and a deployment someone else could open and try. I submitted it as university coursework and it was marked highly. What came out of training and evaluating it fed back into Inqaz, which I am still developing. The two projects address the same problem at different scopes — Inqaz's own detection stack is the dual ResNet-34 system, InqazSceneNet and InqazPoseNet, described on its own page.",
      },
    ],
    featured: true
  },
  {
    slug: 'dishcraft',
    title: "DishCraft",
    description: "Full-stack culinary platform featuring comprehensive UI/UX design, secure JWT user authentication, and seamless database integration using Node.js.",
    tagline: "A full-stack culinary platform, from UI/UX through to the database.",
    image: "/dishcraft.webp",
    tech: ["React.js", "Node.js", "MongoDB", "Express", "JWT"],
    languages: ["TypeScript", "Node.js"],
    github: "https://github.com/laila2005/DishCraft/tree/combined-branch",
    sourceStatus: 'public',
    highlights: [
      "Full-stack culinary platform with comprehensive UI/UX design",
      "Secure JWT user authentication",
      "Seamless database integration using Node.js",
    ],
    gallery: [
      { src: "/dishcraft.webp", alt: "DishCraft cover image" },
      // TODO(laila): add screenshots here. Shape:
      // { src: "/dishcraft-recipe.webp", alt: "A recipe detail view", caption: "Optional one-line caption" },
    ],
    sections: [
      {
        heading: "What it is",
        body: "DishCraft is a full-stack culinary platform, featuring comprehensive UI/UX design.",
      },
      {
        heading: "Authentication",
        body: "User authentication is secured with JWT.",
      },
      {
        heading: "Data layer",
        body: "Database integration runs through Node.js.",
      },
    ],
    featured: true
  },
  {
    slug: 'techroad',
    title: "TechRoad",
    description: "AI-powered career guidance mapping platform. Leading backend development as a Team Leader, architecting the Flask API, load balancing, and MongoDB schemas.",
    tagline: "An AI-powered career guidance mapping platform, still in progress.",
    role: "Team Leader — backend development",
    image: "/techroad-logo.svg",
    tech: ["Flask", "Python", "MongoDB", "Docker", "System Design"],
    languages: ["Python"],
    github: "https://github.com/laila2005/Tech-Road",
    sourceStatus: 'public',
    highlights: [
      "AI-powered career guidance mapping platform",
      "Leading backend development as Team Leader",
      "Architecting the Flask API, load balancing, and MongoDB schemas",
    ],
    gallery: [
      { src: "/techroad-logo.svg", alt: "TechRoad logo" },
      // TODO(laila): add screenshots here. Shape:
      // { src: "/techroad-map.webp", alt: "A generated career map", caption: "Optional one-line caption" },
    ],
    sections: [
      {
        heading: "What it is",
        body: "TechRoad is an AI-powered career guidance mapping platform.",
      },
      {
        heading: "My part in it",
        body: "I lead backend development as Team Leader, architecting the Flask API, load balancing, and MongoDB schemas.",
      },
      {
        heading: "Still in progress",
        body: "This one is labelled in progress on purpose, which means the honest version of this section is a status report rather than a result: [[add what is built today, what ships next, and the team size]].",
        // TODO(laila): keep this current, or delete the section once TechRoad is
        // no longer marked "In Progress".
      },
    ],
    featured: true,
    status: "In Progress"
  },
  {
    slug: 'maze-game',
    title: "3D Raycasting Maze Game",
    description: "Low-level graphics engine built in C using SDL2. Features complex collision detection, player movement physics, enemy AI, and dynamic maze texture rendering.",
    tagline: "A low-level 3D graphics engine written in C with SDL2.",
    image: "/MazeGame.webp",
    tech: ["C", "SDL2", "Raycasting", "Algorithms", "Memory Management"],
    languages: ["C"],
    github: "https://github.com/walid-mehelba/The_Maze",
    sourceStatus: 'public',
    highlights: [
      "Low-level graphics engine built in C using SDL2",
      "Complex collision detection and player movement physics",
      "Enemy AI and dynamic maze texture rendering",
    ],
    gallery: [
      { src: "/MazeGame.webp", alt: "3D raycasting maze game cover image" },
      // TODO(laila): add screenshots here. Shape:
      // { src: "/maze-textures.webp", alt: "Textured walls rendered by the raycaster", caption: "Optional one-line caption" },
    ],
    sections: [
      {
        heading: "What it is",
        body: "A low-level graphics engine built in C using SDL2, with raycasting doing the rendering.",
      },
      {
        heading: "What the engine handles",
        body: "Complex collision detection, player movement physics, enemy AI, and dynamic maze texture rendering.",
      },
    ],
    featured: true
  }
];

/**
 * Filter groups for the projects section.
 *
 * Filtering by raw tech tag produced ~39 pills across five rows — technically
 * complete, visually unusable. These groups collapse that into a handful of
 * meaningful lenses while still letting the Python/C/AI work be found, which was
 * the reason for widening the filter in the first place.
 *
 * `tech` entries are matched case-insensitively against each project's `tech`
 * array. Every project must match at least one group; the count shown on each
 * pill makes an empty group obvious immediately.
 */
export type ProjectCategory = {
  id: string;
  label: string;
  tech: string[];
};

export const categories: ProjectCategory[] = [
  {
    id: 'web',
    label: 'Web & Full-Stack',
    tech: [
      'React', 'React.js', 'Next.js', 'Node.js', 'Express', 'Express.js', 'Tailwind CSS',
      'REST API', 'JWT', 'MongoDB', 'PostgreSQL', 'Leaflet', 'Flask', 'Redux',
    ],
  },
  {
    id: 'mobile',
    label: 'Mobile & Cross-Platform',
    tech: ['Flutter', 'Dart', 'Riverpod', 'Capacitor', 'Electron'],
  },
  {
    id: 'ai',
    label: 'AI & Computer Vision',
    tech: [
      'Google Gemini AI', 'Gemini AI', 'TensorFlow', 'Keras', 'CNN', 'MobileNetV2',
      'Grad-CAM', 'Deep Learning', 'Transfer Learning', 'Computer Vision', 'AI', 'Streamlit',
    ],
  },
  {
    id: 'realtime',
    label: 'Real-Time & Cloud',
    tech: [
      'WebSockets', 'WebRTC', 'FastAPI', 'Firebase', 'Firebase Auth', 'Firestore', 'Val Town',
    ],
  },
  {
    id: 'systems',
    label: 'Systems & Low-Level',
    tech: [
      'C', 'C++', 'SDL2', 'Raycasting', 'Algorithms', 'Memory Management', 'Docker',
      'System Design',
    ],
  },
];

/** True when a project belongs to the given group. */
export const projectInCategory = (project: Project, category: ProjectCategory) => {
  const wanted = new Set(category.tech.map(t => t.toLowerCase()));
  return project.tech.some(t => wanted.has(t.toLowerCase()));
};
