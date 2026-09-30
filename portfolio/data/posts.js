// ─────────────────────────────────────────────────────────────
// Technical Blog Posts & Engineering Essays
// Written by Jeeva Krishnasamy — AI & Computer Vision Engineer
// ─────────────────────────────────────────────────────────────

export const POSTS = [
  {
    slug: "satellite-vision-production-failures",
    title: "Why Models Fail in Production: Lessons from 10,000 Satellite Rooftops",
    date: "2026.08.14",
    readTime: "6 min read",
    domains: ["vision"],
    tags: ["Computer Vision", "YOLOv8", "RF-DETR", "Satellite", "Production AI"],
    blurb:
      "How high-resolution satellite imagery breaks standard object detectors, and why ensemble voting with IoU clustering beats hyperparameter tuning every time.",
    lead:
      "When evaluating an object detector on Kaggle or a benchmark paper, you look at mAP@50-95. When you deploy a detector across metropolitan satellite surveys to locate commercial rooftop HVAC units, mAP is a vanity metric: what matters is whether a business lead is real or a shadow on a skylight.",
    sections: [
      {
        heading: "The Real-World Input Problem",
        body: `Satellite imagery is deceptively challenging for modern vision models. Unlike autonomous driving or indoor surveillance where objects have consistent ground-plane orientations, rooftop equipment exhibits:

- **Extreme scale disparity**: A rooftop commercial chiller can measure 12 meters across, while a residential exhaust fan is barely 40 centimeters.
- **Sun angle and cast shadows**: Early morning and late afternoon passes create elongated shadows that models regularly confuse with condenser coils.
- **Sensor artifacts & compression**: Google Maps static satellite tiles undergo spatial resampling and JPEG compression artifacts that soften sharp metallic edges.

When we began building the RTU Detection platform at Airoverse, off-the-shelf YOLOv8 detectors produced a false positive rate above 35%, primarily flagging skylights, elevator shafts, and solar panel inverters as HVAC units.`,
      },
      {
        heading: "Why One Model Isn't Enough: Ensemble Voting",
        body: `Instead of attempting to force a single detector to solve both multi-scale feature extraction and long-range contextual spatial reasoning, we engineered a complementary dual-architecture ensemble:

1. **YOLOv8 (Ultralytics)**: Optimized for fast, anchor-free local feature representation and sharp edge localization.
2. **RF-DETR (Real-time DEtection TRansformer)**: Uses multi-scale deformable attention to reason about the building rooftop context globally, helping distinguish isolated rooftop units from building infrastructure.

Both models were trained on Roboflow-curated satellite datasets augmented with synthetic Gaussian blur, contrast jitter, and solar-angle shadow rotations.`,
        code: `# Production NMS ensemble merge snippet
import numpy as np

def nms_merge(yolo_boxes, rfdetr_boxes, iou_thresh=0.55):
    """
    Combines predictions from YOLOv8 and RF-DETR via IoU-based consensus.
    Only boxes agreed upon or exceeding high-confidence thresholds survive.
    """
    candidates = []
    for y_box in yolo_boxes:
        for r_box in rfdetr_boxes:
            iou = compute_iou(y_box['bbox'], r_box['bbox'])
            if iou >= iou_thresh:
                # Weighted spatial average based on confidence
                w_y = y_box['conf']
                w_r = r_box['conf']
                merged_box = (y_box['bbox'] * w_y + r_box['bbox'] * w_r) / (w_y + w_r)
                candidates.append({
                    'bbox': merged_box,
                    'conf': (w_y + w_r) / 2.0,
                    'model': 'ensemble'
                })
    return filter_duplicates(candidates)`,
      },
      {
        heading: "Key Engineering Takeaways",
        body: `Shipping this system to production taught three enduring lessons:

- **Data curation is 90% of the model**: Hard negative mining on solar panel frames improved precision by 18 points—more than any architecture change.
- **Ensemble voting eliminates operational costs**: Reaching 90% precision and 80% recall allowed Airoverse to eliminate 90% of manual inspection overhead.
- **Tile boundaries kill detections**: Always overlap geospatial bounding tiles by at least 20% to prevent units on tile seams from being sliced in half.`,
      },
    ],
  },
  {
    slug: "rag-semantic-reranking-slack",
    title: "RAG in the Trenches: Semantic Re-ranking, Chunking & Latency Budgets",
    date: "2026.06.22",
    readTime: "8 min read",
    domains: ["llm"],
    tags: ["LLM", "RAG", "LangChain", "Vector Search", "Python"],
    blurb:
      "Moving beyond naive top-k vector similarity: combining dense vector retrieval with cross-encoder re-ranking to cut repetitive course support queries by 30%.",
    lead:
      "The easiest demo to build in modern software is a naive RAG script using LangChain and a vector store. The hardest system to keep useful in production is that exact same RAG script when real users start asking questions with conflicting jargon and missing context.",
    sections: [
      {
        heading: "The Failure Modes of Naive Cosine Similarity",
        body: `At the University of Pittsburgh, our course support Slack workspace handled thousands of inquiries across hundreds of students. Course staff were repeating the exact same syllabus, assignment guidelines, and exam policy answers daily.

When we prototyped a baseline vector retrieval pipeline (ChromaDB + OpenAI text-embedding-3-small), it failed in three distinct scenarios:

- **Keyword mismatch on synonymous terms**: A student asking "Where do I submit homework 3?" failed to match passages titled "Grading criteria & Canvas assignment portals".
- **Lost in the middle**: Feeding 10 chunk candidates into the LLM context caused hallucinations when contradictory instructions from previous semester syllabi were pulled in.
- **High false-confidence in retrieval**: Bi-encoder embedding models capture semantic relatedness, not authoritative relevance.`,
      },
      {
        heading: "Two-Tier Retrieval: Bi-Encoder + Cross-Encoder Re-ranking",
        body: `We restructured the pipeline into a two-tier retrieval architecture:

1. **Broad Retrieval ($k=20$)**: Dense vector search retrieves 20 candidate passages fast ($< 35$ms).
2. **Semantic Cross-Encoder Re-ranking**: A lightweight cross-encoder evaluates the exact $(query, document)$ pair simultaneously with full self-attention, scoring factual relevance.
3. **Context Injection ($top-4$)**: Only the top 4 re-ranked chunks enter the prompt.`,
        code: `# Production RAG pipeline with semantic re-ranking
from langchain_community.vectorstores import PGVector
from sentence_transformers import CrossEncoder

reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

def query_rag_assistant(question: str):
    # Step 1: Broad bi-encoder retrieval
    candidates = vector_store.similarity_search(question, k=20)
    
    # Step 2: Cross-encoder pair scoring
    pairs = [[question, doc.page_content] for doc in candidates]
    scores = reranker.predict(pairs)
    
    # Step 3: Top-k ranking
    ranked_indices = scores.argsort()[::-1][:4]
    curated_context = "\\n\\n".join([candidates[i].page_content for i in ranked_indices])
    
    # Step 4: Prompt LLM with clean, focused context
    return llm.invoke(SYSTEM_PROMPT.format(context=curated_context, query=question))`,
      },
      {
        heading: "The 30% Reduction Impact",
        body: `Deploying this assistant directly inside student Slack channels dropped repetitive support queries by 30%. More importantly, the precision of answers meant students received factual citations to course materials in under 2 seconds rather than waiting hours for teaching staff.`,
      },
    ],
  },
  {
    slug: "zero-video-exit-edge-cv",
    title: "Zero-Video-Exit: Real-Time Edge Computer Vision on Constrained Hardware",
    date: "2026.04.10",
    readTime: "7 min read",
    domains: ["vision"],
    tags: ["Edge AI", "Computer Vision", "ByteTrack", "YOLOv8", "Privacy"],
    blurb:
      "Architecting in-store retail dwell time and foot-traffic heat maps on local edge hardware without a single raw video frame leaving the premises.",
    lead:
      "Cloud video processing is an architecture that works until you look at the monthly bandwidth invoice or the legal compliance review. For retail physical spaces, edge inference isn't an optimization—it is the only viable architecture.",
    sections: [
      {
        heading: "The Edge Constraint Matrix",
        body: `When designing the RetailVision edge analytics engine, our constraints were strict:

- **Zero raw video transmission**: For GDPR and customer privacy compliance, zero footage could leave the local device.
- **Power and thermals**: Running on compact industrial edge devices (NVIDIA Jetson / x86 compact gateways) without active liquid cooling.
- **Multi-camera real-time streams**: Processing 15–20 FPS across multiple camera feeds concurrently.`,
      },
      {
        heading: "Tracking and Heat-Mapping Without Blob Storage",
        body: `We coupled a lightweight YOLOv8 nano/small person detector with **ByteTrack** for spatial association across frames. Instead of recording images, the pipeline extracts only mathematical vector states: $(track\\_id, (x, y), t)$.

These coordinates are mapped onto a calibrated 2D store blueprint. Dwell time accumulates into a spatial matrix, producing heat maps and traffic flow graphs computed entirely in local memory.`,
        code: `# Local spatial accumulator
import numpy as np

class DwellHeatmap:
    def __init__(self, grid_w=100, grid_h=100):
        self.grid = np.zeros((grid_h, grid_w), dtype=np.float32)

    def accumulate(self, tracks, dt):
        for track in tracks:
            cx, cy = track.center_bottom  # feet contact point
            gx = int(cx * self.grid.shape[1])
            gy = int(cy * self.grid.shape[0])
            if 0 <= gx < self.grid.shape[1] and 0 <= gy < self.grid.shape[0]:
                self.grid[gy, gx] += dt  # accumulate dwell seconds`,
      },
      {
        heading: "Result: Complete Privacy & Edge Efficiency",
        body: `The only data transmitted from store to dashboard is a tiny JSON payload every 5 minutes containing aggregated zone dwell counts. Bandwidth drops from gigabytes per hour to under 50 kilobytes per day.`,
      },
    ],
  },
  {
    slug: "what-factory-floors-taught-me-about-reliability",
    title: "What 15 Factory Floors Taught Me About Cloud SLAs and Engineering Reality",
    date: "2026.02.05",
    readTime: "5 min read",
    domains: ["systems"],
    tags: ["Industrial Automation", "Reliability", "Architecture", "Philosophy"],
    blurb:
      "Before deep learning and LLMs, I programmed PLCs and SCADA systems in heavy industrial plants. Here is what industrial reliability teaches modern software engineers.",
    lead:
      "In web software, when an API request fails, you return a 500 status code and tell the client to retry. In a thermal manufacturing facility, when a control loop fails, a turbine overheats or hundreds of gallons of coolant spill onto the floor.",
    sections: [
      {
        heading: "1. The Myth of the Clean Input",
        body: `Factory floors are physically hostile environments. Sensor wires pick up inductive noise from nearby 400V motors. Thermocouples drift as oxidation sets in. Pressure transmitters report impossible spikes when a valve snaps shut.

Early in my career at Blue Star and Shraddha Engineering, I learned that validating data at the boundary isn't a defensive programming practice—it is the only thing standing between stable operation and complete system collapse. When I build AI pipelines today, whether ingesting satellite tiles or Salesforce telemetry, I treat input data with the same rigorous skepticism.`,
      },
      {
        heading: "2. Fail-Safe Over Fail-Silent",
        body: `In PLC ladder logic, every emergency circuit is wired **normally-closed (NC)**. If a wire is severed, the circuit opens, power is cut, and the machine halts safely.

In modern microservice architectures, developers often write overly optimistic exception handlers that swallow errors, log a warning, and return default values. This is how data corruption propagates invisibly through downstream databases. When an unrecoverable invariant is breached, fail fast and make the failure obvious.`,
      },
      {
        heading: "3. Small Tools, Composed",
        body: `The most reliable industrial control systems aren't monolithic supercomputers; they are small, dedicated PID controllers and deterministic logic blocks connected via standard fieldbuses (Modbus, Profibus).

This directly mirrors the Unix philosophy and how I architect production ML services today: small, containerized FastAPI services acting as pipes with clear schema boundaries and automated health checks.`,
      },
    ],
  },
  {
    slug: "high-throughput-llm-gateway-go",
    title: "Building High-Throughput LLM Gateways in Go: Token Buckets & Fallback Routing",
    date: "2025.11.18",
    readTime: "6 min read",
    domains: ["llm", "systems"],
    tags: ["Go", "LLM", "Redis", "Distributed Systems", "Docker"],
    blurb:
      "Why we wrote our LLM reverse-proxy in Go with Redis token-bucket rate limiting to withstand provider outages and spike traffic.",
    lead:
      "Relying on a single proprietary LLM provider without a routing proxy is one of the highest technical debts an AI engineering team can take on. Providers suffer rate limits, maintenance windows, and regional latency spikes daily.",
    sections: [
      {
        heading: "The Requirement: Zero Downtime Routing",
        body: `Production applications require:
- **Per-model rate limiting**: Preventing an errant batch job from draining the team's entire API quota.
- **Provider failover**: If OpenAI returns a 503 or latency exceeds 4,000ms, immediately re-route the request to Anthropic or a self-hosted vLLM endpoint.
- **Minimal proxy overhead**: Less than 3ms added latency to the round-trip.`,
      },
      {
        heading: "Why Go Over Python or Node for the Proxy",
        body: `While Python is unmatched for model training and RAG orchestration, Go is the undisputed champion for networking proxies. Goroutines provide lightweight concurrent request handling with negligible memory footprint, and static compilation simplifies container deployment.`,
        code: `// Dynamic Fallback Dispatcher in Go
type RouteTarget struct {
    Primary   ModelEndpoint
    Fallback  ModelEndpoint
}

func (r *RouteTarget) Dispatch(ctx context.Context, req *LLMRequest) (*LLMResponse, error) {
    resp, err := r.Primary.Send(ctx, req)
    if err != nil || resp.StatusCode >= 500 {
        log.Printf("Primary endpoint failed: %v. Initiating fallback...", err)
        return r.Fallback.Send(ctx, req)
    }
    return resp, nil
}`,
      },
      {
        heading: "Token-Bucket Rate Limiting via Redis",
        body: `Using Redis atomic Lua scripts to implement token buckets allows multiple distributed proxy instances to enforce shared per-minute token and request quotas without race conditions.`,
      },
    ],
  },
];
