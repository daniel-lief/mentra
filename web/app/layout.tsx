// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Mentra - Learn Anything",
  description: "AI-powered learning platform for mastering any topic",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} min-h-screen bg-white antialiased`}>
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold tracking-tight text-slate-900">
                Mentra
              </div>
              <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
                <a href="/" className="hover:text-slate-900 transition-colors">
                  Home
                </a>
                <a href="#" className="hover:text-slate-900 transition-colors">
                  About
                </a>
                <a href="#" className="hover:text-slate-900 transition-colors">
                  Docs
                </a>
              </nav>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-8rem)]">
          {children}
        </main>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-6">
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>© {new Date().getFullYear()} Mentra. Built for learning.</span>
              <a href="#" className="hover:text-slate-900 transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}