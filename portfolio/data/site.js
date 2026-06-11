export const SITE = {
  name: "Jeeva Krishnasamy",
  tagline: "Building AI that survives contact with real data.",
  email: "jek283@pitt.edu",
  github: "https://github.com/jivanandham",
  linkedin: "https://linkedin.com/in/jivanandham",
  location: "Pittsburgh, PA → Paris, FR",
  focus: "AI / Computer Vision / LLM Systems",
  status: "Open to opportunities",
  lastUpdated: "2026.06.11",
};

export const BOOT_LINES = [
  "> LOADING PORTFOLIO v3.2.1 ...",
  "> SYSTEM: jeeva-krishnasamy.dev",
  "> STATUS: AVAILABLE FOR WORK",
  `> LAST UPDATED: ${SITE.lastUpdated}`,
  "> INITIALIZING INTERFACE ...",
];

export const PROJECTS = [
  {
    num: "01",
    slug: "rtu-detection",
    title: "RTU Detection Platform",
    blurb: "Rooftop HVAC detection over satellite imagery — 90% precision, 80% recall in production.",
    tech: ["YOLOv11", "RF-DETR", "FastAPI", "React", "Docker", "GCP"],
    caseStudy: {
      problem:
        "Airoverse needed to locate rooftop HVAC units (RTUs) across entire metro areas. Manual satellite surveys were slow, expensive, and error-prone — a pilot client was burning budget on human annotators.",
      approach:
        "Built a YOLOv11 + RF-DETR ensemble trained on curated Roboflow datasets, wired to Google Maps geospatial tiles. Served via FastAPI behind a React console, containerized with Docker, deployed to GCP with full CI/CD.",
      result:
        "90% precision / 80% recall in the deployed pipeline. Cut the pilot client's manual survey cost by ninety percent.",
      snippet: `# ensemble vote: YOLOv11 + RF-DETR
detections = nms_merge(
    yolo.predict(tile, conf=0.42),
    rfdetr.predict(tile, conf=0.38),
    iou_thresh=0.55,
)`,
    },
  },
  {
    num: "02",
    slug: "stock-bull",
    title: "Stock Bull Trading Platform",
    blurb: "Virtual stock trading with real-time data, live portfolio updates over WebSockets.",
    tech: ["Node.js", "Express", "MongoDB", "WebSockets", "EJS"],
    caseStudy: {
      problem:
        "Paper-trading tools either lag market data or hide portfolio mechanics behind paywalls. I wanted a sandbox that behaved like a real brokerage.",
      approach:
        "Full-stack Node/Express app with WebSocket-pushed price ticks, MongoDB for positions and order history, and server-rendered EJS views for fast first paint.",
      result:
        "Live portfolio re-pricing on every tick with zero polling. Used as a teaching sandbox for market-microstructure basics.",
      snippet: `ws.on("tick", (quote) => {
  portfolio.reprice(quote);
  broadcast({ type: "PNL_UPDATE", data: portfolio.summary() });
});`,
    },
  },
  {
    num: "03",
    slug: "option-pricing",
    title: "Option Pricing Engine",
    blurb: "Monte Carlo + Black-Scholes dashboard with live market data via yfinance.",
    tech: ["Python", "Dash", "NumPy", "yfinance"],
    caseStudy: {
      problem:
        "Pricing intuition is hard to build from textbook formulas alone. I wanted to see how Monte Carlo paths converge against the closed-form Black-Scholes answer, live.",
      approach:
        "Vectorized NumPy Monte Carlo simulation (100k paths in milliseconds) alongside analytic Black-Scholes, fed by real-time quotes through yfinance, rendered in a Dash dashboard.",
      result:
        "Interactive convergence plots showing simulation error shrink as paths grow — a teaching tool that makes the math tangible.",
      snippet: `S_T = S0 * np.exp((r - 0.5*sigma**2)*T
       + sigma*np.sqrt(T)*np.random.standard_normal(n))
price = np.exp(-r*T) * np.maximum(S_T - K, 0).mean()`,
    },
  },
  {
    num: "04",
    slug: "deepfake-detection",
    title: "Deepfake Detection",
    blurb: "InceptionResNetV2 pipeline for flagging manipulated images and video frames.",
    tech: ["Python", "TensorFlow", "InceptionResNetV2"],
    caseStudy: {
      problem:
        "Manipulated media is getting cheaper to produce than to detect. Off-the-shelf classifiers fall apart on compressed, real-world footage.",
      approach:
        "Fine-tuned InceptionResNetV2 with aggressive augmentation (compression artifacts, color jitter, frame sampling) to harden the model against in-the-wild degradation.",
      result:
        "A scalable TensorFlow pipeline for near-real-time frame-level detection, with measurably better robustness on compressed inputs.",
      snippet: `aug = tf.keras.Sequential([
    layers.RandomContrast(0.2),
    layers.GaussianNoise(0.03),
    JPEGCompression(quality_range=(40, 90)),
])`,
    },
  },
  {
    num: "05",
    slug: "facial-atm",
    title: "Facial Recognition ATM",
    blurb: "Card-free ATM authentication with custom Siamese networks.",
    tech: ["Python", "Siamese Nets", "FastAPI", "PostgreSQL", "Docker"],
    caseStudy: {
      problem:
        "Card skimming remains one of the most common ATM attacks. Biometric auth removes the card — but must work under bad lighting and one-shot enrollment.",
      approach:
        "Custom Siamese neural network for one-shot face verification, served through FastAPI with PostgreSQL-backed identity records, fully containerized with Docker.",
      result:
        "A working card-free authentication prototype with verification latency suitable for ATM interaction flows.",
      snippet: `dist = tf.norm(embed(anchor) - embed(probe), axis=1)
verified = dist < THRESHOLD  # one-shot verification`,
    },
  },
];

