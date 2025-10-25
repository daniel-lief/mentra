"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

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

export default function LecturePage() {
  const [module, setModule] = useState<Module | null>(null);
  const [content, setContent] = useState<ModuleContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [courseTopic, setCourseTopic] = useState("");
  const router = useRouter();
  const params = useParams();
  const moduleId = params.id as string;

  useEffect(() => {
    const storedModule = sessionStorage.getItem("currentModule");
    const storedCourseData = sessionStorage.getItem("courseData");
    
    if (!storedModule || !storedCourseData) {
      router.push("/course");
      return;
    }

    const moduleData = JSON.parse(storedModule);
    const courseData = JSON.parse(storedCourseData);
    setModule(moduleData);
    setCourseTopic(courseData.topic);

    // Load content
    loadContent(moduleData, courseData.topic);
  }, [router, moduleId]);

  const loadContent = async (moduleData: Module, topic: string) => {
    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleTitle: moduleData.module_title,
          courseTopic: topic,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const contentData = await response.json();
      setContent(contentData);
    } catch (error) {
      console.error("Error loading content:", error);
      alert("Failed to load lecture content. Please try again.");
      router.push("/course");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueToQuiz = () => {
    if (content) {
      sessionStorage.setItem("quizData", JSON.stringify(content.quiz));
      router.push(`/quiz/${moduleId}`);
    }
  };

  if (isLoading || !module || !content) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
          <p className="mt-4 font-medium text-slate-700">Generating lecture content...</p>
          <p className="mt-1 text-sm text-slate-500">This may take a moment</p>
        </div>
      </div>
    );
  }

  // Split lecture text into paragraphs
  const paragraphs = content.lecture_text.split("\n\n").filter((p) => p.trim());

  return (
    <div className="mx-auto max-w-4xl">
      {/* Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.push("/course")}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Course
        </button>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          15-20 min read
        </div>
      </div>

      {/* Lecture Header */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Module {module.module_number} Lecture
        </div>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900">
          {content.lecture_title}
        </h1>
        <p className="text-slate-600">{module.description}</p>
      </div>

      {/* Lecture Content */}
      <article className="mb-8 rounded-xl border border-slate-200 bg-white p-8 md:p-10">
        <div className="prose prose-slate max-w-none">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="mb-4 leading-relaxed text-slate-700 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </article>

      {/* Key Takeaways */}
      <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
        <div className="mb-3 flex items-center gap-2 font-semibold text-blue-900">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          You've completed the lecture!
        </div>
        <p className="text-sm text-blue-800">
          Ready to test your understanding? Take the quiz to reinforce what you've learned 
          and track your progress.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleContinueToQuiz}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-slate-800"
        >
          Continue to Quiz
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button
          onClick={() => router.push("/course")}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          Return to Course
        </button>
      </div>
    </div>
  );
}