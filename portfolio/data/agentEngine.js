import { SITE, PROJECTS, EXPERIENCE, EDUCATION, CERTIFICATIONS, STACK, TOOLS, INFLUENCES, formatMonth } from "./site.js";
import { FR_SITE, FR_PROJECTS, FR_EXPERIENCE, FR_EDUCATION, FR_POSTS } from "./translations.js";
import { POSTS } from "./posts.js";

// Pre-compiled comprehensive knowledge index for Jeeva Krishnasamy
export const AGENT_KNOWLEDGE = {
  profile: SITE,
  projects: PROJECTS,
  posts: POSTS,
  experience: EXPERIENCE,
  education: EDUCATION,
  certifications: CERTIFICATIONS,
  stack: STACK,
  tools: TOOLS,
  influences: INFLUENCES,
};

// System prompt used if visitor connects a live LLM (OpenAI/Gemini/Groq)
export const AGENT_SYSTEM_PROMPT = `
You are the personal AI Agent representing Jeeva Krishnasamy on his official portfolio website (jivanandham.com).
Your mission is to welcome visitors, answer questions from recruiters, hiring managers, engineers, and collaborators about Jeeva's background, projects, skills, education, and career availability.

CORE FACTS ABOUT JEEVA:
- Name: Jeeva Krishnasamy
- Role: AI Engineer, Computer Vision Specialist, and LLM Systems Developer
- Status: Available immediately ("Open to work"). Holds a French Talent Passport (no visa sponsorship required in France/EU). Open to on-site, hybrid, or remote roles in France, Europe, or the US.
- Location: France (relocated after completing his Master's in the US).
- Education:
  * M.S. Information Science (AI Specialization), University of Pittsburgh (2023–2025, GPA 3.83/4.0).
  * MBA, Tamil Nadu Agricultural University (2017–2019).
  * B.E. Electrical & Electronics Engineering, Anna University (2009–2013, Class Topper).
- Certifications: AWS Certified Solutions Architect - Associate, Ubuntu Linux Professional, Six Sigma Green Belt, Google IT Support, IBM Data Science, Microsoft Azure Fundamentals.
- Languages: English, French (Français), Tamil (தமிழ்).
- Email: jek283@pitt.edu | LinkedIn: linkedin.com/in/jivanandham | GitHub: github.com/jivanandham

TOP PROJECTS:
1. RTU Detection Platform (Airoverse, 2025): Rooftop HVAC detection over satellite imagery with YOLOv8 + RF-DETR ensemble. Achieved 90% precision & 80% recall. Cut manual detection time and operational costs by 90%. Deployed with FastAPI, React, Docker on GCP.
2. RAG Slack Assistant (Univ of Pittsburgh, 2025): Production retrieval-augmented generation assistant for student & course support. LangChain, vector retrieval, semantic re-ranking. Reduced repetitive support requests by 30%.
3. RetailVision Analytics (2024): Edge-hardware real-time customer tracking and dwell-time heat maps using YOLOv8 and ByteTrack. No raw video leaves the device.
4. LLM API Gateway (2024): High-performance Go gateway with Redis token-bucket rate limiting, per-model load balancing, and fallback routing across OpenAI, Anthropic, and local vLLM endpoints.
5. Deepfake Detection (2023): InceptionResNetV2 pipeline for flagging manipulated images and video frames under heavy compression.
6. Facial Recognition ATM (2023): Card-free one-shot biometric verification using custom Siamese networks, FastAPI, PostgreSQL, and Docker.
7. Stock Bull Trading Platform (2024): Paper trading platform with real-time Finnhub market data, virtual wallet, Node.js, Express, MongoDB, Auth0.
8. Option Pricing Engine (2022): Monte Carlo simulation (100k paths in ms) + Black-Scholes interactive convergence dashboard in Python/Dash.

TONE & PERSONALITY:
- Confident, precise, engineering-minded, and articulate.
- Speaks from first-hand technical experience: appreciates production reliability, clean architectures, and data quality over theoretical hype.
- Concise and courteous. When relevant, offer direct navigation links (e.g., /work, /record, /info, /signal) and suggest follow-up questions.
- If the visitor speaks French or asks in French, reply fluently and naturally in French.
`;

