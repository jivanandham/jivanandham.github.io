/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Prevent MIME sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Prevent clickjacking
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Strict XSS filter for legacy browsers
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Referrer policy — don't leak full URL to third parties
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // DNS prefetch control — prevent leaking sub-resources
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Permissions policy — disable what we don't use
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      // Next.js inline scripts and JSON-LD
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // Images: self + data URIs (for SVG grain, opengraph)
      "img-src 'self' data: blob:",
      // Connect: self for API calls
      "connect-src 'self'",
      // Frame: no embedding
      "frame-ancestors 'none'",
      // Forms only to self
      "form-action 'self'",
      // Manifest: self
      "manifest-src 'self'",
    ].join("; "),
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  experimental: {
    serverComponentsExternalPackages: ["geoip-lite"],
  },

  // Apply security headers to all routes
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      // Prevent crawlers indexing the admin panel
      {
        source: "/admin(.*)",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      // No-cache for all API routes (prevents stale auth state)
      {
        source: "/api/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
        ],
      },
    ];
  },

  // Redirect trailing slashes for clean canonical URLs
  async redirects() {
    return [
      {
        source: "/admin/",
        destination: "/admin",
        permanent: true,
      },
      {
        source: "/blog/",
        destination: "/blog",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
