// ─────────────────────────────────────────────────────────────
// All site content lives here. Edit this file to update the site.
// ─────────────────────────────────────────────────────────────

export const VERSION = "3.4.0";

export const SITE = {
  name: "Jeeva Krishnasamy",
  url: "https://jivanandham.com",
  headline: "AI/ML Engineer, Software Engineer, AWS Certified",
  tagline: "Building AI that survives contact with real data.",
  email: "jek283@pitt.edu",
  github: "https://github.com/jivanandham",
  linkedin: "https://linkedin.com/in/jivanandham",
  location: "France",
  workModes: "on-site, hybrid, or remote",
  focus: "AI / Computer Vision / LLM Systems",
  status: "Open to work",
  visa: "French Talent Passport",
  languages: "English, Français, தமிழ்",
  lastUpdated: "2026.09.30",
};

export const BOOT_LINES = [
  `> LOADING PORTFOLIO v${VERSION} ...`,
  "> SYSTEM: jivanandham.com",
  "> STATUS: AVAILABLE FOR WORK",
  `> LAST UPDATED: ${SITE.lastUpdated}`,
  "> INITIALIZING INTERFACE ...",
];

// Filters shown above the project list. `id` must match project.domains.
export const DOMAINS = [
  { id: "all", label: "All" },
  { id: "vision", label: "Vision" },
  { id: "llm", label: "LLM" },
  { id: "data", label: "Data" },
  { id: "finance", label: "Finance" },
  { id: "security", label: "Security" },
];

