// app/course/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Module = {
  module_number: number;
  module_title: string;
  description: string;
};

export default function CoursePage() {
  const [courseTopic, setCourseTopic] = useState<string>("");
  const [modules, setModules] = useState<Module[]>([]);
  const [completedModules, setCompletedModules] = useState<Set<number>>(new Set());
  const router = useRouter();

  useEffect(() => {
    const storedData = sessionStorage.getItem("courseData");
    if (!storedData) {
      router.push("/");
      return;
    }

    const data = JSON.parse(storedData);
    setCourseTopic(data.topic);
    setModules(data.modules);

    // Load completed modules from sessionStorage
    const completed = sessionStorage.getItem("completedModules");
    if (completed) {
      setCompletedModules(new Set(JSON.parse(completed)));
    }
  }, [router]);

  const handleStartModule = (moduleNumber: number) => {
    router.push(`/lecture/${moduleNumber}`);
  };

  const progressPercent = modules.length > 0 
    ? Math.round((completedModules.size / modules.length) * 100) 
    : 0;

  if (!courseTopic) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-slate-600">Loading course...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white p-8 md:p-12">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,rgba(2,6,23,0.05)_1px,transparent_1px)] [background-size:18px_18px]" />

      <div className="mx-auto w-full max-w-5xl">
        {/* Back button */}
        <button
          onClick={() => router.push("/")}
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>

        {/* Course Header */}
        <section className="relative mb-10 overflow-hidden rounded-lg border border-slate-200 bg-white">
          {/* Gradient background */}
          <div
            className="pointer-events-none absolute inset-0 rounded-lg"
            style={{
              background:
                'radial-gradient(circle at top left, rgba(99,102,241,0.18), transparent 40%), radial-gradient(circle at bottom right, rgba(59,130,246,0.18), transparent 40%)',
            }}
          />
          <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-black/5" />

          {/* Badge */}
          <div className="absolute right-6 top-6">
            <span className="inline-flex items-center rounded-md bg-slate-900 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              AI-Generated Course
            </span>
          </div>

          <div className="relative z-10 p-8 md:p-10">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/60 px-3 py-1 text-xs font-medium text-slate-600 backdrop-blur-sm">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Curated by Mentra
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              {courseTopic}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
              Master {courseTopic.toLowerCase()} through interactive lessons and hands-on quizzes designed for comprehensive learning.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-48">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {progressPercent}% complete
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Modules Section */}
        <section className="relative">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Modules
            </h2>
            <p className="text-sm text-slate-500">
              {modules.length} modules • {completedModules.size} completed
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute bottom-0 left-2 top-0 w-px bg-slate-200" />

            <ul className="space-y-6">
              {modules.map((module, i) => {
                const isCompleted = completedModules.has(module.module_number);
                
                return (
                  <li key={module.module_number} className="relative pl-10">
                    {/* Timeline dot */}
                    <div className={`absolute left-[0.4rem] top-[1.4rem] h-4 w-4 rounded-full border-2 ${
                      isCompleted 
                        ? 'border-indigo-600 bg-indigo-600' 
                        : 'border-slate-300 bg-white'
                    }`}>
                      {isCompleted && (
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    <div className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white transition-all hover:bg-slate-50">
                      {/* Top accent line */}
                      <div className="h-[3px] w-full bg-gradient-to-r from-indigo-600 to-cyan-500 opacity-80" />

                      <div className="flex items-start justify-between p-5">
                        <div className="flex-1 pr-4">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <span className="inline-flex h-6 min-w-[2rem] items-center justify-center rounded-full bg-slate-100 px-2 text-xs font-semibold text-slate-700">
                              {String(module.module_number).padStart(2, '0')}
                            </span>
                            <h3 className="text-lg font-medium text-slate-900">
                              {module.module_title}
                            </h3>
                            {isCompleted && (
                              <span className="ml-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                Completed
                              </span>
                            )}
                          </div>
                          <p className="max-w-2xl text-sm text-slate-600">
                            {module.description}
                          </p>
                        </div>

                        <button
                          onClick={() => handleStartModule(module.module_number)}
                          className="ml-auto flex items-center gap-2 rounded-lg border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50/60 hover:text-indigo-600"
                        >
                          {isCompleted ? 'Review' : 'Start'}
                          <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}