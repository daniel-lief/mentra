// components/ModuleBlock.tsx
"use client";

import { useState } from "react";

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

type GradedResult = {
  question_number: number;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  explanation: string;
};

type GradingResponse = {
  graded_results: GradedResult[];
  feedback_summary: string;
};

type Props = {
  module: Module;
  content?: ModuleContent;
  isLoading: boolean;
  onLoadContent: () => void;
  courseTopic: string;
};

export default function ModuleBlock({
  module,
  content,
  isLoading,
  onLoadContent,
  courseTopic,
}: Props) {
  const [expandedSection, setExpandedSection] = useState<"lecture" | "quiz" | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [gradingResults, setGradingResults] = useState<GradingResponse | null>(null);
  const [isGrading, setIsGrading] = useState(false);

  const handleExpand = (section: "lecture" | "quiz") => {
    if (!content && !isLoading) {
      onLoadContent();
    }
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleAnswerSelect = (questionNumber: number, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionNumber]: answer }));
  };

  const handleSubmitQuiz = async () => {
    if (!content) return;

    const allAnswered = content.quiz.every((q) => userAnswers[q.question_number]);
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
          lectureAndQuiz: content,
          userAnswers: Object.entries(userAnswers).map(([qNum, answer]) => ({
            question_number: parseInt(qNum),
            user_answer: answer,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to grade quiz");
      }

      const results = await response.json();
      setGradingResults(results);
    } catch (error) {
      console.error("Error grading quiz:", error);
      alert("Failed to grade quiz. Please try again.");
    } finally {
      setIsGrading(false);
    }
  };

  // Styles
  const moduleCard: React.CSSProperties = {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
    borderRadius: 16,
    padding: 24,
    width: "100%",
  };

  const moduleHeader: React.CSSProperties = {
    marginBottom: 16,
  };

  const moduleNumber: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 600,
    color: "#5b8cff",
    marginBottom: 6,
  };

  const moduleTitle: React.CSSProperties = {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 8,
  };

  const moduleDescription: React.CSSProperties = {
    fontSize: 14,
    color: "rgba(230,233,242,0.8)",
    lineHeight: 1.6,
  };

  const sectionsRow: React.CSSProperties = {
    display: "flex",
    gap: 12,
    marginTop: 20,
  };

  const sectionBtn: React.CSSProperties = {
    flex: 1,
    padding: "12px 16px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.08)",
    color: "#e6e9f2",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    transition: "all 0.2s",
  };

  const contentArea: React.CSSProperties = {
    marginTop: 20,
    padding: 20,
    background: "rgba(0,0,0,0.2)",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.08)",
  };

  const lectureText: React.CSSProperties = {
    fontSize: 15,
    lineHeight: 1.8,
    color: "rgba(230,233,242,0.95)",
    whiteSpace: "pre-wrap",
  };

  const quizQuestion: React.CSSProperties = {
    marginBottom: 24,
    padding: 16,
    background: "rgba(255,255,255,0.03)",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.08)",
  };

  const questionText: React.CSSProperties = {
    fontSize: 15,
    fontWeight: 600,
    marginBottom: 12,
    color: "#e6e9f2",
  };

  const optionBtn: React.CSSProperties = {
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "10px 14px",
    marginBottom: 8,
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "#e6e9f2",
    cursor: "pointer",
    fontSize: 14,
    transition: "all 0.2s",
  };

  const submitBtn: React.CSSProperties = {
    marginTop: 16,
    padding: "12px 24px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#5b8cff",
    color: "#0b0f19",
    fontWeight: 700,
    cursor: isGrading ? "not-allowed" : "pointer",
    fontSize: 14,
    opacity: isGrading ? 0.7 : 1,
  };

  const resultCard: React.CSSProperties = {
    marginTop: 20,
    padding: 20,
    background: "rgba(91,140,255,0.1)",
    border: "1px solid rgba(91,140,255,0.3)",
    borderRadius: 12,
  };

  const feedbackTitle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 12,
    color: "#5b8cff",
  };

  return (
    <div style={moduleCard}>
      <div style={moduleHeader}>
        <div style={moduleNumber}>Module {module.module_number}</div>
        <h2 style={moduleTitle}>{module.module_title}</h2>
        <p style={moduleDescription}>{module.description}</p>
      </div>

      <div style={sectionsRow}>
        <button
          style={sectionBtn}
          onClick={() => handleExpand("lecture")}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
          }}
        >
          📖 Lecture {expandedSection === "lecture" ? "▼" : "▶"}
        </button>
        <button
          style={sectionBtn}
          onClick={() => handleExpand("quiz")}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
          }}
        >
          ✏️ Quiz {expandedSection === "quiz" ? "▼" : "▶"}
        </button>
      </div>

      {isLoading && expandedSection && (
        <div style={contentArea}>
          <p style={{ textAlign: "center", color: "rgba(230,233,242,0.7)" }}>
            🤖 Generating content...
          </p>
        </div>
      )}

      {content && expandedSection === "lecture" && (
        <div style={contentArea}>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
            {content.lecture_title}
          </h3>
          <div style={lectureText}>{content.lecture_text}</div>
        </div>
      )}

      {content && expandedSection === "quiz" && (
        <div style={contentArea}>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Quiz</h3>

          {content.quiz.map((question) => {
            const userAnswer = userAnswers[question.question_number];
            const result = gradingResults?.graded_results.find(
              (r) => r.question_number === question.question_number
            );

            return (
              <div key={question.question_number} style={quizQuestion}>
                <p style={questionText}>
                  {question.question_number}. {question.question_text}
                </p>

                {question.options.map((option) => {
                  const optionLetter = option.charAt(0);
                  const isSelected = userAnswer === optionLetter;
                  const isCorrect = result?.correct_answer === optionLetter;
                  const isUserAnswer = result?.user_answer === optionLetter;

                  let backgroundColor = "rgba(255,255,255,0.05)";
                  let borderColor = "rgba(255,255,255,0.12)";

                  if (result) {
                    if (isCorrect) {
                      backgroundColor = "rgba(52,211,153,0.15)";
                      borderColor = "rgba(52,211,153,0.4)";
                    } else if (isUserAnswer && !isCorrect) {
                      backgroundColor = "rgba(248,113,113,0.15)";
                      borderColor = "rgba(248,113,113,0.4)";
                    }
                  } else if (isSelected) {
                    backgroundColor = "rgba(91,140,255,0.15)";
                    borderColor = "rgba(91,140,255,0.4)";
                  }

                  return (
                    <button
                      key={optionLetter}
                      style={{
                        ...optionBtn,
                        background: backgroundColor,
                        borderColor: borderColor,
                        cursor: gradingResults ? "default" : "pointer",
                      }}
                      onClick={() =>
                        !gradingResults && handleAnswerSelect(question.question_number, optionLetter)
                      }
                      disabled={!!gradingResults}
                      onMouseEnter={(e) => {
                        if (!gradingResults) {
                          e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!gradingResults) {
                          e.currentTarget.style.background = backgroundColor;
                        }
                      }}
                    >
                      {option}
                      {result && isCorrect && " ✓"}
                      {result && isUserAnswer && !isCorrect && " ✗"}
                    </button>
                  );
                })}

                {result && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: 12,
                      background: result.is_correct
                        ? "rgba(52,211,153,0.1)"
                        : "rgba(248,113,113,0.1)",
                      borderRadius: 8,
                      fontSize: 13,
                      color: "rgba(230,233,242,0.9)",
                    }}
                  >
                    {result.explanation}
                  </div>
                )}
              </div>
            );
          })}

          {!gradingResults && (
            <button style={submitBtn} onClick={handleSubmitQuiz} disabled={isGrading}>
              {isGrading ? "Grading..." : "Submit Quiz"}
            </button>
          )}

          {gradingResults && (
            <div style={resultCard}>
              <h4 style={feedbackTitle}>Results</h4>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(230,233,242,0.9)" }}>
                {gradingResults.feedback_summary}
              </p>
              <p style={{ marginTop: 12, fontSize: 14, color: "rgba(230,233,242,0.7)" }}>
                Score: {gradingResults.graded_results.filter((r) => r.is_correct).length} /{" "}
                {gradingResults.graded_results.length}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
