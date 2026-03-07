"use client";
const STEPS = [
  {
    num: "01", icon: "📄", title: "Dual-Engine Extraction",
    desc: "PyMuPDF dict-level extraction reads font color, size & position per span. pdfplumber captures hyperlinks. OCR fallback (Tesseract @ 200 DPI) handles scanned docs. Locked PDFs auto-detected.",
    tags: ["PyMuPDF", "pdfplumber", "OCR", "DOCX"]
  },
  {
    num: "02", icon: "🛡️", title: "7-Layer Security Firewall",
    desc: "Two-pass dark-mode detection prevents false positives. Invisible text (white font), microscopic text (<4pt), prompt injection, keyword stuffing, and duplicate resumes (>90% cosine similarity) all caught and filtered.",
    tags: ["Invisible Text", "Micro Font", "Injection", "Duplicates"]
  },
  {
    num: "03", icon: "🧠", title: "Neural Structuring",
    desc: "Groq LLaMA-3.1-8b extracts structured JSON: skills (with partial credit), projects, internships, CGPA, achievements. SpaCy NER locates names and locations. 80+ skill taxonomy with fuzzy matching.",
    tags: ["LLaMA 3.1", "SpaCy NER", "JSON"]
  },
  {
    num: "04", icon: "⚖️", title: "12-Factor Scoring",
    desc: "Deterministic 100-point scale across 12 weighted criteria. Prestige multiplier (+8% FAANG, +5% IIT). Skill-project consistency bonus. Fresher/experienced dynamic redistribution. Configurable weights.",
    tags: ["Deterministic", "Prestige", "JD Alignment"]
  },
  {
    num: "05", icon: "🔬", title: "Parallel AI Analysis",
    desc: "6 concurrent Groq tasks: personal info + GitHub trust chain, hireability synthesis, interview questions, soft skills + culture fit, training roadmap, and LLM firewall — all via asyncio.gather.",
    tags: ["6 Parallel Tasks", "Trust Score", "Culture Fit"]
  },
  {
    num: "06", icon: "🏆", title: "Live Ranked Output",
    desc: "Real-time WebSocket broadcast. Leaderboard auto-sorts by score. Profession filter, fraud audit tab, Battle Royale AI comparison, AI email drafting, interview scripts — all instant.",
    tags: ["WebSocket", "Battle Royale", "Email AI"]
  },
];

export default function HowItWorks() {
  return (
    <section id="how" style={{ padding: "120px 60px", background: "linear-gradient(180deg, var(--bg) 0%, rgba(6,182,212,0.03) 50%, var(--bg) 100%)" }}>
      <div className="container">
        <p className="section-label reveal">Pipeline</p>
        <h2 className="section-title reveal reveal-d1">Six phases.<br />85 features.<br />One ranked list.</h2>
        <p className="section-sub reveal reveal-d2">Our forensic pipeline converts unstructured documents into objective, manipulation-proof candidate rankings — with 7-layer security, AI synthesis, and real-time telemetry.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 60, position: "relative" }}>
          {STEPS.map((s, i) => (
            <div key={i} className={`reveal reveal-d${i + 1}`} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "32px 24px", position: "relative", zIndex: 1, transition: "border-color 0.3s, transform 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(6,182,212,0.35)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = ""; }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--cyan)", fontWeight: 600 }}>{s.num}</div>
                <div style={{ fontSize: "1.8rem" }}>{s.icon}</div>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: 16 }}>{s.desc}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {s.tags.map((tag, idx) => (
                  <span key={idx} style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--cyan)", background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.15)", borderRadius: 6, padding: "3px 8px" }}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
