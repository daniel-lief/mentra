// app/page.tsx
"use client";

import { FormEvent, useMemo, useState } from "react";

type ModuleCard = {
  id: string;
  title: string;
  lectures: number;
  quizzes: number;
  estMinutes: number;
};

export default function HomePage() {
  const [topic, setTopic] = useState("");
  const [submittedTopic, setSubmittedTopic] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const t = topic.trim();
    if (!t) return;
    setSubmittedTopic(t);
  };

  const heroWrap: React.CSSProperties = { display: "grid", gap: 16, marginTop: 40, marginBottom: 24 };
  const heroTitle: React.CSSProperties = { fontSize: 36, fontWeight: 800, lineHeight: 1.15 };
  const heroSub: React.CSSProperties = { fontSize: 16, color: "rgba(230,233,242,0.85)", maxWidth: 720 };

  const formRow: React.CSSProperties = { display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" };
  const inputStyle: React.CSSProperties = {
    flex: "1 1 360px",
    minWidth: 280,
    height: 44,
    padding: "0 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#e6e9f2",
    outline: "none",
  };
  const btnPrimary: React.CSSProperties = {
    height: 44,
    padding: "0 16px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#5b8cff",
    color: "#0b0f19",
    fontWeight: 700,
    cursor: "pointer",
  };

  const sectionTitle: React.CSSProperties = { marginTop: 32, marginBottom: 8, fontSize: 18, fontWeight: 700 };

  // Simple placeholder curriculum plan computed from the topic, not persisted
  const suggested: ModuleCard[] = useMemo(() => {
    if (!submittedTopic) return [];
    const base = submittedTopic;
    return [
      { id: "m1", title: `Onboarding, ${base} in 10 minutes`, lectures: 3, quizzes: 1, estMinutes: 10 },
      { id: "m2", title: `Core concepts of ${base}`, lectures: 5, quizzes: 1, estMinutes: 25 },
      { id: "m3", title: `${base} practice set A`, lectures: 2, quizzes: 2, estMinutes: 20 },
      { id: "m4", title: `Applied ${base}`, lectures: 4, quizzes: 1, estMinutes: 22 },
    ];
  }, [submittedTopic]);

  const grid: React.CSSProperties = {
    display: "grid",
    gap: 14,
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    marginTop: 8,
  };

  const card: React.CSSProperties = {
    border: "1px solid rgba(255,255,255,0.10)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.03))",
    borderRadius: 14,
    padding: 16,
  };

  const metaRow: React.CSSProperties = {
    display: "flex",
    gap: 10,
    fontSize: 13,
    color: "rgba(230,233,242,0.8)",
    marginTop: 6,
    flexWrap: "wrap",
  };

  const startBtn: React.CSSProperties = {
    marginTop: 12,
    height: 38,
    width: "100%",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.08)",
    color: "#e6e9f2",
    cursor: "pointer",
  };

  return (
    <>
      <section style={heroWrap} aria-labelledby="hero-title">
        <h1 id="hero-title" style={heroTitle}>Learn any topic, fast</h1>
        <p style={heroSub}>
          Mentra generates a lightweight course with modules, lectures, and quizzes for the topic you choose.
          Enter a topic to see a starter plan. This is a placeholder for the hackathon MVP.
        </p>

        <form onSubmit={handleSubmit} style={formRow} aria-label="Enter topic">
          <input
            aria-label="Topic"
            placeholder="Enter a topic, for example Linear Algebra or Ancient Rome"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" style={btnPrimary}>Generate course</button>
        </form>
      </section>

      {submittedTopic && (
        <section aria-labelledby="suggested-title">
          <h2 id="suggested-title" style={sectionTitle}>
            Suggested modules for “{submittedTopic}”
          </h2>
          <div style={grid}>
            {suggested.map((m) => (
              <article key={m.id} style={card} aria-labelledby={`${m.id}-title`}>
                <h3 id={`${m.id}-title`} style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{m.title}</h3>
                <div style={metaRow}>
                  <span>{m.lectures} lectures</span>
                  <span>{m.quizzes} quizzes</span>
                  <span>~{m.estMinutes} min</span>
                </div>
                <button
                  type="button"
                  style={startBtn}
                  onClick={() => alert("Wire this to /course later")}
                  aria-label={`Start ${m.title}`}
                >
                  Start
                </button>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
