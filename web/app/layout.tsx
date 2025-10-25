// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mentra",
  description: "Learn any topic with AI generated modules, lectures, and quizzes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const shell: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#0b0f19",
    color: "#e6e9f2",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
  };

  const nav: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  };

  const brand: React.CSSProperties = { fontWeight: 700, letterSpacing: "0.4px" };
  const links: React.CSSProperties = { display: "flex", gap: 16, fontSize: 14, opacity: 0.9 };

  const main: React.CSSProperties = { flex: 1, width: "100%", maxWidth: 1100, margin: "0 auto", padding: "28px 20px" };

  const footer: React.CSSProperties = {
    padding: "16px 20px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    fontSize: 13,
    color: "rgba(230,233,242,0.7)",
  };

  return (
    <html lang="en">
      <body style={shell}>
        <header style={nav}>
          <div style={brand}>Mentra</div>
          <nav aria-label="Primary" style={links}>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Modules</a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>About</a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Docs</a>
          </nav>
        </header>

        <main style={main}>{children}</main>

        <footer style={footer}>
          © {new Date().getFullYear()} Mentra. Prototype for hackathon use.
        </footer>
      </body>
    </html>
  );
}
