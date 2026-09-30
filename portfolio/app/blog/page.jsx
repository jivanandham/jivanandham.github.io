import BlogList from "../../components/BlogList";
import { POSTS } from "../../data/posts";
import { SITE } from "../../data/site";

export const metadata = {
  title: "Technical Blog & Engineering Essays",
  description:
    "Engineering essays and technical case breakdowns by Jeeva Krishnasamy: Satellite computer vision with YOLOv8 & RF-DETR, enterprise LangChain RAG architectures, zero-video-exit edge tracking, and Go LLM gateways.",
  keywords: [
    "AI engineering blog",
    "Computer vision tutorials",
    "YOLOv8 satellite imagery",
    "LangChain RAG semantic reranking",
    "Edge AI ByteTrack",
    "Go LLM gateway",
    "Jeeva Krishnasamy blog",
  ],
  alternates: {
    canonical: "/blog",
    languages: {
      "en-US": "/blog?lang=en",
      "fr-FR": "/blog?lang=fr",
    },
  },
  openGraph: {
    title: "Technical Blog & Engineering Essays — Jeeva Krishnasamy",
    description:
      "Field notes and architectural analyses across production computer vision, retrieval augmented generation, edge video analytics, and system reliability.",
    url: `${SITE.url}/blog`,
  },
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Jeeva Krishnasamy — Technical Blog",
  description:
    "Field notes and architectural analyses across production computer vision, retrieval augmented generation, edge video analytics, and system reliability.",
  url: `${SITE.url}/blog`,
  publisher: {
    "@type": "Person",
    name: SITE.name,
    url: SITE.url,
  },
  blogPost: POSTS.map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    description: p.blurb,
    url: `${SITE.url}/blog/${p.slug}`,
    datePublished: p.date.replaceAll(".", "-"),
    author: {
      "@type": "Person",
      name: SITE.name,
    },
    keywords: p.tags.join(", "),
  })),
};

export default function BlogIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <BlogList />
    </>
  );
}
