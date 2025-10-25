// app/lecture/[id]/page.tsx
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

type SlideImage = {
  url: string;
  photographer: string;
  photographer_url: string;
};

type Slide = {
  slide_number: number;
  title: string;
  bullets: string[];
  images: SlideImage[];
};

type ViewMode = 'lecture' | 'slides';

export default function LecturePage() {
  const [module, setModule] = useState<Module | null>(null);
  const [content, setContent] = useState<ModuleContent | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSlides, setIsLoadingSlides] = useState(false);
  const [courseTopic, setCourseTopic] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>('lecture');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
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

  const loadSlides = async () => {
    if (!content || slides.length > 0) return;
    
    setIsLoadingSlides(true);
    try {
      const response = await fetch("/api/generate-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lectureTitle: content.lecture_title,
          lectureText: content.lecture_text,
          courseTopic: courseTopic,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate slides");
      }

      const data = await response.json();
      setSlides(data.slides);
    } catch (error) {
      console.error("Error loading slides:", error);
      alert("Failed to load slides. Please try again.");
    } finally {
      setIsLoadingSlides(false);
    }
  };

  const handleViewModeChange = async (mode: ViewMode) => {
    if (mode === 'slides' && slides.length === 0) {
      await loadSlides();
    }
    setViewMode(mode);
  };

  const handleContinueToQuiz = () => {
    if (content) {
      sessionStorage.setItem("quizData", JSON.stringify(content.quiz));
      router.push(`/quiz/${moduleId}`);
    }
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
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

  const paragraphs = content.lecture_text.split("\n\n").filter((p) => p.trim());
  const currentSlide = slides[currentSlideIndex];

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

      {/* Header with Toggle */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Module {module.module_number}
          </div>

          {/* Toggle Buttons */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
            <button
              onClick={() => handleViewModeChange('lecture')}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                viewMode === 'lecture'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lecture
            </button>
            <button
              onClick={() => handleViewModeChange('slides')}
              disabled={isLoadingSlides}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                viewMode === 'slides'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              } disabled:opacity-50`}
            >
              {isLoadingSlides ? 'Loading...' : 'Slides'}
            </button>
          </div>
        </div>

        <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900">
          {content.lecture_title}
        </h1>
        <p className="text-slate-600">{module.description}</p>
      </div>

      {/* Lecture View */}
      {viewMode === 'lecture' && (
        <>
          <article className="mb-8 rounded-xl border border-slate-200 bg-white p-8 md:p-10">
            <div className="prose prose-slate max-w-none">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed text-slate-700 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        </>
      )}

      {/* Slides View */}
      {viewMode === 'slides' && slides.length > 0 && currentSlide && (
        <>
          {/* Slide Content */}
          <div className="mb-6 rounded-xl border border-slate-200 bg-white overflow-hidden">
            {/* Images */}
            {currentSlide.images.length > 0 && (
              <div className={`grid ${currentSlide.images.length === 2 ? 'grid-cols-2' : 'grid-cols-1'} gap-0`}>
                {currentSlide.images.map((image, idx) => (
                  <div key={idx} className="relative aspect-video bg-slate-100">
                    <img
                      src={image.url}
                      alt={currentSlide.title}
                      className="h-full w-full object-cover"
                    />
                    
                  </div>
                ))}
              </div>
            )}

            {/* Slide Content */}
            <div className="p-8">
              <h2 className="mb-6 text-2xl font-bold text-slate-900">
                {currentSlide.title}
              </h2>
              <ul className="space-y-3">
                {currentSlide.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                      {idx + 1}
                    </span>
                    <span className="flex-1 text-lg leading-relaxed text-slate-700">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Slide Navigation */}
          <div className="mb-8 flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
            <button
              onClick={prevSlide}
              disabled={currentSlideIndex === 0}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <span className="text-sm font-medium text-slate-600">
              Slide {currentSlideIndex + 1} of {slides.length}
            </span>

            <button
              onClick={nextSlide}
              disabled={currentSlideIndex === slides.length - 1}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </>
      )}

      {/* Completion Message */}
      <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
        <div className="mb-3 flex items-center gap-2 font-semibold text-blue-900">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Ready to test your knowledge?
        </div>
        <p className="text-sm text-blue-800">
          You've completed the {viewMode}! Take the quiz to reinforce what you've learned and track your progress.
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
