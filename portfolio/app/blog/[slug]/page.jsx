import { notFound } from "next/navigation";
import BlogPostView from "../../../components/BlogPostView";
import { POSTS } from "../../../data/posts";
import { SITE } from "../../../data/site";
import { getAllPosts, getPostBySlug } from "../../../lib/blogStore.js";

export const dynamicParams = true;

export function generateStaticParams() {
  const posts = getAllPosts();
  return (posts.length > 0 ? posts : POSTS).map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params }) {
  const post = getPostBySlug(params.slug) || POSTS.find((p) => p.slug === params.slug);
  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: `${post.title} | Engineering Blog`,
    description: post.blurb,
    keywords: [...(post.tags || []), "AI engineer blog", "Jeeva Krishnasamy"],
    alternates: {
      canonical: `/blog/${post.slug}`,
      languages: {
        "en-US": `/blog/${post.slug}?lang=en`,
        "fr-FR": `/blog/${post.slug}?lang=fr`,
      },
    },
    openGraph: {
      type: "article",
      title: `${post.title} — Jeeva Krishnasamy`,
      description: post.blurb,
      url: `${SITE.url}/blog/${post.slug}`,
      publishedTime: (post.date || "").replaceAll(".", "-"),
      authors: [SITE.name],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} — Jeeva Krishnasamy`,
      description: post.blurb,
    },
  };
}

export default function BlogPostPage({ params }) {
  const post = getPostBySlug(params.slug) || POSTS.find((p) => p.slug === params.slug);
  if (!post) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.blurb,
    url: `${SITE.url}/blog/${post.slug}`,
    datePublished: post.date.replaceAll(".", "-"),
    author: {
      "@type": "Person",
      name: SITE.name,
      url: SITE.url,
    },
    publisher: {
      "@type": "Person",
      name: SITE.name,
      url: SITE.url,
    },
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BlogPostView slug={params.slug} initialPost={post} />
    </>
  );
}
