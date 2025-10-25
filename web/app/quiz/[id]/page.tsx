"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

type QuizQuestion = {
  question_number: number;
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation: string;
};

type GradedResult = {
  question_number: number;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  explanation: string;
};

type GradingResults = {
  graded_results: GradedResult[];
  feedback_summary: string;
};

export default function QuizPage() {
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gradingResults, setGradingResults] = useState<GradingResults | null>(null);
  const [isGrading, setIsGrading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const moduleId = params.id as string;

  useEffect(() => {
    const storedQuiz = sessionStorage.getItem("quizData");
    if (!storedQuiz) {
      router.push("/course");
      return;
    }

    setQuiz(JSON.parse(storedQuiz));
  }, [router]);

  const handleSelectAnswer = (questionNumber: number, answer: string) => {
    if (isSubmitted) return;
    
    setUserAnswers((prev) => ({
      ...prev,
      [questionNumber]: answer,
    }));
  };

  const handleSubmitQuiz = async () => {
    // Check if all questions are answered
    const allAnswered = quiz.every((q) => userAnswers[q.question_number]);
    if (!allAnswered) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setIsGrading(true);

    try {
      const response = await fetch("/api/grade-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lectureAndQuiz: { quiz },
          userAnswers,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to grade quiz");
      }

      const results = await response.json();
      setGradingResults(results);
      setIsSubmitted(true);

      // Mark module as completed if passed
      const correctCount = results.graded_results.filter((r: GradedResult) => r.is_correct).length;
      const passingScore = Math.ceil(quiz.length * 0.6); // 60% to pass
      
      if (correctCount >= passingScore) {
        const completedModules = JSON.parse(sessionStorage.getItem("completedModules") || "[]");
        if (!completedModules.includes(parseInt(moduleId))) {
          completedModules.push(parseInt(moduleId));
          sessionStorage.setItem("completedModules", JSON.stringify(completedModules));
        }
      }
    } catch (error) {
      console.error("Error grading quiz:", error);
      alert("Failed to grade quiz. Please try again.");
    } finally {
      setIsGrading(false);
    }
  };

  const handleReturnToCourse = () => {
    router.push("/course");
  };

  if (quiz.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
          <p className="mt-4 text-slate-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const correctCount = gradingResults?.graded_results.filter((r) => r.is_correct).length || 0;
  const totalQuestions = quiz.length;
  const scorePercentage = isSubmitted ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return (
    <div className="mx-auto max-w-4xl">
      {/* Navigation */}
      <div className="mb-6">
        <button
          onClick={() => router.push(`/lecture/${moduleId}`)}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Lecture
        </button>
      </div>

      {/* Quiz Header */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Module {moduleId} Quiz
        </div>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900">
          Knowledge Check
        </h1>
        <p className="text-slate-600">
          {isSubmitted
            ? `You scored ${correctCount}/${totalQuestions} (${scorePercentage}%)`
            : `Answer all ${totalQuestions} questions to complete this module`}
        </p>
      </div>

      {/* Results Summary */}
      {isSubmitted && gradingResults && (
        <div
          className={`mb-8 rounded-xl border p-6 ${
            scorePercentage >= 60
              ? "border-green-200 bg-green-50"
              : "border-orange-200 bg-orange-50"
          }`}
        >
          <div className="mb-3 flex items-start gap-3">
            {scorePercentage >= 60 ? (
              <svg className="h-6 w-6 flex-shrink-0 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="h-6 w-6 flex-shrink-0 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            <div>
              <h2 className={`mb-1 font-semibold ${scorePercentage >= 60 ? "text-green-900" : "text-orange-900"}`}>
                {scorePercentage >= 60 ? "Great job!" : "Keep practicing!"}
              </h2>
              <p className={`text-sm ${scorePercentage >= 60 ? "text-green-800" : "text-orange-800"}`}>
                {gradingResults.feedback_summary}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Questions */}
      <div className="space-y-6">
        {quiz.map((question, index) => {
          const userAnswer = userAnswers[question.question_number];
          const gradedResult = gradingResults?.graded_results.find(
            (r) => r.question_number === question.question_number
          );

          return (
            <div
              key={question.question_number}
              className="rounded-xl border border-slate-200 bg-white p-6"
            >
              {/* Question Header */}
              <div className="mb-4 flex items-start gap-3">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                  {index + 1}
                </span>
                <h3 className="flex-1 text-lg font-medium text-slate-900">
                  {question.question_text}
                </h3>
              </div>

              {/* Answer Options */}
              <div className="ml-10 space-y-2">
                {question.options.map((option) => {
                  const optionLetter = option.charAt(0);
                  const isSelected = userAnswer === optionLetter;
                  const isCorrect = gradedResult?.correct_answer === optionLetter;
                  const isUserWrong = isSubmitted && isSelected && !gradedResult?.is_correct;

                  let optionStyles = "border-slate-200 bg-white hover:bg-slate-50";
                  if (isSubmitted) {
                    if (isCorrect) {
                      optionStyles = "border-green-300 bg-green-50";
                    } else if (isUserWrong) {
                      optionStyles = "border-red-300 bg-red-50";
                    } else if (isSelected) {
                      optionStyles = "border-slate-300 bg-slate-50";
                    }
                  } else if (isSelected) {
                    optionStyles = "border-indigo-300 bg-indigo-50";
                  }

                  return (
                    <button
                      key={optionLetter}
                      onClick={() => handleSelectAnswer(question.question_number, optionLetter)}
                      disabled={isSubmitted}
                      className={`w-full rounded-lg border p-4 text-left transition-all ${optionStyles} ${
                        isSubmitted ? "cursor-default" : "cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Radio Circle */}
                        <div
                          className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                            isSubmitted && isCorrect
                              ? "border-green-600 bg-green-600"
                              : isSubmitted && isUserWrong
                              ? "border-red-600 bg-red-600"
                              : isSelected
                              ? "border-indigo-600 bg-indigo-600"
                              : "border-slate-300"
                          }`}
                        >
                          {(isSelected || (isSubmitted && isCorrect)) && (
                            <div className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </div>

                        {/* Option Text */}
                        <span className="flex-1 text-sm text-slate-700">{option}</span>

                        {/* Check/X Icon */}
                        {isSubmitted && isCorrect && (
                          <svg className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {isSubmitted && isUserWrong && (
                          <svg className="h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {isSubmitted && gradedResult && (
                <div className="ml-10 mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-900 mb-1">Explanation:</p>
                  <p className="text-sm text-slate-700">{gradedResult.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap gap-3">
        {!isSubmitted ? (
          <button
            onClick={handleSubmitQuiz}
            disabled={isGrading || Object.keys(userAnswers).length !== quiz.length}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isGrading ? (
              <>
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Grading...
              </>
            ) : (
              <>
                Submit Quiz
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleReturnToCourse}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Return to Course
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}