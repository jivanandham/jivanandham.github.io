import WorkList from "../../components/WorkList";
import { PROJECTS, SITE } from "../../data/site";

export const metadata = {
  title: "Projects & Production AI Case Studies",
  description:
    "Explore production AI systems built by Jeeva Krishnasamy: Satellite HVAC detection with YOLOv8/RF-DETR (90% precision), edge tracking with ByteTrack, LangChain RAG assistant, and high-performance LLM gateway.",
  keywords: [
    "AI projects",
    "Computer vision case studies",
    "YOLOv8 satellite detection",
    "RF-DETR object detection",
    "ByteTrack edge tracking",
    "LangChain RAG assistant",
    "LLM API Gateway",
    "Airoverse",
    "Jeeva Krishnasamy projects",
  ],
  alternates: {
    canonical: "/work",
    languages: {
      "en-US": "/work?lang=en",
      "fr-FR": "/work?lang=fr",
    },
  },
  openGraph: {
    title: "Projects & Production AI Case Studies — Jeeva Krishnasamy",
    description:
      "Satellite HVAC detection, real-time edge tracking, enterprise RAG Slack assistant, and LLM gateway. Production AI systems.",
    url: `${SITE.url}/work`,
  },
};

const workSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: PROJECTS.map((proj, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    item: {
      "@type": "SoftwareApplication",
      name: proj.title,
      description: proj.blurb,
      applicationCategory: "MachineLearningApplication",
      operatingSystem: "Linux, Cloud, Docker",
      author: {
        "@type": "Person",
        name: SITE.name,
      },
      keywords: proj.tech.join(", "),
    },
  })),
};

export default function WorkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(workSchema) }}
      />
      <WorkList />
    </>
  );
}

