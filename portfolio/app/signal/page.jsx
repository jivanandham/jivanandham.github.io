import Signal from "../../components/Signal";
import { SITE } from "../../data/site";

export const metadata = {
  title: "Contact & Signal Terminal | Hire / Collaborate",
  description:
    "Direct contact channel for Jeeva Krishnasamy: AI Engineer available for on-site (France - Talent Passport), hybrid, or remote roles. GitHub, LinkedIn, and email terminal.",
  keywords: [
    "Contact Jeeva Krishnasamy",
    "Hire AI Engineer France",
    "Hire Computer Vision Engineer",
    "Jeeva Krishnasamy email",
    "Talent Passport hire",
  ],
  alternates: {
    canonical: "/signal",
    languages: {
      "en-US": "/signal?lang=en",
      "fr-FR": "/signal?lang=fr",
    },
  },
  openGraph: {
    title: "Contact & Signal Terminal — Jeeva Krishnasamy",
    description:
      "Direct contact channel: Reach Jeeva Krishnasamy for AI engineering roles, consulting, and collaborations.",
    url: `${SITE.url}/signal`,
  },
};

export default function SignalPage() {
  return <Signal />;
}

