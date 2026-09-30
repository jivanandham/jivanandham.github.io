import RecordView from "../../components/RecordView";
import { EXPERIENCE, EDUCATION, CERTIFICATIONS, SITE } from "../../data/site";

export const metadata = {
  title: "Experience & Education | Engineering Record",
  description:
    "Engineering career timeline of Jeeva Krishnasamy: AI Software Developer at Airoverse, Data Engineer at University of Pittsburgh, M.S. Information Science (AI Specialization), and AWS Certified Solutions Architect.",
  keywords: [
    "Jeeva Krishnasamy experience",
    "AI engineer resume",
    "University of Pittsburgh AI",
    "Airoverse AI developer",
    "AWS Certified Solutions Architect",
    "Data engineering timeline",
    "French Talent Passport engineer",
  ],
  alternates: {
    canonical: "/record",
    languages: {
      "en-US": "/record?lang=en",
      "fr-FR": "/record?lang=fr",
    },
  },
  openGraph: {
    title: "Experience & Education Record — Jeeva Krishnasamy",
    description:
      "Career record spanning industrial IoT automation in India, AI software development at Airoverse, and data engineering at the University of Pittsburgh.",
    url: `${SITE.url}/record`,
  },
};

const recordSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: SITE.name,
    hasOccupation: EXPERIENCE.map((e) => ({
      "@type": "Role",
      roleName: e.role,
      startDate: e.start,
      ...(e.end && { endDate: e.end }),
      worksFor: {
        "@type": "Organization",
        name: e.org,
        location: e.place,
      },
      description: e.summary,
    })),
  },
};

export default function RecordPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recordSchema) }}
      />
      <RecordView />
    </>
  );
}
