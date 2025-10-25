// app/api/grade-quiz/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { lectureAndQuiz, userAnswers } = await request.json();

    if (!lectureAndQuiz || !userAnswers) {
      return NextResponse.json(
        { error: 'Lecture/quiz data and user answers are required' },
        { status: 400 }
      );
    }

    const prompt = `You are a precise and encouraging quiz grader.

Below is quiz data and the user's answers in JSON format.

Lecture and quiz content:
${JSON.stringify(lectureAndQuiz, null, 2)}

User's Answers:
${JSON.stringify(userAnswers, null, 2)}

Instructions:
- Compare each user answer to the correct answer.
- Mark each question as "correct" or "incorrect".
- Give a short explanation for each, referencing the relevant concept from the lecture.
- If any are wrong, recommend which section of the lecture to review.

The output must follow the following JSON format. You should not include any extraneous text or symbols. Example output format:
{
\t"graded_results": [
\t\t{
\t\t\t"question_number": 1,
\t\t\t"user_answer": "A",
\t\t\t"correct_answer": "B",
\t\t\t"is_correct": false,
\t\t\t"explanation": "The correct answer is B because..."
\t\t},
\t\t...
\t],
\t"feedback_summary": "You did well overall! Review Newton's Second Law for more clarity."
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content || '';
    
    // Parse the JSON response
    const gradingResults = JSON.parse(responseText);

    return NextResponse.json(gradingResults);
  } catch (error) {
    console.error('Error grading quiz:', error);
    return NextResponse.json(
      { error: 'Failed to grade quiz', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}