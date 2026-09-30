import { NextResponse } from "next/server";
import geoip from "geoip-lite";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  // Manual query override for testing (e.g. /api/geo?country=FR)
  const manualCountry = searchParams.get("country");
  if (manualCountry) {
    const isFr = manualCountry.toUpperCase() === "FR";
    return NextResponse.json({
      country: manualCountry.toUpperCase(),
      isFrance: isFr,
      locale: isFr ? "fr" : "en",
      source: "manual-query",
    });
  }

  // Check CDN headers first (Cloudflare, Vercel, AWS CloudFront)
  const cdnCountry =
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cloudfront-viewer-country") ||
    request.headers.get("x-country-code");

  if (cdnCountry && cdnCountry !== "XX" && cdnCountry !== "T1") {
    const isFr = cdnCountry.toUpperCase() === "FR";
    return NextResponse.json({
      country: cdnCountry.toUpperCase(),
      isFrance: isFr,
      locale: isFr ? "fr" : "en",
      source: "cdn-header",
    });
  }

  // Extract client IP address
  const forwarded = request.headers.get("x-forwarded-for");
  const rawIp = forwarded ? forwarded.split(",")[0].trim() : request.headers.get("x-real-ip") || "";

  // Sanitize IP (strip IPv6 prefix like ::ffff:)
  const cleanIp = rawIp.replace(/^.*:/, "");

  let lookup = null;
  if (cleanIp && cleanIp !== "127.0.0.1" && cleanIp !== "localhost") {
    try {
      lookup = geoip.lookup(cleanIp);
    } catch {}
  }

  if (lookup && lookup.country) {
    const isFr = lookup.country.toUpperCase() === "FR";
    return NextResponse.json({
      country: lookup.country.toUpperCase(),
      isFrance: isFr,
      locale: isFr ? "fr" : "en",
      city: lookup.city || null,
      source: "geoip-lite",
      ip: cleanIp,
    });
  }

  // Fallback: check Accept-Language header
  const acceptLang = (request.headers.get("accept-language") || "").toLowerCase();
  const prefersFrench = acceptLang.startsWith("fr") || acceptLang.includes(",fr");

  return NextResponse.json({
    country: prefersFrench ? "FR" : "OTHER",
    isFrance: prefersFrench,
    locale: prefersFrench ? "fr" : "en",
    source: "accept-language-fallback",
    acceptLanguage: acceptLang,
  });
}
