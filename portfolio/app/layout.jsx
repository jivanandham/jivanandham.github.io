import { headers, cookies } from "next/headers";
import { IBM_Plex_Serif, IBM_Plex_Sans, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import PageTransition from "../components/PageTransition";
import Footer from "../components/Footer";
import CommandLine from "../components/CommandLine";
import AgentChatbot from "../components/AgentChatbot";
import ErrorBoundary from "../components/ErrorBoundary";
import { LanguageProvider } from "../context/LanguageContext";
import { SITE, EXPERIENCE } from "../data/site";

const plexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-serif",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-instrument",
  display: "swap",
});

const DESCRIPTION =
  "Portfolio of Jeeva Krishnasamy: AI Engineer specializing in computer vision (YOLOv8 satellite detection, real-time edge tracking) and production LLM/RAG systems. Based in France (Talent Passport), open to work.";

export const metadata = {
  title: {
    default: "Jeeva Krishnasamy — AI Engineer & Computer Vision Specialist",
    template: "%s | Jeeva Krishnasamy",
  },
  description: DESCRIPTION,
  metadataBase: new URL(SITE.url),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/?lang=en",
      "fr-FR": "/?lang=fr",
      "x-default": "/",
    },
  },
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  keywords: [
    "Jeeva Krishnasamy",
    "Jivanandham Krishnasamy",
    "jivanandham",
    "AI engineer",
    "Computer vision specialist",
    "Ingénieur Intelligence Artificielle",
    "Ingénieur Vision par Ordinateur",
    "Machine Learning Engineer France",
    "YOLOv8 satellite imagery",
    "LangChain RAG assistant",
    "ByteTrack edge tracking",
    "FastAPI",
    "PyTorch",
    "AWS Certified Solutions Architect",
    "University of Pittsburgh AI",
    "French Talent Passport",
    "Paris AI Engineer",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["fr_FR"],
    url: SITE.url,
    siteName: "Jeeva Krishnasamy — AI Engineer",
    title: "Jeeva Krishnasamy — AI Engineer & Computer Vision Specialist",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Jeeva Krishnasamy — AI Engineer & Computer Vision Specialist",
    description: DESCRIPTION,
    creator: "@jivanandham",
  },
};

export const viewport = {
  themeColor: "#1a1814",
  colorScheme: "dark",
};

const current = EXPERIENCE.find((e) => !e.end);
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Person", "Engineer"],
      "@id": `${SITE.url}/#person`,
      name: SITE.name,
      alternateName: ["Jivanandham Krishnasamy", "jivanandham"],
      url: SITE.url,
      image: `${SITE.url}/opengraph-image`,
      email: `mailto:${SITE.email}`,
      jobTitle: "AI Engineer & Computer Vision Specialist",
      ...(current && { worksFor: { "@type": "Organization", name: current.org } }),
      alumniOf: [
        {
          "@type": "CollegeOrUniversity",
          name: "University of Pittsburgh",
          sameAs: "https://www.pitt.edu",
        },
        {
          "@type": "CollegeOrUniversity",
          name: "Anna University",
        },
      ],
      address: {
        "@type": "PostalAddress",
        addressCountry: "France",
      },
      knowsAbout: [
        "Artificial Intelligence",
        "Computer Vision",
        "Deep Learning",
        "Large Language Models (LLM)",
        "Retrieval-Augmented Generation (RAG)",
        "YOLOv8",
        "RF-DETR",
        "Satellite Imagery Detection",
        "Edge AI & Tracking",
        "PyTorch",
        "FastAPI",
        "Industrial Automation",
        "AWS Solutions Architecture",
      ],
      knowsLanguage: ["en", "fr", "ta"],
      hasCredential: [
        {
          "@type": "EducationalOccupationalCredential",
          name: "AWS Certified Solutions Architect – Associate",
          credentialCategory: "Certification",
          recognizedBy: { "@type": "Organization", name: "Amazon Web Services" },
        },
      ],
      sameAs: [SITE.github, SITE.linkedin],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: "Jeeva Krishnasamy — AI Engineer Portfolio",
      description: DESCRIPTION,
      publisher: { "@id": `${SITE.url}/#person` },
      inLanguage: ["en", "fr"],
    },
  ],
};

export default function RootLayout({ children }) {
  let serverLocale = "en";
  try {
    const cookieStore = cookies();
    const headerList = headers();
    serverLocale =
      cookieStore.get("jk_lang")?.value ||
      headerList.get("x-user-locale") ||
      "en";
  } catch {}

  return (
    <html
      lang={serverLocale}
      className={`${plexSerif.variable} ${plexSans.variable} ${plexMono.variable} ${instrument.variable}`}
    >
      <body>
        <LanguageProvider initialLang={serverLocale}>
          <a href="#content" className="skip-link">Skip to content</a>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
          <Sidebar />
          <ErrorBoundary fallback="Command palette failed to load.">
            <CommandLine />
          </ErrorBoundary>
          <ErrorBoundary fallback="AI Agent failed to load. Please refresh.">
            <AgentChatbot />
          </ErrorBoundary>
          <main id="content">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
