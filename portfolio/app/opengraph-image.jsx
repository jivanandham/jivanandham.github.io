import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Jeeva Krishnasamy — AI Engineer & Computer Vision Specialist";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#1a1814",
          color: "#e8dcc8",
          padding: "54px 64px",
          fontFamily: "monospace",
          border: "8px solid #28241d",
          position: "relative",
        }}
      >
        {/* CRT Scanline faint background glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(ellipse at 80% 20%, rgba(196, 93, 62, 0.18), transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(126, 200, 133, 0.12), transparent 50%)",
          }}
        />

        {/* Top bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #3d362a",
            paddingBottom: "18px",
            fontSize: "18px",
            letterSpacing: "0.15em",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#7ec885" }}>●</span>
            <span style={{ color: "#7ec885", fontWeight: 600 }}>SYSTEM: ONLINE</span>
            <span style={{ color: "#8a7e6b" }}>| jivanandham.com</span>
          </div>
          <div style={{ color: "#c45d3e", fontWeight: 600 }}>
            PARIS / PITTSBURGH / REMOTE
          </div>
        </div>

        {/* Main hero typography */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", my: "auto" }}>
          <div
            style={{
              fontSize: "16px",
              color: "#c45d3e",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
            }}
          >
            // DOSSIER · AI & COMPUTER VISION
          </div>
          <h1
            style={{
              fontSize: "58px",
              fontWeight: 700,
              lineHeight: 1.1,
              margin: 0,
              color: "#f5eee6",
              letterSpacing: "-0.02em",
            }}
          >
            Jeeva Krishnasamy
          </h1>
          <p
            style={{
              fontSize: "26px",
              color: "#a89b85",
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            AI Engineer & Computer Vision Specialist.
          </p>
          <p
            style={{
              fontSize: "20px",
              color: "#8a7e6b",
              margin: 0,
            }}
          >
            Building AI that survives contact with real data — satellite imagery, industrial automation & production LLMs.
          </p>
        </div>

        {/* Highlight cards */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "14px",
            fontSize: "16px",
            marginTop: "6px",
          }}
        >
          <div
            style={{
              backgroundColor: "#23201a",
              border: "1px solid #3d362a",
              padding: "10px 16px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "525px",
            }}
          >
            <span style={{ color: "#7ec885" }}>⌬</span>
            <span>RTU Satellite Detection (90% Precision · YOLOv8)</span>
          </div>
          <div
            style={{
              backgroundColor: "#23201a",
              border: "1px solid #3d362a",
              padding: "10px 16px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "525px",
            }}
          >
            <span style={{ color: "#c45d3e" }}>⌁</span>
            <span>Enterprise LangChain RAG & Semantic Re-ranking</span>
          </div>
          <div
            style={{
              backgroundColor: "#23201a",
              border: "1px solid #3d362a",
              padding: "10px 16px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "525px",
            }}
          >
            <span style={{ color: "#7ec885" }}>◉</span>
            <span>M.S. Information Science (AI) · Univ of Pittsburgh</span>
          </div>
          <div
            style={{
              backgroundColor: "#23201a",
              border: "1px solid #3d362a",
              padding: "10px 16px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "525px",
            }}
          >
            <span style={{ color: "#c45d3e" }}>✓</span>
            <span>AWS Certified Solutions Architect · French Talent Passport</span>
          </div>
        </div>

        {/* Footer status bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #3d362a",
            paddingTop: "18px",
            fontSize: "16px",
            color: "#a89b85",
          }}
        >
          <div style={{ display: "flex", gap: "24px" }}>
            <span>STATUS: <strong style={{ color: "#7ec885" }}>OPEN TO WORK</strong></span>
            <span>RELOCATION: <strong style={{ color: "#e8dcc8" }}>France / Europe / US</strong></span>
          </div>
          <div style={{ color: "#7ec885", fontWeight: 600 }}>
            [ EN | FR ] BILINGUAL
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
