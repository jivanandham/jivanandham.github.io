import Landing from "../components/Landing";

export const metadata = {
  title: "Jeeva Krishnasamy — AI Engineer & Computer Vision Specialist",
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/?lang=en",
      "fr-FR": "/?lang=fr",
    },
  },
};

export default function IndexPage() {
  return <Landing />;
}

