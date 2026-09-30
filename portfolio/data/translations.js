import { SITE as EN_SITE, PROJECTS as EN_PROJECTS, EXPERIENCE as EN_EXPERIENCE, EDUCATION as EN_EDUCATION, CERTIFICATIONS as EN_CERTIFICATIONS, STACK as EN_STACK, TOOLS as EN_TOOLS, INFLUENCES as EN_INFLUENCES, DOMAINS as EN_DOMAINS, NAV as EN_NAV, VERSION } from "./site.js";

export const FR_SITE = {
  ...EN_SITE,
  headline: "Ingénieur IA / ML, Ingénieur Logiciel, Certifié AWS",
  tagline: "Construire une IA qui résiste au contact des vraies données.",
  location: "France",
  workModes: "sur site, hybride ou télétravail",
  focus: "IA / Vision par Ordinateur / Systèmes LLM",
  status: "Disponible immédiatement",
  visa: "Passeport Talent (sans parrainage requis)",
  languages: "Anglais, Français, Tamoul",
};

export const FR_BOOT_LINES = [
  `> CHARGEMENT DU PORTFOLIO v${VERSION} ...`,
  "> SYSTÈME: jivanandham.com",
  "> STATUT: DISPONIBLE POUR EMBAUCHE",
  `> DERNIÈRE MISE À JOUR: ${EN_SITE.lastUpdated}`,
  "> INITIALISATION DE L'INTERFACE ...",
];

export const FR_DOMAINS = [
  { id: "all", label: "Tous" },
  { id: "vision", label: "Vision" },
  { id: "llm", label: "LLM" },
  { id: "data", label: "Données" },
  { id: "finance", label: "Finance" },
  { id: "security", label: "Sécurité" },
];

export const FR_NAV = [
  { label: "INDEX", href: "/", glyph: "▣" },
  { label: "PROJETS", href: "/work", glyph: "⌬" },
  { label: "BLOG", href: "/blog", glyph: "▤" },
  { label: "PARCOURS", href: "/record", glyph: "☰" },
  { label: "BIO", href: "/info", glyph: "◉" },
  { label: "LOG", href: "/log", glyph: "≣" },
  { label: "CONTACT", href: "/signal", glyph: "⌁" },
];