// Helper: Normalize input
function normalize(str) {
  return (str || "")
    .toLowerCase()
    .replace(/[^\w\s+#.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Local deterministic RAG and Intent Recognition Engine.
 * Operates 100% in-browser without any server or API key.
 * Fully bilingual (EN / FR).
 */
export function processLocalQuery(query, history = [], lang = "en") {
  const q = normalize(query);

  const isFrench =
    lang === "fr" ||
    /(bonjour|salut|qui|projet|expérience|experience|compétence|competence|disponible|embauche|poste|télétravail|teletravail|france|paris|diplôme|diplome|formation|contact|parcours|parlez|français|francais|cv|travail|anglais|etudes|études)/i.test(
      query
    );

  if (!q) {
    return isFrench
      ? {
          text: "Connexion établie. Que souhaitez-vous savoir sur les réalisations de Jeeva, sa stack technique ou sa disponibilité professionnelle ?",
          actions: [
            { label: "Projets Principaux", query: "Quels sont tes projets principaux ?" },
            { label: "Stack Technique", query: "Quelle est ta stack technique ?" },
            { label: "Disponibilité", query: "Es-tu disponible pour une embauche ?" },
          ],
          suggestions: [
            "Parle-moi du projet satellite RTU",
            "Comment contacter Jeeva ?",
            "Quels systèmes LLM as-tu développés ?",
          ],
        }
      : {
          text: "Connection established. What would you like to know about Jeeva's work, tech stack, or career background?",
          actions: [
            { label: "Top Projects", query: "What are your top projects?" },
            { label: "Tech Stack", query: "What is your tech stack?" },
            { label: "Availability", query: "Are you available for work?" },
          ],
          suggestions: [
            "Tell me about the satellite project",
            "How can I contact Jeeva?",
            "What LLM systems have you built?",
          ],
        };
  }

  // Check context from recent queries if any
  const lastUserMsg = history.filter((m) => m.sender === "user").slice(-2)[0]?.text || "";
  const lastQ = normalize(lastUserMsg);

  // 1. GREETINGS & INTRO
  if (
    /^(hi|hello|hey|yo|greetings|bonjour|salut|hola|vanakkam|namaste|good\s*(morning|afternoon|evening)|who\s*are\s*you|what\s*are\s*you|qui\s*es\s*tu|qui\s*est)/.test(
      q
    )
  ) {
    return isFrench
      ? {
          text: `Bonjour ! Je suis l'agent IA officiel de Jeeva Krishnasamy.\n\nJeeva est un **Ingénieur IA / Vision par Ordinateur & Systèmes LLM** avec plus de 9 ans d'expérience combinée en automatisation industrielle, deep learning et architectures de données distribuées. Il réside en France, est titulaire d'un **Passeport Talent** et est **disponible immédiatement pour des opportunités en ingénierie IA/ML**.\n\nComment puis-je vous aider ? Vous pouvez m'interroger sur ses projets de production, ses compétences, ses diplômes ou les moyens de le contacter.`,
          actions: [
            { label: "Voir les projets", link: "/work" },
            { label: "Consulter le parcours", link: "/record" },
            { label: "Contacter Jeeva", link: "/signal" },
          ],
          suggestions: [
            "Quels sont ses meilleurs projets en IA ?",
            "Parle-moi de son expérience en RAG & LLM",
            "Quel est son statut de visa / autorisation de travail ?",
          ],
        }
      : {
          text: `Hello! I am Jeeva's interactive portfolio agent.\n\nJeeva Krishnasamy is an **AI / Computer Vision & LLM Systems Engineer** with over 9 years of total technical experience across industrial automation, deep learning, and scalable software pipelines. He holds a French Talent Passport and is **open to AI/ML engineering roles**.\n\nHow can I help you today? You can ask about his projects, skills, education, or how to contact him.`,
          actions: [
            { label: "Explore Projects", link: "/work" },
            { label: "View CV & Record", link: "/record" },
            { label: "Open Signal (Contact)", link: "/signal" },
          ],
          suggestions: [
            "What are your top AI projects?",
            "Tell me about your RAG & LLM experience",
            "What is your visa / work authorization status?",
          ],
        };
  }

  // 2. HIRING / AVAILABILITY / LOCATION / VISA / CONTRACT
  if (
    /(hire|hiring|available|availability|job|role|looking for work|open to work|relocate|relocation|visa|talent passport|france|paris|pittsburgh|remote|hybrid|onsite|salary|notice period|start date|embauche|disponible|disponibilit|recruter|poste|contrat|passeport talent|teletravail)/.test(
      q
    )
  ) {
    return isFrench
      ? {
          text: `**Statut : Disponible Immédiatement pour Embauche**\n\n- **Postes ciblés :** Ingénieur IA, Ingénieur Machine Learning, Ingénieur Vision par Ordinateur, Développeur RAG/LLM ou Ingénieur Logiciel Senior.\n- **Localisation & Flexibilité :** Réside en France ; ouvert aux postes **sur site, en hybride ou en télétravail complet** en France, en Europe et aux États-Unis.\n- **Autorisation de travail :** Titulaire d'un **Passeport Talent** (droit légal plein et direct d'exercer en France sans démarche de parrainage).\n- **Disponibilité :** Immédiate sans préavis.\n\nSouhaitez-vous planifier un échange ou recevoir son CV complet ?`,
          actions: [
            { label: "Envoyer un email", link: `mailto:${SITE.email}` },
            { label: "Profil LinkedIn", link: SITE.linkedin, external: true },
            { label: "Historique de carrière", link: "/record" },
          ],
          suggestions: [
            "Quelles sont ses compétences techniques clés ?",
            "Quels projets a-t-il menés chez Airoverse ?",
            "Quelle est sa formation universitaire ?",
          ],
        }
      : {
          text: `**Status: Open to Work (Available Immediately)**\n\n- **Target Roles:** AI Engineer, Machine Learning Engineer, Computer Vision Engineer, LLM/RAG Systems Developer, or Senior Software Engineer.\n- **Location & Flexibility:** Based in France; available for **on-site, hybrid, or remote** arrangements across France, Europe, and the US.\n- **Work Authorization:** Holds a **French Talent Passport** (full legal right to work without sponsorship requirement in France).\n- **Notice Period:** Ready to start right away.\n\nWould you like to review his resume or schedule an introductory chat?`,
          actions: [
            { label: "Email Jeeva directly", link: `mailto:${SITE.email}` },
            { label: "Connect on LinkedIn", link: SITE.linkedin, external: true },
            { label: "Review Career History", link: "/record" },
          ],
          suggestions: [
            "What are his strongest technical skills?",
            "What projects did he build at Airoverse?",
            "What is his educational background?",
          ],
        };
  }

  // 3. CONTACT & SOCIAL
  if (
    /(contact|email|reach|phone|touch|connect|linkedin|github|message|talk|call|meeting|contacter|joindre|ecrire|coordonnees)/.test(
      q
    )
  ) {
    return isFrench
      ? {
          text: `Vous pouvez joindre Jeeva directement via plusieurs canaux :\n\n- **Email direct :** [${SITE.email}](mailto:${SITE.email}) *(délai de réponse généralement inférieur à 24h)*\n- **LinkedIn :** [linkedin.com/in/jivanandham](${SITE.linkedin})\n- **GitHub :** [github.com/jivanandham](${SITE.github})\n- **Localisation :** ${SITE.location} (Disponible en présentiel, hybride ou télétravail)`,
          actions: [
            { label: "Envoyer un email", link: `mailto:${SITE.email}` },
            { label: "Canal de contact (Signal)", link: "/signal" },
            { label: "Ouvrir GitHub", link: SITE.github, external: true },
          ],
          suggestions: [
            "Parle-moi du projet de détection satellite RTU",
            "Quels frameworks utilise-t-il ?",
            "Est-il ouvert au télétravail ?",
          ],
        }
      : {
          text: `You can reach Jeeva directly through several channels:\n\n- **Direct Email:** [${SITE.email}](mailto:${SITE.email}) *(response time usually under 24 hours)*\n- **LinkedIn:** [linkedin.com/in/jivanandham](${SITE.linkedin})\n- **GitHub:** [github.com/jivanandham](${SITE.github})\n- **Location:** ${SITE.location} (Open to remote, hybrid, or on-site)`,
          actions: [
            { label: "Send Email", link: `mailto:${SITE.email}` },
            { label: "View Signal Channel", link: "/signal" },
            { label: "GitHub Profile", link: SITE.github, external: true },
          ],
          suggestions: [
            "Tell me about the RTU detection project",
            "What frameworks does he use?",
            "Is he open to remote work?",
          ],
        };
  }

  // 4. SPECIFIC PROJECTS: RTU / Satellite HVAC
  if (
    /(rtu|hvac|satellite|airoverse|rooftop|toiture|climatisation|yolov8|rf-detr|detection platform)/.test(
      q
    ) ||
    (lastQ.includes("rtu") && /(detail|code|approach|approche|result|resultat|metric)/.test(q))
  ) {
    const p = (isFrench ? FR_PROJECTS : PROJECTS).find((item) => item.slug === "rtu-detection");
    return isFrench
      ? {
          text: `**Projet : ${p.title}** (${p.year})\n\n**La Problématique :**\nAiroverse avait besoin de localiser les unités de climatisation de toit (RTU) sur des métropoles entières pour générer des prospects qualifiés. Les inspections manuelles par satellite étaient lentes, onéreuses et sujettes aux erreurs.\n\n**L'Approche de Jeeva :**\n- Construction de la solution de bout en bout : entraînement des détecteurs **YOLOv8** et **RF-DETR** sur des jeux de données Roboflow minutieusement annotés.\n- Connexion à l'API Google Maps Static Satellite avec collecte automatisée par tuiles cartographiques.\n- Couche de vote d'ensemble (fusion NMS avec seuil IoU à 0.55) pour éliminer les faux positifs.\n- Backend FastAPI conteneurisé sous Docker avec console React, déployé sur Google Cloud Platform (GCP).\n\n**Résultats en Production :**\n- **90% de précision** et **80% de rappel** sur l'imagerie satellite.\n- **Réduction de 90% du temps d'inspection manuelle et des coûts opérationnels**.\n\n\`\`\`python\n# Vote d'ensemble : YOLOv8 + RF-DETR\ndetections = nms_merge(\n    yolo.predict(tile, conf=0.42),\n    rfdetr.predict(tile, conf=0.38),\n    iou_thresh=0.55\n)\n\`\`\``,
          actions: [
            { label: "Voir l'étude de cas", link: "/work#rtu-detection" },
            { label: "Annonce officielle Airoverse", link: p.link?.href, external: true },
          ],
          suggestions: [
            "Parle-moi de l'assistant Slack RAG",
            "Quels autres projets de vision a-t-il réalisés ?",
            "Quelle infrastructure cloud maîtrise-t-il ?",
          ],
        }
      : {
          text: `**Project: ${p.title}** (${p.year})\n\n**The Problem:**\nAiroverse needed to locate rooftop HVAC units (RTUs) across large metropolitan areas to generate qualified business leads. Manual satellite surveys were slow, error-prone, and expensive.\n\n**Jeeva's Approach:**\n- Built an automated pipeline from the ground up: trained **YOLOv8** and **RF-DETR** object detection models on curated Roboflow datasets.\n- Integrated Google Maps static satellite imagery API with automated tile collection.\n- Implemented an ensemble voting layer (NMS merge with IoU threshold 0.55) to maximize accuracy.\n- Containerized with Docker and deployed as a FastAPI backend with a React UI on Google Cloud Platform (GCP).\n\n**Production Results:**\n- **90% precision** and **80% recall** on satellite imagery.\n- **Cut manual detection time and operational costs by 90%**.\n\n\`\`\`python\n# Ensemble voting snippet\ndetections = nms_merge(\n    yolo.predict(tile, conf=0.42),\n    rfdetr.predict(tile, conf=0.38),\n    iou_thresh=0.55\n)\n\`\`\``,
          actions: [
            { label: "View Case Study in Work", link: "/work#rtu-detection" },
            { label: "Airoverse Announcement", link: p.link?.href, external: true },
          ],
          suggestions: [
            "Tell me about the RAG Slack assistant",
            "What other computer vision projects has he done?",
            "What cloud infrastructure did he use?",
          ],
        };
  }

  // 5. SPECIFIC PROJECTS: RAG Slack Assistant / LLM Assistant
  if (
    /(rag|slack|assistant|retrieval augmented|vector|rerank|pitt|course staff|langchain)/.test(
      q
    )
  ) {
    const p = (isFrench ? FR_PROJECTS : PROJECTS).find((item) => item.slug === "rag-slack-assistant");
    return isFrench
      ? {
          text: `**Projet : ${p.title}** (${p.year})\n\n**La Problématique :**\nÀ l'Université de Pittsburgh, les assistants de cours passaient des heures à répondre aux mêmes questions logistiques et techniques sur Slack, tandis que les étudiants attendaient des réponses déjà documentées.\n\n**La Solution de Jeeva :**\n- Conception d'un assistant RAG de production avec **LangChain**, indexation vectorielle et reclassement sémantique.\n- Sélection des passages candidats (k=20) puis reclassement (cross-encoder) pour n'injecter que les 4 passages les plus pertinents dans la fenêtre de contexte du modèle.\n- Intégration directe dans les canaux de cours Slack.\n\n**Impact en Production :**\n- **Baisse de 30%** des tickets de support répétitifs.\n- Précision accrue des réponses et gain de temps substantiel pour le corps enseignant.\n\n\`\`\`python\ncandidates = retriever.invoke(question, k=20)\ncontext = reranker.rank(question, candidates)[:4]\nanswer = llm.invoke(prompt.format(context=context, question=question))\n\`\`\``,
          actions: [
            { label: "Voir dans la section Projets", link: "/work#rag-slack-assistant" },
            { label: "Voir la passerelle LLM", query: "Parle-moi de la passerelle LLM" },
          ],
          suggestions: [
            "Quels autres projets LLM Jeeva a-t-il conçus ?",
            "Quelles bases vectorielles utilise-t-il ?",
            "Parle-moi de son travail à l'Université de Pittsburgh",
          ],
        }
      : {
          text: `**Project: ${p.title}** (${p.year})\n\n**The Problem:**\nAt the University of Pittsburgh, teaching staff were overwhelmed with repetitive logistics and technical questions in Slack, while students endured long waits for answers that already existed in documentation.\n\n**Jeeva's Solution:**\n- Architected an automated RAG assistant using **LangChain**, vector similarity retrieval, and semantic re-ranking.\n- Candidates are retrieved (k=20) and passed through a cross-encoder re-ranker so the top 4 most informative passages feed the LLM context window.\n- Integrated directly into the university Slack workspace.\n\n**Production Impact:**\n- **30% reduction** in repetitive support queries.\n- Dramatically improved retrieval precision and freed staff time for nuanced student inquiries.\n\n\`\`\`python\ncandidates = retriever.invoke(question, k=20)\ncontext = reranker.rank(question, candidates)[:4]\nanswer = llm.invoke(prompt.format(context=context, question=question))\n\`\`\``,
          actions: [
            { label: "View in Work Section", link: "/work#rag-slack-assistant" },
            { label: "See LLM Gateway project", query: "Tell me about the LLM Gateway" },
          ],
          suggestions: [
            "What other LLM projects has Jeeva built?",
            "What vector databases and models did he use?",
            "Tell me about his work at University of Pittsburgh",
          ],
        };
  }

  // 6. SPECIFIC PROJECTS: RetailVision / Edge CV / Tracking
  if (
    /(retail|retailvision|bytetrack|tracking|dwell|heat\s*map|edge\s*hardware|in-store|magasin|suivi)/.test(
      q
    )
  ) {
    const p = (isFrench ? FR_PROJECTS : PROJECTS).find((item) => item.slug === "retailvision");
    return isFrench
      ? {
          text: `**Projet : ${p.title}** (${p.year})\n\n**La Problématique :**\nLes commerçants souhaitent cartographier les parcours réels des clients sans déployer des flux vidéo cloud lourds, onéreux et attentatoires à la vie privée.\n\n**La Solution de Jeeva :**\n- Suivi multi-objets sur matériel edge associant la détection de personnes par **YOLOv8** et l'association temporelle **ByteTrack**.\n- Génération de cartes thermiques et analyse des temps d'arrêt directement en mémoire sur l'appareil embarqué.\n- **Aucun flux vidéo brut ne quitte le matériel**, garantissant la conformité RGPD/vie privée et supprimant les coûts de bande passante.\n\n\`\`\`python\nfor frame in stream:\n    dets = yolo(frame, classes=[PERSON])\n    tracks = tracker.update(dets)\n    heatmap.accumulate(tracks, dt=frame.dt)\n\`\`\``,
          actions: [{ label: "Voir l'étude de cas", link: "/work#retailvision" }],
          suggestions: [
            "Quels autres travaux en Vision par Ordinateur ?",
            "Parle-moi du DAB à reconnaissance faciale",
            "Quelles sont ses compétences en déploiement edge ?",
          ],
        }
      : {
          text: `**Project: ${p.title}** (${p.year})\n\n**The Problem:**\nRetailers needed actionable foot-traffic intelligence: where shoppers actually dwell, browse, and walk. Cloud video processing was too bandwidth-heavy, expensive, and posed privacy concerns.\n\n**Jeeva's Solution:**\n- Edge-native multi-object tracking combining **YOLOv8** human detection with **ByteTrack** association.\n- Computed real-time dwell-time heat maps and zone analytics directly on edge hardware.\n- **Zero raw video leaves the local device**, preserving customer privacy and eliminating cloud transmission costs.\n\n\`\`\`python\nfor frame in stream:\n    dets = yolo(frame, classes=[PERSON])\n    tracks = tracker.update(dets)\n    heatmap.accumulate(tracks, dt=frame.dt)\n\`\`\``,
          actions: [{ label: "View Case Study", link: "/work#retailvision" }],
          suggestions: [
            "What other Computer Vision work has he done?",
            "Tell me about the Facial Recognition ATM",
            "What are his hardware & deployment skills?",
          ],
        };
  }

  // 7. SPECIFIC PROJECTS: LLM Gateway (Go)
  if (
    /(gateway|passerelle|go|golang|vllm|rate limit|token bucket|fallback|load balanc|basculement)/.test(
      q
    )
  ) {
    const p = (isFrench ? FR_PROJECTS : PROJECTS).find((item) => item.slug === "llm-gateway");
    return isFrench
      ? {
          text: `**Projet : ${p.title}** (${p.year})\n\n**La Problématique :**\nLes applications d'entreprise utilisant des LLMs exigent une limitation stricte de requêtes, des réessais automatiques et un basculement immédiat en cas d'indisponibilité d'un fournisseur.\n\n**La Solution de Jeeva :**\n- Passerelle ultra-rapide écrite en **Go**, adossée à **Redis** pour la limitation par jetons (token-bucket).\n- Routage dynamique et basculement automatique entre OpenAI, Anthropic et des instances locales **vLLM**.\n- Interface standardisée documentée en OpenAPI et conteneurisée sous Docker.\n\n\`\`\`go\nroute := router.Pick(req.Model)\nresp, err := route.Primary.Do(ctx, req)\nif isRetryable(err) {\n    resp, err = route.Fallback.Do(ctx, req)\n}\n\`\`\``,
          actions: [{ label: "Voir dans Projets", link: "/work#llm-gateway" }],
          suggestions: [
            "Quelle est son expérience avec Go vs Python ?",
            "Parle-moi du projet de détection de Deepfakes",
            "Quelles sont ses compétences DevOps & Cloud ?",
          ],
        }
      : {
          text: `**Project: ${p.title}** (${p.year})\n\n**The Problem:**\nProduction LLM applications require robust rate-limiting, retries, and high-availability provider fallback without ballooning latency.\n\n**Jeeva's Solution:**\n- Built a high-concurrency proxy in **Go** backed by **Redis** token-bucket rate limiting.\n- Enabled dynamic model routing and automatic failover across OpenAI, Anthropic, and local vLLM endpoints.\n- Specified with OpenAPI and containerized with Docker.\n\n**Result:** High availability and fault tolerance against third-party provider outages.\n\n\`\`\`go\nroute := router.Pick(req.Model)\nresp, err := route.Primary.Do(ctx, req)\nif isRetryable(err) {\n    resp, err = route.Fallback.Do(ctx, req)\n}\n\`\`\``,
          actions: [{ label: "View in Work", link: "/work#llm-gateway" }],
          suggestions: [
            "What is his experience with Go vs Python?",
            "Tell me about the Deepfake Detection project",
            "What are his cloud & DevOps skills?",
          ],
        };
  }

  // 8. OTHER SPECIFIC PROJECTS: Deepfake, ATM, Stock Bull, Option Pricing
  if (/(deepfake|manipulated|manipule|inceptionresnet)/.test(q)) {
    return isFrench
      ? {
          text: `**Pipeline de Détection de Deepfakes (2023)**\n- Pipeline TensorFlow basé sur **InceptionResNetV2** pour détecter les manipulations d'images et de vidéos en temps quasi-réel.\n- Augmentation de données ciblée (artefacts de compression JPEG, bruit gaussien, gigue colorimétrique) pour garantir la robustesse face aux dégradations réelles des vidéos web.\n- Conçu pour une cadence d'analyse élevée image par image.`,
          actions: [{ label: "Voir dans Projets", link: "/work#deepfake-detection" }],
          suggestions: ["Parle-moi du DAB biométrique", "Quels frameworks de Deep Learning maîtrise-t-il ?"],
        }
      : {
          text: `**Deepfake Detection Pipeline (2023)**\n- Developed a TensorFlow pipeline with fine-tuned **InceptionResNetV2** for near-real-time frame-level manipulation detection.\n- Employed aggressive synthetic data augmentation (JPEG compression artifacts, color jitter, frame sampling) so the classifier remains robust against in-the-wild video degradation.\n- Designed for high-throughput frame analysis.`,
          actions: [{ label: "View in Work", link: "/work#deepfake-detection" }],
          suggestions: ["Tell me about the Facial ATM project", "What deep learning frameworks does he use?"],
        };
  }

  if (/(atm|facial|biometric|biometrique|siamese|siame|face|visage|dab)/.test(q)) {
    return isFrench
      ? {
          text: `**DAB à Reconnaissance Faciale (2023)**\n- Prototype d'authentification bancaire sans carte utilisant des **réseaux de neurones siamois** personnalisés pour la vérification one-shot du visage.\n- Backend haute cadence avec **FastAPI** et stockage d'identités sous PostgreSQL, entièrement conteneurisé avec Docker.\n- Latence de vérification optimale adaptée aux terminaux bancaires en conditions d'éclairage variables.`,
          actions: [{ label: "Voir dans Projets", link: "/work#facial-atm" }],
          suggestions: ["Quels autres projets de sécurité ou vision ?", "Parle-moi de son parcours professionnel"],
        }
      : {
          text: `**Facial Recognition ATM (2023)**\n- Engineered card-free biometric ATM authentication utilizing custom **Siamese neural networks** for one-shot face verification.\n- Served through a high-performance **FastAPI** backend with PostgreSQL-backed biometric identity records.\n- Achieved verification latency suitable for real-time customer interaction flows under varied lighting conditions.`,
          actions: [{ label: "View in Work", link: "/work#facial-atm" }],
          suggestions: ["What other security or vision projects does he have?", "Tell me about his career background"],
        };
  }

  if (/(stock|bull|trading|finnhub|bourse|portefeuille|wallet)/.test(q)) {
    return isFrench
      ? {
          text: `**Plateforme de Trading Stock Bull (2024)**\n- Plateforme de trading virtuel (paper trading) construite sur Node.js, Express et MongoDB, sécurisée avec Auth0.\n- Flux de cotations en temps réel via l'API Finnhub, alertes automatisées et valorisation instantanée du portefeuille virtuel.\n- Conçue à l'Université de Pittsburgh pour tester des stratégies sans risque financier.`,
          actions: [{ label: "Voir dans Projets", link: "/work#stock-bull" }],
          suggestions: ["Parle-moi du moteur d'évaluation d'options", "Quels frameworks backend maîtrise-t-il ?"],
        }
      : {
          text: `**Stock Bull Trading Platform (2024)**\n- Full-stack paper-trading platform built with Node.js, Express, and MongoDB, secured via Auth0.\n- Streamed real-time market prices from the Finnhub API with automated watchlist alerts and virtual portfolio re-pricing.\n- Created at the University of Pittsburgh for risk-free strategy evaluation.`,
          actions: [{ label: "View in Work", link: "/work#stock-bull" }],
          suggestions: ["Tell me about the Option Pricing Engine", "What backend frameworks does he know?"],
        };
  }

  if (/(option|black-scholes|monte\s*carlo|pricing\s*engine|yfinance)/.test(q)) {
    return isFrench
      ? {
          text: `**Moteur d'Évaluation d'Options (2022)**\n- Simulation vectorisée Monte Carlo avec NumPy générant 100 000 trajectoires d'actifs en quelques millisecondes.\n- Tracé interactif des courbes de convergence face au modèle analytique de Black-Scholes dans un tableau de bord Dash (Python).\n- Récupération des cours et de la volatilité implicite en temps réel avec yfinance.`,
          actions: [{ label: "Voir dans Projets", link: "/work#option-pricing" }],
          suggestions: ["Quelles sont ses compétences quantitatives et mathématiques ?", "Voir tous les projets"],
        }
      : {
          text: `**Option Pricing Engine (2022)**\n- Vectorized NumPy Monte Carlo engine capable of simulating 100,000 asset paths in milliseconds.\n- Plotted live convergence curves against the analytic Black-Scholes benchmark in an interactive Python Dash dashboard.\n- Pulls live market prices and implied volatility metrics via yfinance.`,
          actions: [{ label: "View in Work", link: "/work#option-pricing" }],
          suggestions: ["What are his quantitative and mathematical skills?", "View all projects"],
        };
  }

  // 9. PROJECTS OVERVIEW / LIST
  if (
    /(projects|portfolio|what did you build|showcase|case studies|work|built|projets|realisations|réalisations|etudes de cas)/.test(
      q
    )
  ) {
    return isFrench
      ? {
          text: `Jeeva a développé **9 systèmes majeurs en production et recherche** couvrant la Vision par Ordinateur, les LLMs et l'Ingénierie des Données :\n\n1. **Plateforme RTU (2025) :** Détection d'équipements CVC sur toitures par satellite avec YOLOv8 et RF-DETR (90% de précision, -90% de coûts).\n2. **Assistant RAG Slack (2025) :** Recherche vectorielle et reclassement sémantique réduisant de 30% les demandes d'assistance.\n3. **RetailVision Analytics (2024) :** Suivi de clientèle et cartes de chaleur sur matériel edge avec ByteTrack.\n4. **Passerelle API LLM (2024) :** Proxy Go ultra-rapide avec limitation par jetons et basculement multi-fournisseurs.\n5. **Détection de Deepfakes (2023) :** Classifieur InceptionResNetV2 robuste aux fortes compressions.\n6. **DAB à Reconnaissance Faciale (2023) :** Authentification biométrique sans carte avec réseaux siamois.\n7. **Trading Stock Bull (2024) :** Simulation boursière en temps réel avec l'API Finnhub.\n8. **Base Archéologique (2023) :** Système PostgreSQL auditable avec versioning horodaté.\n9. **Moteur d'Options (2022) :** Simulation Monte Carlo 100k trajectoires et benchmark Black-Scholes.`,
          actions: [
            { label: "Explorer les Projets", link: "/work" },
            { label: "Filtrer : Projets Vision", link: "/work#rtu-detection" },
            { label: "Filtrer : Projets LLM", link: "/work#rag-slack-assistant" },
          ],
          suggestions: [
            "En savoir plus sur la détection RTU",
            "Comment a-t-il conçu l'assistant Slack RAG ?",
            "Dans quelle stack technique est-il spécialisé ?",
          ],
        }
      : {
          text: `Jeeva has built **9 featured production & research systems** spanning Computer Vision, LLMs, and Data Engineering:\n\n1. **RTU Detection Platform (2025):** Satellite rooftop HVAC detection with YOLOv8 & RF-DETR (90% precision, 90% cost cut).\n2. **RAG Slack Assistant (2025):** Vector search & semantic re-ranking assistant cutting repetitive queries by 30%.\n3. **RetailVision Analytics (2024):** In-store customer tracking & dwell heat maps on edge hardware with ByteTrack.\n4. **LLM API Gateway (2024):** High-speed Go reverse-proxy with token-bucket rate limiting and multi-provider failover.\n5. **Deepfake Detection (2023):** InceptionResNetV2 frame-level manipulation classifier.\n6. **Facial Recognition ATM (2023):** Card-free one-shot biometric auth with Siamese networks.\n7. **Stock Bull Trading Platform (2024):** Real-time paper-trading platform with Finnhub API.\n8. **Archaeology Database (2023):** Auditable PostgreSQL record system with time-stamped versioning.\n9. **Option Pricing Engine (2022):** 100k-path vectorized Monte Carlo & Black-Scholes dashboard.`,
          actions: [
            { label: "Browse All Case Studies", link: "/work" },
            { label: "Filter: Vision Projects", link: "/work#rtu-detection" },
            { label: "Filter: LLM Projects", link: "/work#rag-slack-assistant" },
          ],
          suggestions: [
            "Tell me more about RTU Detection",
            "How did he build the RAG Slack Assistant?",
            "What tech stack does he specialize in?",
          ],
        };
  }

  // 10. COMPUTER VISION SPECIALIZATION
  if (
    /(computer vision|vision par ordinateur|vision|cv|yolo|rf-detr|bytetrack|opencv|image processing|detection|segmentation|roboflow)/.test(
      q
    )
  ) {
    return isFrench
      ? {
          text: `**Expertise en Vision par Ordinateur :**\n\nJeeva est spécialisé dans la vision par ordinateur appliquée aux données complexes du monde réel :\n- **Architectures :** YOLOv8, YOLOv11, RF-DETR, Réseaux Siamois, InceptionResNet, ResNet, ViT.\n- **Suivi et Temps Réel :** ByteTrack, DeepSORT, OpenCV, calcul de trajectoires et cartes de chaleur sur matériel edge.\n- **Data Engineering pour la CV :** Curation de jeux de données sur Roboflow, apprentissage actif, techniques avancées d'augmentation de données contre la compression.\n- **Cas d'usage concrets :** Imagerie satellite (détection RTU Airoverse), analyse de flux en magasin (RetailVision), sécurité biométrique et détection de médias manipulés.`,
          actions: [
            { label: "Voir Détection RTU", link: "/work#rtu-detection" },
            { label: "Voir RetailVision", link: "/work#retailvision" },
            { label: "Voir DAB Facial", link: "/work#facial-atm" },
          ],
          suggestions: [
            "Quelle est son expérience avec PyTorch ?",
            "Parle-moi de ses déploiements sur matériel edge",
            "Quelle est son expertise en LLM / RAG ?",
          ],
        }
      : {
          text: `**Computer Vision Expertise:**\n\nJeeva specializes in applied, high-accuracy computer vision for complex real-world data:\n- **Architectures:** YOLOv8, YOLOv11, RF-DETR, Siamese Networks, InceptionResNet, ResNet, ViT.\n- **Tracking & Real-Time:** ByteTrack, DeepSORT, OpenCV, multi-object trajectory heat mapping on edge hardware.\n- **Data Engineering for CV:** Roboflow dataset curation, active learning, aggressive compression/noise augmentation.\n- **Domains:** Satellite & geospatial imagery (HVAC rooftop detection), edge IoT in-store retail foot-traffic, biometric security, and video manipulation detection.`,
          actions: [
            { label: "See RTU Detection", link: "/work#rtu-detection" },
            { label: "See RetailVision", link: "/work#retailvision" },
            { label: "See Facial ATM", link: "/work#facial-atm" },
          ],
          suggestions: [
            "What is his experience with PyTorch?",
            "Tell me about his edge compute deployments",
            "What LLM / GenAI experience does he have?",
          ],
        };
  }

  // 11. LLM & GENERATIVE AI SPECIALIZATION
  if (
    /(llm|rag|large language|generative ai|ia generative|langchain|vector search|embeddings|vllm|transformers|prompt engineering)/.test(
      q
    )
  ) {
    return isFrench
      ? {
          text: `**Expertise en LLM & Systèmes RAG :**\n\n- **Génération Augmentée par Récupération (RAG) :** Pipelines de recherche vectorielle avec LangChain, embeddings denses et couches de reclassement sémantique (cross-encoder).\n- **Infrastructure & Inférence :** vLLM, TGI, Hugging Face, MLX (inférence locale sur Apple Silicon) et passerelles de fournisseurs (OpenAI, Anthropic).\n- **Passerelles Haute Performance :** Conception d'un proxy Go avec limitation par jetons Redis et basculement automatique sans perte de requête.\n- **Production :** Assistant Slack déployé à l'Université de Pittsburgh ayant fait chuter de 30% les tickets répétitifs.`,
          actions: [
            { label: "Assistant Slack RAG", link: "/work#rag-slack-assistant" },
            { label: "Passerelle LLM", link: "/work#llm-gateway" },
          ],
          suggestions: [
            "Quelle est sa stack technique principale ?",
            "Quelle expérience a-t-il avec Docker et le Cloud ?",
            "Parle-moi de son parcours à Pittsburgh",
          ],
        }
      : {
          text: `**LLM & RAG Systems Expertise:**\n\n- **Retrieval Augmented Generation (RAG):** End-to-end vector search pipelines with LangChain, dense embeddings, and cross-encoder semantic re-ranking layers.\n- **Infrastructure & Serving:** vLLM, TGI, Hugging Face, MLX (local Apple Silicon inference), and provider gateways (OpenAI, Anthropic).\n- **High-Performance Routing:** Built custom Go gateway with Redis token-bucket rate limiting and automatic failover across LLM endpoints.\n- **Production Delivery:** Deployed production Slack AI assistants cutting repetitive support workloads by 30%.`,
          actions: [
            { label: "RAG Slack Assistant", link: "/work#rag-slack-assistant" },
            { label: "LLM Gateway", link: "/work#llm-gateway" },
          ],
          suggestions: [
            "What is his core tech stack?",
            "What experience does he have with cloud & Docker?",
            "Tell me about his time at Pitt",
          ],
        };
  }

  // 12. TECH STACK & TOOLS
  if (
    /(stack|skills|technologies|tools|languages|competences|outils|langages|python|pytorch|tensorflow|fastapi|docker|aws|gcp|sql|airflow)/.test(
      q
    )
  ) {
    return isFrench
      ? {
          text: `**Stack Technique Principale :**\n\n- **Langages :** Python (usage quotidien, 0.95), Go (microservices à faible latence), SQL (modélisation avancée), Java, JavaScript / TypeScript.\n- **IA & ML :** PyTorch, TensorFlow, OpenCV, scikit-learn, LangChain, Hugging Face, vLLM, Roboflow.\n- **Backend & APIs :** FastAPI, Node.js / Express, APIs RESTful, OpenAPI.\n- **Données & Pipelines :** Apache Airflow, PostgreSQL, MongoDB, Pandas, NumPy, Redis.\n- **Cloud & DevOps :** AWS (**Solutions Architect Certifié**), GCP, Docker, CI/CD, Ubuntu Linux.\n- **Industrie & Edge :** Automates PLC / SCADA, réseaux de capteurs IoT, inférence embarquée.`,
          actions: [
            { label: "Consulter la stack complète", link: "/info" },
            { label: "Voir les certifications", link: "/record" },
          ],
          suggestions: [
            "Quelles certifications cloud possède-t-il ?",
            "Parle-moi de son expérience en automatisation d'usine",
            "Quels projets mettent en valeur ses compétences Python ?",
          ],
        }
      : {
          text: `**Core Technology Stack:**\n\n- **Languages:** Python (daily driver, 0.95), Go (latency-critical services), SQL (fluent data modeling), Java, JavaScript / TypeScript.\n- **AI & ML:** PyTorch, TensorFlow, OpenCV, scikit-learn, LangChain, Hugging Face, vLLM, Roboflow.\n- **Backend & APIs:** FastAPI, Node.js / Express, RESTful APIs, OpenAPI.\n- **Data & Pipelines:** Apache Airflow, PostgreSQL, MongoDB, Pandas, NumPy, Redis.\n- **Cloud & DevOps:** AWS (**Certified Solutions Architect**), GCP, Docker, CI/CD, Ubuntu Linux.\n- **Industrial & Edge:** PLC / SCADA, IoT sensor networks, edge inferencing.`,
          actions: [
            { label: "View Detailed Stack Breakdown", link: "/info" },
            { label: "View Certifications", link: "/record" },
          ],
          suggestions: [
            "What cloud certifications does he have?",
            "Tell me about his industrial automation background",
            "What projects highlight his Python skills?",
          ],
        };
  }

  // 13. WORK EXPERIENCE & CAREER
  if (
    /(experience|career|history|work experience|background|jobs|companies|past roles|parcours|carriere|postes|entreprises|airoverse|pitt|shraddha|blue star)/.test(
      q
    )
  ) {
    return isFrench
      ? {
          text: `**Parcours Professionnel (Plus de 9 ans d'expérience en ingénierie) :**\n\n1. **Data Engineer @ Université de Pittsburgh** (2024–2025)\n   - Pipelines ETL (APIs Coursera et Salesforce vers tables SQL), orchestration de 10+ workflows Apache Airflow.\n   - Déploiement de l'assistant RAG Slack avec reclassement sémantique (-30% de tickets répétitifs).\n   - Animation de cours pour 300+ étudiants en Python, Tableau et Power BI.\n\n2. **AI Software Developer @ Airoverse** (2025)\n   - Modèles YOLOv8 et RF-DETR pour la détection satellite d'équipements CVC (90% précision, 80% rappel).\n   - Déploiement de la stack FastAPI + React sur GCP, réduisant les coûts de 90%.\n\n3. **Data Automation Engineer @ Shraddha Engineering** (2020–2022)\n   - Déploiements IoT sur 15+ sites industriels, économisant 2 000+ heures d'ingénierie par an.\n   - Automatisation ETL et supervision en temps réel diminuant les temps d'arrêt de 30%.\n\n4. **Systems & Analytics Engineer @ Blue Star Limited** (2018–2020)\n   - Maintenance prédictive par ML (réduction des pannes de 22%).\n   - Automatisation PLC/SCADA sur 25+ projets (+18% d'efficacité).\n\n5. **Automation Engineer @ Chennai Engineering Services** (2015–2018)\n   - Acquisition de données industrielles et logique de contrôle en Python et SQL.`,
          actions: [
            { label: "Voir la chronologie complète", link: "/record" },
            { label: "Voir la recommandation", link: "/record" },
          ],
          suggestions: [
            "Quelle est sa formation universitaire ?",
            "Quelles sont ses certifications officielles ?",
            "Est-il disponible pour un nouveau poste ?",
          ],
        }
      : {
          text: `**Career Trajectory (Over 9 Years of Engineering Experience):**\n\n1. **Data Engineer @ University of Pittsburgh** (2024–2025)\n   - Architected ETL pipelines (Coursera/Salesforce APIs to SQL tables), orchestrated 10+ Apache Airflow workflows.\n   - Shipped LangChain RAG Slack assistant (30% ticket reduction).\n   - Taught 300+ students in Python, Tableau, and Power BI.\n\n2. **AI Software Developer @ Airoverse** (2025)\n   - Trained YOLOv8 & RF-DETR models for rooftop HVAC satellite detection (90% precision, 80% recall).\n   - Shipped FastAPI + React stack on GCP, slashing manual survey costs by 90%.\n\n3. **Data Automation Engineer @ Shraddha Engineering** (2020–2022)\n   - Led IoT deployments across 15+ industrial facilities, saving 2,000+ engineering hours/year.\n   - Automated ETL & built sensor streaming pipelines cutting downtime by 30%.\n\n4. **Systems & Analytics Engineer @ Blue Star Limited** (2018–2020)\n   - ML-driven predictive maintenance (reduced failures by 22%).\n   - Built PLC/SCADA automation across 25+ commercial installations (+18% efficiency).\n\n5. **Automation Engineer @ Chennai Engineering Services** (2015–2018)\n   - Industrial data acquisition and control logic automation with Python and SQL.`,
          actions: [
            { label: "View Full Career Record", link: "/record" },
            { label: "View References & Endorsements", link: "/record" },
          ],
          suggestions: [
            "Tell me about his education and degrees",
            "What are his certifications?",
            "Is he available for a new role?",
          ],
        };
  }

  // 14. EDUCATION & CERTIFICATIONS
  if (
    /(education|degree|university|school|college|gpa|study|master|bachelor|mba|certif|credential|diplome|formation|universite|ecole)/.test(
      q
    )
  ) {
    return isFrench
      ? {
          text: `**Formation Académique & Diplômes :**\n\n- **Master of Science en Sciences de l'Information (Spécialisation IA)**\n  *Université de Pittsburgh* (2023–2025) — **GPA : 3.83 / 4.0**\n\n- **Master of Business Administration (MBA)**\n  *Tamil Nadu Agricultural University* (2017–2019) — GPA : 3.0 / 4.0\n\n- **Bachelor of Engineering en Électrotechnique & Électronique**\n  *Anna University* (2009–2013) — **GPA : 3.5 / 4.0 (Major de promotion, PPG Institute of Technology)**\n\n**Certifications Officielles :**\n- **AWS :** Solutions Architect — Associate\n- **Canonical :** Ubuntu Linux Professional\n- **LinkedIn :** Six Sigma Green Belt\n- **Google :** Certificat Professionnel Support IT\n- **Pendo :** IA pour la gestion de produits\n- **IBM :** Certificat Professionnel Data Science\n- **Microsoft :** Azure Fundamentals`,
          actions: [
            { label: "Voir la formation sur le parcours", link: "/record" },
            { label: "Demander le CV complet", link: "/signal" },
          ],
          suggestions: [
            "Quels étaient ses cours phares à Pittsburgh ?",
            "Quelles certifications possède-t-il ?",
            "Comment le contacter ?",
          ],
        }
      : {
          text: `**Education & Academic Credentials:**\n\n- **M.S. in Information Science (AI Specialization)**\n  *University of Pittsburgh* (2023–2025) — **GPA: 3.83 / 4.0**\n\n- **Master of Business Administration (MBA)**\n  *Tamil Nadu Agricultural University* (2017–2019) — GPA: 3.0 / 4.0\n\n- **B.E. in Electrical & Electronics Engineering**\n  *Anna University* (2009–2013) — **GPA: 3.5 / 4.0 (Class Topper, PPG Institute of Technology)**\n\n**Certifications:**\n- **AWS:** Solutions Architect — Associate\n- **Canonical:** Ubuntu Linux Professional\n- **LinkedIn:** Six Sigma Green Belt\n- **Google:** IT Support Professional Certificate\n- **Pendo:** AI for Product Management\n- **IBM:** Data Science Professional\n- **Microsoft:** Azure Fundamentals`,
          actions: [
            { label: "View Education on Record Page", link: "/record" },
            { label: "Download / Request Full CV", link: "/signal" },
          ],
          suggestions: [
            "What were his key courses at Pitt?",
            "What certifications does he hold?",
            "How can I contact him?",
          ],
        };
  }

  // 15. SPOKEN LANGUAGES
  if (/(languages?\s*(spoken|speak)|french|francais|tamil|english|langues|parles|parlez)/.test(q)) {
    return isFrench
      ? {
          text: `Jeeva est multilingue et collabore au quotidien avec des équipes internationales :\n\n- **Anglais :** Bilingue / Courant professionnel complet\n- **Français :** Niveau professionnel de travail\n- **Tamoul (தமிழ்) :** Langue maternelle`,
          actions: [{ label: "Contacter Jeeva", link: "/signal" }],
          suggestions: ["Dans quels pays est-il autorisé à travailler ?", "Quelle est sa stack technique ?"],
        }
      : {
          text: `Jeeva is multilingual and communicates fluently across global teams:\n\n- **English:** Fluent (Full professional proficiency)\n- **Français (French):** Working proficiency\n- **தமிழ் (Tamil):** Native speaker`,
          actions: [{ label: "Contact Jeeva", link: "/signal" }],
          suggestions: ["What countries is he authorized to work in?", "What is his tech stack?"],
        };
  }

  // 16. PHILOSOPHY / INFLUENCES
  if (/(philosophy|influences|books|readings|approach|mindset|philosophie|lectures|livres)/.test(q)) {
    return isFrench
      ? {
          text: `**Philosophie d'Ingénierie & Influences :**\n\n- *Designing Data-Intensive Applications* (Kleppmann) : Pourquoi ses pipelines ne tombent plus à 2h du matin.\n- *The Pragmatic Programmer* (Hunt & Thomas) : Approche "balles traçantes" et prototypage itératif plutôt que spécifications rigides.\n- *Cours d'Andrej Karpathy* : L'apprentissage par les premiers principes plutôt que par l'abstraction théorique.\n- *Expérience en usine (PLC/SCADA)* : 15 sites industriels lui ont appris que la théorie ne vaut rien sans résilience face au monde réel.`,
          actions: [{ label: "Lire les influences dans Info", link: "/info" }],
          suggestions: ["Parle-moi de son parcours", "Voir les projets phares"],
        }
      : {
          text: `**Engineering Philosophy & Influences:**\n\n- *Designing Data-Intensive Applications* (Kleppmann): "Why my pipelines stopped falling over at 2 a.m."\n- *The Pragmatic Programmer* (Hunt & Thomas): Tracer bullets over big design up front. Always.\n- *Andrej Karpathy's lectures*: First-principles understanding beats surface abstractions.\n- *Industrial Automation experience*: 15 factory floors taught him that theoretical elegance means nothing if it doesn't survive contact with messy real-world data.`,
          actions: [{ label: "Read Influences in Info", link: "/info" }],
          suggestions: ["Tell me about his background", "View top projects"],
        };
  }

  // 17. RESUME / CV
  if (/(resume|cv|curriculum vitae|download|pdf|telecharger)/.test(q)) {
    return isFrench
      ? {
          text: `Vous pouvez consulter l'ensemble des compétences, parcours et études de cas de Jeeva directement sur le site, ou lui écrire pour obtenir son CV au format PDF :\n\n- **Parcours professionnel :** [` + "/record" + `](/record)\n- **Études de cas projets :** [` + "/work" + `](/work)\n- **Demande de CV par email :** [${SITE.email}](mailto:${SITE.email})`,
          actions: [
            { label: "Consulter le parcours", link: "/record" },
            { label: "Demander le CV par email", link: `mailto:${SITE.email}?subject=Demande%20de%20CV%20-%20Jeeva%20Krishnasamy` },
          ],
          suggestions: ["Es-tu disponible pour une embauche ?", "Parle-moi de tes projets phares", "Quelle est ta stack technique ?"],
        }
      : {
          text: `You can review Jeeva's complete qualifications, roles, and case studies right here on the website, or reach out to request an official PDF copy:\n\n- **Career Record:** [` + "/record" + `](/record)\n- **Project Deep-Dives:** [` + "/work" + `](/work)\n- **Direct Email for CV:** [${SITE.email}](mailto:${SITE.email})`,
          actions: [
            { label: "View Online Record", link: "/record" },
            { label: "Email Jeeva for PDF", link: `mailto:${SITE.email}?subject=Resume%20Request%20-%20Jeeva%20Krishnasamy` },
          ],
          suggestions: ["Are you available for work?", "Tell me about your top projects", "What is your tech stack?"],
        };
  }

  // 18. BLOG / ARTICLES / TECHNICAL ESSAYS / THOUGHTS
  const postList = isFrench ? FR_POSTS : POSTS;
  if (/(blog|article|post|essay|thought|writing|publication|écrit|pensée|reflexion)/.test(q)) {
    const matchedPost = postList.find(
      (p) =>
        q.includes(p.slug) ||
        p.tags.some((t) => q.includes(t.toLowerCase())) ||
        p.title.toLowerCase().includes(q)
    );

    if (matchedPost) {
      return isFrench
        ? {
            text: `Voici l'article technique correspondant :\n\n**${matchedPost.title}** (${matchedPost.date} · ${matchedPost.readTime})\n*${matchedPost.blurb}*\n\n> "${matchedPost.lead}"`,
            actions: [
              { label: `Lire l'article complet`, link: `/blog/${matchedPost.slug}` },
              { label: "Voir tous les articles", link: "/blog" },
            ],
            suggestions: ["Quels sont les autres articles ?", "Parle-moi de tes projets", "Quelle est ta stack technique ?"],
          }
        : {
            text: `Here is the technical article matching your request:\n\n**${matchedPost.title}** (${matchedPost.date} · ${matchedPost.readTime})\n*${matchedPost.blurb}*\n\n> "${matchedPost.lead}"`,
            actions: [
              { label: `Read Full Article`, link: `/blog/${matchedPost.slug}` },
              { label: "Browse All Articles", link: "/blog" },
            ],
            suggestions: ["What other articles have you written?", "Tell me about your projects", "What is your tech stack?"],
          };
    }

    return isFrench
      ? {
          text: `Jeeva publie régulièrement des réflexions et articles techniques détaillés sur la vision par ordinateur en production, les architectures RAG, l'edge computing et la fiabilité des systèmes :\n\n` +
            postList
              .map((p) => `- [${p.title}](/blog/${p.slug}) (${p.readTime})\n  *${p.blurb}*`)
              .join("\n\n"),
          actions: [
            { label: "Consulter le Blog Technique", link: "/blog" },
            { label: "Voir les Projets", link: "/work" },
          ],
          suggestions: [
            "Pourquoi les modèles échouent en satellite ?",
            "Parle-moi du reranking RAG",
            "Qu'as-tu appris en usine ?",
          ],
        }
      : {
          text: `Jeeva regularly writes in-depth engineering essays on real-world computer vision, production RAG architectures, edge tracking, and distributed systems reliability:\n\n` +
            postList
              .map((p) => `- [${p.title}](/blog/${p.slug}) (${p.readTime})\n  *${p.blurb}*`)
              .join("\n\n"),
          actions: [
            { label: "Browse Technical Blog", link: "/blog" },
            { label: "View Projects", link: "/work" },
          ],
          suggestions: [
            "Why do satellite vision models fail in production?",
            "Explain RAG semantic reranking",
            "What did factory floors teach you?",
          ],
        };
  }

  // 19. GENERAL FUZZY SEARCH MATCH OVER PROJECTS & SKILLS
  const projectList = isFrench ? FR_PROJECTS : PROJECTS;
  const matchedProject = projectList.find(
    (p) =>
      q.includes(p.slug) ||
      q.includes(p.title.toLowerCase()) ||
      p.tech.some((t) => q.includes(t.toLowerCase())) ||
      p.domains.some((d) => q.includes(d))
  );

  if (matchedProject) {
    return isFrench
      ? {
          text: `Voici un projet correspondant à votre recherche :\n\n**${matchedProject.title}** (${matchedProject.year})\n*${matchedProject.blurb}*\n\n- **Technologies :** ${matchedProject.tech.join(", ")}\n- **Problématique :** ${matchedProject.caseStudy.problem}\n- **Impact :** ${matchedProject.caseStudy.result}`,
          actions: [
            { label: `Consulter l'étude : ${matchedProject.title}`, link: `/work#${matchedProject.slug}` },
            { label: "Tous les projets", link: "/work" },
          ],
          suggestions: [
            "Parle-moi d'un autre projet",
            "Quelles sont ses compétences clés ?",
            "Comment entrer en contact ?",
          ],
        }
      : {
          text: `Here is a relevant project matching your interest:\n\n**${matchedProject.title}** (${matchedProject.year})\n*${matchedProject.blurb}*\n\n- **Technologies:** ${matchedProject.tech.join(", ")}\n- **Problem:** ${matchedProject.caseStudy.problem}\n- **Impact:** ${matchedProject.caseStudy.result}`,
          actions: [
            { label: `View Case Study: ${matchedProject.title}`, link: `/work#${matchedProject.slug}` },
            { label: "Browse All Projects", link: "/work" },
          ],
          suggestions: [
            "Tell me about another project",
            "What are his core skills?",
            "How can I get in touch?",
          ],
        };
  }

  // DEFAULT / FALLBACK
  return isFrench
    ? {
        text: `Je n'ai pas trouvé de correspondance exacte pour cette question, mais en tant qu'agent de Jeeva, je dispose de toutes ses informations clés :\n\n- **IA & Vision :** Détection satellite RTU (90% de précision), suivi temps réel sur matériel edge, détection de deepfakes.\n- **Systèmes LLM :** Assistants RAG avec LangChain, passerelles Go haute performance, vLLM.\n- **Parcours :** Data Engineer à l'Université de Pittsburgh, développeur IA chez Airoverse, 9+ ans d'expérience en ingénierie.\n- **Disponibilité :** Immédiate en France (Passeport Talent), en Europe ou en télétravail.\n\nQue souhaitez-vous approfondir ?`,
        actions: [
          { label: "Parcourir les projets", link: "/work" },
          { label: "Consulter la stack", link: "/info" },
          { label: "Contacter Jeeva", link: "/signal" },
        ],
        suggestions: [
          "Quels sont ses 3 projets majeurs ?",
          "Quel est son statut de visa en France ?",
          "Quels outils utilise-t-il pour les systèmes LLM ?",
        ],
      }
    : {
        text: `I'm not completely certain about that specific phrasing, but as Jeeva's AI representative, I have full knowledge of his work and credentials:\n\n- **AI & Vision:** Satellite HVAC detection (90% precision), real-time edge tracking, deepfake detection.\n- **LLM & Systems:** RAG assistants with LangChain, Go high-throughput API gateways, vLLM inference.\n- **Background:** Data Engineer at Pitt, AI Developer at Airoverse, 9+ years engineering experience.\n- **Availability:** Ready for hire immediately in France, Europe, or remote.\n\nWhat would you like to explore?`,
        actions: [
          { label: "Browse Projects", link: "/work" },
          { label: "View Tech Stack", link: "/info" },
          { label: "Contact Jeeva", link: "/signal" },
        ],
        suggestions: [
          "What are his top 3 projects?",
          "What is his visa status in France?",
          "What tools does he use for LLM systems?",
        ],
      };
}
