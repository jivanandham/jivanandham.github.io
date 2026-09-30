import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;

  // Skip static assets, images, and internal Next.js requests
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".woff2") ||
    pathname.endsWith(".txt")
  ) {
    return NextResponse.next();
  }

  // 1. Manual query override (?lang=fr or ?country=FR)
  const qLang = searchParams.get("lang");
  const qCountry = searchParams.get("country");
  if (qLang === "fr" || qCountry?.toUpperCase() === "FR") {
    const res = NextResponse.next();
    res.cookies.set("jk_lang", "fr", { path: "/", maxAge: 60 * 60 * 24 * 365 });
    res.headers.set("x-user-locale", "fr");
    return res;
  }
  if (qLang === "en" || (qCountry && qCountry.toUpperCase() !== "FR")) {
    const res = NextResponse.next();
    res.cookies.set("jk_lang", "en", { path: "/", maxAge: 60 * 60 * 24 * 365 });
    res.headers.set("x-user-locale", "en");
    return res;
  }

  // 2. Cookie preference (if visitor previously made a choice or was detected)
  const existingCookie = request.cookies.get("jk_lang")?.value;
  if (existingCookie === "fr" || existingCookie === "en") {
    const res = NextResponse.next();
    res.headers.set("x-user-locale", existingCookie);
    return res;
  }

  // 3. Geolocation & Headers inspection on backend server
  const cdnCountry =
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cloudfront-viewer-country") ||
    request.headers.get("x-country-code");

  const acceptLang = (request.headers.get("accept-language") || "").toLowerCase();
  const isFrenchAccept = acceptLang.startsWith("fr") || acceptLang.includes(",fr");

  let detectedLocale = "en";
  let hasHighConfidence = false;

  if (cdnCountry?.toUpperCase() === "FR") {
    detectedLocale = "fr";
    hasHighConfidence = true;
  } else if (cdnCountry) {
    detectedLocale = "en";
    hasHighConfidence = true;
  } else if (isFrenchAccept) {
    detectedLocale = "fr";
  }

  const response = NextResponse.next();
  if (hasHighConfidence || detectedLocale === "fr") {
    response.cookies.set("jk_lang", detectedLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }
  response.headers.set("x-user-locale", detectedLocale);
  return response;
}


export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