export const FR_PROJECTS = [
  {
    slug: "rag-slack-assistant",
    year: "2025",
    domains: ["llm"],
    title: "Assistant RAG Slack",
    blurb: "Assistant RAG en production pour le support pédagogique — 30% de requêtes répétitives en moins.",
    tech: ["LangChain", "Recherche vectorielle", "Re-ranking", "Slack API", "Python"],
    caseStudy: {
      problem:
        "À l'Université de Pittsburgh, l'équipe pédagogique répondait sans cesse aux mêmes questions de logistique et de cours sur Slack, tandis que les étudiants attendaient des réponses déjà présentes dans la documentation.",
      approach:
        "Conception et déploiement d'un assistant Slack basé sur le RAG avec LangChain et indexation vectorielle des cours, enrichi d'une couche de reclassement sémantique (cross-encoder) pour envoyer les passages les plus pertinents au modèle.",
      result:
        "Pertinence accrue et réduction de 30% des demandes répétitives, libérant l'équipe pédagogique pour les questions à haute valeur ajoutée.",
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
    title: "Plateforme de Détection RTU",
    blurb: "Détection d'unités CVC sur toitures par imagerie satellite — 90% de précision, 80% de rappel en production.",
    tech: ["YOLOv8", "RF-DETR", "FastAPI", "React", "Docker", "GCP"],
    link: {
      label: "Annonce officielle Airoverse",
      href: "https://www.linkedin.com/posts/airoverse_ai-universityofpittsburgh-airtificialintelligence-activity-7196101892342425600-ZFV3",
    },
    caseStudy: {
      problem:
        "Airoverse avait besoin de localiser les unités de climatisation de toit (RTU) sur des métropoles entières pour générer des prospects qualifiés. Les inspections satellites manuelles étaient lentes, onéreuses et sujettes aux erreurs. Réalisé lors d'une mission de conseil de 8 semaines avec une équipe de Pitt.",
      approach:
        "Développement de l'application de bout en bout : modèles YOLOv8 et RF-DETR entraînés sur des jeux de données Roboflow ciblés, connectés à l'API Google Maps pour la collecte automatisée par tuiles. Servi via FastAPI avec une console React, conteneurisé sous Docker et déployé sur GCP.",
      result:
        "90% de précision et 80% de rappel sur imagerie satellite. Réduction de 90% du temps d'inspection manuelle et des coûts opérationnels.",
      snippet: `# vote d'ensemble : YOLOv8 + RF-DETR
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
    title: "Analyse RetailVision Edge",
    blurb: "Analytique en magasin en temps réel — suivi des clients et cartes thermiques de présence sur matériel edge.",
    tech: ["YOLOv8", "ByteTrack", "Python", "OpenCV", "Edge"],
    caseStudy: {
      problem:
        "Chaque commerçant cherche à comprendre où vont réellement les clients. Les compteurs de passage ne fournissent que des totaux, et les flux vidéo cloud sont trop lents et coûteux par boutique.",
      approach:
        "Détection YOLOv8 couplée au suivi multi-objets ByteTrack exécuté en local sur du matériel edge en magasin. Les trajectoires sont agrégées en cartes thermiques et synthèses comportementales par zone — aucune vidéo brute ne quitte l'appareil.",
      result:
        "Cartes thermiques en direct et analyse des temps d'arrêt par zone, calculées sur le matériel embarqué en temps réel.",
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
    title: "Passerelle API LLM (Go)",
    blurb: "Passerelle Go pour le trafic LLM — limitation de débit, répartition de charge et basculement multi-fournisseurs.",
    tech: ["Go", "Redis", "OpenAPI", "Docker"],
    caseStudy: {
      problem:
        "Le trafic LLM en production nécessite une limitation stricte de débit, des réessais automatiques et un basculement de secours sans latence superflue.",
      approach:
        "Passerelle haute performance en Go avec limitation par jetons (token-bucket) via Redis, répartition de charge par modèle et basculement dynamique entre OpenAI, Anthropic et des endpoints vLLM auto-hébergés.",
      result:
        "Un point de terminaison unique et résilient absorbant automatiquement les pannes de fournisseurs tiers.",
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
    title: "Détection de Deepfakes",
    blurb: "Pipeline InceptionResNetV2 pour identifier les images et vidéos manipulées sous forte compression.",
    tech: ["Python", "TensorFlow", "InceptionResNetV2"],
    caseStudy: {
      problem:
        "Les médias manipulés deviennent plus faciles à produire qu'à détecter. Les classifieurs génériques échouent face aux vidéos compressées du monde réel.",
      approach:
        "Ajustement fin (fine-tuning) d'InceptionResNetV2 avec augmentation agressive des données (artefacts de compression JPEG, bruit gaussien, échantillonnage de trames) pour immuniser le modèle.",
      result:
        "Pipeline TensorFlow haute cadence pour une détection trame par trame, particulièrement robuste aux dégradations réelles.",
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
    title: "DAB à Reconnaissance Faciale",
    blurb: "Authentification bancaire sans carte avec réseaux siamois personnalisés.",
    tech: ["Python", "Réseaux Siamois", "FastAPI", "PostgreSQL", "Docker"],
    caseStudy: {
      problem:
        "Le piratage de carte (skimming) reste très répandu. L'authentification biométrique supprime la carte physique, mais doit fonctionner sous un éclairage variable et avec un enrôlement unique.",
      approach:
        "Réseau de neurones siamois pour la vérification one-shot, servi via FastAPI avec base PostgreSQL pour les identités, conteneurisé avec Docker.",
      result:
        "Prototype fonctionnel sans carte avec une latence d'inférence parfaitement adaptée aux flux d'interaction des guichets automatiques.",
      snippet: `dist = tf.norm(embed(anchor) - embed(probe), axis=1)
verified = dist < THRESHOLD  # vérification one-shot`,
    },
  },
  {
    slug: "stock-bull",
    year: "2024",
    domains: ["finance"],
    title: "Plateforme Boursière Stock Bull",
    blurb: "Trading virtuel avec cotations en direct, listes de suivi et portefeuille simulé sans risque.",
    tech: ["Node.js", "Express", "MongoDB", "Auth0", "Finnhub API"],
    caseStudy: {
      problem:
        "Les traders ont besoin d'un environnement sans risque pour tester leurs stratégies, mais la plupart des simulateurs ont des données en retard ou imposent des barrières payantes.",
      approach:
        "Application web MVC sur Node.js, Express et MongoDB avec authentification Auth0, flux en direct de l'API Finnhub, alertes de watchlist et suivi en temps réel de portefeuille.",
      result:
        "Bac à sable boursier complet où les utilisateurs passent des ordres simulés et voient la valorisation de leur portefeuille s'actualiser en continu.",
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
    title: "Base de Données Archéologique",
    blurb: "Système de base de données pour le département d'archéologie de Pitt, avec versioning et contrôle d'accès.",
    tech: ["SQL", "Modélisation de données", "HTML", "Application Web"],
    caseStudy: {
      problem:
        "Le département d'archéologie de l'Université de Pittsburgh devait centraliser ses relevés de fouilles en permettant à plusieurs chercheurs de modifier les données sans perdre l'historique.",
      approach:
        "Conception de la base relationnelle et de l'interface web : contrôle d'accès par rôles pour la saisie dynamique, dictionnaire de données et instantanés horodatés pour le versioning complet.",
      result:
        "Un système de stockage auditable et évolutif où chaque modification est traçable et réversible.",
      snippet: `INSERT INTO artifact_snapshot (artifact_id, data, edited_by, taken_at)
SELECT id, to_jsonb(a), :user_id, now()
FROM artifact a WHERE id = :artifact_id;`,
    },
  },
  {
    slug: "option-pricing",
    year: "2022",
    domains: ["finance"],
    title: "Moteur de Valorisation d'Options",
    blurb: "Tableau de bord Monte Carlo + Black-Scholes avec cotations de marché en direct via yfinance.",
    tech: ["Python", "Dash", "NumPy", "yfinance"],
    caseStudy: {
      problem:
        "L'intuition financière s'acquiert difficilement avec de simples formules théoriques. L'objectif était de visualiser en direct la convergence des trajectoires Monte Carlo vers la solution de Black-Scholes.",
      approach:
        "Simulation vectorisée NumPy (100 000 trajectoires en quelques millisecondes) confrontée à la formule analytique de Black-Scholes, connectée aux cotations réelles de yfinance dans un tableau de bord Dash.",
      result:
        "Graphiques interactifs de convergence illustrant la réduction de l'erreur au fil de l'échantillonnage.",
      snippet: `S_T = S0 * np.exp((r - 0.5*sigma**2)*T
       + sigma*np.sqrt(T)*np.random.standard_normal(n))
price = np.exp(-r*T) * np.maximum(S_T - K, 0).mean()`,
    },
  },
];

export const FR_EXPERIENCE = [
  {
    role: "Ingénieur Données & IA",
    org: "Université de Pittsburgh",
    place: "Pittsburgh, PA, États-Unis",
    start: "2024-09",
    end: "2025-12",
    summary:
      "Architecture de pipelines ETL en Python intégrant les API Coursera et Salesforce vers des tables SQL optimisées. Orchestration de plus de 10 workflows de production sous Apache Airflow avec reprise automatique sur incident. Développement et déploiement d'un assistant RAG sur Slack avec reclassement sémantique, diminuant de 30% les requêtes d'assistance répétitives. Formation de plus de 300 étudiants en Python, Tableau et Power BI.",
    tags: ["Python", "Airflow", "SQL", "LangChain", "RAG", "Tableau"],
  },
  {
    role: "Développeur Logiciel IA",
    org: "Airoverse",
    place: "Pittsburgh, PA, États-Unis",
    start: "2025-03",
    end: "2025-04",
    summary:
      "Création d'une plateforme de détection automatisée d'unités CVC sur toitures par satellite pour la génération de prospects d'affaires. Entraînement des modèles YOLOv8 et RF-DETR atteignant 90% de précision et 80% de rappel sur imagerie satellite. Intégration des API Google Maps et Roboflow, pile FastAPI + React sur GCP. Réduction de 90% du temps de traitement et des coûts d'inspection.",
    tags: ["YOLOv8", "RF-DETR", "FastAPI", "React", "GCP"],
  },
  {
    role: "Ingénieur Automatisation & Données",
    org: "Shraddha Engineering & Facility Services",
    place: "Coimbatore, Inde",
    start: "2020-06",
    end: "2022-12",
    summary:
      "Pilotage de déploiements IoT et d'automatisation sur plus de 15 sites industriels, économisant plus de 2 000 heures d'ingénierie par an. Conception de pipelines ETL Python et SQL avec tableaux de bord Power BI réduisant de 50% le travail manuel. Systèmes de surveillance en direct et alertes par capteurs diminuant les arrêts non planifiés de 30%.",
    tags: ["IoT", "ETL", "Python", "SQL", "Power BI", "APIs REST"],
  },
  {
    role: "Ingénieur Systèmes & Analytique",
    org: "Blue Star Limited",
    place: "Coimbatore, Inde",
    start: "2018-04",
    end: "2020-06",
    summary:
      "Maintenance prédictive par Machine Learning réduisant les pannes de 22% sur des installations CVC commerciales. Automatisation industrielle PLC/SCADA sur 25+ projets apportant un gain d'efficacité de 18%. Direction d'une équipe de 10 ingénieurs sur l'analytique et les réseaux de capteurs.",
    tags: ["ML", "PLC/SCADA", "Pandas", "Maintenance prédictive"],
  },
  {
    role: "Ingénieur Automatisation",
    org: "Chennai Engineering Services",
    place: "Coimbatore, Inde",
    start: "2015-06",
    end: "2018-04",
    summary:
      "Automatisation de l'acquisition de données et des rapports avec Python et SQL, améliorant la fiabilité de 15%. Conception de logiques de contrôle électrique pour projets commerciaux, réduisant les délais de livraison de 10%.",
    tags: ["Python", "SQL", "Automatisation industrielle"],
  },
];

export const FR_EDUCATION = [
  {
    degree: "Master of Science en Sciences de l'Information, Spécialisation IA",
    school: "Université de Pittsburgh",
    place: "Pittsburgh, PA, États-Unis",
    years: "2023–2025",
    gpa: "3.83 / 4.0",
  },
  {
    degree: "Master en Administration des Entreprises (MBA)",
    school: "Tamil Nadu Agricultural University",
    place: "Inde",
    years: "2017–2019",
    gpa: "3.0 / 4.0",
  },
  {
    degree: "Licence d'Ingénieur en Génie Électrique & Électronique",
    school: "Anna University",
    place: "Chennai, Inde",
    years: "2009–2013",
    gpa: "3.5 / 4.0",
    note: "Major de Promotion, PPG Institute of Technology",
  },
];

export const FR_UI = {
  skipContent: "Passer au contenu",
  tipCmd: "Astuce : appuyez sur / pour la ligne de commande",
  skipHint: "appuyez sur une touche pour passer",
  nowLabel: "Actuellement",
  recentlyLabel: "Récemment",
  latestLabel: "Dernier projet",
  statusLabel: "Statut",
  viewWorkBtn: "> Voir les projets",
  readRecordBtn: "> Lire le parcours",
  contactBtn: "> Prendre contact",
  colophon: "COLOPHON",
  colophonDesc: "Composé en IBM Plex Serif, IBM Plex Sans & IBM Plex Mono. Fait main, sans modèles.",
  updatedOn: "Mis à jour le",
  langLabel: "FR",
  langTooltip: "Changer de langue (FR / EN)",
  // Work page
  workTitle: "Projets & Réalisations",
  workFilterAll: "Tous",
  caseStudyProblem: "Le Problème",
  caseStudyApproach: "L'Approche",
  caseStudyResult: "Le Résultat",
  viewCaseStudy: "Étude de cas",
  // Record page
  recordTitle: "Parcours Professionnel",
  experienceHeading: "Expérience",
  educationHeading: "Formation & Diplômes",
  certificationsHeading: "Certifications",
  // Info page
  infoTitle: "Dossier & Compétences",
  stackHeading: "Technologies Principales",
  toolsHeading: "Outils & Méthodes",
  // Signal page
  signalTitle: "Ouvrir un canal",
  signalPitch: "Disponible pour des postes en ingénierie IA / ML et logicielle en France, sur site, en hybride ou en télétravail. Passeport Talent en main, disponible immédiatement.",
  copyBtn: "[COPIER]",
  copiedBtn: "COPIÉ ✓",
  writeBtn: "[ÉCRIRE]",
  openBtn: "[OUVRIR]",
  signalNote: "Délai de réponse habituel : < 24h. Canal privilégié : email. Langues parlées : Anglais, Français, Tamoul.",
  // Chatbot
  botTitle: "JEEVA.AI // AGENT IA",
  botStatusLocal: "[RAG LOCAL // v1.0]",
  botWelcome: "Bienvenue sur jivanandham.com. Je suis l'agent IA interactif de Jeeva Krishnasamy.\n\nJe réponds à toutes vos questions concernant ses projets en **Vision par Ordinateur**, ses **systèmes RAG & LLM**, ses 9+ ans d'expérience en ingénierie ou sa **disponibilité immédiate en France et à l'international**.\n\nQue souhaitez-vous explorer ?",
  botStarterQuestions: [
    "💼 Êtes-vous disponible immédiatement ?",
    "🛰 Projet Satellite HVAC Rooftop",
    "🧠 Expérience RAG & LLM",
    "🛠 Stack technique principale",
    "📬 Comment contacter Jeeva ?",
  ],
  botInputPlaceholder: "Posez une question sur les projets, compétences ou opportunités...",
  botSend: "ENVOYER ↵",
  botFollowUps: "SUGGESTIONS :",
  // Blog
  blogTitle: "Blog & Réflexions Techniques",
  blogSubtitle: "Essais approfondis sur la vision par ordinateur, les architectures RAG, les systèmes embarqués et la fiabilité logicielle.",
  blogFilterAll: "Tous",
  readArticleBtn: "Lire l'article →",
  backToBlog: "← Retour au blog",
  tableOfContents: "SOMMAIRE",
  writtenBy: "Rédigé par",
  publishedOn: "Publié le",
  discussWithAgent: "Discuter de cet article avec l'Agent IA",
  shareArticle: "Partager l'article",
  copiedLink: "Lien copié !",
};

export const EN_UI = {
  skipContent: "Skip to content",
  tipCmd: "Tip: press / for the command line",
  skipHint: "press any key to skip",
  nowLabel: "Now",
  recentlyLabel: "Most recently",
  latestLabel: "Latest",
  statusLabel: "Status",
  viewWorkBtn: "> View work",
  readRecordBtn: "> Read the record",
  contactBtn: "> Get in touch",
  colophon: "COLOPHON",
  colophonDesc: "Set in IBM Plex Serif, IBM Plex Sans & IBM Plex Mono. Hand-coded, no templates.",
  updatedOn: "Updated",
  langLabel: "EN",
  langTooltip: "Switch language (EN / FR)",
  // Work page
  workTitle: "Selected Projects",
  workFilterAll: "All",
  caseStudyProblem: "The Problem",
  caseStudyApproach: "The Approach",
  caseStudyResult: "The Result",
  viewCaseStudy: "Case Study",
  // Record page
  recordTitle: "Record & Experience",
  experienceHeading: "Experience",
  educationHeading: "Education",
  certificationsHeading: "Certifications",
  // Info page
  infoTitle: "Dossier & Profile",
  stackHeading: "Core Stack",
  toolsHeading: "Tools & Methods",
  // Signal page
  signalTitle: "Open a channel.",
  signalPitch: "Open to AI / ML and software engineering roles in France, on-site, hybrid, or remote. Talent Passport visa in hand, available immediately. If you need computer vision, LLM systems, or industrial-grade AI, reach out.",
  copyBtn: "[COPY]",
  copiedBtn: "COPIED ✓",
  writeBtn: "[WRITE]",
  openBtn: "[OPEN]",
  signalNote: "Response time: usually < 24h. Preferred channel: email. Languages: English, Français, தமிழ்.",
  // Chatbot
  botTitle: "JEEVA.AI // AGENT TERMINAL",
  botStatusLocal: "[LOCAL RAG // v1.0]",
  botWelcome: "Welcome to jivanandham.com. I am Jeeva's interactive **AI Portfolio Agent**.\n\nI can answer questions regarding his **Computer Vision & LLM systems**, technical case studies, 9+ years of engineering experience, or immediate work availability in France/EU and the US.\n\nWhat would you like to explore?",
  botStarterQuestions: [
    "💼 Are you available for work?",
    "🛰 Rooftop HVAC Satellite Project",
    "🧠 RAG & LLM Experience",
    "🛠 What is your tech stack?",
    "📬 How do I contact Jeeva?",
  ],
  botInputPlaceholder: "Ask about projects, tech, experience, or hiring...",
  botSend: "SEND ↵",
  botFollowUps: "SUGGESTED FOLLOW-UPS:",
  // Blog
  blogTitle: "Technical Blog & Essays",
  blogSubtitle: "In-depth writing on Computer Vision, production RAG architectures, edge systems, and software reliability.",
  blogFilterAll: "All",
  readArticleBtn: "Read Article →",
  backToBlog: "← Back to blog",
  tableOfContents: "TABLE OF CONTENTS",
  writtenBy: "Written by",
  publishedOn: "Published",
  discussWithAgent: "Discuss this article with AI Agent",
  shareArticle: "Share Article",
  copiedLink: "Link copied!",
};

export const FR_POSTS = [
  {
    slug: "satellite-vision-production-failures",
    title: "Pourquoi les modèles échouent en production : Enseignements de 10 000 toitures satellites",
    date: "2026.08.14",
    readTime: "6 min de lecture",
    domains: ["vision"],
    tags: ["Vision par Ordinateur", "YOLOv8", "RF-DETR", "Satellite", "IA en Production"],
    blurb:
      "Comment l'imagerie satellite haute résolution déjoue les détecteurs classiques, et pourquoi le vote d'ensemble par IoU bat l'optimisation d'hyperparamètres.",
    lead:
      "Sur Kaggle, on évalue un modèle sur le mAP@50-95. Mais lorsqu'on déploie un détecteur pour identifier des unités CVC sur des métropoles entières, ce qui compte est de savoir si un prospect commercial est réel ou s'il s'agit d'une simple ombre sur un puits de lumière.",
    sections: [
      {
        heading: "Le défi des données du monde réel",
        body: `L'imagerie satellite pose des défis redoutables aux modèles de vision modernes :

- **Disparité d'échelle extrême** : Un groupe frigorifique industriel peut mesurer 12 mètres, tandis qu'un extracteur d'air résidentiel dépasse à peine 40 cm.
- **Orientation solaire et ombres portées** : Les passages satellites du matin ou de fin d'après-midi génèrent des ombres étirées régulièrement confondues avec des batteries d'échangeurs thermiques.
- **Artéfacts de capteurs et compression** : Les tuiles satellites statiques subissent un rééchantillonnage et une compression JPEG qui adoucissent les arêtes métalliques.

Au début du projet chez Airoverse, les modèles YOLOv8 standards dépassaient 35% de faux positifs, confondant puits de lumière, cages d'ascenseurs et onduleurs photovoltaïques avec des unités CVC.`,
      },
      {
        heading: "Pourquoi un modèle unique ne suffit pas : Le vote d'ensemble",
        body: `Plutôt que d'exiger d'un seul réseau qu'il gère à la fois l'extraction multi-échelle fine et le raisonnement spatial contextuel global, nous avons conçu un ensemble de deux architectures complémentaires :

1. **YOLOv8 (Ultralytics)** : Optimisé pour une détection locale rapide et la précision des contours sans ancres (anchor-free).
2. **RF-DETR (Real-time DEtection TRansformer)** : Exploite l'attention déformable multi-échelle pour appréhender le contexte global de la toiture.

Les deux modèles ont été entraînés sur des jeux Roboflow enrichis de flou gaussien synthétique, de variations de contraste et de rotations d'ombres.`,
        code: `# Fusion d'ensemble NMS en production
import numpy as np

def nms_merge(yolo_boxes, rfdetr_boxes, iou_thresh=0.55):
    """
    Fusionne les prédictions YOLOv8 et RF-DETR par consensus IoU.
    Seules les boîtes validées par consensus ou dépassant un seuil strict sont conservées.
    """
    candidates = []
    for y_box in yolo_boxes:
        for r_box in rfdetr_boxes:
            iou = compute_iou(y_box['bbox'], r_box['bbox'])
            if iou >= iou_thresh:
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
        heading: "Enseignements d'ingénierie majeurs",
        body: `La mise en production de ce système a mis en lumière trois règles fondamentales :

- **La curation de données représente 90% du succès** : L'échantillonnage difficile (hard negative mining) sur les panneaux solaires a amélioré la précision de 18 points.
- **Le vote d'ensemble élimine les coûts opérationnels** : Atteindre 90% de précision et 80% de rappel a permis à Airoverse d'éliminer 90% des inspections manuelles.
- **Le chevauchement des tuiles est critique** : Toujours faire chevaucher les tuiles géospatiales d'au moins 20% pour ne pas tronquer les équipements situés sur les bordures.`,
      },
    ],
  },
  {
    slug: "rag-semantic-reranking-slack",
    title: "Le RAG sur le terrain : Reclassement sémantique, découpage & budget de latence",
    date: "2026.06.22",
    readTime: "8 min de lecture",
    domains: ["llm"],
    tags: ["LLM", "RAG", "LangChain", "Recherche Vectorielle", "Python"],
    blurb:
      "Au-delà de la similarité cosinus basique : combiner recherche vectorielle dense et reclassement cross-encoder pour réduire de 30% les tickets répétitifs.",
    lead:
      "Le prototype le plus simple à coder est un script RAG naïf avec LangChain. Le système le plus difficile à maintenir utile en production est ce même script face aux requêtes réelles des utilisateurs.",
    sections: [
      {
        heading: "Les failles de la similarité cosinus naïve",
        body: `À l'Université de Pittsburgh, notre canal Slack d'assistance aux cours traitait des milliers de requêtes réparties sur des centaines d'étudiants.

Lors du prototypage initial avec une recherche vectorielle classique, le système échouait dans trois cas fréquents :
- **Vocabulaire synonyme non aligné** : Un étudiant demandant "Où déposer le TP 3 ?" ne correspondait pas aux sections intitulées "Critères d'évaluation et portails Canvas".
- **Perte d'information centrale (Lost in the middle)** : Injecter 10 passages bruts dans le contexte du LLM entraînait des confusions avec d'anciens programmes universitaires.
- **Fausse confiance des modèles bi-encoders** : Les embeddings capturent la proximité thématique, pas l'autorité factuelle.`,
      },
      {
        heading: "Architecture à deux niveaux : Bi-Encoder + Reclassement Cross-Encoder",
        body: `Nous avons restructuré le pipeline en deux étapes complémentaires :
1. **Récupération large ($k=20$)** : Recherche vectorielle dense rapide (< 35 ms).
2. **Reclassement sémantique par Cross-Encoder** : Évaluation simultanée de la paire (question, document) avec attention croisée pour noter la pertinence factuelle réelle.
3. **Injection ciblée (top-4)** : Seuls les 4 passages les mieux classés entrent dans le prompt du LLM.`,
        code: `# Pipeline RAG avec reclassement sémantique
from sentence_transformers import CrossEncoder

reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

def query_rag_assistant(question: str):
    candidates = vector_store.similarity_search(question, k=20)
    pairs = [[question, doc.page_content] for doc in candidates]
    scores = reranker.predict(pairs)
    
    ranked_indices = scores.argsort()[::-1][:4]
    curated_context = "\\n\\n".join([candidates[i].page_content for i in ranked_indices])
    return llm.invoke(SYSTEM_PROMPT.format(context=curated_context, query=question))`,
      },
      {
        heading: "Impact concret : -30% de requêtes",
        body: `Ce déploiement a fait chuter de 30% les questions répétitives. Les étudiants obtiennent des références exactes au cours en moins de 2 secondes, sans monopoliser les assistants.`,
      },
    ],
  },
  {
    slug: "zero-video-exit-edge-cv",
    title: "Zéro flux sortant : Vision par ordinateur temps réel sur matériel edge contraint",
    date: "2026.04.10",
    readTime: "7 min de lecture",
    domains: ["vision"],
    tags: ["Edge AI", "Vision par Ordinateur", "ByteTrack", "YOLOv8", "Confidentialité"],
    blurb:
      "Cartographier les flux piétons et temps d'arrêt en magasin sur du matériel edge local sans qu'aucune trame vidéo brute ne quitte les locaux.",
    lead:
      "Le traitement vidéo dans le cloud fonctionne jusqu'à ce que vous receviez la facture de bande passante ou le retour de l'équipe juridique sur le RGPD.",
    sections: [
      {
        heading: "La matrice des contraintes embarquées",
        body: `Lors du développement du moteur RetailVision, les contraintes étaient strictes :
- **Zéro transmission vidéo** : Conformité RGPD totale, aucune image ne sort de la passerelle locale.
- **Consommation et thermique** : Exécution sur des boîtiers industriels compacts sans refroidissement liquide actif.
- **Flux multi-caméras temps réel** : Traitement à 15–20 FPS de plusieurs flux vidéo simultanés.`,
      },
      {
        heading: "Suivi et cartographie thermique sans stockage blob",
        body: `Nous avons couplé YOLOv8 nano avec **ByteTrack** pour l'association temporelle. Le système extrait uniquement des coordonnées vectorielles discrètes : (track_id, (x, y), t), projetées sur le plan 2D du magasin pour calculer la durée de présence en mémoire vive locale.`,
      },
      {
        heading: "Résultat : Confidentialité et efficacité",
        body: `Seule une synthèse JSON agrégée de quelques kilo-octets est transmise toutes les 5 minutes au tableau de bord. La bande passante est divisée par plus de mille.`,
      },
    ],
  },
  {
    slug: "what-factory-floors-taught-me-about-reliability",
    title: "Ce que 15 usines m'ont appris sur les SLA cloud et la réalité d'ingénierie",
    date: "2026.02.05",
    readTime: "5 min de lecture",
    domains: ["systems"],
    tags: ["Automatisation Industrielle", "Fiabilité", "Architecture", "Philosophie"],
    blurb:
      "Avant le deep learning et les LLMs, je programmais des automates industriels et des systèmes SCADA. Voici ce que la résilience industrielle enseigne aux développeurs logiciels.",
    lead:
      "Dans le logiciel web, lorsqu'une API échoue, on renvoie une 500 et on demande de réessayer. Dans une usine thermique, quand une boucle de contrôle lâche, une turbine surchauffe ou des centaines de litres de fluide se déversent sur le sol.",
    sections: [
      {
        heading: "1. Le mythe des données d'entrée parfaites",
        body: `L'environnement industriel est physiquement hostile : bruits inductifs des moteurs 400V, dérive des thermocouples, pics de pression à la fermeture d'une vanne. La validation rigoureuse des données à la frontière du système est la seule barrière contre l'effondrement. J'applique exactement ce principe à mes pipelines IA actuels.`,
      },
      {
        heading: "2. Sécurité positive (Fail-Safe) plutôt que silence",
        body: `Sur un automate PLC, un circuit d'arrêt d'urgence est toujours câblé en circuit fermé (NF). Si un câble est sectionné, le courant est coupé et la machine s'arrête en sécurité. Dans les microservices, trop de développeurs masquent les erreurs au lieu d'échouer de manière explicite et maîtrisée.`,
      },
      {
        heading: "3. Petits outils modulaires",
        body: `Les systèmes de contrôle les plus fiables sont de petits régulateurs PID et des blocs logiques déterministes interconnectés par des bus standard. C'est l'essence même de la philosophie Unix et des microservices FastAPI conteneurisés d'aujourd'hui.`,
      },
    ],
  },
  {
    slug: "high-throughput-llm-gateway-go",
    title: "Concevoir des passerelles LLM haute performance en Go : Limitation par jetons et basculement",
    date: "2025.11.18",
    readTime: "6 min de lecture",
    domains: ["llm", "systems"],
    tags: ["Go", "LLM", "Redis", "Systèmes Distribués", "Docker"],
    blurb:
      "Pourquoi nous avons développé notre proxy inverse LLM en Go avec limitation par jetons Redis pour absorber les pannes et pics de charge.",
    lead:
      "Dépendre d'un seul fournisseur de LLM sans couche de routage intermédiaire est une dette technique colossale pour une équipe d'ingénierie IA.",
    sections: [
      {
        heading: "L'exigence : Haute disponibilité sans surcoût de latence",
        body: `En production, il est nécessaire de limiter le débit par modèle, d'effectuer un basculement instantané en cas d'erreur 503 ou de latence anormale (> 4 000 ms), tout en ajoutant moins de 3 ms de latence réseau.`,
      },
      {
        heading: "Pourquoi Go pour le proxy réseau",
        body: `Si Python excelle pour l'entraînement et l'orchestration RAG, Go est idéal pour les proxys réseau concurrents. Les goroutines traitent des milliers de connexions avec une empreinte mémoire minime et une compilation binaire autonome.`,
      },
      {
        heading: "Limitation par jetons avec Redis",
        body: `L'utilisation de scripts Lua atomiques dans Redis permet à plusieurs instances du proxy de partager des quotas de requêtes et de jetons à la minute sans risque d'accès concurrents.`,
      },
    ],
  },
];


