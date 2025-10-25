// app/course/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ModuleBlock from "../../components/ModuleBlock";

type Module = {
  module_number: number;
  module_title: string;
  description: string;
};

type ModuleContent = {
  lecture_title: string;
  lecture_text: string;
  quiz: QuizQuestion[];
};

type QuizQuestion = {
  question_number: number;
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation: string;
};

export default function CoursePage() {
  const [courseTopic, setCourseTopic] = useState<string>("");
  const [modules, setModules] = useState<Module[]>([]);
  const [moduleContents, setModuleContents] = useState<Record<number, ModuleContent>>({});
  const [loadingModules, setLoadingModules] = useState<Record<number, boolean>>({});
  const router = useRouter();

  useEffect(() => {
    // Retrieve course data from sessionStorage
    const storedData = sessionStorage.getItem("courseData");
    if (!storedData) {
      router.push("/");
      return;
    }

    const data = JSON.parse(storedData);
    setCourseTopic(data.topic);
    setModules(data.modules);
  }, [router]);

  const loadModuleContent = async (module: Module) => {
    if (moduleContents[module.module_number] || loadingModules[module.module_number]) {
      return; // Already loaded or loading
    }

    setLoadingModules((prev) => ({ ...prev, [module.module_number]: true }));

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleTitle: module.module_title,
          courseTopic: courseTopic,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const content = await response.json();
      setModuleContents((prev) => ({ ...prev, [module.module_number]: content }));
    } catch (error) {
      console.error("Error loading module content:", error);
      alert("Failed to load module content. Please try again.");
    } finally {
      setLoadingModules((prev) => ({ ...prev, [module.module_number]: false }));
    }
  };

  const pageTitle: React.CSSProperties = {
    fontSize: 32,
    fontWeight: 800,
    marginBottom: 8,
  };

  const pageSubtitle: React.CSSProperties = {
    fontSize: 16,
    color: "rgba(230,233,242,0.7)",
    marginBottom: 32,
  };

  const backBtn: React.CSSProperties = {
    marginBottom: 24,
    padding: "10px 16px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "#e6e9f2",
    cursor: "pointer",
    fontSize: 14,
  };

  if (!courseTopic) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button style={backBtn} onClick={() => router.push("/")}>
        ← Back to Home
      </button>

      <h1 style={pageTitle}>{courseTopic}</h1>
      <p style={pageSubtitle}>
        {modules.length} modules • Complete each lecture and quiz to master the topic
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {modules.map((module) => (
          <ModuleBlock
            key={module.module_number}
            module={module}
            content={moduleContents[module.module_number]}
            isLoading={loadingModules[module.module_number]}
            onLoadContent={() => loadModuleContent(module)}
            courseTopic={courseTopic}
          />
        ))}
      </div>
    </div>
  );
}