import { NAV, SITE } from "../data/site";
import { POSTS } from "../data/posts";

export const dynamic = "force-static";

export default function sitemap() {
  const lastMod = new Date(SITE.lastUpdated.replaceAll(".", "-"));

  const navRoutes = NAV.map((n) => {
    const path = n.href === "/" ? "" : n.href;
    const base = `${SITE.url}${path}`;
    const isPrimary = n.href === "/" || n.href === "/work" || n.href === "/blog";

    return {
      url: base,
      lastModified: lastMod,
      changeFrequency: isPrimary ? "weekly" : "monthly",
      priority: n.href === "/" ? 1.0 : n.href === "/work" ? 0.9 : n.href === "/blog" ? 0.85 : 0.8,
      alternates: {
        languages: {
          en: `${base}${path ? "?lang=en" : "/?lang=en"}`,
          fr: `${base}${path ? "?lang=fr" : "/?lang=fr"}`,
        },
      },
    };
  });

  const postRoutes = POSTS.map((post) => {
    const postUrl = `${SITE.url}/blog/${post.slug}`;
    const postDate = new Date(post.date.replaceAll(".", "-"));

    return {
      url: postUrl,
      lastModified: isNaN(postDate.getTime()) ? lastMod : postDate,
      changeFrequency: "monthly",
      priority: 0.75,
      alternates: {
        languages: {
          en: `${postUrl}?lang=en`,
          fr: `${postUrl}?lang=fr`,
        },
      },
    };
  });

  return [...navRoutes, ...postRoutes];
}

