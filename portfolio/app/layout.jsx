import { IBM_Plex_Serif, IBM_Plex_Sans, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import PageTransition from "../components/PageTransition";
import Footer from "../components/Footer";

const plexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-serif",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata = {
  title: "Jeeva Krishnasamy — AI Engineer",
  description:
    "Jeeva Krishnasamy — AI engineer and computer vision specialist. Production AI across satellite imagery, industrial automation, and LLM systems.",
  metadataBase: new URL("https://jivanandham.github.io"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "jeeva-krishnasamy.dev",
    title: "Jeeva Krishnasamy — AI Engineer",
    description:
      "AI engineer and computer vision specialist. Production AI across satellite imagery, industrial automation, and LLM systems.",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@jivanandham",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${plexSerif.variable} ${plexSans.variable} ${plexMono.variable} ${instrument.variable}`}
    >
      <body>
        <Sidebar />
        <main>
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
