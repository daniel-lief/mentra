// app/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const handleGenerateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      alert("Please enter a topic");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate course");
      }

      const data = await response.json();
      
      // Store course data in sessionStorage
      sessionStorage.setItem("courseData", JSON.stringify({
        topic: data.topic,
        modules: data.modules,
      }));
      
      // Initialize completed modules
      sessionStorage.setItem("completedModules", JSON.stringify([]));

      // Navigate to course page
      router.push("/course");
    } catch (error) {
      console.error("Error generating course:", error);
      alert("Failed to generate course. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    
    <div className="relative min-h-screen w-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-sky-200 via-blue-50 to-white">
      {/* Header Navigation */}
      <header className="flex items-center justify-between px-6 py-4 md:px-12">
        <div className="flex items-center gap-2">
          <img 
            src="/mentra-icon.png" 
            alt="Mentra logo" 
            width={32} 
            height={32}
            className="h-8 w-8"
          />
          <div className="text-xl font-semibold text-slate-900">Mentra</div>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100">
            Sign Up
          </button>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
            Login
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex min-h-[calc(100vh-5rem)] flex-col items-center px-6 pt-16">
        <div className="w-full max-w-6xl text-center">
          {/* Headline */}
          <h1 className="mb-8 text-6xl font-bold tracking-tight text-slate-900 md:text-7xl">
            Learn <span className="font-bold text-slate-900">Anything</span>.
          </h1>

          {/* Input Form */}
          <form onSubmit={handleGenerateCourse} className="mx-auto mb-8 max-w-2xl">
            <div className="relative flex items-center rounded-full bg-[rgba(255,255,255,1)] shadow-sm px-6 py-3 transition-all">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a topic..."
                disabled={isGenerating}
                className="flex-1 bg-transparent text-base text-slate-900 placeholder-slate-400 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isGenerating}
                className="ml-4 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-all hover:scale-105 disabled:cursor-not-allowed disabled:bg-blue-700"
              >
                {isGenerating ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    Submit
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Preview Image with 3D Rotation */}
          <div className="mx-auto max-w-6xl">
            <img 
              src="/lecture-preview.png" 
              alt="Lecture preview example"
              className="w-full h-auto"
            />
          </div>
        </div>
      </main>
    </div>
  );
}