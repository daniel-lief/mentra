# mentra

## Inspiration
We believe that access to open, reliable, and quality education is one of the most significant social issues of our time. Seeing the rapid improvement in the capabilities of AI, especially open source models, we were motivated to create Mentra as a tool that gives users access to personally curated courses on any topic they want.

## What It Does
Mentra provides an intuitive interface where users can generate full classes complete with text-based lectures, slideshows with integrated audio, quizzes to check understanding on module concepts, and more. The user enters a subject they want to learn more about, whether it be specific or general, the Mentra constructs a series of digestible modules that build on each other as the user progresses through the content.

We recognize the importance of providing multiple ways to learn, so Mentra supports both traditional written lectures as well as a more engaging slideshow mode that presents the content with integrated audio and visuals. At the end of each module, the user has a chance to check their understanding with a short multiple choice quiz on the content they just explored, giving them near-instant feedback about what they've mastered and where they can improve before continuing on.

The Mentra dashboard allows users to work on multiple courses at once–you can start, stop, and come back at your own pace as your curiosities evolve.

## Tech Stack
Front end

- TypeScript
- Next JS
- Tailwind CSS
- Figma

Back end, module generation

- JSON
- Groq API
- Llama 3.3 70B
- OpenAI API

Back end, slide generation

- Fish Audio API
- Pexels API


## Building and Running
To run the project locally:

1) Clone this repository
2) Change directory to `web/app`
3) Run `npm install` to install required packeds
4) Run `npm run dev` to run a development build of the website
