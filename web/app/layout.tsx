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
      <body className={`${inter.className} min-h-screen bg-transparent antialiased`}>
        <main className="min-h-[calc(100vh-8rem)]">
          {children}
        </main>
        
      </body>
    </html>
  );
}