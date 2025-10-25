// app/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const t = topic.trim();
    if (!t) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: t }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate modules");
      }

      const data = await response.json();
      
      // Store the course data in sessionStorage for the course page
      sessionStorage.setItem("courseData", JSON.stringify(data));
      
      // Navigate to the course page
      router.push("/course");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsGenerating(false);
    }
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
    background: isGenerating ? "#4a73cc" : "#5b8cff",
    color: "#0b0f19",
    fontWeight: 700,
    cursor: isGenerating ? "not-allowed" : "pointer",
    opacity: isGenerating ? 0.7 : 1,
  };

  const errorStyle: React.CSSProperties = {
    marginTop: 12,
    padding: 12,
    background: "rgba(255,59,48,0.1)",
    border: "1px solid rgba(255,59,48,0.3)",
    borderRadius: 8,
    color: "#ff6b6b",
    fontSize: 14,
  };

  return (
    <>
      <section style={heroWrap} aria-labelledby="hero-title">
        <h1 id="hero-title" style={heroTitle}>Learn any topic, fast</h1>
        <p style={heroSub}>
          Mentra generates a personalized course with modules, lectures, and quizzes for any topic you choose.
          Enter a topic below to get started.
        </p>

        <form onSubmit={handleSubmit} style={formRow} aria-label="Enter topic">
          <input
            aria-label="Topic"
            placeholder="Enter a topic, for example Linear Algebra or Ancient Rome"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={inputStyle}
            disabled={isGenerating}
          />
          <button type="submit" style={btnPrimary} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate course"}
          </button>
        </form>

        {error && <div style={errorStyle}>{error}</div>}

        {isGenerating && (
          <div style={{ marginTop: 20, textAlign: "center", color: "rgba(230,233,242,0.7)" }}>
            <p>🤖 AI is generating your personalized course modules...</p>
            <p style={{ fontSize: 14, marginTop: 8 }}>This may take 10-20 seconds</p>
          </div>
        )}
      </section>
    </>
  );
}