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
  const [progress, setProgress] = useState(0);
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

    // Calculate progress from completed modules
    const completedModules = JSON.parse(sessionStorage.getItem("completedModules") || "[]");
    if (data.modules.length > 0) {
      setProgress(Math.round((completedModules.length / data.modules.length) * 100));
    }
  }, [router]);

  const handleStartModule = (moduleNumber: number) => {
    sessionStorage.setItem("currentModule", JSON.stringify(modules[moduleNumber - 1]));
    router.push(`/lecture/${moduleNumber}`);
  };

  const isModuleCompleted = (moduleNumber: number) => {
    const completedModules = JSON.parse(sessionStorage.getItem("completedModules") || "[]");
    return completedModules.includes(moduleNumber);
  };

  if (!courseTopic) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
          <p className="mt-4 text-slate-600">Loading course...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Back Button */}
      <button
        onClick={() => router.push("/")}
        className="mb-6 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Home
      </button>

      {/* Course Header */}
      <section className="relative mb-10 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* Gradient Background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at top left, rgba(99,102,241,0.18), transparent 40%), radial-gradient(circle at bottom right, rgba(59,130,246,0.18), transparent 40%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />

        {/* Badge */}
        <div className="absolute right-6 top-6 rotate-1">
          <span className="inline-flex items-center rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            AI Generated • {modules.length} Modules
          </span>
        </div>

        <div className="relative z-10 p-8 md:p-10">
          {/* Course Badge */}
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/60 px-3 py-1 text-xs font-medium text-slate-600 backdrop-blur-sm">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3l1.912 5.813a1 1 0 00.95.69h6.064L15.54 13.49a1 1 0 00-.364 1.118l1.912 5.813-5.384-3.987a1 1 0 00-1.176 0l-5.384 3.987 1.912-5.813a1 1 0 00-.364-1.118L2.074 9.503h6.064a1 1 0 00.95-.69L12 3z" />
            </svg>
            Curated by Mentra
          </div>

          {/* Course Title */}
          <h1 className="mb-3 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            {courseTopic}
          </h1>

          {/* Course Description */}
          <p className="mb-6 max-w-2xl text-base leading-relaxed text-slate-600">
            Master {courseTopic.toLowerCase()} through {modules.length} interactive modules with 
            comprehensive lectures and knowledge-testing quizzes.
          </p>

          {/* Progress Bar */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative h-2 w-48 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-slate-700">{progress}% complete</span>
            </div>
            <button className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 font-medium text-white transition-colors hover:bg-slate-800">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Continue Learning
            </button>
          </div>
        </div>
      </section>

      {/* Module List */}
      <section>
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Course Modules</h2>
          <p className="text-sm text-slate-500">
            {modules.length} modules • ~{modules.length * 15}-{modules.length * 25} mins
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-2 top-0 bottom-0 w-px bg-slate-200" />

          <ul className="space-y-6">
            {modules.map((module, index) => {
              const completed = isModuleCompleted(module.module_number);
              
              return (
                <li key={module.module_number} className="relative pl-10">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute left-[0.44rem] top-[1.4rem] h-3 w-3 rounded-full border ${
                      completed
                        ? "border-indigo-500 bg-indigo-500"
                        : "border-slate-300 bg-white"
                    }`}
                  />

                  {/* Module Card */}
                  <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:shadow-md">
                    {/* Top Accent Line */}
                    <div
                      className={`h-[3px] w-full ${
                        completed
                          ? "bg-gradient-to-r from-green-500 to-emerald-500"
                          : "bg-gradient-to-r from-indigo-500 to-blue-500"
                      }`}
                    />

                    <div className="flex items-start justify-between p-5">
                      <div className="flex-1 pr-4">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          {/* Module Number */}
                          <span className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-slate-100 px-2 text-xs font-semibold text-slate-700">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          {/* Module Title */}
                          <h3 className="text-lg font-medium text-slate-900">
                            {module.module_title}
                          </h3>

                          {/* Completed Badge */}
                          {completed && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 13l4 4L19 7" />
                              </svg>
                              Completed
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-slate-600">{module.description}</p>
                      </div>

                      {/* Start Button */}
                      <button
                        onClick={() => handleStartModule(module.module_number)}
                        className="ml-auto inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50/60 hover:text-indigo-600"
                      >
                        {completed ? "Review" : "Start"}
                        <svg
                          className="h-4 w-4 text-indigo-500 transition-transform group-hover:translate-x-0.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M9 5l7 7-7 7" />
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
  );
}