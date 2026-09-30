"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  FR_SITE,
  FR_BOOT_LINES,
  FR_DOMAINS,
  FR_PROJECTS,
  FR_POSTS,
  FR_EXPERIENCE,
  FR_EDUCATION,
  FR_NAV,
  FR_UI,
  EN_UI,
} from "../data/translations";
import {
  SITE as EN_SITE,
  BOOT_LINES as EN_BOOT_LINES,
  DOMAINS as EN_DOMAINS,
  PROJECTS as EN_PROJECTS,
  EXPERIENCE as EN_EXPERIENCE,
  EDUCATION as EN_EDUCATION,
  NAV as EN_NAV,
  CERTIFICATIONS,
  STACK,
  TOOLS,
  INFLUENCES,
} from "../data/site";
import { POSTS as EN_POSTS } from "../data/posts";


const LanguageContext = createContext({
  lang: "en",
  setLang: () => {},
  toggleLang: () => {},
  isFrance: false,
  detectedCountry: "US",
  t: {
    site: EN_SITE,
    bootLines: EN_BOOT_LINES,
    domains: EN_DOMAINS,
    projects: EN_PROJECTS,
    posts: EN_POSTS,
    experience: EN_EXPERIENCE,
    education: EN_EDUCATION,
    certifications: CERTIFICATIONS,
    stack: STACK,
    tools: TOOLS,
    influences: INFLUENCES,
    nav: EN_NAV,
    ui: EN_UI,
  },
});

function getCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

function setCookie(name, value, days = 365) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function LanguageProvider({ children, initialLang = "en" }) {
  const [lang, setLangState] = useState(initialLang);
  const [isFrance, setIsFrance] = useState(initialLang === "fr");
  const [detectedCountry, setDetectedCountry] = useState(initialLang === "fr" ? "FR" : "US");

  const setLang = (newLang, isManual = true) => {
    const l = newLang === "fr" ? "fr" : "en";
    setLangState(l);
    setCookie("jk_lang", l);
    if (isManual) {
      setCookie("jk_lang_manual", "true");
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = l;
    }
  };

  const toggleLang = () => {
    setLang(lang === "fr" ? "en" : "fr", true);
  };

  // Client-side verification with backend geolocation API
  useEffect(() => {
    // 1. Check if user manually made an explicit choice
    const isManual = getCookie("jk_lang_manual") === "true";
    const savedCookie = getCookie("jk_lang");

    if (isManual && (savedCookie === "fr" || savedCookie === "en")) {
      setLangState(savedCookie);
      document.documentElement.lang = savedCookie;
      return;
    }

    // 2. Query backend server /api/geo to check real visitor IP location
    fetch("/api/geo")
      .then((res) => res.json())
      .then((data) => {
        setDetectedCountry(data.country || "OTHER");
        setIsFrance(Boolean(data.isFrance));

        // If visitor is from France, automatically display everything in French!
        if (data.isFrance || data.locale === "fr") {
          setLang("fr", false);
        } else if (!savedCookie) {
          setLang("en", false);
        }
      })
      .catch((err) => {
        console.warn("Geolocation lookup fallback:", err);
      });
  }, []);


  const t = useMemo(() => {
    const isFr = lang === "fr";
    return {
      site: isFr ? FR_SITE : EN_SITE,
      bootLines: isFr ? FR_BOOT_LINES : EN_BOOT_LINES,
      domains: isFr ? FR_DOMAINS : EN_DOMAINS,
      projects: isFr ? FR_PROJECTS : EN_PROJECTS,
      posts: isFr ? FR_POSTS : EN_POSTS,
      experience: isFr ? FR_EXPERIENCE : EN_EXPERIENCE,
      education: isFr ? FR_EDUCATION : EN_EDUCATION,
      certifications: CERTIFICATIONS,
      stack: STACK,
      tools: TOOLS,
      influences: INFLUENCES,
      nav: isFr ? FR_NAV : EN_NAV,
      ui: isFr ? FR_UI : EN_UI,
    };
  }, [lang]);

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        isFrance,
        detectedCountry,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
