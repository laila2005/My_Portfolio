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
 * by the author for that project (zagel, riselist, inqaz, petpulse, and the
 * model-layer facts shared between inqaz and crash-detection). Nothing here
 * introduces a fact from outside one of those two sources — no invented metrics,
 * dates, team sizes, feature lists, or outcomes.
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
    description: "A highly scalable unified communications platform bridging web, desktop, and mobile users. Features sub-millisecond WebSocket messaging, zero-latency WebRTC video conferencing, and JWT authentication. Wrapped natively via Electron and Capacitor.",
    tagline: "One zero-latency communications platform across web, native desktop, and mobile — from a single frontend codebase.",
    image: "/chat-ui-cover.webp",
    apk: "/zagel-app.apk",
    tech: ["Next.js", "FastAPI", "WebSockets", "WebRTC", "Electron", "Capacitor", "JWT"],
    languages: ["TypeScript", "Python"],
    github: "https://github.com/laila2005/messaging-system",
    sourceStatus: 'public',
    caseStudy: "/writing/zagel-websocket-architecture",
    highlights: [
      "Unified communications platform bridging web, desktop, and mobile users",
      "Sub-millisecond WebSocket messaging and zero-latency WebRTC video conferencing",
      "JWT authentication across every client",
      "Wrapped natively via Electron and Capacitor",
    ],
    gallery: [
      { src: "/chat-ui-cover.webp", alt: "Zagel cover image — the chat interface" },
      // TODO(laila): add screenshots here. Shape:
      // { src: "/zagel-call.webp", alt: "A WebRTC call in progress", caption: "Optional one-line caption" },
      // Only reference files that exist in public/, and add their intrinsic size
      // to src/data/image-dimensions.json so the page reserves the right box.
    ],
    sections: [
      {
        heading: "The challenge",
        body: "Build a unified, zero-latency communications platform that functions seamlessly across the web, native desktop environments, and mobile devices — all from a single, maintainable frontend codebase.",
      },
      {
        heading: "Async concurrency on the backend",
        body: "The backend is FastAPI (Python), designed with a heavy emphasis on real-time concurrency. I leaned on asynchronous programming so that one service can manage thousands of concurrent WebSocket connections while carrying text messaging. This site describes that messaging as \"sub-millisecond\", and a latency claim needs a path, a percentile, and a load level before it means anything: [[verify the messaging latency figure — measurement path, percentile (p95/p99), and concurrency]].",
        // TODO(laila): either publish the measurement behind the latency wording
        // used in the description above, or soften the description itself. The
        // marker stays visible until one of those two things happens.
      },
      {
        heading: "Peer-to-peer media with WebRTC",
        body: "Video conferencing runs on WebRTC. I integrated it so a call establishes a direct peer-to-peer UDP connection for audio and video streaming, which bypasses server bottlenecks entirely rather than relaying every frame through the backend.",
      },
      {
        heading: "Three shells, one codebase",
        body: "To reach every platform without rewriting the UI three times, I built the frontend in Next.js and wrapped it natively: Electron compiles the web app into a performant Windows desktop application, and Capacitor wraps it into a native Android application. That approach yielded a 100% shared UI codebase while still retaining access to native APIs on each platform.",
      },
      {
        heading: "Auth, retention, and sync",
        body: "Security was paramount, so authentication is a stateless JSON Web Token (JWT) flow used across every client. Alongside it I implemented automated data retention and synchronisation policies, so enterprise-grade compliance and data integrity hold across all three platforms rather than only on the web.",
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
    note: "Source private — APK available on request.",
    sourceStatus: 'private',
    privateNote: "Source private — APK available on request.",
    highlights: [
      "Google Gemini AI autonomously extracts prioritized task lists from voice notes",
      "'Magic Breakdowns' decompose massive tasks automatically",
      "Zen Mode focus environment, Daily Journaling, and offline voice queueing",
      "Robust paywall system with premium fluid animations",
    ],
    gallery: [
      { src: "/riselist_logo.webp", alt: "RiseList app logo" },
      // TODO(laila): add screenshots here — this one needs them most, because the
      // repo is private and the cover is only a logo. Shape:
      // { src: "/riselist-capture.webp", alt: "Voice capture screen", caption: "Optional one-line caption" },
    ],
    sections: [
      {
        heading: "The challenge",
        body: "Traditional task management apps require high-friction manual data entry, and that friction is what disrupts flow. The goal was an intelligent engine that could capture raw, rambling thoughts and autonomously organise them into a structured, prioritised, and scheduled day.",
      },
      {
        heading: "The voice-to-structured-data pipeline",
        body: "RiseList is a cross-platform mobile application engineered in Flutter and Dart, with Riverpod handling reactive, scalable state management. The core innovation is the voice-to-structured-data pipeline: I integrated on-device speech-to-text to capture live audio transcripts, with visual waveform feedback so the app is visibly listening while you talk.",
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
        heading: "What this page still owes you",
        body: "Because the repository is private, screenshots are the proof — and there are none in this repo yet: [[add app screenshots: voice capture, a Magic Breakdown, Zen Mode]].",
        // TODO(laila): drop real screenshots into public/, add them to the
        // `gallery` above and to src/data/image-dimensions.json, then delete this
        // whole section.
      },
    ],
    featured: true
  },
  {
    slug: 'inqaz',
    title: "Inqaz-app – Egypt Emergency AI Response System",
    description: "Architected an end-to-end emergency response platform using computer vision to detect accidents and disasters from live mobile camera footage. Automatically dispatches emergency services in real time with GPS coordination.",
    tagline: "Detect a severe accident from a live camera feed and dispatch emergency services with precise GPS coordinates.",
    role: "Architected the end-to-end platform",
    image: "/inqaz-cover.webp",
    tech: ["Python", "TensorFlow", "Keras", "CNN", "MobileNetV2", "Grad-CAM", "React.js"],
    languages: ["Python"],
    github: "#",
    note: "Repository private — architecture write-up available on request.",
    sourceStatus: 'private',
    privateNote: "Repository private — architecture write-up available on request.",
    highlights: [
      "End-to-end emergency response platform architected from the ground up",
      "Computer vision detects accidents and disasters from live mobile camera footage",
      "Automatically dispatches emergency services in real time with GPS coordination",
    ],
    gallery: [
      { src: "/inqaz-cover.webp", alt: "Inqaz-app cover image" },
      // TODO(laila): add screenshots here. Shape:
      // { src: "/inqaz-detection.webp", alt: "A detection result on camera footage", caption: "Optional one-line caption" },
    ],
    sections: [
      {
        heading: "The challenge",
        body: "Emergency response times are often delayed by manual reporting — somebody has to notice the crash, decide to call, and describe where it happened. Inqaz needed to remove that step: an automated system that analyses live camera feeds, detects severe accidents instantly, and dispatches emergency services with precise GPS coordinates.",
      },
      {
        heading: "The detection models",
        body: "I architected an end-to-end computer vision pipeline. The core AI is a pair of models trained from scratch on a dataset of over 3,000 real-world traffic images: a custom Convolutional Neural Network (CNN), and a MobileNetV2 model using transfer learning. Fine-tuning MobileNetV2 produced a 68% F1-score on entirely unseen test data.",
      },
      {
        heading: "Making the model interpretable for operators",
        body: "In a life-or-death dispatch decision, a bare confidence score is not something a human operator can act on or trust, so interpretability was a hard requirement rather than a finishing touch. I applied Grad-CAM (Gradient-weighted Class Activation Mapping), which generates thermal heatmaps directly over the video feed, pinpointing the exact structural damage on the vehicle that triggered the alert.",
      },
      {
        heading: "Triage and GPS dispatch",
        body: "The AI is wrapped in a full-stack web interface that ingests live camera feeds, performs real-time incident triage, and automatically coordinates GPS dispatch routing to the Ministry of Interior (122) and Ambulance services (123).",
      },
    ],
    featured: true
  },

  {
    slug: 'petpulse',
    title: "Petpulse (Mewoo)",
    description: "A unified digital ecosystem designed to simplify every stage of pet ownership. Built as a comprehensive platform for pet care, health tracking, and management.",
    tagline: "A location-aware marketplace for finding nearby, verified veterinarians and trainers.",
    image: "/petpulse-cover.webp",
    tech: ["React.js", "Node.js", "Express.js", "PostgreSQL", "Leaflet"],
    languages: ["TypeScript"],
    github: "https://github.com/laila2005/Mewoo",
    sourceStatus: 'public',
    live: "https://petpulse-pi.vercel.app/",
    highlights: [
      "Unified digital ecosystem covering every stage of pet ownership",
      "Comprehensive platform for pet care, health tracking, and management",
    ],
    gallery: [
      { src: "/petpulse-cover.webp", alt: "Petpulse cover image" },
      // TODO(laila): add screenshots here. Shape:
      // { src: "/petpulse-health.webp", alt: "Health tracking view", caption: "Optional one-line caption" },
    ],
    sections: [
      {
        heading: "The challenge",
        body: "Petpulse — also called Mewoo — exists because pet care services are fragmented, which makes it difficult for owners to find nearby, verified veterinarians and trainers. What that actually requires is a robust, location-aware marketplace capable of handling complex booking workflows and vendor management.",
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
        body: "This is the project with a public repo and a live deployment, so the demo above is better evidence than anything written here.",
      },
    ],
    featured: true
  },
  {
    slug: 'crash-detection',
    title: "Crash Detection and Classification Model",
    description: "Trained custom CNN and MobileNetV2 models on 3,000 real-world traffic images. Applied Grad-CAM explainability to generate thermal heatmaps identifying structural damage, deployed on Streamlit.",
    tagline: "Crash classification with Grad-CAM explainability, deployed on Streamlit.",
    role: "Model training, explainability, and deployment",
    image: "/crash-detection-cover-v2.webp",
    tech: ["Python", "TensorFlow", "Keras", "CNN", "MobileNetV2", "Transfer Learning", "Grad-CAM", "Streamlit"],
    languages: ["Python"],
    github: "#",
    note: "Model and notebooks available on request.",
    sourceStatus: 'private',
    privateNote: "Model and notebooks available on request.",
    highlights: [
      "Custom CNN and MobileNetV2 models trained on 3,000 real-world traffic images",
      "Grad-CAM explainability generates thermal heatmaps identifying structural damage",
      "Deployed on Streamlit",
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
        body: "Two models were trained from scratch on the same dataset of over 3,000 real-world traffic images: a custom Convolutional Neural Network (CNN), and a MobileNetV2 adapted through transfer learning.",
      },
      {
        heading: "Explainability",
        body: "I applied Grad-CAM (Gradient-weighted Class Activation Mapping) to generate thermal heatmaps over the input, pinpointing the structural damage on the vehicle that drove the classification. That is what makes a prediction reviewable by a human instead of merely asserted at them.",
      },
      {
        heading: "Results",
        body: "Fine-tuning MobileNetV2 produced a 68% F1-score on entirely unseen test data. F1 rather than accuracy is the honest headline for this task: the classes are not balanced, so a global accuracy figure would flatter a model that mostly predicts \"no crash\" and says nothing about whether it catches the crashes that matter.",
      },
      {
        heading: "Deployment",
        body: "The model is deployed on Streamlit.",
      },
      {
        heading: "Where this model ships",
        body: "This is the model layer behind Inqaz-app, the emergency response system elsewhere in this portfolio — the same CNN and MobileNetV2 pair, wrapped there in a live triage and dispatch pipeline.",
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
