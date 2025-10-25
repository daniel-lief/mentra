// app/api/generate-modules/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MAX_GENERATE_MODULES_ATTEMPTS = 5;

export async function POST(request: NextRequest) {
  const { topic } = await request.json();

  if (!topic || typeof topic !== 'string') {
    return NextResponse.json(
      { error: 'Topic is required and must be a string' },
      { status: 400 }
    );
  }

  const prompt = `You are an expert curriculum designer and educator. Your task is to break down a broad topic into an organized list of study modules that progressively build understanding.
Topic: "${topic}"

Requirements:
- Create between 5 and 10 module titles.
- Each module should focus on one key subtopic or skill needed to master the overall topic.
- Titles should be concise, engaging, and clear (5–10 words each).
- Order them in a logical learning sequence (beginner → advanced).
- Include a one-sentence description for each module explaining what it covers.

The output must follow the following JSON format. The output MUST be valid JSON (use escape characters like '\\n' for newlines between paragraphs, etc). You should not include any extraneous text or symbols. Example output format:
[
\t{
\t\t"module_number": 1,
\t\t"module_title": "Introduction to ...",
\t\t"description": "..."
\t},
\t...
]`;

  for (let i: number = 0; i < MAX_GENERATE_MODULES_ATTEMPTS; i++) {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 2000,
      });

      const responseText = completion.choices[0]?.message?.content || '';
    
      const modules = JSON.parse(responseText);

      return NextResponse.json({ modules, topic });
    } catch (error) {
      console.error('Error generating modules:', error);
      continue;
    }
  }

  return NextResponse.json(
    { error: 'Failed to generate modules', details: 'Timed out while generating modules.' },
    { status: 500 }
  );
}
