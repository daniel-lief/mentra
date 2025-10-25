// app/api/generate-content/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MAX_GENERATE_CONTENT_ATTEMPTS = 5;

export async function POST(request: NextRequest) {
  const { moduleTitle, courseTopic } = await request.json();

  if (!moduleTitle || !courseTopic) {
    return NextResponse.json(
      { error: 'Module title and course topic are required' },
      { status: 400 }
    );
  }

  const prompt = `You are an expert teacher creating comprehensive educational content for an online learning platform.

Module Topic: "${moduleTitle}"
Main Course Topic: "${courseTopic}"

Task:
1. Write a detailed, engaging, and well-structured lecture that thoroughly explains this module's concept.
2. The lecture should be 800-1200 words and include:
   - A clear introduction that hooks the reader
   - Multiple sections with detailed explanations
   - Real-world examples and practical applications
   - Analogies to make complex concepts accessible
   - Progressive building of knowledge from basics to more advanced concepts
3. Use clear paragraph breaks (\\n\\n) between major sections
4. Assume the reader is motivated but has limited prior knowledge
5. End with a challenging quiz (4-5 questions) that tests deep understanding of key concepts

The output must follow the following JSON format. The output MUST be valid JSON (use escape characters like '\\n' for newlines between paragraphs). You should not include any extraneous text or symbols. For the quiz options, you must start each option with a letter (e.g. "A.", "B.", etc). Example output format:
{
\t"lecture_title": "string",
\t"lecture_text": "multi-paragraph explanation with \\n\\n between paragraphs",
\t"quiz": [
\t\t{
\t\t\t"question_number": 1,
\t\t\t"question_text": "string",
\t\t\t"options": ["A. First option", "B. Second option", "C. Third option", "D. Fourth option"],
\t\t\t"correct_answer": "A",
\t\t\t"explanation": "Detailed explanation of why this answer is correct and why others are incorrect."
\t\t},
\t\t...
\t]
}`;

  for (let i: number = 0; i < MAX_GENERATE_CONTENT_ATTEMPTS; i++) {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.6,
        max_tokens: 6000,
      });

      const responseText = completion.choices[0]?.message?.content || '';
      
      const content = JSON.parse(responseText);

      return NextResponse.json(content);
    } catch (error) {
      console.error('Error generating content:', error);
      continue;
    }
  }

  return NextResponse.json(
    { error: 'Failed to generate content', details: 'Timed out while generating lecture content.' },
    { status: 500 }
  );
}