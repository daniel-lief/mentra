// app/api/text-to-speech/route.ts
import { NextRequest, NextResponse } from 'next/server';

const FISH_API_KEY = process.env.FISH_API_KEY;
const FISH_API_URL = 'https://api.fish.audio/v1/tts';

export async function POST(request: NextRequest) {
  const { text } = await request.json();

  if (!text) {
    return NextResponse.json(
      { error: 'Text is required' },
      { status: 400 }
    );
  }

  if (!FISH_API_KEY) {
    return NextResponse.json(
      { error: 'Fish API key not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(FISH_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FISH_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        reference_id: '802e3bc2b27e49c2995d23ef70e6ac89', // Using Fish's Energetic Male voice
        format: 'mp3',
        mp3_bitrate: 128,
      }),
    });


    // Get the audio blob from Fish API
    const audioBlob = await response.blob();
    
    // Return the audio as a response
    return new NextResponse(audioBlob, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBlob.size.toString(),
      },
    });
  } catch (error) {
    return null;
  }
}
