import Info from "../../components/Info";
import { SITE } from "../../data/site";

export const metadata = {
  title: "About & Tech Stack | AI / Vision / Cloud",
  description:
    "Technical dossier of Jeeva Krishnasamy: AI/ML engineer with expertise across PyTorch, YOLOv8/v11, LangChain, FastAPI, Docker, and AWS Solutions Architecture. Based in France (Talent Passport), open to work.",
  keywords: [
    "AI tech stack",
    "Computer vision skills",
    "PyTorch developer",
    "FastAPI backend engineer",
    "LangChain RAG developer",
    "AWS Certified Solutions Architect",
    "Jeeva Krishnasamy bio",
  ],
  alternates: {
    canonical: "/info",
    languages: {
      "en-US": "/info?lang=en",
      "fr-FR": "/info?lang=fr",
    },
  },
  openGraph: {
    title: "About & Tech Stack — Jeeva Krishnasamy",
    description:
      "Dossier and technical stack: Models, LLMs, Languages, Backend, Infrastructure, and Data engineering.",
    url: `${SITE.url}/info`,
  },
};

export default function InfoPage() {
  return <Info />;
}

