// app/api/generate-content/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { moduleTitle, courseTopic } = await request.json();

    if (!moduleTitle || !courseTopic) {
      return NextResponse.json(
        { error: 'Module title and course topic are required' },
        { status: 400 }
      );
    }

    const prompt = `You are an expert teacher creating educational content for an online learning platform like Khan Academy.

Module Topic: "${moduleTitle}"
Main Course Topic: "${courseTopic}"

Task:
1. Write a clear, engaging, and well-structured lecture that explains this module's concept.
2. Assume the reader is a motivated learner but has little to no prior knowledge on the module topic.
3. Use examples, analogies, and short paragraphs for readability.
4. End with a short quiz (3–5 questions) that tests key points from the lecture.

The output must follow the following JSON format. You should not include any extraneous text or symbols. Example output format:
{
\t"lecture_title": "string",
\t"lecture_text": "multi-paragraph explanation",
\t"quiz": [
\t\t{
\t\t\t"question_number": 1,
\t\t\t"question_text": "string",
\t\t\t"options": ["A.", "B.", "C.", "D."],
\t\t\t"correct_answer": "A",
\t\t\t"explanation": "Why this answer is correct."
\t\t},
\t\t...
\t]
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 4000,
    });

    const responseText = completion.choices[0]?.message?.content || '';
    
    // Parse the JSON response
    const content = JSON.parse(responseText);

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}