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
    const loadCompletedModules = () => {
      const completed = sessionStorage.getItem("completedModules");
      if (completed) {
        setCompletedModules(new Set(JSON.parse(completed)));
      }
    };

    loadCompletedModules();

    // Listen for storage events to refresh when returning from quiz
    const handleStorageChange = () => {
      loadCompletedModules();
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen for focus events to refresh when tab regains focus
    window.addEventListener('focus', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, [router]);

  const handleStartModule = (moduleNumber: number) => {
    // Store the current module data in sessionStorage
    const currentModule = modules.find(m => m.module_number === moduleNumber);
    if (currentModule) {
      sessionStorage.setItem("currentModule", JSON.stringify(currentModule));
    }
    router.push(`/lecture/${moduleNumber}`);
  };

  const progressPercent = modules.length > 0 
    ? Math.round((completedModules.size / modules.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        {/* Course Header */}
        <section className="mb-12">
          <button
            onClick={() => router.push("/")}
            className="mb-6 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Home
          </button>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              Course
            </div>

            <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900">
              {courseTopic}
            </h1>
            
            <p className="mb-2 text-slate-600">
              Master {courseTopic} through structured modules, detailed lectures, and knowledge-testing quizzes.
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
                    <div
                      className={`absolute left-2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? 'border-green-600 bg-green-600'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isCompleted && (
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    <div className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white transition-all hover:bg-slate-50">
                      {/* Top accent line - BLUE for incomplete, GREEN for completed */}
                      <div className={`h-[3px] w-full transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                          : 'bg-gradient-to-r from-indigo-400 to-cyan-500 opacity-80'
                      }`} />

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