export const STACK = [
  { abbr: "PY", name: "Python", level: 0.95 },
  { abbr: "TF", name: "TensorFlow", level: 0.85 },
  { abbr: "PT", name: "PyTorch", level: 0.85 },
  { abbr: "CV", name: "OpenCV", level: 0.9 },
  { abbr: "JS", name: "JavaScript", level: 0.8 },
  { abbr: "TS", name: "TypeScript", level: 0.7 },
  { abbr: "RE", name: "React", level: 0.75 },
  { abbr: "FA", name: "FastAPI", level: 0.9 },
  { abbr: "DK", name: "Docker", level: 0.85 },
  { abbr: "GC", name: "GCP", level: 0.8 },
  { abbr: "SQ", name: "SQL", level: 0.8 },
  { abbr: "LL", name: "LLM / RAG", level: 0.85 },
];

export const SKILLS_TOOLTIPS = {
  "computer vision": "8 yrs",
  "deep learning": "7 yrs",
  FastAPI: "5 yrs",
  Docker: "5 yrs",
  "RAG architectures": "3 yrs",
  "fine-tuning": "3 yrs",
};

export const INFLUENCES = [
  { title: "Deep Learning — Goodfellow, Bengio, Courville", note: "The textbook I keep returning to when intuition runs out." },
  { title: "Designing Data-Intensive Applications — Kleppmann", note: "Why my pipelines stopped falling over at 2 a.m." },
  { title: "The Pragmatic Programmer — Hunt & Thomas", note: "Tracer bullets over big design up front. Always." },
  { title: "Andrej Karpathy's lectures", note: "Proof that first-principles teaching beats abstraction." },
  { title: "fast.ai — Jeremy Howard", note: "Top-down learning: ship the model, then learn why it works." },
  { title: "PLC ladder logic", note: "Fifteen factory floors taught me more about reliability than any cloud SLA." },
  { title: "Roboflow", note: "Data curation is the model. The weights are downstream." },
  { title: "The Unix philosophy", note: "Small tools, composed. My FastAPI services are basically pipes." },
];