export const PROJECTS = [
  {
    slug: "rag-slack-assistant",
    year: "2025",
    domains: ["llm"],
    title: "RAG Slack Assistant",
    blurb: "Production RAG assistant for student support — 30% fewer repetitive requests.",
    tech: ["LangChain", "Vector search", "Re-ranking", "Slack API", "Python"],
    caseStudy: {
      problem:
        "At the University of Pittsburgh, course staff answered the same logistics and content questions over and over in Slack, and students waited on humans for answers that already existed in course material.",
      approach:
        "Built and deployed a retrieval-augmented Slack assistant with LangChain and vector retrieval over course content, plus a semantic re-ranking layer so the most relevant passages reach the model first.",
      result:
        "Better retrieval relevance and a 30% drop in repetitive student support requests, freeing staff for the questions that need a person.",
      snippet: `candidates = retriever.invoke(question, k=20)
context = reranker.rank(question, candidates)[:4]
answer = llm.invoke(prompt.format(context=context,
                                  question=question))`,
    },
  },
  {
    slug: "rtu-detection",
    year: "2025",
    domains: ["vision"],
    title: "RTU Detection Platform",
    blurb: "Rooftop HVAC detection over satellite imagery — 90% precision, 80% recall in production.",
    tech: ["YOLOv8", "RF-DETR", "FastAPI", "React", "Docker", "GCP"],
    link: {
      label: "Airoverse announcement",
      href: "https://www.linkedin.com/posts/airoverse_ai-universityofpittsburgh-airtificialintelligence-activity-7196101892342425600-ZFV3",
    },
    caseStudy: {
      problem:
        "Airoverse needed to locate rooftop HVAC units (RTUs) across entire metro areas to generate business leads. Manual satellite surveys were slow, expensive, and error-prone. Built during an 8-week consulting engagement with a Pitt team.",
      approach:
        "Built the app from the ground up: YOLOv8 and RF-DETR detectors trained on curated Roboflow datasets, wired to Google Maps imagery for automated collection across building tags. Served via FastAPI behind a React console, containerized with Docker, deployed to GCP.",
      result:
        "90% precision / 80% recall on satellite imagery. Cut manual detection time and operational cost by ninety percent.",
      snippet: `# ensemble vote: YOLOv8 + RF-DETR
detections = nms_merge(
    yolo.predict(tile, conf=0.42),
    rfdetr.predict(tile, conf=0.38),
    iou_thresh=0.55,
)`,
    },
  },
  {
    slug: "retailvision",
    year: "2024",
    domains: ["vision"],
    title: "RetailVision Analytics",
    blurb: "Real-time in-store analytics — customer tracking and dwell-time heat maps on edge hardware.",
    tech: ["YOLOv8", "ByteTrack", "Python", "OpenCV", "Edge"],
    caseStudy: {
      problem:
        "Every retailer eventually asks the same question: where do people actually go? Footfall counters give totals, not paths, and cloud video pipelines are too slow and too expensive per store.",
      approach:
        "YOLOv8 detection feeding ByteTrack multi-object tracking, running on edge hardware in-store. Tracks are aggregated into dwell-time heat maps and zone-level behaviour summaries — no raw video leaves the device.",
      result:
        "Live heat maps and dwell-time analytics per zone, computed on the edge in real time.",
      snippet: `for frame in stream:
    dets = yolo(frame, classes=[PERSON])
    tracks = tracker.update(dets)
    heatmap.accumulate(tracks, dt=frame.dt)`,
    },
  },
  {
    slug: "llm-gateway",
    year: "2024",
    domains: ["llm"],
    title: "LLM API Gateway",
    blurb: "A Go gateway for LLM traffic — rate limiting, load balancing, and fallback across providers.",
    tech: ["Go", "Redis", "OpenAPI", "Docker"],
    caseStudy: {
      problem:
        "Production LLM traffic needs rate limits, retries, and provider fallback. The off-the-shelf gateways were all opinionated in the wrong direction.",
      approach:
        "A high-performance gateway in Go with Redis-backed token-bucket rate limiting, per-model load balancing, and fallback routing across OpenAI, Anthropic, and local vLLM endpoints, described by an OpenAPI spec.",
      result:
        "One stable endpoint in front of many models, with provider outages absorbed by automatic fallback.",
      snippet: `route := router.Pick(req.Model)
resp, err := route.Primary.Do(ctx, req)
if isRetryable(err) {
    resp, err = route.Fallback.Do(ctx, req)
}`,
    },
  },
  {
    slug: "deepfake-detection",
    year: "2023",
    domains: ["vision", "security"],
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
    slug: "facial-atm",
    year: "2023",
    domains: ["vision", "security"],
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
  {
    slug: "stock-bull",
    year: "2024",
    domains: ["finance"],
    title: "Stock Bull Trading Platform",
    blurb: "Paper trading with real-time prices, watchlists, and a virtual wallet — risk-free strategy practice.",
    tech: ["Node.js", "Express", "MongoDB", "Auth0", "Finnhub API"],
    caseStudy: {
      problem:
        "Traders need somewhere to refine strategies without risking money, and most paper-trading tools either lag market data or hide portfolio mechanics behind paywalls.",
      approach:
        "MVC web app on Node.js, Express, and MongoDB with Auth0 authentication, real-time quotes from the Finnhub API, watchlists with notifications, portfolio analytics, and virtual wallet management. University of Pittsburgh project.",
      result:
        "A working brokerage-style sandbox where users track prices, execute simulated trades, and see their portfolio re-price live.",
      snippet: `finnhub.on("trade", (quote) => {
  portfolio.reprice(quote);
  notifyWatchers(quote.symbol, quote.price);
});`,
    },
  },
  {
    slug: "archaeology-database",
    year: "2023",
    domains: ["data"],
    title: "Archaeology Database",
    blurb: "Database and website for Pitt's archaeology department, with versioning and role-based data entry.",
    tech: ["SQL", "Data modeling", "HTML", "Web app"],
    caseStudy: {
      problem:
        "The University of Pittsburgh's archaeology department needed its field data in one place, with a way for different people to enter and correct records without losing history.",
      approach:
        "Designed the database and built a website on top: role-based access for dynamic data entry, variable fields, a data dictionary, and time-stamped snapshots for versioning.",
      result:
        "A structured, auditable record store the department can grow, where every change is attributable and reversible.",
      snippet: `INSERT INTO artifact_snapshot (artifact_id, data, edited_by, taken_at)
SELECT id, to_jsonb(a), :user_id, now()
FROM artifact a WHERE id = :artifact_id;`,
    },
  },
  {
    slug: "option-pricing",
    year: "2022",
    domains: ["finance"],
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
].sort((a, b) => b.year.localeCompare(a.year)); // newest first; stable within a year

// Newest first. `end: null` means current role.
export const EXPERIENCE = [
  {
    role: "Data Engineer",
    org: "University of Pittsburgh",
    place: "Pittsburgh, PA",
    start: "2024-09",
    end: "2025-12",
    summary:
      "Architected Python ETL pipelines pulling from the Coursera and Salesforce APIs into clean, query-ready SQL tables, and orchestrated 10+ production workflows in Apache Airflow with automated retries and failure recovery. Built and deployed a RAG-based Slack assistant with semantic re-ranking that cut repetitive student support requests by 30%. Also facilitated courses for 300+ students in Python, Tableau, and Power BI.",
    tags: ["Python", "Airflow", "SQL", "LangChain", "RAG", "Tableau"],
  },
  {
    role: "AI Software Developer",
    org: "Airoverse",
    place: "Pittsburgh, PA",
    start: "2025-03",
    end: "2025-04",
    summary:
      "Built an AI-powered rooftop HVAC detection platform to generate business leads. Trained YOLOv8 and RF-DETR models to 90% precision and 80% recall on satellite imagery, integrated the Google Maps and Roboflow APIs for automated real-time collection, and shipped a FastAPI + React stack. Cut manual detection time and cost by 90%.",
    tags: ["YOLOv8", "RF-DETR", "FastAPI", "React", "GCP"],
  },
  {
    role: "Data Automation Engineer",
    org: "Shraddha Engineering & Facility Services",
    place: "Coimbatore, India",
    start: "2020-06",
    end: "2022-12",
    summary:
      "Led end-to-end IoT and automation deployments across 15+ facilities, saving 2,000+ engineering hours a year. Designed Python and SQL ETL pipelines with Power BI dashboards that cut manual data work by 50%, and built real-time monitoring with sensor streams and alerting that reduced downtime by 30%. REST APIs for facility-management integrations; Git and Agile throughout.",
    tags: ["IoT", "ETL", "Python", "SQL", "Power BI", "REST APIs"],
  },
  {
    role: "Systems & Analytics Engineer",
    org: "Blue Star Limited",
    place: "Coimbatore, India",
    start: "2018-04",
    end: "2020-06",
    summary:
      "ML-driven predictive maintenance that reduced failures by 22% across commercial HVAC deployments. Built PLC/SCADA automation across 25+ projects for an 18% efficiency gain, and led a cross-functional team of ten on analytics and sensor-network deployments.",
    tags: ["ML", "PLC/SCADA", "Pandas", "Predictive maintenance"],
  },
  {
    role: "Automation Engineer",
    org: "Chennai Engineering Services",
    place: "Coimbatore, India",
    start: "2015-06",
    end: "2018-04",
    summary:
      "Automated data acquisition and reporting with Python and SQL, improving reliability by 15%. Designed control logic for commercial electrical projects and cut project delivery times by 10%. First real exposure to the gap between what's elegant on paper and what survives the field.",
    tags: ["Python", "SQL", "Industrial automation"],
  },
];

export const EDUCATION = [
  {
    degree: "M.S. Information Science, AI Specialization",
    school: "University of Pittsburgh",
    place: "Pittsburgh, PA",
    years: "2023–2025",
    gpa: "3.83 / 4.0",
  },
  {
    degree: "Master of Business Administration",
    school: "Tamil Nadu Agricultural University",
    place: "India",
    years: "2017–2019",
    gpa: "3.0 / 4.0",
  },
  {
    degree: "B.E. Electrical & Electronics Engineering",
    school: "Anna University",
    place: "Chennai, India",
    years: "2009–2013",
    gpa: "3.5 / 4.0",
    note: "Class Topper, PPG Institute of Technology",
  },
];

export const CERTIFICATIONS = [
  { issuer: "AWS", name: "Solutions Architect — Associate" },
  { issuer: "Canonical", name: "Ubuntu Linux Professional" },
  { issuer: "LinkedIn", name: "Six Sigma: Green Belt" },
  { issuer: "Google", name: "IT Support Professional Certificate" },
  { issuer: "Pendo", name: "AI for Product Management" },
  { issuer: "IBM", name: "Data Science Professional" },
  { issuer: "Microsoft", name: "Azure Fundamentals" },
  { issuer: "Udacity", name: "Data Analyst Nanodegree" },
];

export const RECOMMENDATIONS = [
  {
    quote:
      "Jeeva built the app from the ground up, turning our messy ideas into something real and functional. He was always clear in communication, kept the team updated, and never overpromised — just quietly delivered solid work week after week.",
    name: "Ngoc (Frances) Phan",
    context: "Teammate on the Airoverse consulting project, MBA Analytics, University of Pittsburgh",
  },
];

export const VOLUNTEERING = [{ role: "Volunteer", org: "Pittsburgh Robotics Network", area: "Science and technology" }];

export const STACK = [
  { abbr: "PY", name: "Python", level: 0.95 },
  { abbr: "PT", name: "PyTorch", level: 0.85 },
  { abbr: "TF", name: "TensorFlow", level: 0.85 },
  { abbr: "CV", name: "OpenCV", level: 0.9 },
  { abbr: "LL", name: "LLM / RAG", level: 0.85 },
  { abbr: "FA", name: "FastAPI", level: 0.9 },
  { abbr: "GO", name: "Go", level: 0.7 },
  { abbr: "JS", name: "JavaScript", level: 0.8 },
  { abbr: "TS", name: "TypeScript", level: 0.7 },
  { abbr: "RE", name: "React", level: 0.75 },
  { abbr: "DK", name: "Docker", level: 0.85 },
  { abbr: "AW", name: "AWS", level: 0.85 },
  { abbr: "AF", name: "Airflow", level: 0.8 },
  { abbr: "GC", name: "GCP", level: 0.8 },
  { abbr: "SQ", name: "SQL", level: 0.8 },
  { abbr: "PL", name: "PLC / SCADA", level: 0.85 },
];

export const TOOLS = [
  {
    area: "Models",
    text: "PyTorch first for new work; TensorFlow where the team's already there. Fluent with the modern detection stack — YOLOv8, YOLOv11, RF-DETR, Roboflow — and classic scikit-learn for everything before neural networks were the obvious answer.",
  },
  {
    area: "LLMs",
    text: "RAG pipelines, fine-tuning, agentic workflows. LangChain and Hugging Face for composition; MLX when the work's local; vLLM and TGI when the work's serious.",
  },
  {
    area: "Languages",
    text: "Python daily; Go for services where latency matters; Java and JavaScript/TypeScript when the job calls for them. SQL fluently, including the ugly parts.",
  },
  {
    area: "Backend",
    text: "FastAPI as my default; Node/Express when the team's in JS; Spring where Java's mandated.",
  },
  {
    area: "Infra",
    text: "AWS (certified Solutions Architect), GCP, and Azure. Docker and CI/CD as table stakes; Apache Airflow for orchestration. HPC clusters for the genuinely large training runs; Linux everywhere else.",
  },
  {
    area: "Data",
    text: "PostgreSQL, MongoDB, MySQL. Pandas and NumPy in my sleep. ETL from Coursera and Salesforce APIs to plant-floor telemetry; Power BI and Tableau for the people who read the results.",
  },
  {
    area: "Industrial",
    text: "PLC and SCADA systems, IoT sensor networks, edge compute, LiDAR, predictive maintenance — the career before this career.",
  },
];

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

// Navigation — shared by the sidebar, mobile tab bar, and command line.
export const NAV = [
  { label: "INDEX", href: "/", glyph: "▣" },
  { label: "WORK", href: "/work", glyph: "⌬" },
  { label: "BLOG", href: "/blog", glyph: "▤" },
  { label: "RECORD", href: "/record", glyph: "☰" },
  { label: "INFO", href: "/info", glyph: "◉" },
  { label: "LOG", href: "/log", glyph: "≣" },
  { label: "SIGNAL", href: "/signal", glyph: "⌁" },
];


// ── helpers ──────────────────────────────────────────────────
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export function formatMonth(ym) {
  if (!ym) return "PRESENT";
  const [y, m] = ym.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

/** Whole years of professional experience since the first role. */
export function yearsOfExperience(now = new Date()) {
  const first = EXPERIENCE.map((e) => e.start).sort()[0];
  const [y, m] = first.split("-").map(Number);
  const months = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m);
  return Math.floor(months / 12);
}

const NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];
export const numberWord = (n) => NUMBER_WORDS[n] ?? String(n);
