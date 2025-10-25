// app/api/generate-slides/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const MAX_GENERATE_SLIDES_ATTEMPTS = 5;

type Slide = {
  slide_number: number;
  title: string;
  bullets: string[];
  search_query: string;
};

export async function POST(request: NextRequest) {
  const { lectureTitle, lectureText, courseTopic } = await request.json();

  if (!lectureTitle || !lectureText) {
    return NextResponse.json(
      { error: 'Lecture title and text are required' },
      { status: 400 }
    );
  }

  // Step 1: Generate slides structure with AI
  const slidesPrompt = `You are an expert at creating educational slide presentations.

Lecture Title: "${lectureTitle}"
Course Topic: "${courseTopic}"
Lecture Content: "${lectureText.substring(0, 2000)}..." 

Task:
Convert this lecture into 5-7 presentation slides. Each slide should have:
- A clear, concise title (5-8 words)
- 2-3 bullet points, about 1-2 sentences each, that capture key concepts and explain the main ideas of the lecture. Users should be able to understand the same concepts as the lecture after following the slides.
- A search query for finding relevant images (2-4 keywords)

IMPORTANT: Return ONLY valid JSON. Do not wrap in markdown code blocks. Do not include backticks or any other formatting.

The output must be valid JSON format:
{
\t"slides": [
\t\t{
\t\t\t"slide_number": 1,
\t\t\t"title": "Introduction to Topic",
\t\t\t"bullets": [
\t\t\t\t"First key point",
\t\t\t\t"Second key point",
\t\t\t\t"Third key point"
\t\t\t],
\t\t\t"search_query": "topic keyword concept"
\t\t},
\t\t...
\t]
}`;

  let slidesData: Slide[] = [];

  for (let i = 0; i < MAX_GENERATE_SLIDES_ATTEMPTS; i++) {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: slidesPrompt,
          },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.5,
        max_tokens: 2000,
      });

      const responseText = completion.choices[0]?.message?.content || '';
      
      // Strip markdown code blocks if present (```json ... ``` or ``` ... ```)
      let cleanedText = responseText.trim();
      if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
      }
      
      const parsed = JSON.parse(cleanedText);
      slidesData = parsed.slides;
      break;
    } catch (error) {
      console.error('Error generating slides:', error);
      if (i === MAX_GENERATE_SLIDES_ATTEMPTS - 1) {
        return NextResponse.json(
          { error: 'Failed to generate slides', details: 'Timed out while generating slides.' },
          { status: 500 }
        );
      }
    }
  }

  // Step 2: Fetch images from Pexels for each slide
  const slidesWithImages = await Promise.all(
    slidesData.map(async (slide) => {
      try {
        const pexelsResponse = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(slide.search_query)}&per_page=2&orientation=landscape`,
          {
            headers: {
              Authorization: PEXELS_API_KEY || '',
            },
          }
        );

        if (!pexelsResponse.ok) {
          console.error('Pexels API error:', pexelsResponse.statusText);
          return {
            ...slide,
            images: [],
          };
        }

        const pexelsData = await pexelsResponse.json();
        const images = pexelsData.photos?.slice(0, 1).map((photo: any) => ({
          url: photo.src.large,
        })) || [];

        return {
          ...slide,
          images,
        };
      } catch (error) {
        console.error('Error fetching Pexels images:', error);
        return {
          ...slide,
          images: [],
        };
      }
    })
  );

  return NextResponse.json({ slides: slidesWithImages });
}
